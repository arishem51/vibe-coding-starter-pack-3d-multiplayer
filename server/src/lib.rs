use spacetimedb::{ReducerContext, Identity, Table, Timestamp, ScheduleAt};
use std::time::Duration;

// ==================== TABLES ====================

#[spacetimedb::table(accessor = room, public)]
#[derive(Clone)]
pub struct Room {
    #[primary_key]
    #[auto_inc]
    pub room_id: u64,
    pub room_code: String,
    pub admin_identity: Identity,
    pub status: String, // "waiting" | "playing" | "ended"
    pub started_at: u64, // micros since unix epoch; 0 = not started
}

#[spacetimedb::table(accessor = player, public)]
#[derive(Clone)]
pub struct PlayerData {
    #[primary_key]
    pub identity: Identity,
    pub room_code: String,
    pub display_name: String,
    pub pos_x: f32,
    pub pos_z: f32,
    pub lives: u8,
    pub status: String, // "waiting" | "alive" | "in_quiz" | "eliminated"
    pub is_admin: bool,
    pub character_type: String, // "white" | "black" | "ghost"
    pub ammo: u8,
    pub shield_active: bool,
    pub shield_cooldown: bool,
    pub score: u32,
    pub bonus_question_pending: bool,
    pub shield_extended: bool,
    pub bonus_cooldown_until: u64, // micros since unix epoch; 0 = ready
}

#[spacetimedb::table(accessor = projectile, public)]
#[derive(Clone)]
pub struct Projectile {
    #[primary_key]
    #[auto_inc]
    pub projectile_id: u64,
    pub owner_identity: Identity,
    pub room_code: String,
    pub pos_x: f32,
    pub pos_z: f32,
    pub direction: i32, // +1 forward, -1 backward
    pub range_remaining: i32,
}

#[spacetimedb::table(accessor = ammo_tick_schedule, scheduled(ammo_tick))]
pub struct AmmoTickSchedule {
    #[primary_key]
    #[auto_inc]
    pub scheduled_id: u64,
    pub scheduled_at: ScheduleAt,
}

#[spacetimedb::table(accessor = projectile_tick_schedule, scheduled(move_projectiles))]
pub struct ProjectileTickSchedule {
    #[primary_key]
    #[auto_inc]
    pub scheduled_id: u64,
    pub scheduled_at: ScheduleAt,
}

#[spacetimedb::table(accessor = shield_expire_schedule, scheduled(shield_expire))]
pub struct ShieldExpireSchedule {
    #[primary_key]
    #[auto_inc]
    pub scheduled_id: u64,
    pub scheduled_at: ScheduleAt,
    pub player_identity: Identity,
}

#[spacetimedb::table(accessor = shield_cooldown_schedule, scheduled(shield_cooldown_expire))]
pub struct ShieldCooldownSchedule {
    #[primary_key]
    #[auto_inc]
    pub scheduled_id: u64,
    pub scheduled_at: ScheduleAt,
    pub player_identity: Identity,
}

// ==================== HELPERS ====================

fn ts_micros(ts: Timestamp) -> u64 {
    ts.to_micros_since_unix_epoch().max(0) as u64
}

fn id_to_room_code(id: u64) -> String {
    const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let base = CHARSET.len() as u64;
    let mut n = id.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
    let mut code = [0u8; 5];
    for byte in code.iter_mut() {
        *byte = CHARSET[(n % base) as usize];
        n /= base;
    }
    String::from_utf8(code.to_vec()).unwrap()
}

fn check_win_condition(ctx: &ReducerContext, room_code: &str) {
    let total_non_admin = ctx.db.player().iter()
        .filter(|p| p.room_code == room_code && !p.is_admin)
        .count();

    let alive = ctx.db.player().iter()
        .filter(|p| p.room_code == room_code && (p.status == "alive" || p.status == "in_quiz") && !p.is_admin)
        .count();

    let should_end = alive == 0 || (total_non_admin > 1 && alive <= 1);
    if should_end {
        if let Some(mut room) = ctx.db.room().iter().find(|r| r.room_code == room_code) {
            if room.status == "playing" {
                room.status = "ended".to_string();
                ctx.db.room().room_id().update(room);
            }
        }
    }
}

// ==================== LIFECYCLE ====================

#[spacetimedb::reducer(init)]
pub fn init(ctx: &ReducerContext) -> Result<(), String> {
    ctx.db.ammo_tick_schedule().insert(AmmoTickSchedule {
        scheduled_id: 0,
        scheduled_at: ScheduleAt::Interval(Duration::from_secs(5).into()),
    });
    ctx.db.projectile_tick_schedule().insert(ProjectileTickSchedule {
        scheduled_id: 0,
        scheduled_at: ScheduleAt::Interval(Duration::from_millis(300).into()),
    });
    Ok(())
}

#[spacetimedb::reducer(client_connected)]
pub fn identity_connected(_ctx: &ReducerContext) {}

#[spacetimedb::reducer(client_disconnected)]
pub fn identity_disconnected(ctx: &ReducerContext) {
    if let Some(player) = ctx.db.player().identity().find(ctx.sender()) {
        let in_waiting = ctx.db.room().iter()
            .any(|r| r.room_code == player.room_code && r.status == "waiting");
        // Keep the player record while the room is still in waiting — they can reconnect
        if !in_waiting {
            ctx.db.player().identity().delete(ctx.sender());
        }
    }
}

// ==================== ROOM ====================

#[spacetimedb::reducer]
pub fn create_room(ctx: &ReducerContext, display_name: String) -> Result<(), String> {
    // Clean up any existing player entry
    ctx.db.player().identity().delete(ctx.sender());

    let room = ctx.db.room().insert(Room {
        room_id: 0,
        room_code: String::new(),
        admin_identity: ctx.sender(),
        status: "waiting".to_string(),
        started_at: 0,
    });

    let mut room = room;
    let code = id_to_room_code(room.room_id);
    room.room_code = code.clone();
    ctx.db.room().room_id().update(room);

    ctx.db.player().insert(PlayerData {
        identity: ctx.sender(),
        room_code: code,
        display_name,
        pos_x: 0.0,
        pos_z: 0.0,
        lives: 3,
        status: "waiting".to_string(),
        is_admin: true,
        character_type: "ghost".to_string(),
        ammo: 0,
        shield_active: false,
        shield_cooldown: false,
        score: 0,
        bonus_question_pending: false,
        shield_extended: false,
        bonus_cooldown_until: 0,
    });

    Ok(())
}

#[spacetimedb::reducer]
pub fn join_room(ctx: &ReducerContext, room_code: String, player_name: String) -> Result<(), String> {
    let room = ctx.db.room().iter()
        .find(|r| r.room_code == room_code)
        .ok_or_else(|| "Room not found".to_string())?;

    if room.status != "waiting" {
        return Err("Room is not accepting players".to_string());
    }

    let is_admin = ctx.sender() == room.admin_identity;

    ctx.db.player().identity().delete(ctx.sender());

    ctx.db.player().insert(PlayerData {
        identity: ctx.sender(),
        room_code,
        display_name: player_name,
        pos_x: 0.0,
        pos_z: 0.0,
        lives: 3,
        status: "waiting".to_string(),
        is_admin,
        character_type: if is_admin { "ghost" } else { "white" }.to_string(),
        ammo: 0,
        shield_active: false,
        shield_cooldown: false,
        score: 0,
        bonus_question_pending: false,
        shield_extended: false,
        bonus_cooldown_until: 0,
    });

    Ok(())
}

#[spacetimedb::reducer]
pub fn select_character(ctx: &ReducerContext, character_type: String) -> Result<(), String> {
    if character_type != "white" && character_type != "black" {
        return Err("Invalid character type".to_string());
    }

    let mut player = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if player.is_admin {
        return Err("Admin is always ghost".to_string());
    }

    let room = ctx.db.room().iter()
        .find(|r| r.room_code == player.room_code)
        .ok_or_else(|| "Room not found".to_string())?;

    if room.status != "waiting" {
        return Err("Game already started".to_string());
    }

    player.character_type = character_type;
    ctx.db.player().identity().update(player);
    Ok(())
}

#[spacetimedb::reducer]
pub fn start_game(ctx: &ReducerContext, room_code: String) -> Result<(), String> {
    let admin = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if !admin.is_admin || admin.room_code != room_code {
        return Err("Only admin can start".to_string());
    }

    let mut room = ctx.db.room().iter()
        .find(|r| r.room_code == room_code)
        .ok_or_else(|| "Room not found".to_string())?;

    if room.status != "waiting" {
        return Err("Room already started".to_string());
    }

    let players: Vec<PlayerData> = ctx.db.player().iter()
        .filter(|p| p.room_code == room_code)
        .collect();

    let n = players.len() as f32;
    for (i, mut p) in players.into_iter().enumerate() {
        p.pos_x = (i as f32 - n / 2.0) * 2.0;
        p.pos_z = 0.0;
        p.status = "alive".to_string();
        p.lives = 3;
        p.ammo = 0;
        p.score = 0;
        ctx.db.player().identity().update(p);
    }

    room.status = "playing".to_string();
    room.started_at = ts_micros(ctx.timestamp);
    ctx.db.room().room_id().update(room);
    Ok(())
}

#[spacetimedb::reducer]
pub fn force_end(ctx: &ReducerContext, room_code: String) -> Result<(), String> {
    let admin = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if !admin.is_admin || admin.room_code != room_code {
        return Err("Only admin can force end".to_string());
    }

    let mut room = ctx.db.room().iter()
        .find(|r| r.room_code == room_code)
        .ok_or_else(|| "Room not found".to_string())?;

    room.status = "ended".to_string();
    ctx.db.room().room_id().update(room);
    Ok(())
}

// ==================== MOVEMENT ====================

#[spacetimedb::reducer]
pub fn update_position(ctx: &ReducerContext, x: f32, z: f32) -> Result<(), String> {
    let mut player = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if player.status == "in_quiz" || player.status == "eliminated" || player.status == "waiting" {
        return Ok(());
    }
    if player.shield_active {
        return Ok(());
    }

    // Anti-teleport: max 2 tiles per update
    if (x - player.pos_x).abs() > 2.0 || (z - player.pos_z).abs() > 2.0 {
        return Ok(());
    }

    player.pos_x = x;
    player.pos_z = z;
    ctx.db.player().identity().update(player);
    Ok(())
}

// ==================== QUIZ (CAR HIT) ====================

#[spacetimedb::reducer]
pub fn trigger_quiz(ctx: &ReducerContext) -> Result<(), String> {
    let mut player = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if player.character_type == "ghost" || player.shield_active || player.status != "alive" {
        return Ok(());
    }

    player.status = "in_quiz".to_string();
    ctx.db.player().identity().update(player);
    Ok(())
}

#[spacetimedb::reducer]
pub fn submit_answer(ctx: &ReducerContext, is_correct: bool) -> Result<(), String> {
    let mut player = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if player.status != "in_quiz" {
        return Ok(());
    }

    if is_correct {
        player.status = "alive".to_string();
    } else {
        player.pos_z = (player.pos_z - 1.0).max(0.0);
        player.lives = player.lives.saturating_sub(1);
        player.status = if player.lives == 0 { "eliminated".to_string() } else { "alive".to_string() };
    }

    let room_code = player.room_code.clone();
    ctx.db.player().identity().update(player);
    check_win_condition(ctx, &room_code);
    Ok(())
}

// ==================== KNOWLEDGE TRIGGER ====================

#[spacetimedb::reducer]
pub fn crossed_car_road(ctx: &ReducerContext) -> Result<(), String> {
    let mut player = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if player.status != "alive" {
        return Ok(());
    }

    player.score += 1;

    let now_micros = ts_micros(ctx.timestamp);
    let on_cooldown = player.bonus_cooldown_until > 0 && now_micros < player.bonus_cooldown_until;

    if !on_cooldown && !player.bonus_question_pending {
        // Pseudo-random 15% check
        let seed = (player.score as u64)
            .wrapping_mul(6364136223846793005)
            .wrapping_add((player.pos_z.to_bits() as u64).wrapping_mul(2246822519));
        if seed % 100 < 15 {
            player.bonus_question_pending = true;
        }
    }

    ctx.db.player().identity().update(player);
    Ok(())
}

#[spacetimedb::reducer]
pub fn submit_bonus_answer(ctx: &ReducerContext, is_correct: bool) -> Result<(), String> {
    let mut player = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    player.bonus_question_pending = false;
    player.bonus_cooldown_until = ts_micros(ctx.timestamp) + 10_000_000; // 10s

    if is_correct {
        player.score += 10;
        match player.character_type.as_str() {
            "black" => { player.shield_extended = true; }
            "white" => { player.ammo += 2; }
            _ => {}
        }
    }

    ctx.db.player().identity().update(player);
    Ok(())
}

// ==================== CHARACTER SKILLS ====================

#[spacetimedb::reducer]
pub fn shoot(ctx: &ReducerContext, direction: i32) -> Result<(), String> {
    let mut player = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if player.character_type != "white" { return Err("Only White can shoot".to_string()); }
    if player.ammo == 0 { return Err("No ammo".to_string()); }
    if player.status != "alive" { return Ok(()); }
    if direction != 1 && direction != -1 { return Err("Invalid direction".to_string()); }

    player.ammo -= 1;
    let (room_code, pos_x, pos_z) = (player.room_code.clone(), player.pos_x, player.pos_z);
    ctx.db.player().identity().update(player);

    ctx.db.projectile().insert(Projectile {
        projectile_id: 0,
        owner_identity: ctx.sender(),
        room_code,
        pos_x,
        pos_z: pos_z + direction as f32,
        direction,
        range_remaining: 4,
    });

    Ok(())
}

#[spacetimedb::reducer]
pub fn toggle_shield(ctx: &ReducerContext) -> Result<(), String> {
    let mut player = ctx.db.player().identity().find(ctx.sender())
        .ok_or_else(|| "Player not found".to_string())?;

    if player.character_type != "black" { return Err("Only Black can use shield".to_string()); }
    if player.shield_active { return Err("Shield already active".to_string()); }
    if player.shield_cooldown { return Err("Shield on cooldown".to_string()); }
    if player.status != "alive" { return Ok(()); }

    let is_extended = player.shield_extended;
    player.shield_active = true;
    player.shield_extended = false;
    ctx.db.player().identity().update(player);

    let shield_secs: u64 = if is_extended { 6 } else { 3 };
    ctx.db.shield_expire_schedule().insert(ShieldExpireSchedule {
        scheduled_id: 0,
        scheduled_at: ScheduleAt::Time(
            (ctx.timestamp + Duration::from_secs(shield_secs)).into()
        ),
        player_identity: ctx.sender(),
    });

    Ok(())
}

// ==================== SCHEDULED REDUCERS ====================

#[spacetimedb::reducer(update)]
pub fn ammo_tick(ctx: &ReducerContext, _sched: AmmoTickSchedule) {
    for mut player in ctx.db.player().iter() {
        if player.character_type == "white" && player.status == "alive" && player.ammo < 5 {
            player.ammo += 1;
            ctx.db.player().identity().update(player);
        }
    }
}

#[spacetimedb::reducer(update)]
pub fn move_projectiles(ctx: &ReducerContext, _sched: ProjectileTickSchedule) {
    let projectiles: Vec<Projectile> = ctx.db.projectile().iter().collect();

    for mut proj in projectiles {
        proj.pos_z += proj.direction as f32;
        proj.range_remaining -= 1;

        if proj.range_remaining <= 0 {
            ctx.db.projectile().projectile_id().delete(proj.projectile_id);
            continue;
        }

        let mut hit = false;
        let mut reflected = false;
        let players: Vec<PlayerData> = ctx.db.player().iter()
            .filter(|p| p.room_code == proj.room_code)
            .collect();

        for mut target in players {
            if target.identity == proj.owner_identity { continue; }
            if target.character_type == "ghost" { continue; }

            let dx = (target.pos_x - proj.pos_x).abs();
            let dz = (target.pos_z - proj.pos_z).abs();

            if dx < 0.6 && dz < 0.6 {
                if target.shield_active && target.character_type == "black" {
                    proj.direction = -proj.direction;
                    reflected = true;
                } else if target.status == "alive" || target.status == "in_quiz" {
                    target.pos_z += proj.direction as f32;
                    ctx.db.player().identity().update(target);
                    hit = true;
                }
                break;
            }
        }

        if hit {
            ctx.db.projectile().projectile_id().delete(proj.projectile_id);
        } else {
            if reflected {
                // Also bounce back 1 tile
                proj.pos_z += proj.direction as f32;
            }
            ctx.db.projectile().projectile_id().update(proj);
        }
    }
}

#[spacetimedb::reducer(update)]
pub fn shield_expire(ctx: &ReducerContext, sched: ShieldExpireSchedule) {
    if let Some(mut player) = ctx.db.player().identity().find(sched.player_identity) {
        player.shield_active = false;
        player.shield_cooldown = true;
        ctx.db.player().identity().update(player);

        ctx.db.shield_cooldown_schedule().insert(ShieldCooldownSchedule {
            scheduled_id: 0,
            scheduled_at: ScheduleAt::Time(
                (ctx.timestamp + Duration::from_secs(9)).into()
            ),
            player_identity: sched.player_identity,
        });
    }
}

#[spacetimedb::reducer(update)]
pub fn shield_cooldown_expire(_ctx: &ReducerContext, sched: ShieldCooldownSchedule) {
    if let Some(mut player) = _ctx.db.player().identity().find(sched.player_identity) {
        player.shield_cooldown = false;
        _ctx.db.player().identity().update(player);
    }
}
