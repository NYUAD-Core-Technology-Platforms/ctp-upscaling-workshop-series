---
# Workshop 02: From Ideas to Apps: AI in the Microscopy Facility
# A practical case study (Rachid Rezgui, Light Microscopy core) in turning
# core-facility knowledge into operational systems, scientific simulations
# and teaching tools. Ported from the standalone HTML deck presented on
# 8 October 2026 into the CTP Slidev theme; the interactive simulators live
# in ./components and ./lib.
theme: ctp
routerMode: hash
title: "From Ideas to Apps: AI in the Microscopy Facility"
info: |
  CTP Upscaling Workshop 02. From Ideas to Apps: AI in the Microscopy Facility.

  A practical case study in turning core-facility knowledge into operational
  systems (CoreOps), scientific simulations and teaching tools, with live
  optics and imaging simulators built with AI assistance.
author: Rachid Rezgui
date: 2026-10-08
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: fade
mdc: true
layout: cover
---

# From Ideas to Apps: AI in the Microscopy Facility

<p class="cover-lead">A practical case study in turning core-facility knowledge into operational systems, scientific simulations and teaching tools.</p>

::eyebrow::
<span class="ctp-tag ctp-tag--accent">Workshop 02 · Applied AI / Codex upskilling</span>

::meta::
Rachid Rezgui · Light Microscopy · Core Technology Platforms · NYU Abu Dhabi

8 October 2026

<style scoped>
.cover-lead { font-family: var(--font-serif); font-size: var(--t-body-lg); color: var(--fg2); margin: var(--s-4) 0 0; max-width: 60ch; }
</style>

<!--
Opening, 1 minute. Open with the outcome, not a list of AI features: facility
knowledge can now become a working workflow, simulator, or teaching tool.
Two halves today: 01 run the facility (training, procurement, equipment,
reporting) and 02 teach the science (optics, confocal imaging, analysis).
-->

---
layout: default
---

<p class="eyebrow">The real starting point</p>

# One role carries two kinds of complexity

<div class="worlds">
  <div class="world">
    <span class="world__index">01</span>
    <h3>Run the facility</h3>
    <p>Training · equipment · maintenance · bookings · records</p>
  </div>
  <div class="world__core"><span>Domain</span><strong>Expertise</strong></div>
  <div class="world">
    <span class="world__index">02</span>
    <h3>Teach the science</h3>
    <p>Optics · imaging · acquisition · analysis · interpretation</p>
  </div>
</div>

<blockquote class="big-quote">The bottleneck was not ideas. It was turning expertise into usable tools.</blockquote>

<style scoped>
.worlds { display: grid; grid-template-columns: 1fr 150px 1fr; align-items: center; gap: var(--s-5); margin-top: var(--s-4); }
.world { position: relative; border: 1px solid var(--hairline); border-radius: var(--r-2); padding: var(--s-6) var(--s-5) var(--s-5); min-height: 190px; display: flex; flex-direction: column; justify-content: center; }
.world h3 { margin: 0 0 var(--s-2); font-family: var(--font-serif); font-size: 24px; }
.world p { margin: 0; font-size: 15px; color: var(--fg2); line-height: 1.45; }
.world__index { position: absolute; top: var(--s-3); right: var(--s-4); font-family: var(--font-mono); font-size: 22px; font-weight: 600; color: var(--violet-300); }
.world__core { display: flex; flex-direction: column; align-items: center; justify-content: center; aspect-ratio: 1; border: 1px solid var(--violet-300); border-radius: var(--r-2); background: var(--violet-050); text-align: center; }
.world__core span { font-size: 10px; letter-spacing: var(--tracked); text-transform: uppercase; color: var(--fg2); }
.world__core strong { font-size: 13px; letter-spacing: var(--tracked); text-transform: uppercase; color: var(--nyu-violet); }
.big-quote { font-size: 26px; margin: var(--s-7) 0 0; padding: 0 var(--s-5); color: var(--fg1); line-height: 1.3; }
</style>

<!--
Context, 3 minutes. Ask the room what they manage beyond the instrument
itself. Use their answers to reveal the two halves of the story.
-->

---
layout: default
---

<p class="eyebrow">The philosophy</p>

# One Stop Shop

<div class="ssot">
  <div class="ssot__card ssot__card--chaos">
    <div class="ssot__head">Today: every SOP, and every decision, lives in many places</div>
    <ul class="ssot__files">
      <li><i>W</i>SOP.docx</li>
      <li><i>W</i>SOP_version_1.docx</li>
      <li><i>W</i>SOP_version_2.docx</li>
      <li><i>W</i>SOP_last_version.docx</li>
      <li><i>W</i>SOP_final.docx</li>
      <li><i>W</i>SOP_final_2.docx</li>
      <li><i>W</i>SOP_final_6.docx</li>
      <li><i>W</i>SOP_use_this_one.docx</li>
      <li><i>W</i>SOP_dont_use_this_one.docx</li>
      <li><i>W</i>SOP_do_not_delete.docx</li>
    </ul>
    <p class="ssot__foot">Everyone keeps a personal copy, and agreements get scattered across emails, chats and meetings. Nobody knows which version is right.</p>
  </div>
  <div class="ssot__arrow">→</div>
  <div class="ssot__card ssot__card--truth">
    <div class="ssot__head">Goal: one reference, one place</div>
    <div class="ssot__single"><i>★</i>SOP <small>current · owner · version history</small></div>
    <ul class="ssot__links">
      <li>Facility system</li>
      <li>Training &amp; access</li>
      <li>Staff &amp; users</li>
    </ul>
    <p class="ssot__foot">Everyone links to it. No one copies it. What we agree on is written once, in one place.</p>
  </div>
</div>

<p class="ssot__quote">This is now possible with AI. One shared reference that everyone, and every tool, reads from. We need to implement it.</p>

<style scoped>
.ssot { display: grid; grid-template-columns: 1.15fr auto 1fr; align-items: stretch; gap: var(--s-4); }
.ssot__card { border: 1px solid var(--hairline); border-radius: var(--r-2); padding: var(--s-3) var(--s-4); display: flex; flex-direction: column; gap: var(--s-2); }
.ssot__card--truth { background: var(--violet-050); border-color: var(--violet-200); }
.ssot__head { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: var(--tracked-sm); color: var(--fg2); }
.ssot__card--truth .ssot__head { color: var(--nyu-violet); }
.ssot__files, .ssot__links { list-style: none; margin: 0; padding: 0; }
.ssot__files { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 10px; }
.ssot__files li { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 11px; color: var(--fg1); background: var(--bg2); border-radius: var(--r-1); padding: 3px 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ssot__files i, .ssot__single i { font-style: normal; display: inline-grid; place-items: center; width: 14px; height: 14px; border-radius: var(--r-1); background: var(--sky); color: #fff; font-size: 9px; font-weight: 700; flex: none; }
.ssot__single { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; background: var(--bg1); border: 1px solid var(--violet-200); border-radius: var(--r-1); padding: 6px 10px; }
.ssot__single i { background: var(--gold); width: 18px; height: 18px; font-size: 11px; }
.ssot__single small { font-weight: 400; font-size: 11px; color: var(--fg2); }
.ssot__links { display: flex; flex-direction: column; gap: 4px; }
.ssot__links li { font-size: 12px; color: var(--fg1); background: var(--bg1); border: 1px solid var(--hairline); border-radius: var(--r-1); padding: 4px 10px; }
.ssot__foot { margin: auto 0 0; font-size: 11px; line-height: 1.35; color: var(--fg2); }
.ssot__arrow { align-self: center; font-size: 26px; color: var(--nyu-violet); }
.ssot__quote { margin: var(--s-3) 0 0; font-family: var(--font-serif); font-size: 17px; line-height: 1.35; color: var(--fg1); }
</style>

<!--
Philosophy, 3 minutes. Ask who has ever opened a "final_final" file and
wondered if it was the right one. Facility system, Word, Google Docs, emails
and chats: each holds its own version of the truth, and the same goes for what
we agree on as a team. AI now makes it practical to keep one living document
of agreements and procedures that everyone and every tool reads from. It can
only search, summarise and connect if there is one reference to point at, so
we need to implement it.
-->

---
layout: section
---

# Run the facility

::number::
PART 01

::subtitle::
Training, procurement, equipment and reporting in one operational system: CoreOps.

<!--
Part I. The next seven slides follow real CoreOps screens. The point is never
the dashboard itself; it is that daily activity, exceptions and records stay
connected.
-->

---
layout: default
---

<p class="eyebrow">Part I · Operations</p>

# Facility operations in one system

<div class="evidence">
  <EvidenceFigure src="img/coreops-dashboard.png" alt="CoreOps dashboard showing training, procurement, equipment status and LabOps activity" caption="CoreOps dashboard · weekly operational view" />
  <ol class="evidence__rail">
    <li><b>01</b><span>Training, procurement, equipment and LabOps share one weekly view.</span></li>
    <li><b>02</b><span>Exceptions, such as equipment down or overdue work, surface immediately.</span></li>
    <li><b>03</b><span>Every summary links back to the underlying operational record.</span></li>
  </ol>
</div>

<!--
CoreOps overview, 4 minutes. Use this screen to establish the application as
the operational spine. The dashboard makes current work and exceptions
visible without assembling information from separate files. Confirm live
integration behaviour during the demonstration.
-->

---
layout: default
---

<p class="eyebrow">CoreOps · Training</p>

# Training scheduling and instrument booking

<div class="evidence">
  <EvidenceFigure src="img/coreops-training-scheduler.png" alt="CoreOps training scheduler checking trainer availability, instrument bookings and user conflicts" caption="Schedule Trainings & Experiments" />
  <ol class="evidence__rail">
    <li><b>01</b><span>Checks trainer availability, user conflicts and existing instrument reservations.</span></li>
    <li><b>02</b><span>Training type, user, equipment, duration and notes stay attached to the booking.</span></li>
    <li><b>03</b><span>One action records the session and books the instrument.</span></li>
  </ol>
</div>

<!--
Training scheduling, 3 minutes. One scheduling view coordinates the trainer,
trainee and instrument before the session enters the system. Walk from the
training type and trainee selection to the combined availability view.
Highlight that the operational record begins before the session, not after.
-->

---
layout: default
---

<p class="eyebrow">CoreOps · Full integration</p>

# One record, three synchronized systems

<div class="flow-strip"><strong>CoreOps training record</strong><span>→</span><b>Google Calendar</b><span>+</span><b>CTP booking system</b></div>

<div class="evidence evidence--split integration">
  <EvidenceFigure src="img/gcal-training-event.png" alt="Google Calendar training invitation showing the instrument, session time, room, attendees and required-document links" caption="Google Calendar · session details and required documents" height="250px" fit="top" />
  <EvidenceFigure src="img/booked-resource.png" alt="CTP booking resource for the same microscope showing its schedule, location, permissions and access rules" caption="CTP booking · matching resource and controlled permissions" height="250px" />
</div>

<div class="evidence__notes">
  <span><b>01</b>The invitation carries the instrument, time, room and required documents.</span>
  <span><b>02</b>The booking resource uses the same instrument identity and location.</span>
  <span><b>03</b>Training validation in CoreOps controls when the user receives booking access.</span>
</div>

<style scoped>
.integration { grid-template-columns: 0.55fr 1fr; }
</style>

<!--
Connected systems, 2 minutes. A single CoreOps action creates the Google
Calendar event and books the matching CTP instrument resource. Follow one
training record across the three systems: start in CoreOps, then show the
Calendar event and the matching CTP resource. Booking permission remains a
controlled step after training rather than an automatic entitlement.
Names, avatars and document links in these screenshots are pixelated for the
published deck.
-->

---
layout: default
---

<p class="eyebrow">CoreOps · Training</p>

# The record continues after the session

<div class="evidence evidence--split training">
  <EvidenceFigure src="img/coreops-training-management.png" alt="CoreOps training management screen with validation, reminders and booking or door access controls" caption="Manager view · validate, remind, grant or revoke access" height="265px" />
  <EvidenceFigure src="img/training-completion-email.png" alt="Training completion email with confirmation, safety documents, data policy and booking portal link" caption="User view · confirm attendance before full booking access" height="265px" fit="top" />
</div>

<div class="evidence__notes">
  <span><b>01</b>Status and reminders remain in the same training record.</span>
  <span><b>02</b>Booking and door access can be controlled from that record.</span>
  <span><b>03</b>The completion email carries safety, data and acknowledgement requirements.</span>
</div>

<style scoped>
.training { grid-template-columns: 1.3fr 0.7fr; }
</style>

<!--
Training completion, 4 minutes. Validation, user confirmation, safety
information and access control are handled as one connected journey. Follow
one completed training from the manager screen to the user-facing email. The
important point is continuity: the operational action, required documents,
confirmation, and access decision remain connected.
-->

---
layout: default
---

<p class="eyebrow">CoreOps · Procurement</p>

# Procurement and budget control

<div class="evidence">
  <EvidenceFigure src="img/coreops-procurement.png" alt="CoreOps purchase order list with vendor, equipment, amount and chartfield; budget and remaining amounts are hidden" caption="Purchase orders · expenditure and remaining budget by chartfield" />
  <ol class="evidence__rail">
    <li><b>01</b><span>Each order retains its vendor, equipment, PO, chartfield and amount.</span></li>
    <li><b>02</b><span>Status and age filters expose delayed or unresolved orders.</span></li>
    <li><b>03</b><span>Budget summaries show expenditure and remaining funds in context.</span></li>
  </ol>
</div>

<!--
Procurement, 3 minutes. Requisitions, purchase orders and available funds
remain traceable within one workflow. Explain the operational benefit as
transparency and follow-through, not merely data storage. A request can be
traced through purchase order status to its budget impact. Budget and
remaining amounts are hidden in the screenshot.
-->

---
layout: default
---

<p class="eyebrow">CoreOps · Equipment</p>

# One operational record per instrument

<div class="evidence">
  <EvidenceFigure src="img/coreops-equipment.png" alt="CoreOps equipment page with instrument details, SOP, risk assessment, operational status and dated service history" caption="Equipment record · documentation, status, actions and history" />
  <ol class="evidence__rail">
    <li><b>01</b><span>SOP, risk assessment, manual and service contract remain with the instrument.</span></li>
    <li><b>02</b><span>Operational status and user communication are part of the same workflow.</span></li>
    <li><b>03</b><span>Updates, preventive maintenance, repairs and breakdowns form a dated history.</span></li>
  </ol>
</div>

<!--
Equipment management, 4 minutes. Documentation, live status and the complete
service history stay beside the equipment record. Show how the instrument page
brings together what users need now and what the manager needs later:
documentation, availability, communication and history. Exact automated
notifications remain to be demonstrated live.
-->

---
layout: default
---

<p class="eyebrow">CoreOps · Analytics &amp; reporting</p>

# Operational records become evidence

<div class="evidence evidence--split">
  <EvidenceFigure src="img/coreops-training-analytics.png" alt="CoreOps training analytics with KPIs, booking conversion and onboarding delay charts" caption="Operations · training KPIs, booking conversion and onboarding delay" height="265px" />
  <EvidenceFigure src="img/coreops-publications.png" alt="CoreOps publications and author reporting with citation and impact metrics" caption="Research output · publications, authors and citation indicators" height="265px" />
</div>

<div class="evidence__notes">
  <span><b>01</b>Did training convert into instrument use?</span>
  <span><b>02</b>Where are onboarding delays or idle capacity?</span>
  <span><b>03</b>How did facility activity support research output?</span>
</div>

<!--
Analytics and reporting, 4 minutes. The same records support training review,
resource planning and research-impact reporting. Move from activity to
questions: who trained, who booked, how long onboarding took, how resources
were used, and how facility support connects to research output. Publication
metrics and attribution rules should be reviewed before formal reporting.
-->

---
layout: default
---

<p class="eyebrow">Google Workspace Studio · Launch 1.0</p>

# From records to routines that run themselves

<div class="studio">
  <aside class="studio__rail">
    <span class="ctp-tag ctp-tag--accent">Launch 1.0</span>
    <h3>Start with documentation.</h3>
    <p>Remove the repetitive preparation around a workflow while keeping scientific and operational accountability with the team.</p>
    <dl>
      <div><dt>Input</dt><dd>Existing Workspace events and records</dd></div>
      <div><dt>Output</dt><dd>A structured draft ready for review</dd></div>
      <div><dt>Boundary</dt><dd>No access decision or publication without approval</dd></div>
    </dl>
  </aside>
  <div class="studio__canvas">
    <ol class="studio__flow">
      <li><b>1</b><strong>Trigger</strong><small>Training completed, issue submitted, or weekly review begins</small></li>
      <li><b>2</b><strong>Understand</strong><small>Gemini summarizes, classifies, and uses permitted context</small></li>
      <li><b>3</b><strong>Act in Workspace</strong><small>Draft a Doc, update a Sheet, organize Drive, or notify in Gmail and Chat</small></li>
      <li><b>4</b><strong>Human review</strong><small>The manager checks, approves, and publishes the result</small></li>
    </ol>
    <div class="studio__cases">
      <article><span>Training</span><p>Package notes and required documents, then prepare the validation record and confirmation email.</p></article>
      <article><span>Equipment</span><p>Classify an incident, create the record, route it to the right person, and track follow-up.</p></article>
      <article><span>Reporting</span><p>Collect operational activity and prepare a consistent weekly summary for management review.</p></article>
    </div>
  </div>
</div>

<p class="studio__governance"><strong>Automate the preparation, not the accountability.</strong> Permissions, approvals, and institutional governance stay in the loop.</p>

<style scoped>
.studio { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: var(--s-5); align-items: stretch; }
.studio__rail { border: 1px solid var(--hairline); border-radius: var(--r-2); padding: var(--s-4); display: flex; flex-direction: column; gap: var(--s-2); }
.studio__rail .ctp-tag { align-self: flex-start; }
.studio__rail h3 { margin: var(--s-1) 0 0; font-family: var(--font-serif); font-size: 19px; }
.studio__rail p { margin: 0; font-size: 12px; line-height: 1.4; color: var(--fg2); }
.studio__rail dl { margin: var(--s-2) 0 0; display: flex; flex-direction: column; gap: 5px; }
.studio__rail dl div { display: grid; grid-template-columns: 62px 1fr; gap: 6px; font-size: 11px; line-height: 1.3; border-top: 1px solid var(--hairline); padding-top: 5px; }
.studio__rail dt { font-weight: 700; text-transform: uppercase; letter-spacing: var(--tracked-sm); font-size: 10px; color: var(--nyu-violet); }
.studio__rail dd { margin: 0; color: var(--fg1); }
.studio__canvas { display: flex; flex-direction: column; gap: var(--s-3); min-width: 0; }
.studio__flow { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-2); }
.studio__flow li { display: grid; gap: 3px; border: 1px solid var(--hairline); border-radius: var(--r-2); padding: 10px 12px; background: var(--bg1); }
.studio__flow li b { display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: var(--r-pill); background: var(--nyu-violet); color: var(--white); font-family: var(--font-mono); font-size: 11px; }
.studio__flow li:nth-child(4) b { background: var(--gold); }
.studio__flow li strong { font-size: 13px; color: var(--fg1); }
.studio__flow li small { font-size: 10.5px; line-height: 1.3; color: var(--fg2); }
.studio__cases { display: flex; flex-direction: column; border: 1px solid var(--hairline); border-radius: var(--r-2); }
.studio__cases article { display: grid; grid-template-columns: 90px 1fr; gap: var(--s-3); align-items: center; padding: 7px 12px; border-top: 1px solid var(--hairline); }
.studio__cases article:first-child { border-top: 0; }
.studio__cases span { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: var(--tracked-sm); color: var(--nyu-violet); }
.studio__cases p { margin: 0; font-size: 11.5px; line-height: 1.35; color: var(--fg1); }
.studio__governance { margin: var(--s-2) 0 0; font-size: 12px; color: var(--fg2); }
.studio__governance strong { color: var(--fg1); }
</style>

<!--
Workspace automation, 3 minutes. Google Workspace Studio (the production
evolution of Workspace Flows) uses Gemini to build no-code automations across
familiar Workspace tools. It is not Google Flow, the filmmaking tool, and it
is not Google AI Studio. Frame this as a proposed Launch 1.0 opportunity, not
a deployed CoreOps feature. Begin with documentation because the output can be
reviewed before it changes access, sends external communications, or becomes
an official record. Availability depends on the institution's eligible Google
Workspace edition, Gemini access, and administrator settings. Source: Google
Workspace Studio official product and help documentation.
-->

---
layout: section
---

# If operations can become interactive, scientific concepts can too.

::number::
PART 02 · Scientific operations

::subtitle::
Not another static diagram: a model the trainee can manipulate while the question is still fresh.

<!--
Transition, 2 minutes. Shift the framing from AI as software implementation
help to AI as a rapid scientific visualization and simulation partner. Every
simulator that follows was built with AI assistance and runs live in this deck.
-->

---
layout: default
---

<p class="eyebrow">Gaussian beam propagation</p>

# Move the parameters; the beam makes sense

<GaussianBeamDemo />

<!--
Interactive explanation, 3 minutes. Ask the audience to predict what happens
before moving a control. At one Rayleigh range, the radius is sqrt(2) times w0
and the peak intensity has halved.
Sources: Edmund Optics, Gaussian Beam Propagation; University of Colorado
Boulder, Gaussian Beams.
-->

---
layout: default
---

<p class="eyebrow">Lens / objective</p>

# A singlet shifts focus with wavelength

<LensObjectiveDemo />

<!--
Interactive explanation, 4 minutes. Keep the singlet selected and move the
wavelength from blue to red. Normal dispersion makes the singlet weaker at
longer wavelengths, so the focus moves away from the lens. The animation
enlarges this displacement by a factor of eight while the metric reports the
physical model value.
Switch to the corrected doublet. The focal plane stays fixed in this idealized
model, although the diffraction-limited waist still increases with wavelength.
Real achromatic doublets bring two design wavelengths to a common focus and
retain a small secondary spectrum.
Sources: SCHOTT N-BK7 optical constants, represented with a Cauchy dispersion
model; Edmund Optics, Chromatic Aberration; Edmund Optics, Gaussian Beam
Propagation.
-->

---
layout: default
---

<p class="eyebrow">Laser alignment</p>

# Two planes reveal translation and tilt

<AlignmentDemo />

<!--
Interactive alignment, 4 minutes. Goal: steer the beam through both irises.
Use Mirror 1 primarily for the near iris, then Mirror 2 for the far iris, and
iterate because the controls are coupled.
Run "Animate convergence": Mirror 1 centers the near iris, Mirror 2 centers
the far iris, and the coupled corrections become smaller on each pass. Then
run the wrong sequence: assigning Mirror 1 to the far iris and Mirror 2 to the
near iris amplifies the error until adjustment travel is exhausted.
The optical system does have a solution. The failure animation shows that the
reversed control strategy does not converge, not that two-mirror alignment is
impossible.
Source: Thorlabs, Optical Alignment Best Practices. Simulation adapted from the
user-provided two-mirror reference.
-->

---
layout: default
---

<p class="eyebrow">Simplified confocal scan head · 3D model</p>

# From excitation to detected signal

<ScanHeadFrame />

<!--
Inside the scan head, 5 minutes. The dichroic reflects the scanned excitation
beam into the objective, which focuses it to one spot. Fluorescence leaves that
spot in all directions; the objective accepts only its numerical-aperture cone,
and the dichroic transmits that return signal to the detector.
Use "Move X only" and "Move Y only" to isolate the two orthogonal galvo
rotations, then restore both axes to build the raster. Switch between the top,
side and perspective views to connect mirror motion to the moving focal spot.
Next isolate the excitation and detection paths. Drag to rotate, wheel to zoom.
Teaching schematic based on the Leica SP8 Scan Head with 4Tune Detection
poster, 2018. Relay lenses, the confocal pinhole and spectral-selection optics
are omitted for clarity. Needs WebGL; the PDF and PPTX exports show a still.
-->

---
layout: default
---

<p class="eyebrow">Confocal microscopy</p>

# One confocal pixel is a measurement

<ConfocalPixelDemo />

<!--
Confocal animation, 3 minutes. Not a miniature photograph: build the path one
event at a time: focus, fluorescence, collection, pinhole rejection, detector,
integration. Say "rejects much of the out-of-focus signal", not "only in-focus
photons".
Sources: Nikon MicroscopyU, Point-Scanning Confocal Microscopy; Jonkman et al.,
Confocal Microscopy: Principles and Modern Practices.
-->

---
layout: default
---

<p class="eyebrow">Raster scanning</p>

# One pixel becomes a line. Lines become a frame.

<RasterScanDemo />

<!--
Raster animation, 3 minutes. Connect speed, dwell time, signal-to-noise,
bleaching, and phototoxicity. The image is assembled sequentially rather than
captured all at once by a camera.
Sources: Nikon MicroscopyU; University of Edinburgh confocal laser scanning
tutorial.
-->

---
layout: default
---

<p class="eyebrow">Point-spread function</p>

# The PSF explains why the image is never the object

<PsfDemo />

<!--
PSF interaction, 3 minutes. Move NA and wavelength. Emphasize that axial
resolution is normally poorer than lateral resolution and that blur can change
apparent size, separability, and count.
Sources: Introduction to Bioimage Analysis, Blur and the PSF; University of
Queensland, Deconvolution and the PSF.
-->

---
layout: default
---

<p class="eyebrow">Small tool · Live demo</p>

# Build a cell counter, then inspect the evidence

<CellCounterDemo />

<!--
Cell-counting demo, 6 minutes. Use the synthetic image to show the loop
safely: describe, build, inspect, correct. A simple threshold may work for
isolated nuclei; touching nuclei need declumping such as watershed. Domain
validation remains necessary.
Sources: CellProfiler IdentifyPrimaryObjects; scikit-image watershed
segmentation; ImageJ Particle Analysis.
-->

---
layout: default
---

<p class="eyebrow">Data processing · Objects to evidence</p>

# From segmented objects to measurable distributions

<ObjectAnalysisDemo />

<!--
Objects to table to distributions, 4 minutes. A mask already contains object
identities. One click turns those objects into a table; the same values can
then switch between histogram and violin views. Build the table first: each
row is one segmented object and each column is a reproducible measurement.
Plot the area, then switch between histogram and violin views without changing
a single value. Introduce the second synthetic population and repeat the
switch. Emphasize that visualization follows segmentation; it does not repair
a poor mask.
Teaching note: the values and group names are deterministic synthetic
examples. Do not interpret the displayed median difference as a biological
conclusion or significance test.
-->

---
layout: default
---

<p class="eyebrow">Data processing · Regression</p>

# Fit a model, then inspect what it misses

<RegressionFitDemo />

<!--
Regression demo, 4 minutes. AI can generate the fitting workflow quickly.
Scientific judgment still chooses the model and checks uncertainty and
residual structure. Fit the linear model first so the residual curvature is
visible. Move to quadratic and compare the residuals and reduced chi-square.
Try cubic last: a slightly higher R squared does not automatically justify
extra complexity.
The example uses deterministic synthetic data and weighted least squares. Fit
metrics quantify agreement; they do not prove a mechanism.
-->

---
layout: default
---

<p class="eyebrow">Next step · Connected applications</p>

# A learning system for neuron imaging

<NeuroLoop />

<!--
Next chapter, timing to refine. NeuroSeg, NeuroSim and NeuroTrain pass
reviewed files and models between workflows. Each validated cycle can improve
the next model. Hover or focus an application on the slide to see its role.
Use this slide as the transition from individual AI-built tools to a connected
scientific workflow. NeuroSeg supplies reviewed morphology, NeuroSim creates
controlled labelled data, and NeuroTrain returns a model for testing on real
acquisitions. Human review remains the gate between cycles. Reviewed output
becomes the next cycle's input.
Sources: the NEURON_PROJECTS notes and the maintained NeuroSeg, NeuroSim and
NeuroTrain README files, reviewed 8 September 2026. The applications exchange
controlled files and model artifacts; they do not operate as one automatic
service.
-->

---
layout: end
---

# Expertise is the engine. AI makes it executable.

::meta::
<p class="end-equation"><strong>Domain expertise</strong><b>×</b><strong>Rapid iteration</strong><b>×</b><strong>Validation</strong><b>=</b><strong>Usable tools</strong></p>
<p class="end-question">What operational problem, or scientific concept, would you make executable first?</p>
<p>Rachid Rezgui · Light Microscopy · Core Technology Platforms · NYU Abu Dhabi</p>

<style scoped>
.end-equation { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-3); margin: 0 0 var(--s-4) !important; }
.end-equation strong { font-size: 12px; font-weight: 700; letter-spacing: var(--tracked); text-transform: uppercase; color: var(--white); }
.end-equation b { color: var(--gold); font-size: 14px; }
.end-question { font-family: var(--font-serif); font-size: var(--t-body-lg) !important; color: var(--white) !important; margin: 0 0 var(--s-4) !important; }
</style>

<!--
Close, 1 minute. Return to the opening tension. AI did not replace microscopy
or facility expertise; it provided a practical path from expertise to a tested
tool.
-->
