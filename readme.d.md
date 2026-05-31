spacetime build

spacetime generate --lang typescript --out-dir ../client/src/generated --bin-path target/wasm32-unknown-unknown/release/spacetime_module.wasm

spacetime publish --server local spst-crossy -y

spacetime delete spst-crossy --server local


# Admin Access

Nút "Tạo phòng" chỉ hiện với người có flag trong localStorage.

Mở DevTools (F12) → Console → chạy:
  localStorage.setItem("isAdmin", "me")

Reload lại trang là thấy nút Admin.

Để thu hồi:
  localStorage.removeItem("isAdmin")
