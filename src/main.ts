import './style.css';
import { Sandbox } from './sandbox';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main class="game-shell">
  <header class="topbar"><div><span class="eyebrow">A tactile fourth-dimensional toybox</span><h1>Elseplane</h1></div><button id="help" class="quiet">How to play</button></header>
  <section class="scene-card"><div id="viewport" aria-label="Interactive 4D toy scene"></div>
    <div class="scene-title"><span>Scene 02</span><div><h2>First Crossing</h2><p>Move the slice. What disappears is still there.</p></div></div>
    <aside class="readout"><span>Slice position</span><strong id="w-readout">W&nbsp; 0.00</strong><small id="selection">No toy selected</small></aside>
  </section>
  <section class="controls" aria-label="Scene controls">
    <label class="wide">Move through W <input id="slice" type="range" min="-4" max="4" step="0.01" value="0"></label>
    <label>XW rotate <input id="xw" type="range" min="-3.14" max="3.14" step="0.01" value="0"></label>
    <label>YW rotate <input id="yw" type="range" min="-3.14" max="3.14" step="0.01" value="0"></label>
    <label>ZW rotate <input id="zw" type="range" min="-3.14" max="3.14" step="0.01" value="0"></label>
    <div class="button-row"><button id="pause">Pause</button><button id="slower">0.5×</button><button id="recover">Return toys</button><button id="reset" class="quiet">Reset</button></div>
  </section>
</main>
<dialog id="guide"><button id="close" class="close" aria-label="Close">×</button><span class="eyebrow">First Crossing</span><h2>Hold what you can see.</h2><p>Drag a toy to throw it. Drag empty space to orbit the camera. The W slider moves your entire three-dimensional slice through the fourth dimension; the rotation sliders tilt that slice through XW, YW, and ZW.</p><p>If a toy vanishes, move W toward its marker or choose <strong>Return toys</strong>.</p></dialog>`;

const sandbox = new Sandbox(document.querySelector('#viewport')!);
const byId = <T extends HTMLElement>(id: string): T => document.querySelector<T>(`#${id}`)!;
const bindRange = (id: string, apply: (value: number) => void): void => byId<HTMLInputElement>(id).addEventListener('input', (event) => apply(Number((event.target as HTMLInputElement).value)));
bindRange('slice', (value) => sandbox.setSlice(value));
(['xw', 'yw', 'zw'] as const).forEach((id, axis) => bindRange(id, (value) => sandbox.setRotation(axis, value)));
byId('pause').addEventListener('click', () => { sandbox.paused = !sandbox.paused; byId('pause').textContent = sandbox.paused ? 'Play' : 'Pause'; });
byId('slower').addEventListener('click', () => { sandbox.timeScale = sandbox.timeScale === 1 ? 0.5 : sandbox.timeScale === 0.5 ? 0.25 : 1; byId('slower').textContent = `${sandbox.timeScale}×`; });
byId('recover').addEventListener('click', () => sandbox.recoverAll());
byId('reset').addEventListener('click', () => { sandbox.reset(); for (const id of ['slice', 'xw', 'yw', 'zw']) byId<HTMLInputElement>(id).value = '0'; });
const guide = byId<HTMLDialogElement>('guide'); byId('help').addEventListener('click', () => guide.showModal()); byId('close').addEventListener('click', () => guide.close());
sandbox.onChange = () => { byId('w-readout').textContent = `W  ${sandbox.sliceW.toFixed(2)}`; const selected = sandbox.selected; byId('selection').textContent = selected ? `${selected.id.replace('-', ' ')} · W ${selected.position[3].toFixed(2)}` : (sandbox.recoverableCount ? `${sandbox.recoverableCount} recoverable` : 'No toy selected'); };
