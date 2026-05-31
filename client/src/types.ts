// Types matching our SpacetimeDB schema (post spacetime generate)
export interface Room {
  roomId: bigint;
  roomCode: string;
  adminIdentity: { toHexString(): string };
  status: string; // "waiting" | "playing" | "ended"
  startedAt: bigint; // micros since unix epoch; 0n = not started
}

export interface PlayerData {
  identity: { toHexString(): string };
  roomCode: string;
  displayName: string;
  posX: number;
  posZ: number;
  lives: number;
  status: string; // "waiting" | "alive" | "in_quiz" | "eliminated"
  isAdmin: boolean;
  characterType: string; // "white" | "black" | "ghost"
  ammo: number;
  shieldActive: boolean;
  shieldCooldown: boolean;
  score: number;
  bonusQuestionPending: boolean;
  shieldExtended: boolean;
  bonusCooldownUntil: bigint;
}

export interface Projectile {
  projectileId: bigint;
  ownerIdentity: { toHexString(): string };
  roomCode: string;
  posX: number;
  posZ: number;
  direction: number;
  rangeRemaining: number;
}

export type Screen =
  | "landing"
  | "create"
  | "join"
  | "char-select"
  | "lobby"
  | "game"
  | "winner";
