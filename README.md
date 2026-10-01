# Elseplane

Elseplane is a tactile fourth-dimensional toybox for desktop browsers. It renders genuine three-dimensional intersections of four-dimensional toys, allowing the player to move and rotate the visible slice, grab and throw what it intersects, and recover objects that still exist beyond sight.

This is an original, independent experience inspired by the spatial ideas popularized by *4D Toys*. It does not use the reference game's code, assets, interface, writing, audio, or scene compositions.

## Play locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. A production build can be previewed with:

```bash
npm run build
npm run preview
```

You can also double-click the repository's `index.html` to play directly in an external browser without starting a server. Run `npm run bundle:direct` after source changes to refresh that direct-launch bundle.

## Controls

- Drag a visible Toy to grab and throw it.
- Drag empty scene space to orbit the 3D camera.
- Use **Move through W** or the left/right arrow keys to translate the 3D Slice.
- Use **XW**, **YW**, and **ZW rotate** to rotate the Slice through four-dimensional space.
- Press Space to pause or play, R to reset, and Ctrl/Command-Z to undo.
- Open **Gallery** to visit all eight Scenes and **Journal** to revisit discoveries.
- The Workbench Toy Drawer can add all six Toy Families.

Experiments are only saved when **Save experiment** is selected. **Open saved** restores that one browser-local save. Exported `.elseplane` files are versioned JSON and can be imported explicitly.

## Verification

```bash
npm run check
```

The check runs deterministic unit tests for geometry, bounded physics, and Experiment File validation; creates the production build; and runs browser journeys for slice travel, the complete Gallery, discoveries, accessibility preferences, and save/open recovery.

## Architecture

- `src/geometry4d.ts` — renderer-independent 4D transforms and intersections
- `src/physics.ts` — fixed-step bounded toy motion
- `src/scenes.ts` — eight original Scene definitions
- `src/sandbox.ts` — Three.js presentation and direct manipulation
- `src/storage.ts` — local preferences and versioned Experiment Files
- `CONTEXT.md` — canonical domain vocabulary
- `docs/adr/` — accepted product and architecture decisions

Elseplane is client-only: it has no accounts, backend, analytics, advertising, tracking, or remote error reporting.

## License

MIT. See [LICENSE](LICENSE).
