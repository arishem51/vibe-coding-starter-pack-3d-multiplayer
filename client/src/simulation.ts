/**
 * Bot simulation for room-based multiplayer.
 *
 * Usage:
 *   cd client
 *   npm run simulate -- <ROOM_CODE> [N=29] [duration=60]
 *
 * Flow:
 *   1. Open the game in browser, create a room, get the room code
 *   2. Run this script with that code — bots join the room
 *   3. Join the room yourself in the browser too
 *   4. When everyone is in, admin starts the game
 */

import { DbConnection } from './generated/index.js';
import type { ErrorContext } from './generated/index.js';

const DB_HOST = process.env.STDB_HOST ?? 'localhost:3000';
const DB_NAME = process.env.STDB_NAME ?? 'spst-crossy';
const ROOM_CODE = (process.argv[2] ?? '').toUpperCase();
const NUM_BOTS = parseInt(process.argv[3] || '29', 10);
const DURATION_MS = parseInt(process.argv[4] || '120', 10) * 1000;
const MOVE_INTERVAL_MS = 300;

if (!ROOM_CODE) {
  console.error('Usage: npm run simulate -- <ROOM_CODE> [N=29] [duration=120]');
  console.error('Example: npm run simulate -- ABC12 29 120');
  process.exit(1);
}

const CHARACTER_TYPES = ['white', 'black'] as const;

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface BotState {
  id: number;
  conn: DbConnection;
  identityHex: string;
  alive: boolean;
  x: number;
  z: number;
  tickHandle: ReturnType<typeof setInterval> | null;
}

function tickBot(state: BotState): void {
  if (!state.alive) return;

  const dz = 0.8 + Math.random() * 0.7;   // move forward 0.8–1.5 tiles
  const dx = (Math.random() - 0.5) * 0.8; // small lateral step

  state.z += dz;
  state.x = Math.max(-8, Math.min(8, state.x + dx));

  // Loop back to start when reaching far end
  if (state.z > 18) {
    state.z = 1;
  }

  state.conn.reducers.updatePosition({ x: state.x, z: state.z });
}

function spawnBot(id: number): Promise<BotState> {
  return new Promise((resolve, reject) => {
    const playerName = `Bot_${id}`;
    const characterType = randomItem(CHARACTER_TYPES);
    const timeout = setTimeout(() => reject(new Error(`Bot ${id} timed out`)), 20_000);

    const state: Partial<BotState> = {
      id,
      alive: false,
      x: 0,
      z: 0,
      tickHandle: null,
    };

    const onConnect = (conn: DbConnection, identity: any) => {
      state.conn = conn;
      state.identityHex = identity.toHexString();

      conn.db.player.onUpdate((_ctx: any, _old: any, player: any) => {
        if (player.identity.toHexString() !== state.identityHex) return;

        if (player.status === 'alive' && !state.alive) {
          state.alive = true;
          state.x = player.posX;
          state.z = player.posZ;
          if (!state.tickHandle) {
            state.tickHandle = setInterval(() => tickBot(state as BotState), MOVE_INTERVAL_MS);
          }
        } else if (player.status === 'eliminated') {
          state.alive = false;
          if (state.tickHandle) {
            clearInterval(state.tickHandle);
            state.tickHandle = null;
          }
        }
      });

      conn.subscriptionBuilder()
        .onApplied(() => {
          conn.reducers.joinRoom({ roomCode: ROOM_CODE, playerName });
          // Brief delay to let join propagate before selecting character
          setTimeout(() => {
            conn.reducers.selectCharacter({ characterType });
            console.log(`  [Bot ${id}] Joined as "${playerName}" (${characterType})`);
            clearTimeout(timeout);
            resolve(state as BotState);
          }, 600);
        })
        .onError((err: any) => {
          clearTimeout(timeout);
          reject(err);
        })
        .subscribe('SELECT * FROM player');
    };

    const onDisconnect = (_ctx: ErrorContext, reason?: Error | null) => {
      console.log(`  [Bot ${id}] Disconnected: ${reason?.message ?? 'unknown'}`);
      if (state.tickHandle) {
        clearInterval(state.tickHandle);
        state.tickHandle = null;
      }
    };

    DbConnection.builder()
      .withUri(DB_HOST.startsWith('localhost') ? `ws://${DB_HOST}` : `wss://${DB_HOST}`)
      .withDatabaseName(DB_NAME)
      .withConfirmedReads(false)
      .onConnect(onConnect)
      .onDisconnect(onDisconnect)
      .build();
  });
}

async function main() {
  console.log(`\n=== Bot Simulation: ${NUM_BOTS} bots → room ${ROOM_CODE} for ${DURATION_MS / 1000}s ===\n`);

  console.log('Connecting bots...');
  const results = await Promise.allSettled(
    Array.from({ length: NUM_BOTS }, (_, i) => spawnBot(i + 1))
  );

  const bots: BotState[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') bots.push(r.value);
    else console.error('  Failed to connect a bot:', (r as PromiseRejectedResult).reason);
  }

  console.log(`\n${bots.length}/${NUM_BOTS} bots joined room ${ROOM_CODE}.`);
  if (bots.length === 0) {
    console.error('No bots connected. Check server and room code.');
    process.exit(1);
  }

  console.log('Bots are ready. Join the room in your browser, then have admin start the game.\n');

  const statusInterval = setInterval(() => {
    const alive = bots.filter(b => b.alive).length;
    console.log(`  [Status] ${alive}/${bots.length} bots alive`);
  }, 5_000);

  await new Promise<void>(resolve => setTimeout(resolve, DURATION_MS));

  clearInterval(statusInterval);
  for (const bot of bots) {
    if (bot.tickHandle) {
      clearInterval(bot.tickHandle);
      bot.tickHandle = null;
    }
  }

  console.log('\nSimulation complete.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Simulation failed:', err);
  process.exit(1);
});
