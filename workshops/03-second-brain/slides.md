---
# Your AI forgets. Your vault doesn't.
# Obsidian and Markdown as a shared, model-agnostic memory for AI-assisted work.
theme: ctp
routerMode: hash
title: "Your AI forgets. Your vault doesn't."
info: |
  CTP Upscaling Workshop 03. Your AI forgets. Your vault doesn't: Obsidian and Markdown as a
  shared, model-agnostic memory for AI-assisted work, with a live demo of two
  AIs on one vault and a hands-on setup of a starter vault.
author: Samuel A. Prieto
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: fade
selectable: true
mdc: true
layout: cover
class: sb-cover
---

<VaultGraph />

# Your AI forgets. *Your vault doesn't.*

<p class="sb-hero-sub">Obsidian and Markdown as a shared, model-agnostic memory for AI-assisted work</p>

::eyebrow::
<span class="ctp-tag ctp-tag--accent">Workshop · Obsidian × AI</span>

::meta::
**Samuel A. Prieto**

KINESIS · Core Technology Platforms · NYU Abu Dhabi

<!--
Welcome. In the next 45 minutes (30 in a short slot): why chat memory breaks real work, how I run a core facility on plain Markdown files that any AI can use, a live demo with two different AIs on the same files, and then we set up your own vault together, step by step. Laptop optional: follow along or just watch. The moving graph is what a vault looks like in Obsidian: notes and the links between them. (0:30)

Timing, full session (CTP team): about 45 min + Q&A. Hook 1-3: 2:30 · Problem 4-5: 2:30 · Idea 6-8: 3:30 · Obsidian 9: 2:00 · How we run it 10-16: 8:00 · Live demo 17-20: 8:00 · Credits and models 21-22: 2:00 · Start today 23: 1:00 · Hands-on 24-31: 14:30 · Habits 32: 1:00 · Close 33: 0:30 · then Q&A, 10-15 min.

Short slot (Cafe): about 32 min + Q&A. Skip 7, 11, 15 and 22; in the hands-on part show only 24, 26 and 27, as a demo; show the demo recaps 18-20 only if the live demo fails.
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Quick show of hands</div>

# This month, have you…

<div class="sb-hooks">
<div v-click class="sb-hook"><div class="big">01</div><div class="sb-hic"><svg viewBox="0 0 24 24"><g class="spin"><path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9"/><path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9"/><path d="M18.6 2.6v3.7h-3.7"/><path d="M5.4 21.4v-3.7h3.7"/></g></svg></div><p>…re-explained a project to an AI from scratch?</p></div>
<div v-click class="sb-hook"><div class="big">02</div><div class="sb-hic"><svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><g class="bob"><path d="M9.9 11.2a2.1 2.1 0 1 1 3 1.9c-.6.3-.9.8-.9 1.4v.3"/><circle cx="12" cy="17.4" r=".55" fill="currentColor"/></g></svg></div><p>…opened an AI-written document and couldn't say why it says what it says?</p></div>
<div v-click class="sb-hook"><div class="big">03</div><div class="sb-hic"><svg viewBox="0 0 24 24"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v3.8a2.5 2.5 0 0 1-2.5 2.5H9.2L5.6 14.6v-2.8A2.5 2.5 0 0 1 3 9.3z"/><path d="M7 7.4h6"/><g class="seek"><circle cx="16.6" cy="16.2" r="3.7"/><path d="M19.4 19l2.4 2.4"/></g></svg></div><p>…lost a useful answer somewhere in your chat history?</p></div>
</div>

<!--
Reveal one question at a time and pause for hands. Most hands go up on the first one. The point to land: we keep paying a "re-explain" tax because the memory lives inside the chat. (1:00)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Sound familiar?</div>

# The hard questions are about *memory*, not models

<div class="sb-quotes">
<div class="sb-quote sb-rise" style="--d:1">How do I track what the AI actually did?</div>
<div class="sb-quote sb-rise" style="--d:3">Where can I see the decisions it made, and why?</div>
<div class="sb-quote sb-rise" style="--d:5">Which version is the current one?</div>
<div class="sb-quote sb-rise" style="--d:7">I came back two months later and the chat was working from outdated information.</div>
</div>

<!--
Questions people raise as soon as they use AI for real processes or teaching materials. None of them says the model is weak. They are about where the memory lives and whether you can audit it. That is what this session answers. (1:00)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">A familiar story</div>

# An SOP, two months later

<div class="sb-tl">
<div class="pt" style="--t:.15s"><div class="dotc" style="background:var(--sb-good)">✓</div><div class="m">AUGUST</div><p>You draft the battery-storage SOP with an AI chat. It's good.</p><div class="sb-mini"><span class="mi">SOP</span><div><b>LiPo charging &amp; storage</b><span>v1 · drafted in a chat</span></div></div></div>
<div class="pt" style="--t:.75s"><div class="dotc" style="background:var(--sb-warm)">!</div><div class="m">SEPTEMBER</div><p>The new fire-resistant cabinet goes into the KINESIS lab. Every battery moves there from Room 101.</p><div class="sb-mini warn"><span class="mi">!</span><div><b>New cabinet in service</b><span>KINESIS lab · Room 101 emptied</span></div></div></div>
<div class="pt" style="--t:1.35s"><div class="dotc" style="background:var(--sb-bad)">✕</div><div class="m">OCTOBER</div><p>You go back to the same chat to make a quick-start for new users. It still works from August.</p>
<div class="sb-chat" style="margin-top:10px"><div class="sb-chat__hd"><span>Same chat, two months later</span><span class="sb-tag sb-late" style="--ts:2.2s;--tl:1.1s">Outdated</span></div><div class="sb-chat__bd"><div class="sb-bubble u sb-late" style="--ts:1.5s;--tl:.2s">Turn the SOP into a one-page quick-start for new users.</div><div class="sb-reply"><div class="sb-typing" style="--ts:1.9s;--tl:1.2s"><i></i><i></i><i></i></div><div class="sb-bubble a bad sb-late" style="--ts:1.9s;--tl:1.2s">Quick-start: store LiPo batteries in the cabinet in Room 101 and charge them at the charging table.</div></div></div></div>
</div>
</div>

<p class="sb-statement sb-late sb-push" style="--ts:3.4s;--tl:.2s">The chat doesn't know what it doesn't know.</p>

<!--
A familiar case, built on our own battery change. In August you draft the battery SOP with an AI chat, while the batteries sit in temporary storage in Room 101. In September the new fire-resistant cabinet goes into the KINESIS lab and every battery moves there. In October you go back to the same chat to make a quick-start for new users, and it confidently writes the old rule, because it has no way to know. Multiply that by every SOP, risk assessment, course material or analysis built inside a chat. (1:30)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Why chat memory fails real work</div>

# Five ways a chat lets you down

<div class="sb-fails">
<div v-click class="sb-fail"><div class="ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><h3>Stale</h3><p>Doesn't know what changed since.</p></div>
<div v-click class="sb-fail"><div class="ic"><svg viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c5 0 9 6 9 6a16 16 0 0 1-2.7 3.3"/><path d="M6.4 7.7C4.3 9.2 3 12 3 12s4 6 9 6a8.7 8.7 0 0 0 4.1-1"/></svg></div><h3>Untraceable</h3><p>No record of what was done, or why.</p></div>
<div v-click class="sb-fail"><div class="ic"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l2.5 2.5"/></svg></div><h3>Unversioned</h3><p>No history, no diff, no undo.</p></div>
<div v-click class="sb-fail"><div class="ic"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="16" rx="1.5"/><rect x="17" y="4" width="4" height="16" rx="1.5"/></svg></div><h3>Siloed</h3><p>Every tool keeps its own private memory.</p></div>
<div v-click class="sb-fail"><div class="ic"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div><h3>Personal</h3><p>Your colleagues can't read your chats.</p></div>
</div>

<div v-click class="sb-banner sb-push">And when your tool, plan or credits change, <b>that memory stays behind.</b></div>

<!--
Five failure modes. Stale: it does not know what changed. Untraceable: you cannot see what it did or why. Unversioned: no history, no undo. Siloed: one tool's memory is not another's. Personal: your colleagues cannot read your chats. And when your plan, credits or tool change, all of that memory stays behind. (1:00)
-->

---
layout: default
---

<div class="sb-row" style="flex:1;align-items:center;gap:10px">
<div class="sb-col" style="flex:0 0 400px;gap:0">
<div class="sb-kicker ctp-eyebrow">The idea</div>
<h1 style="font-size:44px;line-height:1.04">Move the memory <em>out of the model.</em></h1>
<p class="sb-lede" style="margin-top:14px;font-size:17px">The project lives in plain files you own. Any AI reads them, does the work and writes back.</p>
<p class="sb-statement" style="margin-top:22px">Swap the AI. <b>Keep the brain.</b></p>
</div>
<div class="sb-grow" style="display:flex;justify-content:center"><HubDiagram class="sb-rise" style="height:440px;width:490px" /></div>
</div>

<!--
This is the whole talk in one picture. The vault is a folder of Markdown files, versioned with Git. I work in it with Obsidian; the AIs read context from it (violet) and write their results back to it (gold). Any of them can be swapped, because the memory never lived inside them. (1:30)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Side by side</div>

# Chat history vs. a second brain

<table class="sb-cmp">
<thead><tr style="--i:0"><th></th><th class="c">Chat history</th><th class="t">Second brain</th></tr></thead><tbody>
<tr style="--i:1"><td>Where it lives</td><td class="c">Inside one tool's history</td><td class="t">Files you own, in a folder</td></tr>
<tr style="--i:2"><td>Who can read it</td><td class="c">You, in that tool</td><td class="t">You, your colleagues, any AI</td></tr>
<tr style="--i:3"><td>When things change</td><td class="c">Keeps the old answer</td><td class="t">Note updated, decision logged</td></tr>
<tr style="--i:4"><td>History</td><td class="c">Scroll and hope</td><td class="t">Every change dated and reversible</td></tr>
<tr style="--i:5"><td>Switching tools</td><td class="c">Start over</td><td class="t">Point the new tool at the folder</td></tr>
<tr style="--i:6"><td>Every new session</td><td class="c">Re-explain the context</td><td class="t">Load only the note it needs</td></tr>
</tbody></table>

<p class="sb-statement sb-late sb-push" style="--ts:1.1s;font-size:18px">A chat is a hallway conversation with a brilliant colleague who forgets it the moment you walk away. <b>The vault is the lab notebook.</b></p>

<!--
Side by side. The analogy I use: a chat is a hallway conversation with a brilliant colleague who forgets everything when you walk away; the vault is the lab notebook. Nobody would run a lab from hallway conversations. (1:00; short slot: skip)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">How the brain is organized</div>

# Three layers, three rules

<div class="sb-layers">
<div class="sb-layer sb-rise" style="--d:1;--c:var(--sb-gold-ink);--cs:var(--sb-gold-soft)"><div class="lbl"><small>Layer 1</small>Evidence</div><div class="ex">Emails, attachments, transcripts, logs, vendor documents</div><div class="rule">Kept as-is, linked</div></div>
<div class="sb-arrowdown"><svg viewBox="0 0 26 34"><path d="M13 2v26M4 20l9 10 9-10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>reconcile</div>
<div class="sb-layer sb-rise" style="--d:4;--c:var(--sb-accent);--cs:var(--sb-violet-soft)"><div class="lbl"><small>Layer 2</small>Canonical state</div><div class="ex">One current record per project, equipment item, procedure and decision</div><div class="rule">Curated: the truth today</div></div>
<div class="sb-arrowdown"><svg viewBox="0 0 26 34"><path d="M13 2v26M4 20l9 10 9-10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>generate</div>
<div class="sb-layer sb-rise" style="--d:7;--c:var(--sb-good);--cs:var(--sb-good-soft)"><div class="lbl"><small>Layer 3</small>Actions &amp; views</div><div class="ex">Tasks, calendar, reports, wiki pages, training packs, digests</div><div class="rule">Generated from the state</div></div>
</div>

<p class="sb-statement sb-late sb-push" style="--ts:1.1s;font-size:18px">Capture is not completion: new evidence has to <b>update the current state.</b></p>

<!--
Three layers keep the brain honest. Evidence (emails, attachments, transcripts) is kept as it is and linked. Canonical state is one current record per project, equipment item, procedure or decision. Views (tasks, reports, wiki pages) are generated from that state. The classic mistake is to stop at capture: saving everything without ever updating the current state. (1:00)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Obsidian in three minutes</div>

# A vault is just a folder of *Markdown files*

<div class="sb-row" style="gap:20px;align-items:flex-start">
<CodeWin tab="lipo-batteries.md" rt="the file on disk" reveal :lstep="75" :l0="300" class="sb-rise" style="--d:1;flex:0 0 430px">
<pre><span class="c">---</span>
<span class="k">type:</span> <span class="s">equipment</span>
<span class="k">status:</span> <span class="s">active</span>
<span class="k">location:</span> <span class="s">KINESIS lab, fire-resistant cabinet</span>
<span class="k">sop:</span> <span class="l">"[[LiPo charging and storage]]"</span>
<span class="k">last_updated:</span> <span class="n">2026-10-15</span>
<span class="c">---</span>
<span class="h"># LiPo batteries</span>
&#8203;
Storage rules changed on 2026-10-15,
see <span class="l">[[decisions#D7]]</span>.
&#8203;
<span class="c">- [ ]</span> Inspect for swollen packs monthly</pre>
</CodeWin>
<div class="sb-render sb-late sb-grow" style="--ts:1.4s">
<div class="sb-props"><span class="pk">type</span><span>equipment</span><span class="pk">status</span><span>active</span><span class="pk">location</span><span>KINESIS lab, fire-resistant cabinet</span><span class="pk">sop</span><span><a>LiPo charging and storage</a></span><span class="pk">last updated</span><span>2026-10-15</span></div>
<h4>LiPo batteries</h4>
<p>Storage rules changed on 2026-10-15, see <a>decisions › D7</a>.</p>
<div class="sb-todo"><i></i>Inspect for swollen packs monthly</div>
<div class="sb-bl">3 backlinks · equipment hub, SOP, D7</div>
</div>
</div>

<div class="sb-chips sb-late" style="--ts:1.9s"><span class="sb-chip">Links &amp; backlinks</span><span class="sb-chip">Properties</span><span class="sb-chip">Graph view</span><span class="sb-chip">Search</span><span class="sb-chip">Git plugin</span><span class="sb-caption" style="margin-left:6px;font-size:12.5px">Free · offline · no database · opens in any editor</span></div>

<!--
Obsidian in three minutes. A vault is just a folder of .md files. On the left, the raw file; on the right, what Obsidian shows. The properties at the top are structured fields; double square brackets make links; Obsidian tracks backlinks and draws the graph. No database, no lock-in, free, works offline. And every AI tool can read and write these files. No need to switch to Obsidian now: we open it together in the hands-on part. (2:00)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">One contract for every AI</div>

# Write the rules once. *Every AI follows them.*

<div class="sb-row" style="gap:22px;flex:1;margin-bottom:6px">
<CodeWin tab="AGENTS.md" rt="read first, every session" reveal :lstep="85" :l0="300" class="sb-rise" style="--d:1;flex:0 0 500px;align-self:flex-start">
<pre><span class="h"># How to work in this vault</span>
&#8203;
<span class="w">1.</span> Pull before you start. Commit and push when done.
<span class="w">2.</span> Don't read everything: start at <span class="l">index.md</span>,
   then the relevant hub.
<span class="w">3.</span> Read the current state first; history only if needed.
<span class="w">4.</span> Keep links and properties intact. Link every
   new note to a hub.
<span class="w">5.</span> Record lasting decisions in <span class="l">decisions.md</span>,
   with the date and the reason.
<span class="w">6.</span> Ask before deleting, moving or reorganizing.
<span class="w">7.</span> Never store passwords or personal data.</pre>
</CodeWin>
<div class="sb-col sb-grow" style="gap:0">
<div class="sb-adapters">
<div class="sb-adapter sb-late" style="--ts:1.5s"><div class="ar"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></div><div><b>CLAUDE.md</b><span>A two-line pointer: read <code>AGENTS.md</code> and follow it</span></div></div>
<div class="sb-adapter sb-late" style="--ts:1.75s"><div class="ar"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></div><div><b>Codex</b><span>Reads <code>AGENTS.md</code> natively</span></div></div>
<div class="sb-adapter sb-late" style="--ts:2s"><div class="ar"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></div><div><b>Cursor</b><span>Reads <code>AGENTS.md</code> natively</span></div></div>
</div>
<p class="sb-caption sb-late sb-push" style="--ts:2.4s;font-size:13.5px;color:var(--fg2)">Switching tools means pointing the new one at the same folder. <b>Nothing to re-explain.</b></p>
</div>
</div>

<!--
Every AI tool reads an instruction file when it starts. We write the rules once, in AGENTS.md: pull first, navigate instead of reading everything, record decisions, ask before deleting, commit when done. Codex and Cursor read it natively; Claude's own file simply points to it. Switching tools means pointing the new one at the folder. (1:30)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Specialist roles</div>

# Roles are *procedures*, not personas

<div class="sb-roles">
<div class="sb-role sb-rise" style="--d:1"><span class="nick">threepio.md</span><h3>Orchestrator</h3><ul><li>Conversation and planning</li><li>Tasks and calendar</li><li>Routes work to the right role</li></ul></div>
<div class="sb-role sb-rise" style="--d:2;--c:var(--sb-gold-ink);--cs:var(--sb-gold-soft)"><span class="nick">artoo.md</span><h3>Intake</h3><ul><li>Inbox, files, transcripts</li><li>Extracts what changed</li><li>Files it and closes the item</li></ul></div>
<div class="sb-role sb-rise" style="--d:3;--c:var(--sb-good);--cs:var(--sb-good-soft)"><span class="nick">jocasta.md</span><h3>Records</h3><ul><li>Meetings and decisions</li><li>Links and hubs</li><li>Reports and accomplishments</li></ul></div>
<div class="sb-role sb-rise" style="--d:4;--c:var(--sb-bad);--cs:var(--sb-bad-soft)"><span class="nick">chopper.md</span><h3>Equipment &amp; compliance</h3><ul><li>One note per equipment item</li><li>SOPs and risk assessments</li><li>Generates the wiki</li></ul></div>
<div class="sb-role sb-rise" style="--d:5;--c:var(--fg2);--cs:var(--bg3)"><span class="nick">watto.md</span><h3>Procurement</h3><ul><li>Quotes and vendors</li><li>Purchase orders</li><li>Hands deliveries to equipment</li></ul></div>
</div>

<p class="sb-lede sb-late" style="--ts:1s;margin-top:14px;color:var(--fg1)">Each role is one Markdown file, loaded only when the task needs it. <b>Same model, different procedure.</b></p>

<p class="sb-caption sb-late sb-push" style="--ts:1.4s">Yes, it's a Star Wars crew. Droids get memory wipes; the knowledge lives in the Holocron.</p>

<!--
Roles are not different bots. They are procedures written in Markdown and loaded only when needed. The orchestrator talks to me and routes work; intake files whatever comes in; records keeps meetings, links and reports; equipment owns SOPs, risk assessments and the wiki; procurement handles quotes and purchase orders. And yes, it's a Star Wars crew: droids get memory wipes, so the knowledge lives in the Holocron. (1:00; short slot: skip)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Decisions</div>

# Every decision is *written down*

<div class="sb-row" style="gap:22px;flex:1;margin-bottom:6px">
<CodeWin tab="decisions.md" rt="newest at the bottom" reveal :lstep="90" :l0="300" class="sb-rise" style="--d:1;flex:0 0 510px;align-self:flex-start">
<pre><span class="h">## 2026-06-26 - D1: Equipment records live in the vault</span>
- <span class="k">Decision:</span> one note per equipment item is the
  source of truth; the wiki is generated from it.
- <span class="k">Context:</span> wiki data was edited by hand in two places.
- <span class="k">Status:</span> <span class="s">accepted</span>
&#8203;
<span class="h">## 2026-10-07 - D101: Move the daily assistant to</span>
<span class="h">   a different AI tool</span>
- <span class="k">Decision:</span> interactive work and the 07:30 email
  triage run from the new tool.
- <span class="k">Context:</span> AI access changed; the vault, rules and
  roles stay exactly the same.
- <span class="k">Status:</span> <span class="s">accepted</span></pre>
</CodeWin>
<div class="sb-col sb-grow" style="gap:16px">
<div class="sb-late" style="--ts:.6s"><div class="sb-label" style="margin-bottom:8px">Every entry records</div><div class="sb-chips"><span class="sb-chip good">Date</span><span class="sb-chip good">Decision</span><span class="sb-chip good">Context</span><span class="sb-chip good">Alternatives</span><span class="sb-chip good">Status</span></div></div>
<div class="sb-stat sb-late" style="--ts:.9s"><div class="v t"><CountUp :to="108" :delay="1000" /></div><div class="d">decisions logged since June 2026. Superseded ones stay, marked as such.</div></div>
<div class="sb-card sb-late sb-push" style="--ts:1.7s"><p class="sb-statement" style="font-size:15.5px">“Capture the vision durably first so it survives across chats/agents before building.”</p><p class="sb-label" style="margin-top:9px">Decision D3 · June 2026</p></div>
</div>
</div>

<!--
Every lasting decision gets a dated entry: what was decided, why, the alternatives and its status. Superseded decisions stay, marked as such, so you can always see why something is the way it is. Our third decision, back in June, sums up the whole approach: capture it durably so it survives across chats and agents. (1:30)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Versions</div>

# Every change is versioned, *human or AI*

<div class="sb-row" style="gap:24px;flex:1;align-items:flex-start">
<CodeWin tab="git log --oneline" rt="the vault's history" class="sb-rise" style="--d:1;flex:0 0 510px">
<div class="sb-gl">
<div class="r fresh" style="--i:0"><span class="hs">7a30b15</span><span class="ms">Workshop note: outline and demo script</span><span class="sb-who ag">agent · interactive</span></div>
<div class="r" style="--i:1"><span class="hs">50c9ebb</span><span class="ms">Daily triage 10-15: 9 notes updated</span><span class="sb-who sc">agent · scheduled</span></div>
<div class="r" style="--i:2"><span class="hs">5526e16</span><span class="ms">Files index: thesis title and year</span><span class="sb-who ag">agent · interactive</span></div>
<div class="r" style="--i:3"><span class="hs">3f8e2d1</span><span class="ms">vault backup: 2026-10-14 09:57</span><span class="sb-who ob">Obsidian plugin</span></div>
<div class="r" style="--i:4"><span class="hs">c783900</span><span class="ms">Daily triage 10-14: 4 replies filed</span><span class="sb-who sc">agent · scheduled</span></div>
<div class="r" style="--i:5"><span class="hs">9b1a4c7</span><span class="ms">Meeting notes: weekly lab review</span><span class="sb-who me">human</span></div>
<div class="r" style="--i:6"><span class="hs">101b12d</span><span class="ms">Floorplan: document 3D model v2</span><span class="sb-who ag">agent · interactive</span></div>
<div class="r" style="--i:7"><span class="hs">e44d0a9</span><span class="ms">Equipment: drone maintenance logged</span><span class="sb-who me">human</span></div>
</div>
</CodeWin>
<div class="sb-bens sb-grow">
<div class="sb-ben sb-late" style="--ts:1.3s"><div class="bi"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></div><div><b>Who, what, when, why</b><span>for every change, human or AI</span></div></div>
<div class="sb-ben sb-late" style="--ts:1.55s"><div class="bi"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg></div><div><b>Undo anything</b><span>one command, at any time</span></div></div>
<div class="sb-ben sb-late" style="--ts:1.8s"><div class="bi"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg></div><div><b>Trace any line</b><span>to the change and the decision behind it</span></div></div>
<div class="sb-ben sb-late" style="--ts:2.05s"><div class="bi"><svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5v7M18 11.5c0 3-4 3.5-10 5"/></svg></div><div><b>No terminal needed</b><span>the Obsidian Git plugin commits for you; browse history on GitHub</span></div></div>
</div>
</div>

<!--
Git is the time machine. Every change, mine or an agent's, is a commit with a message, so you can see who changed what, when and why, undo anything, and trace any line back to the change and the decision behind it. You don't need the terminal: the Obsidian Git plugin commits automatically and GitHub shows the history in a browser. These are the kinds of commits our vault gets every day: scheduled triage, interactive agent work, automatic backups and my own edits. You'll make your own first commit in the hands-on part. (1:00)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">How an agent works in the vault</div>

# Navigate. *Don't load everything.*

<p class="sb-lede" style="margin-top:0">Embeddings optional: links, aliases and one home per fact do most of the work.</p>

<div style="flex:1;display:flex;justify-content:center;align-items:flex-end;min-height:0"><AgentLoop class="sb-rise" style="height:330px;width:711px" /></div>

<!--
No agent reads the whole vault. It reads the contract, loads the role it needs, enters through an index, searches narrowly, resolves the current state (the latest accepted decision wins), and only then does the work, writes back and commits. A good answer gives the current state, its source and when it was last verified. You don't need a vector database to start: links, aliases and one home per fact do most of the work. (1:00)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">One brain, many stores</div>

# Points to your files, *never swallows them*

<p class="sb-lede" style="margin-top:0">Author once, generate every view: one note feeds the wiki, the training pack and the report.</p>

<StoresMap class="sb-push" style="margin-bottom:6px" />

<!--
One brain is not one giant folder. Documents stay in Box, code in its repositories, email in the mailbox, tasks in the task app. The vault holds the current state and points to all of them. Published things, like our private wiki and the equipment training packs, are generated from the notes: author once, generate every view. (1:00; short slot: skip)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">KINESIS, by the numbers</div>

# Running a core facility on *plain text*

<div class="sb-stats">
<div class="sb-card sb-stat sb-rise" style="--d:1"><div class="v"><CountUp :to="475" :delay="150" /></div><div class="d">notes, all plain Markdown</div></div>
<div class="sb-card sb-stat sb-rise" style="--d:2"><div class="v g"><CountUp :to="46" :delay="250" /></div><div class="d">equipment records, one note each</div></div>
<div class="sb-card sb-stat sb-rise" style="--d:3"><div class="v p"><CountUp :to="85" :delay="350" /></div><div class="d">meeting notes</div></div>
<div class="sb-card sb-stat sb-rise" style="--d:4"><div class="v t"><CountUp :to="108" :delay="450" /></div><div class="d">logged decisions</div></div>
<div class="sb-card sb-stat sb-rise" style="--d:5"><div class="v"><CountUp :to="781" :delay="550" /></div><div class="d">commits since June 2026</div></div>
<div class="sb-card sb-stat sb-rise" style="--d:6"><div class="v g"><CountUp :to="3" :delay="650" /></div><div class="d">AI tools working on the same vault</div></div>
</div>

<div class="sb-banner sb-late sb-push" style="--ts:1.9s">When our AI access changed, we moved the whole daily workflow to a different AI tool <b>in one day</b>. Nothing was lost, because nothing lived in the old tool.</div>

<!--
A few numbers from our vault (as of 2026-11-16). The one I care about most is the last story: when our AI access changed, we moved the whole daily workflow to a different AI tool in a single day, and nothing was lost, because nothing lived in the old tool. (1:00)
-->

---
layout: section
class: sb-stage
---

::number::
Live demo <span class="sb-live"></span>

::default::

# One brain, *two AIs*

<div class="sb-steps">
<div v-click class="sb-step" style="--c:var(--violet-200)"><div class="sn">1</div><div class="who2">Claude</div><p>“The new LiPo cabinet is in service. Update everything affected and log the decision.”</p></div>
<div v-click class="sb-step" style="--c:var(--sb-warm)"><div class="sn">2</div><div class="who2">Git</div><p>See exactly what the AI changed, and why.</p></div>
<div v-click class="sb-step" style="--c:#86D5C4"><div class="sn">3</div><div class="who2">Codex</div><p>Fresh session, no shared chat: “Brief new users on LiPo storage. Cite your sources.”</p></div>
<div v-click class="sb-step" style="--c:#F49A80"><div class="sn">4</div><div class="who2">Old chat</div><p>Same request in the August chat. It still says Room 101.</p></div>
</div>

<div class="sb-pill" style="margin-top:auto;align-self:flex-start">Same vault · different companies · no shared memory</div>

<!--
Before starting: demo vault open in Obsidian; Claude and Codex pointed at the demo folder only; memory off in both; fresh sessions; the old August chat open in another tab. Steps: (1) tell Claude the new cabinet is in service in the KINESIS lab and the batteries have moved from Room 101; it updates the SOP and the equipment note and logs D7; (2) git log, diff and blame; (3) ask Codex for a briefing for new users; (4) ask the old chat the same thing: it still says Room 101. If anything fails, the next three slides show each step. Press B to blank the screen while switching windows. (8:00 for the whole demo)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Demo · step 1</div>

# Claude updates the vault *and logs the decision*

<div class="sb-row" style="gap:20px;align-items:flex-start">
<div class="sb-chat sb-rise" style="--d:1;flex:0 0 450px">
<div class="sb-chat__hd"><span class="sb-chip">Claude</span><span>demo vault</span></div>
<div class="sb-chat__bd">
<div class="sb-bubble u">The new fire-resistant cabinet is in service in the KINESIS lab and every LiPo battery has moved there from Room 101. From now on they are stored and charged only inside it. Update everything affected and log the decision.</div>
<ul class="sb-act"><li style="--i:0">Read AGENTS.md</li><li style="--i:1">index.md → Equipment hub → lipo-batteries.md</li><li style="--i:2">Edited sops/lipo-charging-and-storage.md</li><li style="--i:3">Edited equipment/lipo-batteries.md</li><li style="--i:4">Added D7 to decisions.md (supersedes D4)</li><li style="--i:5">Committed a41f9e2</li></ul>
<div class="sb-reply"><div class="sb-typing" style="--ts:2.9s;--tl:.9s"><i></i><i></i><i></i></div><div class="sb-bubble a good sb-late" style="--ts:2.9s;--tl:.9s">Done. SOP and equipment note updated, D7 logged (supersedes D4), changes committed.</div></div>
</div>
</div>
<CodeWin tab="decisions.md" reveal :lstep="70" :l0="2400" class="sb-late sb-grow" style="--ts:2.1s">
<pre><span class="h">## 2026-10-15 - D7: LiPo storage moves to</span>
<span class="h">   the new cabinet in the KINESIS lab</span>
- <span class="k">Decision:</span> store and charge LiPo
  batteries only inside the fire-resistant
  cabinet; they leave it only while in use.
- <span class="k">Context:</span> cabinet installed in the
  KINESIS lab; batteries moved from Room 101.
- <span class="k">Supersedes:</span> <span class="l">D4</span> (temporary storage,
  Room 101)
- <span class="k">Status:</span> <span class="s">accepted</span></pre>
</CodeWin>
</div>

<!--
Step 1 recap (skip quickly if the live demo worked). Notice the order: it read the contract, found the notes through the index, edited only the two notes affected, logged the decision with its context and what it supersedes, and committed. Nothing was pasted into the chat.
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Demo · step 2</div>

# What changed, *and why*

<div class="sb-row" style="gap:22px;align-items:flex-start">
<CodeWin tab="git show a41f9e2" class="sb-rise" style="--d:1;flex:0 0 540px">
<pre><span class="k">a41f9e2</span>  <span class="w">LiPo storage moves to the new cabinet (D7)</span>
 sops/lipo-charging-and-storage.md | <span class="n">4</span> <span class="s">++</span><span class="h">--</span>
 equipment/lipo-batteries.md       | <span class="n">4</span> <span class="s">++</span><span class="h">--</span>
 decisions.md                      | <span class="n">8</span> <span class="s">++++++++</span>
&#8203;
<span class="c">sops/lipo-charging-and-storage.md</span>
<span class="c">@@ Storage and charging @@</span>
<span class="del sb-seq" style="--i:0">- Store batteries in the temporary cabinet, Room 101.</span><span class="del sb-seq" style="--i:1">- Charge at the charging table, never unattended.</span><span class="add sb-seq" style="--i:2">+ Store and charge only inside the new cabinet (D7).</span><span class="add sb-seq" style="--i:3">+ Batteries leave the cabinet only while in use (D7).</span></pre>
</CodeWin>
<div class="sb-blame sb-grow">
<div class="sb-label sb-late" style="--ts:2.2s">git blame, line 14</div>
<div class="ln2 sb-late" style="--ts:2.3s">Store and charge only inside the new cabinet (D7).</div>
<svg class="down sb-late" style="--ts:2.6s" viewBox="0 0 26 34"><path d="M13 2v26M4 20l9 10 9-10" stroke="var(--fg3)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
<div class="ln2 sb-late" style="--ts:2.75s"><span style="color:var(--sb-gold-ink);font-weight:700">a41f9e2</span> · 2026-10-15 · agent session</div>
<svg class="down sb-late" style="--ts:3.05s" viewBox="0 0 26 34"><path d="M13 2v26M4 20l9 10 9-10" stroke="var(--fg3)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
<div class="ln2 sb-late" style="--ts:3.2s"><span style="color:var(--sb-good);font-weight:700">D7</span> · decision, context, supersedes D4</div>
<div class="sb-chips sb-late" style="--ts:3.6s;margin-top:10px"><span class="sb-chip bad">Undo: git revert a41f9e2</span></div>
</div>
</div>

<!--
Step 2 recap. Git shows exactly which lines changed, in which files, and blame traces any line to the commit and from there to the decision. One command undoes the whole change.
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Demo · step 3</div>

# A different AI. *Same answer, with a source.*

<div class="sb-row" style="gap:18px;align-items:flex-start">
<div class="sb-chat sb-rise sb-grow" style="--d:1;border-top:3px solid var(--sb-good)">
<div class="sb-chat__hd"><span class="sb-chip good">Codex</span><span>fresh session · reads the vault</span></div>
<div class="sb-chat__bd">
<div class="sb-bubble u sb-late" style="--ts:.4s">Write a short briefing for this week's new users: where do they store and charge LiPo batteries, and since when? Cite your sources.</div>
<div class="sb-reply"><div class="sb-typing" style="--ts:.9s;--tl:1.4s"><i></i><i></i><i></i></div><div class="sb-bubble a good sb-late" style="--ts:.9s;--tl:1.4s">Store and charge them only inside the new fire-resistant cabinet in the KINESIS lab, and take them out only while in use. This replaced the temporary storage in Room 101 (decision D7, 15 October 2026).<br><span style="font:500 10.5px/1.4 var(--font-mono);color:var(--sb-good)">sops/lipo-charging-and-storage.md · decisions.md#D7</span></div></div>
</div>
</div>
<div class="sb-chat sb-rise sb-grow" style="--d:2;border-top:3px solid var(--sb-bad)">
<div class="sb-chat__hd"><span class="sb-chip bad">Old chat</span><span>August conversation</span></div>
<div class="sb-chat__bd">
<div class="sb-bubble u sb-late" style="--ts:.7s">Write a short briefing for this week's new users: where do they store and charge LiPo batteries, and since when? Cite your sources.</div>
<div class="sb-reply"><div class="sb-typing" style="--ts:1.3s;--tl:1.3s"><i></i><i></i><i></i></div><div class="sb-bubble a bad sb-late" style="--ts:1.3s;--tl:1.3s">Store them in the cabinet in Room 101 and charge them at the charging table, never unattended.</div></div>
<span class="sb-tag sb-late" style="--ts:2.9s;align-self:flex-start">Outdated, no source</span>
</div>
</div>
</div>

<p class="sb-statement sb-late sb-push" style="--ts:3.3s">Different model. Different company. No shared chat. <b>Same answer, with a source and a date.</b></p>

<!--
Step 3 recap. A different model, from a different company, with no shared chat, gives the current rule with its source and date. The old chat still says Room 101 and can't point to a source. The memory was never in the model.
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Credits</div>

# Pay for thinking, *not for re-reading*

<div class="sb-row" style="gap:30px">
<div class="sb-col sb-rise" style="--d:1;flex:0 0 380px;gap:0">
<div class="sb-label">Where a long agent session's cost goes</div>
<div class="sb-sbar"><div style="width:60%;background:var(--sb-bad)">60%</div><div style="width:25%;background:var(--sb-warm)">25%</div><div style="width:15%;background:var(--sb-good)">15%</div></div>
<div class="sb-legend"><div><i style="background:var(--sb-bad)"></i>Re-reading context it has already seen</div><div><i style="background:var(--sb-warm)"></i>New input: your prompt and the files it opens</div><div><i style="background:var(--sb-good)"></i>Output: the actual answer</div></div>
<p class="sb-caption" style="margin-top:11px">Illustrative mix. Exact shares vary by tool and task.</p>
</div>
<div class="sb-tips sb-grow">
<div class="sb-tip sb-late" style="--ts:1.4s"><b>Navigate, don't paste</b><span>index → hub → the one note it needs</span></div>
<div class="sb-tip sb-late" style="--ts:1.6s"><b>One task, one chat</b><span>start fresh from the files, not a long thread</span></div>
<div class="sb-tip sb-late" style="--ts:1.8s"><b>Right-size the model</b><span>smaller tiers are often several times cheaper per token</span></div>
<div class="sb-tip sb-late" style="--ts:2s"><b>Short, stable instructions</b><span>they get cached and reused across sessions</span></div>
</div>
</div>

<div class="sb-banner sb-late sb-push" style="--ts:2.5s">Good structure is what makes <b>smaller, cheaper models</b> good enough.</div>

<!--
In long agent sessions, most of what you pay for is the AI re-reading context it has already seen; the answer itself is a small share. These numbers are illustrative, but the pattern is consistent. So: navigate instead of pasting, one task per chat, right-size the model, keep instructions short and stable. Good structure is what lets a smaller, cheaper model do the job. (1:00)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Any model, many workflows</div>

# Mix models freely. *They share one brain.*

<p class="sb-lede" style="margin-top:0">The memory lives outside every tool: each job gets the right model, and any of them can be swapped.</p>

<WorkflowMap class="sb-push" style="margin-bottom:6px" />

<!--
Because the memory is outside, you can mix models and workflows: a frontier model for hard reasoning and reviews, a fast model for everyday edits, a scheduled agent that triages email overnight, a local model for monitoring and routine checks (on site, no credits), and you, in Obsidian. They all read from and write to the same vault, so any of them can be replaced tomorrow. (1:00; short slot: skip)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Start today</div>

# Three files are *enough to begin*

<div class="sb-row" style="gap:26px;flex:1">
<div class="sb-files" style="flex:0 0 380px">
<div class="sb-file sb-rise" style="--d:1"><svg viewBox="0 0 72 86"><path d="M8 3h40l21 21v55a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" fill="var(--bg2)" stroke="var(--border)" stroke-width="3"/><path d="M48 3v21h21" fill="none" stroke="var(--border)" stroke-width="3"/><text x="36" y="64" text-anchor="middle" font-family="Consolas,monospace" font-size="19" font-weight="700" fill="var(--sb-bad)">MD</text></svg><div><b>AGENTS.md</b><span>How to work here: the rules every AI follows</span></div></div>
<div class="sb-file sb-rise" style="--d:3"><svg viewBox="0 0 72 86"><path d="M8 3h40l21 21v55a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" fill="var(--bg2)" stroke="var(--border)" stroke-width="3"/><path d="M48 3v21h21" fill="none" stroke="var(--border)" stroke-width="3"/><text x="36" y="64" text-anchor="middle" font-family="Consolas,monospace" font-size="19" font-weight="700" fill="var(--sb-good)">MD</text></svg><div><b>decisions.md</b><span>What we decided, when, and why</span></div></div>
<div class="sb-file sb-rise" style="--d:5"><svg viewBox="0 0 72 86"><path d="M8 3h40l21 21v55a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" fill="var(--bg2)" stroke="var(--border)" stroke-width="3"/><path d="M48 3v21h21" fill="none" stroke="var(--border)" stroke-width="3"/><text x="36" y="64" text-anchor="middle" font-family="Consolas,monospace" font-size="19" font-weight="700" fill="var(--sb-accent)">MD</text></svg><div><b>project.md</b><span>Current state, next step, where the files are</span></div></div>
</div>
<div class="sb-col sb-grow">
<div class="sb-prompt sb-rise" style="--d:2"><span class="pl">Your first prompt</span><TypeWriter :delay="800" :speed="14" text="Read AGENTS.md and README.md. Don't change anything yet.&#10;&#10;Audit this folder: what is here, how the notes link together, anything sensitive.&#10;&#10;Propose the smallest reversible setup for one real project of mine. Then wait for my approval." /></div>
<p class="sb-caption sb-late sb-push" style="--ts:1.2s;font-size:13px;color:var(--fg2)">Take-home: <b>starter-vault.zip</b>, with these three files, example notes, this prompt and a cheat sheet. <b>We set it up together, now.</b></p>
</div>
</div>

<!--
Start small. Three files are enough: the rules, the decisions and one project note. All three come in the starter vault, together with example notes, this prompt and a one-page cheat sheet. The prompt is read-only: audit first, change nothing, propose the smallest reversible setup for one real project, and wait for your approval (the full text, plus a version for a folder of notes you already have, is in first-prompt.md). Now let's set it up together. (1:00; short slot: keep)
-->

---
layout: section
class: sb-stage
---

::number::
Hands-on <span class="sb-live"></span>

::default::

# Set it up together, *step by step*

<p class="sb-lede" style="color:var(--violet-200);margin-top:8px">About 15 minutes with the starter vault, and a checkpoint after every step.</p>

<div class="sb-road">
<div class="ph" style="grid-column:1/5">In Obsidian</div>
<div class="ph" style="grid-column:5/7">With your AI</div>
<div class="ph" style="grid-column:7/8">History</div>
<div class="rn" style="grid-column:1;--i:0;--c:var(--violet-200)"><i class="nd">1</i><b>Install</b><span>Obsidian, free</span></div>
<div class="rn" style="grid-column:2;--i:1;--c:var(--violet-200)"><i class="nd">2</i><b>Open</b><span>the starter vault</span></div>
<div class="rn" style="grid-column:3;--i:2;--c:var(--violet-200)"><i class="nd">3</i><b>Tour</b><span>what's in the box</span></div>
<div class="rn" style="grid-column:4;--i:3;--c:var(--violet-200)"><i class="nd">4</i><b>First note</b><span>copy the example, link it</span></div>
<div class="rn" style="grid-column:5;--i:4;--c:#86D5C4"><i class="nd">5</i><b>Connect</b><span>an AI to the folder</span></div>
<div class="rn" style="grid-column:6;--i:5;--c:#86D5C4"><i class="nd">6</i><b>First prompt</b><span>read-only</span></div>
<div class="rn" style="grid-column:7;--i:6;--c:var(--sb-warm)"><i class="nd">7</i><b>Version</b><span>your first commit</span></div>
</div>

<div class="sb-paths">
<div class="sb-path sb-late" style="--ts:1.7s;--c:#86D5C4"><b>Laptop with you?</b>Follow along, and raise a hand at each checkpoint.</div>
<div class="sb-path sb-late" style="--ts:1.9s;--c:var(--sb-warm)"><b>No laptop?</b>Just watch. Every step is in the starter vault's README.</div>
</div>

<div class="sb-pill sb-late" style="--ts:2.2s;margin-top:auto;align-self:flex-start">Take-home: starter-vault.zip · first-prompt.md · cheat-sheet.md</div>

<!--
Now the practical part: we set up a vault together, step by step, with the starter vault. If you have a laptop, follow along: there is a checkpoint after every step and I'll ask for hands. If you don't, just watch: every step is in the README of the starter vault, so you can do it later at your own pace. Pace it by the room: do each step live in Obsidian, come back to the slide for the checkpoint, and if a few people are stuck, move on and pick them up in Q&A.

Before the session: share the starter-vault.zip link (QR code or chat; it is in this repository under workshops/03-second-brain/starter-vault, and the zip is served next to the deck as starter-vault.zip) and, for the CTP team, ask people to install Obsidian beforehand; keep a fresh, unzipped copy of the starter vault on the presenter laptop (not the demo vault); to show the vault picker live, click the vault name at the bottom left of Obsidian and choose Manage vaults. Press B to blank the screen while switching windows. (1:00; short slot: keep, say it's a demo)
-->

---
layout: default
---

<div class="sb-dots" aria-hidden="true"><i class="cur"></i><i class="cur"></i><i></i><i></i><i></i><i></i><i></i></div>

<div class="sb-kicker ctp-eyebrow">Hands-on · steps 1–2 of 7</div>

# Install Obsidian, *open the starter vault*

<div class="sb-row" style="gap:22px">
<CodeWin tab="Obsidian" rt="first launch" class="sb-rise" style="--d:1;flex:0 0 450px">
<div class="sb-picker"><div class="pl">No vaults yet</div><div class="pr"><svg class="logo" viewBox="0 0 66 80" aria-hidden="true"><polygon points="33,2 60,24 50,68 33,78 16,68 6,24" fill="#8E5CD6"/><polygon points="33,2 44,40 33,78 22,40" fill="#C9B2FF" opacity=".8"/></svg><div class="an">Obsidian</div><div class="av">free · works offline</div><div class="sb-prow"><div><b>Create new vault</b><span>Create a new Obsidian vault under a folder.</span></div><em class="btn">Create</em></div><div class="sb-prow hot"><div><b>Open folder as vault</b><span>Choose an existing folder of Markdown files.</span></div><em class="btn hot">Open</em></div><div class="sb-prow"><div><b>Open vault from Obsidian Sync</b><span>Set up a synced vault with an existing remote vault.</span></div><em class="btn">Sign in</em></div></div></div>
</CodeWin>
<ol class="sb-do sb-grow">
<li style="--i:0">Download Obsidian, free, from <b>obsidian.md</b>. Managed laptop? Watch now, install later.</li>
<li style="--i:1">Download <b>starter-vault.zip</b> and <span class="sb-ui">Extract All</span>. Don't work inside the zip.</li>
<li style="--i:2">Move the folder to <b>Documents</b>. Rename it if you like: the folder name is the vault name.</li>
<li style="--i:3">In Obsidian, <span class="sb-ui">Open folder as vault</span> and choose the folder.</li>
</ol>
</div>

<div class="sb-check sb-late" style="--ts:1.4s"><span class="cb">✓</span><span><small>Checkpoint</small> The left sidebar shows AGENTS, decisions, index and README.</span></div>

<!--
Steps 1 and 2. Obsidian is free from obsidian.md, for Windows, macOS and Linux. Download the zip and extract it: the most common mistake is opening it inside the zip. Move the folder to Documents and rename it if you like, because the folder name is the vault name. Then Open folder as vault. Show it live, then the checkpoint: hands up if you see AGENTS, decisions, index and README in the left sidebar. On a managed laptop where installs are blocked, watch now and install later. (2:00; short slot: skip, just say "install Obsidian and open the folder as a vault")
-->

---
layout: default
---

<div class="sb-dots" aria-hidden="true"><i class="d"></i><i class="d"></i><i class="cur"></i><i></i><i></i><i></i><i></i></div>

<div class="sb-kicker ctp-eyebrow">Hands-on · step 3 of 7</div>

# Three files do the work. *The rest helps.*

<div class="sb-row" style="gap:20px">
<CodeWin tab="index" rt="starter-vault" class="sb-rise" style="--d:1;flex:0 0 490px">
<div class="sb-obw" style="--tw:150px"><div class="sb-tree"><div class="vn">starter-vault</div><div class="r fo">meetings</div><div class="r in">Example meeting</div><div class="r fo">projects</div><div class="r in">Example project</div><div class="r">AGENTS</div><div class="r">cheat-sheet</div><div class="r">CLAUDE</div><div class="r">decisions</div><div class="r">first-prompt</div><div class="r sel">index</div><div class="r">README</div></div><div class="sb-npane"><div class="it">Index</div><div>The map of this vault. Every note is linked from here. AI tools start here too (see <span class="wl">AGENTS</span>).</div><h6>Start here</h6><ul><li><span class="wl">README</span>: how this vault is set up</li><li><span class="wl">AGENTS</span>: the rules every AI follows</li><li><span class="wl">first-prompt</span> · <span class="wl">cheat-sheet</span></li></ul><h6>Projects</h6><ul><li><span class="wl">Example project</span>: replace it with yours</li></ul><h6>Decisions</h6><ul><li><span class="wl">decisions</span>: what, when and why</li></ul></div></div>
</CodeWin>
<div class="sb-col sb-grow" style="gap:0">
<div class="sb-core3"><div class="sb-cf" style="--i:0;--c:var(--sb-bad)"><b>AGENTS.md</b><span>The rules every AI follows</span></div><div class="sb-cf" style="--i:1;--c:var(--sb-good)"><b>decisions.md</b><span>What was decided, when and why</span></div><div class="sb-cf" style="--i:2;--c:var(--sb-accent)"><b>project.md</b><span>Current state, next step, where the files are</span></div></div>
<div class="sb-helpers"><h4>The helpers</h4><div class="sb-hr" style="--i:3"><b>index</b><span>the map: every note is linked</span></div><div class="sb-hr" style="--i:4"><b>README</b><span>the setup steps, for you</span></div><div class="sb-hr" style="--i:5"><b>CLAUDE.md</b><span>points to AGENTS.md</span></div><div class="sb-hr" style="--i:6"><b>examples</b><span>a project and a meeting: copy them</span></div><div class="sb-hr" style="--i:7"><b>first-prompt · cheat-sheet</b><span>what to tell your AI · the basics</span></div></div>
</div>
</div>

<div class="sb-check sb-late" style="--ts:1.8s"><span class="cb">✓</span><span><small>Checkpoint</small> Press <CtpKbd>Ctrl</CtpKbd>+<CtpKbd>G</CtpKbd>: the notes are already linked. No orphans.</span></div>

<!--
Step 3, the tour. Three files do the work: AGENTS.md is the rules every AI follows, decisions.md is the why, and the project note is the current state. The rest helps: the index is the map, the README is the setup guide for you, CLAUDE.md only points to AGENTS.md, two example notes are already linked and show the shape of a project and a meeting note (AGENTS.md describes the same shapes, so the AI writes new notes that way), and first-prompt and the cheat sheet are for you. Open index, decisions and AGENTS live, then Ctrl+G (Cmd+G on a Mac) for the graph: every note is linked, nothing is an orphan. (2:00; short slot: keep)
-->

---
layout: default
---

<div class="sb-dots" aria-hidden="true"><i class="d"></i><i class="d"></i><i class="d"></i><i class="cur"></i><i></i><i></i><i></i></div>

<div class="sb-kicker ctp-eyebrow">Hands-on · step 4 of 7</div>

# Your first note, *copy the example*

<div class="sb-row" style="gap:22px">
<div style="flex:0 0 470px;position:relative;display:flex;min-height:0">
<CodeWin tab="My first project" rt="projects/" class="sb-rise sb-grow" style="--d:1">
<div class="sb-obw" style="--tw:125px"><div class="sb-tree"><div class="vn">starter-vault</div><div class="r fo cl">meetings</div><div class="r fo">projects</div><div class="r in">Example project</div><div class="r in new">My first project</div><div class="r">AGENTS</div><div class="r">decisions</div><div class="r">index</div><div class="r">README</div></div><div class="sb-npane" style="gap:4px"><div class="it">My first project</div><div class="sb-oprops sb-late" style="--ts:.9s"><span class="pk">status</span><span>active</span><span class="pk">owner</span><span>me</span><span class="pk">last_updated</span><span>2026-11-18</span></div><div class="sb-late" style="--ts:1.1s">Up: <span class="wl">index</span> · Decisions: <span class="wl">decisions</span></div><h6 class="sb-late" style="--ts:1.3s">Current state</h6><div class="sb-late" style="--ts:1.5s">Scope agreed; first draft this week.</div><h6 class="sb-late" style="--ts:1.7s">Next step</h6><div class="sb-cbx sb-late" style="--ts:1.9s"><i></i>Share the draft for comments</div></div></div>
</CodeWin>
<div class="sb-sugg sb-late" style="--ts:2.6s;right:-13px;bottom:-6px;width:230px"><div class="sh">index · Projects</div><div style="padding:1px 7px 5px;font:500 10.5px/1.3 var(--font-mono);color:#fff">- [[My fi<span class="sb-cursor"></span></div><div class="sq on"><span>My first project</span><small>projects/</small></div><div class="sq"><span>Example project</span><small>projects/</small></div></div>
</div>
<ol class="sb-do sb-grow">
<li style="--i:0">Right-click <b>Example project</b> → <span class="sb-ui">Make a copy</span>.</li>
<li style="--i:1">Type the name of a <b>real project</b> over the selected title.</li>
<li style="--i:2">Delete the <i>Example</i> box and tag. One line of <b>current state</b>, one <b>next step</b>.</li>
<li style="--i:3">In <b>index</b>, type <CtpKbd>[[</CtpKbd> and link your note under Projects.</li>
<li style="--i:4" class="sb-caption">No template plugin: the shape lives in the example and in AGENTS.md, so your AI writes new notes the same way.</li>
</ol>
</div>

<div class="sb-check sb-late" style="--ts:2.2s"><span class="cb">✓</span><span><small>Checkpoint</small> <CtpKbd>Ctrl</CtpKbd>+<CtpKbd>G</CtpKbd> shows your note connected to index.</span></div>

<!--
Step 4, the first note. No template plugin: we don't use one ourselves. The example note is the shape, and AGENTS.md describes the same shape, so once the AI is connected it writes new notes that way. Right-click Example project, Make a copy: the copy opens with its title selected, so just type the name of a real project. Delete the grey Example box, the example tag and the alias: properties and sections are already there, linked to the index and the decision log. Write one line of current state and one next step. Then open the index and link the note by typing two square brackets. That is the habit: every new note is linked from a hub. Checkpoint: the graph shows your note connected. (2:30; short slot: keep, as a demo)
-->

---
layout: default
---

<div class="sb-dots" aria-hidden="true"><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="cur"></i><i></i><i></i></div>

<div class="sb-kicker ctp-eyebrow">Hands-on · step 5 of 7</div>

# Point an AI *at the folder, and only the folder*

<div class="sb-row" style="gap:22px">
<div class="sb-tools" style="flex:0 0 515px">
<div class="th"><span>Tool</span><span>How to connect</span><span>Reads first</span></div>
<div class="tr" style="--i:0"><span class="sb-chip">Claude app</span><span>Choose the vault as the folder to work in</span><span class="rd">CLAUDE.md → AGENTS.md</span></div>
<div class="tr" style="--i:1"><span class="sb-chip">Claude Code</span><span>Open a terminal in the vault, run <code>claude</code></span><span class="rd">CLAUDE.md → AGENTS.md</span></div>
<div class="tr" style="--i:2"><span class="sb-chip good">Codex</span><span>Run <code>codex</code> in the vault, or open it in the app</span><span class="rd">AGENTS.md</span></div>
<div class="tr" style="--i:3"><span class="sb-chip gold">Cursor</span><span>File → Open Folder → the vault</span><span class="rd">AGENTS.md</span></div>
<div class="tr" style="--i:4"><span class="sb-chip ink">Local model</span><span>Any local client that can read a folder</span><span class="rd">AGENTS.md</span></div>
<div class="tr" style="--i:5"><span class="sb-chip bad">Chat only</span><span>Upload AGENTS.md and the note; paste the result back</span><span class="rd">by hand</span></div>
</div>
<div class="sb-col sb-grow">
<div class="sb-chat sb-rise" style="--d:3"><div class="sb-chat__hd"><span>Quick check</span><span>fresh session</span></div><div class="sb-chat__bd"><div class="sb-bubble u sb-late" style="--ts:1.2s">What are the rules in this folder?</div><div class="sb-reply"><div class="sb-typing" style="--ts:1.6s;--tl:1.2s"><i></i><i></i><i></i></div><div class="sb-bubble a good sb-late" style="--ts:1.6s;--tl:1.2s">From AGENTS.md: start at the index and read only what the task needs; log lasting decisions in decisions.md; write the current state back before we finish; ask before deleting, moving or sending anything. I haven't changed anything.</div></div></div></div>
<p class="sb-caption sb-late sb-push" style="--ts:3.1s">Use only AI tools approved for the data you put in the vault.</p>
</div>
</div>

<div class="sb-check sb-late" style="--ts:3.3s"><span class="cb">✓</span><span><small>Checkpoint</small> It answers from AGENTS.md, and you pasted nothing.</span></div>

<!--
Step 5. Point an AI tool at this folder, and only this folder, not your whole drive. Each tool reads its instruction file when it starts: Codex and Cursor read AGENTS.md; Claude reads CLAUDE.md, which points to AGENTS.md. A local model works too, through any local client that can read a folder, and a chat-only assistant works by uploading AGENTS.md and the note and pasting the result back. Use only AI tools approved for the data you put in. Quick check, ten seconds: ask "What are the rules in this folder?" It should answer from AGENTS.md without you pasting anything. If it doesn't, start a fresh session opened in the vault folder. (2:00; short slot: skip)
-->

---
layout: default
---

<div class="sb-dots" aria-hidden="true"><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="cur"></i><i></i></div>

<div class="sb-kicker ctp-eyebrow">Hands-on · step 6 of 7</div>

# First prompt: *look, don't touch*

<div class="sb-row" style="gap:24px">
<div class="sb-chat sb-rise" style="--d:1;flex:0 0 520px">
<div class="sb-chat__hd"><span class="sb-chip">Your AI tool</span><span>starter vault · fresh session</span></div>
<div class="sb-chat__bd">
<div class="sb-bubble u" style="font-size:11.5px">Read AGENTS.md and README.md. Don't change anything yet. Audit this folder: what is here, how the notes link together, anything sensitive. Then ask me about one real project, propose the smallest reversible setup for it, and wait for my approval.</div>
<ul class="sb-act"><li style="--i:0">Read AGENTS.md, README.md, index.md</li><li style="--i:1">Listed the folder: 2 linked examples, decision D1</li><li style="--i:2">Changed nothing</li></ul>
<div class="sb-reply"><div class="sb-typing" style="--ts:2s;--tl:.9s"><i></i><i></i><i></i></div><div class="sb-bubble a good sb-late" style="--ts:2s;--tl:.9s">Nothing sensitive here. Which project shall we set up? Then I'd propose three small steps: 1. a project note shaped like the example; 2. your first decision as D2; 3. a first commit. Nothing has changed yet. I'll wait for your OK.</div></div>
</div>
</div>
<div class="sb-col sb-grow">
<div class="sb-label" style="margin-bottom:6px">A good first answer</div>
<ul class="sb-oks"><li style="--i:0">changes nothing</li><li style="--i:1">names the files it read</li><li style="--i:2">proposes small, reversible steps</li><li style="--i:3">flags anything sensitive</li><li style="--i:4">stops and waits for your OK</li></ul>
<p class="sb-caption sb-late sb-push" style="--ts:3.6s;font-size:12.5px;color:var(--fg2)">Full prompt, and one for notes you already have, in <b>first-prompt.md</b>.</p>
</div>
</div>

<div class="sb-check sb-late" style="--ts:3.4s"><span class="cb">✓</span><span><small>Checkpoint</small> It asked before changing anything. Don't approve yet: first, save a version.</span></div>

<!--
Step 6, the first prompt: the same one as on slide 23, also in first-prompt.md, with a second version for a folder of notes you already have. It is read-only: the AI looks, reports, proposes and waits. What to check in the answer: it changed nothing, it names the files it read, it proposes small reversible steps rather than a migration, it flags anything sensitive, and it stops for your OK. If it starts editing straight away, stop it. Don't approve the changes yet: first we save a version, so everything after that is visible and reversible. (2:00; short slot: skip, slide 23 already shows the prompt)
-->

---
layout: default
---

<div class="sb-dots" aria-hidden="true"><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="cur"></i></div>

<div class="sb-kicker ctp-eyebrow">Hands-on · step 7 of 7</div>

# Save a version *before the AI writes*

<div class="sb-row" style="gap:24px">
<CodeWin tab="terminal · my-vault" rt="or let a tool do it" reveal :lstep="240" :l0="500" class="sb-rise" style="--d:1;flex:0 0 430px">
<pre><span class="c"># once, in the vault folder</span>
<span class="k">$</span> git init
<span class="k">$</span> git add -A
<span class="k">$</span> git commit -m <span class="s">"Start my vault"</span>
<span class="k">$</span> git log --oneline
<span class="n">4c1d2e7</span> Start my vault
&#8203;
<span class="c"># after every session</span>
<span class="k">$</span> git log --oneline
<span class="n">9e2b7a1</span> My first project: current state, D2
<span class="n">4c1d2e7</span> Start my vault</pre>
</CodeWin>
<div class="sb-opts sb-grow">
<div class="sb-tip sb-late" style="--ts:1.2s"><small>No terminal</small><b>GitHub Desktop</b><span>Add local repository → create a repository → Commit. Publishing is optional; keep it private.</span></div>
<div class="sb-tip sb-late" style="--ts:1.45s"><small>Ask your AI</small><b>“Initialise Git here and commit everything.”</b><span>Then ask it to show you the log. Git must be installed.</span></div>
<div class="sb-tip sb-late" style="--ts:1.7s"><small>Automatic, later</small><b>Git plugin for Obsidian</b><span>Commits on a timer. Until then, Obsidian's File recovery keeps snapshots.</span></div>
</div>
</div>

<div class="sb-check sb-late" style="--ts:2.2s"><span class="cb">✓</span><span><small>Checkpoint</small> The history shows one commit. From now on: approve, review the diff, commit.</span></div>

<!--
Step 7. Save a version before the AI writes anything, so every later change is visible and can be undone. Three ways: GitHub Desktop, no terminal (add the folder as a local repository, create the repository, commit; publishing to GitHub is optional and should stay private); or ask your AI tool to initialise Git and commit; or three commands. Later, the Git community plugin for Obsidian can commit on a timer. No Git today? Obsidian's File recovery keeps snapshots in the meantime. Checkpoint: one commit in the history. From now on every session ends the same way: the AI writes back, you review the diff, you commit. Now go back to the AI and approve its first step. (2:00; short slot: skip)
-->

---
layout: default
---

<div class="sb-dots" aria-hidden="true"><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i></div>

<div class="sb-kicker ctp-eyebrow">Hands-on · you're set up</div>

# Your first week, *and what to do when stuck*

<div class="sb-hg sm">
<div><h3 style="color:var(--sb-good)">One real project, five days</h3><ol>
<li style="--i:0"><span class="dl">Day 1</span>Replace the example with a real project: current state, next step, where the files are.</li>
<li style="--i:1"><span class="dl">Day 2</span>Log one real decision in decisions.md.</li>
<li style="--i:2"><span class="dl">Day 3</span>Do one task with your AI from the files, and have it write the result back.</li>
<li style="--i:3"><span class="dl">Day 4</span>Copy the example meeting for one real meeting and link it to the project.</li>
<li style="--i:4"><span class="dl">Day 5</span>Read the week's history and fix anything that drifted.</li>
</ol></div>
<div><h3 style="color:var(--sb-gold-ink)">If you get stuck</h3><ul class="fix">
<li style="--i:5"><b>Obsidian shows the zip.</b> Extract it first, then open the folder as a vault.</li>
<li style="--i:6"><b>Note alone in the graph.</b> Link it from index with <code>[[</code>.</li>
<li style="--i:7"><b>The AI ignores the rules.</b> Start a fresh session opened in the vault folder.</li>
<li style="--i:8"><b>“Not a git repository”.</b> Run <code>git init</code> in the folder with AGENTS.md.</li>
<li style="--i:9"><b>A faded link.</b> The note doesn't exist yet: click it to create it.</li>
</ul></div>
</div>

<p class="sb-caption sb-late sb-push" style="--ts:1.2s">All of this is in the starter vault's README, so nobody has to finish it today.</p>

<!--
You're set up. The first week is about one real project: put it in, log one real decision, do one task with your AI from the files and have it write back, copy the example meeting for one real meeting, and at the end of the week read the history. On the right, the five problems people are most likely to hit today, and the fix for each. All of it is in the README, so nobody has to finish today. (1:00; short slot: skip)
-->

---
layout: default
---

<div class="sb-kicker ctp-eyebrow">Make it stick</div>

# Five habits, *six guardrails*

<div class="sb-hg">
<div><h3 style="color:var(--sb-good)">Habits</h3><ol>
<li style="--i:0">If it's not in the vault, it didn't happen.</li>
<li style="--i:1">Before closing a chat, have the AI write down the decision and the current state.</li>
<li style="--i:2">One fact, one home: link to it, don't copy it.</li>
<li style="--i:3">Commit after every session, or let the plugin do it.</li>
<li style="--i:4">Start every new chat from the files, not from memory.</li>
</ol></div>
<div><h3 style="color:var(--sb-bad)">Guardrails</h3><ul>
<li style="--i:5">No passwords, ID documents or personal data in the vault</li>
<li style="--i:6">Keep the repository private</li>
<li style="--i:7">Institutional data only with approved AI tools</li>
<li style="--i:8">Agents propose; you approve sending, deleting, publishing</li>
<li style="--i:9">Treat what the AI reads as data, not instructions</li>
<li style="--i:10">Review the diff before you trust it</li>
</ul></div>
</div>

<!--
Five habits make it stick; the most important is the second one: before you close a chat, have the AI write the decision and the current state into the vault. And six guardrails: no secrets or personal data, a private repository, institutional data only with approved tools, a human approves anything irreversible, treat what the AI reads (emails, documents) as data rather than instructions, and review the diff. (1:00)
-->

---
layout: cover
class: sb-cover sb-close
---

<VaultGraph />

# Your AI forgets. *Your vault doesn't.*

<div class="sb-takes">
<div class="sb-take" style="--d:2"><span class="tn">1</span><span>The chat is a workspace, not the record.</span></div>
<div class="sb-take" style="--d:4"><span class="tn">2</span><span>Any AI plugs into the same brain.</span></div>
<div class="sb-take" style="--d:6"><span class="tn">3</span><span>Every change and decision is written down and versioned.</span></div>
</div>

::eyebrow::
<span class="ctp-tag">Takeaways</span>

::meta::
<div class="sb-chips sb-late" style="--ts:1s"><span class="sb-label" style="margin-right:4px">Take home</span><span class="sb-chip good">starter-vault.zip</span><span class="sb-chip good">first-prompt.md</span><span class="sb-chip good">cheat-sheet.md</span></div>

<p class="sb-late" style="--ts:1.4s;margin-top:10px"><strong style="font:700 26px/1 var(--font-serif);color:var(--fg1);margin-right:14px">Questions?</strong>Samuel A. Prieto · samuel.prieto@nyu.edu</p>

<!--
Three takeaways. The chat is a workspace, not the record. Any AI plugs into the same brain. Every change and every decision is written down and versioned. You take home the starter vault, the first prompt and the cheat sheet. Then open for questions, including any setup problems from the hands-on part. (0:30, then Q&A: 10-15 min for the CTP team, about 5 in a short slot)
-->
