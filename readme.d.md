spacetime build

spacetime generate --lang typescript --out-dir ../client/src/generated --bin-path target/wasm32-unknown-unknown/release/spacetime_module.wasm

spacetime publish --server local spst-crossy -y

spacetime delete spst-crossy --server local

