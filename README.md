# String Art Generator

A tool that transforms images into string art using a greedy algorithm implemented in Rust, with both web and desktop interfaces.

## Project Structure

- `stringart/` - Core Rust package implementing the string art algorithm
- `wasm-stringart/` - WebAssembly bindings for the core algorithm
- `src-tauri/` - Tauri desktop application configuration
- `src/` - Frontend web application (vanilla JavaScript)
- `docs/` - GitHub Pages deployment files

## Deployment

### Desktop Application (Tauri)
The project uses Tauri to create a desktop application that combines the Rust backend with a web-based frontend:

```bash
# Build and run desktop app
npm run tauri dev
```

### Web Application (GitHub Pages)
The web version is automatically deployed to GitHub Pages using GitHub Actions:

1. The Rust backend is compiled to WebAssembly using `wasm-pack`
2. The web application in `docs/` directory uses the WebAssembly module
3. GitHub Actions automatically builds and deploys to GitHub Pages on push

## Development

### Prerequisites
- Rust toolchain
- Node.js
- wasm-pack
- Tauri dependencies

### Build Steps

1. Build WebAssembly module:
```bash
cd wasm-stringart
wasm-pack build
```

2. Run web version locally:
```bash
cd docs
npm start
```

3. Build desktop version:
```bash
npm run tauri build
```

## Architecture

- **Frontend**: Vanilla JavaScript with HTML Canvas for rendering
- **Backend**: Rust implementation of string art algorithm
- **Interfaces**:
  - Desktop: Tauri-based application
  - Web: WebAssembly compilation served via GitHub Pages
