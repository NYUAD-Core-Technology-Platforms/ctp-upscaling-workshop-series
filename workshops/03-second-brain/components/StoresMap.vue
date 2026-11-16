<!--
  StoresMap: the vault in the middle points to the stores that keep their own
  content (files, code, email, tasks) and generates the published views.
  Wires flow outwards. Coordinates follow a 1680 x 560 design grid.
-->
<template>
  <div class="sb-stores">
    <svg class="wires" viewBox="0 0 1680 560" preserveAspectRatio="none" aria-hidden="true">
      <path d="M620 250 C520 250 480 70 390 70" />
      <path d="M620 320 C520 320 480 390 390 390" />
      <path d="M1060 250 C1160 250 1200 70 1290 70" />
      <path d="M1060 320 C1160 320 1200 390 1290 390" />
      <path class="gen" d="M840 368 L840 420" />
    </svg>
    <div class="store sb-rise" style="--d:2;left:0;top:1.8%"><b>Working files</b><span>Box or Drive: documents, data, media</span></div>
    <div class="store sb-rise" style="--d:3;left:0;top:59%"><b>Code &amp; docs</b><span>Repositories keep their own instructions</span></div>
    <div class="store sb-rise" style="--d:4;left:76.8%;top:1.8%"><b>Email</b><span>Evidence, linked by thread</span></div>
    <div class="store sb-rise" style="--d:5;left:76.8%;top:59%"><b>Tasks &amp; calendar</b><span>Commitments with dates</span></div>
    <div class="store gen sb-rise" style="--d:6;left:38.4%;top:75%"><b>Published views</b><span>Wiki, training packs, reports: generated</span></div>
    <div class="vault sb-rise" style="--d:1"><b>The vault</b><span>current state, decisions and pointers</span></div>
  </div>
</template>

<style scoped>
.sb-stores { position: relative; height: 280px; flex: none; }
.wires { position: absolute; inset: 0; width: 100%; height: 100%; }
.wires path { fill: none; stroke: var(--violet-300); stroke-width: 3; stroke-dasharray: 3 10; stroke-linecap: round; vector-effect: non-scaling-stroke; animation: st-flow 1.3s linear infinite; }
.wires path.gen { stroke: var(--gold); }
.store { position: absolute; width: 23.2%; background: var(--sb-card); border: 1px solid var(--hairline); border-radius: 6px; box-shadow: var(--sb-shadow); padding: 10px 13px; }
.store b { display: block; font: 700 14px/1.15 var(--font-serif); }
.store span { display: block; font-size: 11px; line-height: 1.35; color: var(--fg2); margin-top: 3px; }
.store.gen { border: 1.5px dashed var(--gold); box-shadow: none; background: transparent; }
.vault { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 26%; padding: 16px 18px; border-radius: 10px; background: var(--nyuad-deep-violet); color: #fff; text-align: center; box-shadow: 0 14px 26px -12px rgba(61, 4, 98, .6); }
.vault b { display: block; font: 700 20px/1.1 var(--font-serif); }
.vault span { display: block; font-size: 11.5px; line-height: 1.4; color: var(--violet-200); margin-top: 5px; }
@keyframes st-flow { to { stroke-dashoffset: -26; } }
</style>
