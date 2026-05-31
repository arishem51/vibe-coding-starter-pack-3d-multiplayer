import { create } from "zustand";
import { PlayerData, Room, Projectile, Screen } from "../types";

interface GameState {
  screen: Screen;
  myIdentityHex: string | null;
  roomCode: string | null;
  room: Room | null;
  players: Map<string, PlayerData>;
  projectiles: Map<string, Projectile>;

  setScreen: (s: Screen) => void;
  setIdentity: (hex: string) => void;
  setRoomCode: (code: string) => void;
  setRoom: (room: Room | null) => void;
  upsertPlayer: (p: PlayerData) => void;
  removePlayer: (hex: string) => void;
  upsertProjectile: (p: Projectile) => void;
  removeProjectile: (id: string) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: "landing",
  myIdentityHex: null,
  roomCode: null,
  room: null,
  players: new Map(),
  projectiles: new Map(),

  setScreen: (screen) => set({ screen }),
  setIdentity: (hex) => set({ myIdentityHex: hex }),
  setRoomCode: (code) => set({ roomCode: code }),
  setRoom: (room) => set({ room }),

  upsertPlayer: (p) =>
    set((s) => {
      const m = new Map(s.players);
      m.set(p.identity.toHexString(), p);
      return { players: m };
    }),

  removePlayer: (hex) =>
    set((s) => {
      const m = new Map(s.players);
      m.delete(hex);
      return { players: m };
    }),

  upsertProjectile: (p) =>
    set((s) => {
      const m = new Map(s.projectiles);
      m.set(String(p.projectileId), p);
      return { projectiles: m };
    }),

  removeProjectile: (id) =>
    set((s) => {
      const m = new Map(s.projectiles);
      m.delete(id);
      return { projectiles: m };
    }),

  reset: () =>
    set({
      screen: "landing",
      myIdentityHex: null,
      roomCode: null,
      room: null,
      players: new Map(),
      projectiles: new Map(),
    }),
}));
