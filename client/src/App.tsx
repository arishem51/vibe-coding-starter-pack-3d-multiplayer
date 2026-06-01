import { useEffect, useRef, useState, useCallback } from "react";
// @ts-ignore — regenerate after: spacetime generate --lang typescript --out-dir src/generated
import { DbConnection, EventContext, ErrorContext } from "./generated";
import { Identity } from "spacetimedb";
import { useGameStore } from "./stores/gameStore";
import { playerState } from "./hooks/usePlayerState";
import useEventListeners from "./hooks/useEventListeners";
import { DB_HOST, DB_NAME } from "./constants";

import { LandingScreen } from "./screens/LandingScreen";
import { CreateRoomScreen } from "./screens/CreateRoomScreen";
import { JoinRoomScreen } from "./screens/JoinRoomScreen";
import { CharacterSelectScreen } from "./screens/CharacterSelectScreen";
import { LobbyScreen } from "./screens/LobbyScreen";
import { WinnerScreen } from "./screens/WinnerScreen";
import { Scene } from "./game/Scene";
import { HUD } from "./hud/HUD";
import { setConn } from "./connection";

let conn: DbConnection | null = null;

export default function App() {
  const [connected, setConnected] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const identityRef = useRef<Identity | null>(null);
  const myRoomCodeRef = useRef<string | null>(null);
  const prevLivesRef = useRef<number | null>(null);

  const {
    screen, setScreen, setIdentity, setRoomCode, setRoom,
    upsertPlayer, removePlayer, upsertProjectile, removeProjectile,
    roomCode, room, players, reset,
  } = useGameStore();

  const myPlayer = identityRef.current
    ? players.get(identityRef.current.toHexString()) ?? null
    : null;

  // ── SpacetimeDB connection ──────────────────────────────────────────────────
  useEffect(() => {
    if (conn) return;

    if (localStorage.getItem('stdb_host') !== DB_HOST) {
      localStorage.removeItem('stdb_token');
      localStorage.setItem('stdb_host', DB_HOST);
    }
    const savedToken = localStorage.getItem('stdb_token') ?? undefined;

    DbConnection.builder()
      .withUri(`ws://${DB_HOST}`)
      .withDatabaseName(DB_NAME)
      .withCompression('none')
      .withConfirmedReads(false)
      .withToken(savedToken)
      .onConnect((connection: DbConnection, id: Identity, token: string) => {
        localStorage.setItem('stdb_token', token);
        conn = connection;
        setConn(connection);
        identityRef.current = id;
        setIdentity(id.toHexString());
        setConnected(true);

        // Room table — ignore backfill inserts (onApplied handles initial state)
        let initializedRef = false;
        conn.db.room.onInsert((_ctx: EventContext, room: any) => {
          if (!initializedRef) return;
          if (room.adminIdentity.toHexString() === identityRef.current?.toHexString()) {
            myRoomCodeRef.current = room.roomCode;
            setRoom(room);
            setRoomCode(room.roomCode);
          }
        });
        conn.db.room.onUpdate((_ctx: EventContext, _old: any, newRoom: any) => {
          if (newRoom.roomCode !== myRoomCodeRef.current) return;
          setRoom(newRoom);
          if (newRoom.status === "ended") setScreen("winner");
          else if (newRoom.status === "playing") {
            // Init playerState from server-assigned spawn position before screen mounts
            const myHex = identityRef.current?.toHexString();
            if (myHex && conn) {
              for (const p of conn.db.player.iter()) {
                if (p.identity.toHexString() === myHex) {
                  playerState.currentTile = Math.round(p.posX);
                  playerState.currentRow = Math.round(p.posZ);
                  playerState.movesQueue = [];
                  break;
                }
              }
            }
            setScreen("game");
          }
        });

        // Player table
        conn.db.player.onInsert((_ctx: EventContext, p: any) => upsertPlayer(p));
        conn.db.player.onUpdate((_ctx: EventContext, _o: any, p: any) => {
          upsertPlayer(p);
          if (p.identity.toHexString() !== identityRef.current?.toHexString()) return;
          if (p.roomCode === myRoomCodeRef.current) return;
          myRoomCodeRef.current = p.roomCode;
          for (const r of conn!.db.room.iter()) {
            if (r.roomCode === p.roomCode) { setRoom(r); setRoomCode(r.roomCode); break; }
          }
        });
        conn.db.player.onDelete((_ctx: EventContext, p: any) => removePlayer(p.identity.toHexString()));

        // Projectile table
        conn.db.projectile.onInsert((_ctx: EventContext, p: any) => upsertProjectile(p));
        conn.db.projectile.onUpdate((_ctx: EventContext, _o: any, p: any) => upsertProjectile(p));
        conn.db.projectile.onDelete((_ctx: EventContext, p: any) => removeProjectile(String(p.projectileId)));

        conn.subscriptionBuilder()
          .onApplied(() => {
            initializedRef = true;
            const myHex = identityRef.current?.toHexString();
            let myRoomCode: string | null = null;
            for (const p of conn!.db.player.iter()) {
              upsertPlayer(p);
              if (myHex && p.identity.toHexString() === myHex) myRoomCode = p.roomCode;
            }
            for (const room of conn!.db.room.iter()) {
              if (room.roomCode === myRoomCode) {
                myRoomCodeRef.current = room.roomCode;
                setRoom(room);
                setRoomCode(room.roomCode);
                if (room.status === "waiting") setScreen("lobby");
                else if (room.status === "playing") setScreen("game");
              }
            }
          })
          .subscribe(["SELECT * FROM room", "SELECT * FROM player", "SELECT * FROM projectile"]);
      })
      .onDisconnect((ctx: ErrorContext) => {
        // Stale token from a different server (e.g. maincloud → local) causes 401.
        // Drop it so the next connection gets a fresh identity.
        if ((ctx as any)?.message?.includes('401') || (ctx as any)?.code === 401) {
          localStorage.removeItem('stdb_token');
        }
        conn = null;
        setConnected(false);
      })
      .build();
  }, []);

  // ── Keyboard for game (shoot / shield) ──────────────────────────────────────
  useEventListeners(screen === "game" && myPlayer?.status === "alive");

  useEffect(() => {
    if (screen !== "game") return;
    const handleKey = (e: KeyboardEvent) => {
      if (!conn || !myPlayer) return;
      if (e.key === " " && myPlayer.characterType === "white") {
        e.preventDefault();
        conn.reducers.shoot({ direction: 1 });
      }
      if ((e.key === "f" || e.key === "F") && myPlayer.characterType === "black") {
        conn.reducers.toggleShield({});
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen, myPlayer]);

  // ── Send position to server at 20Hz ────────────────────────────────────────
  useEffect(() => {
    if (screen !== "game") return;
    const interval = setInterval(() => {
      if (!conn || myPlayer?.status !== "alive") return;
      conn.reducers.updatePosition({ x: playerState.currentTile, z: playerState.currentRow });
    }, 50);
    return () => clearInterval(interval);
  }, [screen, myPlayer?.status]);

  // ── Callbacks ───────────────────────────────────────────────────────────────
  const handleCarHit = useCallback(() => {
    if (!conn || !myPlayer) return;
    if (myPlayer.isAdmin) return;
    if (myPlayer.shieldActive) return;
    if (myPlayer.status !== "alive") return;
    conn.reducers.carHit({});
  }, [myPlayer]);

  const handleCrossedCarRoad = useCallback(() => {
    if (!conn || myPlayer?.status !== "alive") return;
    conn.reducers.crossedCarRoad({});
  }, [myPlayer]);

  // Shake on any lives decrease (car hit or projectile hit)
  useEffect(() => {
    if (!myPlayer) { prevLivesRef.current = null; return; }
    const prev = prevLivesRef.current;
    prevLivesRef.current = myPlayer.lives;
    if (prev !== null && myPlayer.lives < prev) {
      // Snap local state to server's pushed-back position and cancel pending moves
      playerState.currentRow = Math.round(myPlayer.posZ);
      playerState.currentTile = Math.round(myPlayer.posX);
      playerState.movesQueue = [];
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  }, [myPlayer?.lives]);

  // Block movement while bonus quiz is open
  useEffect(() => {
    playerState.blocked = !!(myPlayer?.bonusQuestionPending);
  }, [myPlayer?.bonusQuestionPending]);

  const handlePositionUpdate = useCallback((x: number, z: number) => {
    // Position sent in the 20Hz interval loop above
  }, []);

  const handleQuizAnswer = useCallback((correct: boolean) => {
    conn?.reducers.submitAnswer({ isCorrect: correct });
  }, []);

  const handleBonusAnswer = useCallback((correct: boolean) => {
    conn?.reducers.submitBonusAnswer({ isCorrect: correct });
  }, []);

  // ── Screen routing ──────────────────────────────────────────────────────────
  if (!connected) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1117" }}>
        <div style={{ color: "white", fontSize: 18 }}>Đang kết nối...</div>
      </div>
    );
  }

  if (screen === "landing") {
    return (
      <LandingScreen
        onCreateRoom={() => { setRoom(null); setRoomCode(null); myRoomCodeRef.current = null; setScreen("create"); }}
        onJoinRoom={() => setScreen("join")}
      />
    );
  }

  if (screen === "create") {
    return (
      <CreateRoomScreen
        roomCode={roomCode}
        onBack={() => { setRoom(null); setRoomCode(null); myRoomCodeRef.current = null; setScreen("landing"); }}
        onSubmit={(name) => conn?.reducers.createRoom({ displayName: name })}
        onGoLobby={() => setScreen("lobby")}
      />
    );
  }

  if (screen === "join") {
    return (
      <JoinRoomScreen
        error={joinError}
        onBack={() => { setJoinError(null); setScreen("landing"); }}
        onSubmit={(code, name) => {
          setJoinError(null);
          try {
            conn?.reducers.joinRoom({ roomCode: code, playerName: name });
            setScreen("char-select");
          } catch (e: any) {
            setJoinError(e?.message ?? "Lỗi không xác định");
          }
        }}
      />
    );
  }

  if (screen === "char-select") {
    return (
      <CharacterSelectScreen
        onSelect={(type) => {
          conn?.reducers.selectCharacter({ characterType: type });
          setScreen("lobby");
        }}
      />
    );
  }

  if (screen === "lobby") {
    console.log("[lobby] myIdentity:", identityRef.current?.toHexString());
    console.log("[lobby] myPlayer:", myPlayer);
    console.log("[lobby] room.adminIdentity:", room?.adminIdentity?.toHexString());
    console.log("[lobby] players in store:", [...players.keys()]);
    console.log("[lobby] localStorage token:", localStorage.getItem('stdb_token')?.slice(0, 20));
    const isAdmin = myPlayer?.isAdmin ?? false;
    return (
      <LobbyScreen
        isAdmin={isAdmin}
        roomCode={roomCode ?? ""}
        onStart={() => conn?.reducers.startGame({ roomCode: roomCode ?? "" })}
        onForceEnd={() => conn?.reducers.forceEnd({ roomCode: roomCode ?? "" })}
      />
    );
  }

  if (screen === "winner") {
    return (
      <WinnerScreen
        onPlayAgain={() => {
          reset();
          playerState.currentRow = 0;
          playerState.currentTile = 0;
          playerState.movesQueue = [];
        }}
      />
    );
  }

  // ── Game screen ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      width: "100vw", height: "100vh", position: "relative", background: "#000",
      animation: shaking ? "screenShake 0.4s ease" : undefined,
    }}>
      <style>{`
        @keyframes screenShake {
          0%   { transform: translate(0,0) rotate(0deg); }
          20%  { transform: translate(-6px, 4px) rotate(-1deg); }
          40%  { transform: translate(6px, -4px) rotate(1deg); }
          60%  { transform: translate(-4px, 6px) rotate(-0.5deg); }
          80%  { transform: translate(4px, -2px) rotate(0.5deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
      `}</style>
      <Scene
        myIdentityHex={identityRef.current?.toHexString() ?? ""}
        shieldActive={myPlayer?.shieldActive ?? false}
        characterType={myPlayer?.characterType ?? "white"}
        onCarHit={handleCarHit}
        onCrossedCarRoad={handleCrossedCarRoad}
        onPositionUpdate={handlePositionUpdate}
      />
      <HUD
        myPlayer={myPlayer}
        onBonusAnswer={handleBonusAnswer}
      />
      {/* Admin controls */}
      {myPlayer?.isAdmin && (
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
          <button
            onClick={() => conn?.reducers.forceEnd({ roomCode: roomCode ?? "" })}
            style={{ padding: "8px 16px", background: "#880000", border: "none", borderRadius: 6, color: "white", cursor: "pointer" }}
          >
            ⏹ Kết thúc ngay
          </button>
        </div>
      )}
    </div>
  );
}
