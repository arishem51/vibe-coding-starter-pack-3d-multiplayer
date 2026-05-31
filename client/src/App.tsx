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

let conn: DbConnection | null = null;

export default function App() {
  const [connected, setConnected] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const identityRef = useRef<Identity | null>(null);

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

    const savedToken = localStorage.getItem('stdb_token') ?? undefined;

    DbConnection.builder()
      .withUri(`wss://${DB_HOST}`)
      .withDatabaseName(DB_NAME)
      .withCompression('none')
      .withConfirmedReads(false)
      .withToken(savedToken)
      .onConnect((connection: DbConnection, id: Identity, token: string) => {
        localStorage.setItem('stdb_token', token);
        conn = connection;
        identityRef.current = id;
        setIdentity(id.toHexString());
        setConnected(true);

        // Room table
        conn.db.room.onInsert((_ctx: EventContext, room: any) => {
          if (room.adminIdentity.toHexString() === identityRef.current?.toHexString()) {
            setRoom(room);
            setRoomCode(room.roomCode);
          }
        });
        conn.db.room.onUpdate((_ctx: EventContext, _old: any, newRoom: any) => {
          setRoom(newRoom);
          if (newRoom.status === "ended") setScreen("winner");
          else if (newRoom.status === "playing") setScreen("game");
        });

        // Player table
        conn.db.player.onInsert((_ctx: EventContext, p: any) => upsertPlayer(p));
        conn.db.player.onUpdate((_ctx: EventContext, _o: any, p: any) => upsertPlayer(p));
        conn.db.player.onDelete((_ctx: EventContext, p: any) => removePlayer(p.identity.toHexString()));

        // Projectile table
        conn.db.projectile.onInsert((_ctx: EventContext, p: any) => upsertProjectile(p));
        conn.db.projectile.onUpdate((_ctx: EventContext, _o: any, p: any) => upsertProjectile(p));
        conn.db.projectile.onDelete((_ctx: EventContext, p: any) => removeProjectile(String(p.projectileId)));

        conn.subscriptionBuilder()
          .onApplied(() => {
            const myHex = identityRef.current?.toHexString();
            let myRoomCode: string | null = null;
            for (const p of conn!.db.player.iter()) {
              upsertPlayer(p);
              if (myHex && p.identity.toHexString() === myHex) myRoomCode = p.roomCode;
            }
            for (const room of conn!.db.room.iter()) {
              if (room.roomCode === myRoomCode) {
                setRoom(room);
                setRoomCode(room.roomCode);
                if (room.status === "waiting") setScreen("lobby");
                else if (room.status === "playing") setScreen("game");
              }
            }
          })
          .subscribe(["SELECT * FROM room", "SELECT * FROM player", "SELECT * FROM projectile"]);
      })
      .onDisconnect((_ctx: ErrorContext) => {
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
    if (myPlayer.characterType === "ghost") return;
    if (myPlayer.shieldActive) return;
    if (myPlayer.status !== "alive") return;
    conn.reducers.triggerQuiz({});
  }, [myPlayer]);

  const handleCrossedCarRoad = useCallback(() => {
    if (!conn || myPlayer?.status !== "alive") return;
    conn.reducers.crossedCarRoad({});
  }, [myPlayer]);

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
        onCreateRoom={() => setScreen("create")}
        onJoinRoom={() => setScreen("join")}
      />
    );
  }

  if (screen === "create") {
    return (
      <CreateRoomScreen
        roomCode={roomCode}
        onBack={() => setScreen("landing")}
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
    const isAdmin = myPlayer?.isAdmin
      || room?.adminIdentity?.toHexString() === identityRef.current?.toHexString()
      || false;
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
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#000" }}>
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
        onQuizAnswer={handleQuizAnswer}
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
