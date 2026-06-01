# Dev Commands

## Server build & publish

```bash
spacetime build

spacetime generate --lang typescript --out-dir ../client/src/generated --bin-path target/wasm32-unknown-unknown/release/spacetime_module.wasm

spacetime publish --server local spst-crossy -y

spacetime delete spst-crossy --server local
```

---

## ⚠️ Warnings

### Windows: setup.sh không chạy native
`setup.sh` là bash script. Trên Windows phải dùng **Git Bash** hoặc **WSL**:
```bash
bash setup.sh
```
Hoặc cài thủ công: Rust → `rustup target add wasm32-unknown-unknown` → SpacetimeDB CLI.

### wasm32 target bắt buộc trước khi build
```bash
rustup target add wasm32-unknown-unknown
```
Thiếu target này → `spacetime build` sẽ fail ngay.

### Phải chạy `spacetime start` trước khi publish
```bash
# Terminal 1
spacetime start

# Terminal 2 (sau khi server ready)
spacetime publish --server local spst-crossy -y
```

### Đổi schema server → phải làm đủ 3 bước
Khi thêm/xóa field trong table hoặc thêm reducer:
```bash
# 1. Xóa DB cũ (bắt buộc nếu thay đổi schema)
spacetime delete spst-crossy --server local

# 2. Build lại
spacetime build

# 3. Publish + regenerate bindings
spacetime publish --server local spst-crossy -y
spacetime generate --lang typescript --out-dir ../client/src/generated --bin-path target/wasm32-unknown-unknown/release/spacetime_module.wasm
```
Bỏ qua bước delete → server giữ schema cũ → type mismatch, lỗi khó debug.

---

## Chạy bot (load test / fill phòng)

```bash
cd client
npm run simulate -- <MÃ_PHÒNG> [số_bot] [giây]
```

**Ví dụ:**
```bash
npm run simulate -- ABC12 29 120
```
→ 29 bot join phòng `ABC12`, chạy 120 giây.

Mặc định kết nối `localhost:3000` / `spst-crossy`. Để dùng host khác:
```bash
STDB_HOST=maincloud.spacetimedb.com STDB_NAME=vibe-multiplayer-arishem npm run simulate -- ABC12 29 120
```

**Thứ tự:**
1. Tạo phòng trên browser → lấy mã phòng
2. Chạy lệnh trên → bot join phòng
3. Bấm **Bắt đầu ngay** trong lobby → bot tự di chuyển

---

## Admin Access

Nút "Tạo phòng" chỉ hiện với người có flag trong localStorage.

Mở DevTools (F12) → Console → chạy:
```js
localStorage.setItem("isAdmin", "me")
```

Reload lại trang là thấy nút Admin.

Để thu hồi:
```js
localStorage.removeItem("isAdmin")
```
