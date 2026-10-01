import './style.css';
import { Sandbox } from './sandbox';
import { scenes } from './scenes';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main class="game-shell">
  <header class="topbar"><div><span class="eyebrow">A tactile fourth-dimensional toybox</span><h1>Elseplane</h1></div><nav><button id="gallery" class="quiet">Gallery</button><button id="journal" class="quiet">Journal <span id="journal-count">0</span></button><button id="help" class="quiet">How to play</button></nav></header>
  <section class="scene-card"><div id="viewport" aria-label="Interactive 4D toy scene"></div>
    <div class="scene-title"><span id="scene-number">Scene 02</span><div><h2 id="scene-name">First Crossing</h2><p id="scene-prompt">What disappears is still there.</p></div></div>
    <aside class="readout"><span>Slice position</span><strong id="w-readout">W&nbsp; 0.00</strong><small id="selection">No toy selected</small></aside>
  </section>
  <section class="controls" aria-label="Scene controls">
    <label class="wide">Move through W <input id="slice" type="range" min="-4" max="4" step="0.01" value="0"></label>
    <label>XW rotate <input id="xw" type="range" min="-3.14" max="3.14" step="0.01" value="0"></label>
    <label>YW rotate <input id="yw" type="range" min="-3.14" max="3.14" step="0.01" value="0"></label>
    <label>ZW rotate <input id="zw" type="range" min="-3.14" max="3.14" step="0.01" value="0"></label>
    <div class="button-row"><button id="pause">Pause</button><button id="slower">0.5×</button><button id="recover">Return toys</button><button id="reset" class="quiet">Reset</button><span class="drawer-label">Toy Drawer</span><button class="toy-add" data-kind="tesseract">Tesseract</button><button class="toy-add" data-kind="hypersphere">Hypersphere</button><button class="toy-add" data-kind="simplex">5-cell</button><button class="toy-add" data-kind="orthoplex">16-cell</button><button class="toy-add" data-kind="duocylinder">Duocylinder</button><button class="toy-add" data-kind="hypertorus">Ring</button></div>
  </section>
</main>
<dialog id="guide"><button data-close class="close" aria-label="Close">×</button><span class="eyebrow">First Crossing</span><h2>Hold what you can see.</h2><p>Drag a toy to throw it. Drag empty space to orbit the camera. The W slider moves your entire three-dimensional slice through the fourth dimension; the rotation sliders tilt that slice through XW, YW, and ZW.</p><p>If a toy vanishes, move W toward its marker or choose <strong>Return toys</strong>.</p></dialog>
<dialog id="gallery-dialog"><button data-close class="close" aria-label="Close">×</button><span class="eyebrow">Eight experiments</span><h2>The Gallery</h2><div class="gallery-grid">${scenes.map((scene, index) => `<button class="scene-choice" data-scene="${scene.id}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${scene.name}</strong><small>${scene.prompt}</small></button>`).join('')}</div></dialog>
<dialog id="journal-dialog"><button data-close class="close" aria-label="Close">×</button><span class="eyebrow">Things you have noticed</span><h2>Discovery Journal</h2><div id="journal-pages"><p>Move a slice or rotate 4D space to begin noticing what ordinary sight leaves out.</p></div></dialog>`;

const sandbox = new Sandbox(document.querySelector('#viewport')!);
const byId = <T extends HTMLElement>(id: string): T => document.querySelector<T>(`#${id}`)!;
const bindRange = (id: string, apply: (value: number) => void): void => byId<HTMLInputElement>(id).addEventListener('input', (event) => apply(Number((event.target as HTMLInputElement).value)));
const discoveries = new Set<string>();
const notice = (): void => { discoveries.add(sandbox.currentScene.id); byId('journal-count').textContent = String(discoveries.size); byId('journal-pages').innerHTML = [...discoveries].map((id) => { const scene = scenes.find((item) => item.id === id)!; return `<article><strong>${scene.name}</strong><p>${scene.discovery}</p></article>`; }).join(''); };
bindRange('slice', (value) => { sandbox.setSlice(value); if (Math.abs(value) > .7) notice(); });
(['xw', 'yw', 'zw'] as const).forEach((id, axis) => bindRange(id, (value) => { sandbox.setRotation(axis, value); if (Math.abs(value) > .35) notice(); }));
byId('pause').addEventListener('click', () => { sandbox.paused = !sandbox.paused; byId('pause').textContent = sandbox.paused ? 'Play' : 'Pause'; });
byId('slower').addEventListener('click', () => { sandbox.timeScale = sandbox.timeScale === 1 ? 0.5 : sandbox.timeScale === 0.5 ? 0.25 : 1; byId('slower').textContent = `${sandbox.timeScale}×`; });
byId('recover').addEventListener('click', () => sandbox.recoverAll());
byId('reset').addEventListener('click', () => { sandbox.reset(); for (const id of ['slice', 'xw', 'yw', 'zw']) byId<HTMLInputElement>(id).value = '0'; });
const guide = byId<HTMLDialogElement>('guide'); const gallery = byId<HTMLDialogElement>('gallery-dialog'); const journal = byId<HTMLDialogElement>('journal-dialog');
byId('help').addEventListener('click', () => guide.showModal()); byId('gallery').addEventListener('click', () => gallery.showModal()); byId('journal').addEventListener('click', () => journal.showModal());
document.querySelectorAll<HTMLButtonElement>('[data-close]').forEach((button) => button.addEventListener('click', () => button.closest('dialog')?.close()));
document.querySelectorAll<HTMLButtonElement>('.scene-choice').forEach((button) => button.addEventListener('click', () => { sandbox.loadScene(button.dataset.scene!); gallery.close(); const index = scenes.indexOf(sandbox.currentScene); byId('scene-number').textContent = `Scene ${String(index + 1).padStart(2, '0')}`; byId('scene-name').textContent = sandbox.currentScene.name; byId('scene-prompt').textContent = sandbox.currentScene.prompt; for (const id of ['slice', 'xw', 'yw', 'zw']) byId<HTMLInputElement>(id).value = '0'; }));
document.querySelectorAll<HTMLButtonElement>('.toy-add').forEach((button) => button.addEventListener('click', () => { sandbox.addToy(button.dataset.kind as Parameters<typeof sandbox.addToy>[0]); if (sandbox.toys.length >= 4) notice(); }));
sandbox.onChange = () => { byId('w-readout').textContent = `W  ${sandbox.sliceW.toFixed(2)}`; const selected = sandbox.selected; byId('selection').textContent = selected ? `${selected.id.replace('-', ' ')} · W ${selected.position[3].toFixed(2)}` : (sandbox.recoverableCount ? `${sandbox.recoverableCount} recoverable` : 'No toy selected'); };
