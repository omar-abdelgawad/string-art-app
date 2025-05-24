defautl:
  @just --list

build-wasm:
  @cd wasm-stringart && just build

# I can't run this locally after upgrading ubu24 due to dependencies
run-tauri-app:
  npm run tauri dev # or cargo tauri dev but I already installed from npm

# doesn't work locally due to node version
launch-website-locally:
  @cd docs && npm start

clean-rust-bins:
  cd wasm-stringart && cargo clean
  cd stringart && cargo clean
  cd src-tauri && cargo clean
