import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="shell">
    <header class="masthead">
      <div><span class="eyebrow">A tactile fourth-dimensional toybox</span><h1>Elseplane</h1></div>
      <span class="mvp">Geometry laboratory · MVP 1</span>
    </header>
    <section class="hero" aria-labelledby="welcome-title">
      <div class="orb" aria-hidden="true"><span></span><span></span><span></span></div>
      <div><p class="kicker">The world is larger than the part you can see.</p>
      <h2 id="welcome-title">Touch a three-dimensional slice of four-dimensional space.</h2>
      <p>The mathematical core is awake. Interactive Scenes arrive in the next playable milestone.</p></div>
    </section>
  </main>`;

