# Research: Bret Victor's live-tree demo

## What the talk is actually about

_Inventing on Principle_ was presented by Bret Victor at CUSEC on January 20, 2012. The first half demonstrates tools; the larger argument is about choosing a
specific guiding principle for one's work. Victor's principle is:

> Creators need an immediate connection to what they create.

He makes “immediate” stricter than fast compilation: when a creator makes a
change or decision, its effect should be visible without delay, and relevant
behavior should not remain hidden. The reason is creative discovery. Ideas start
weak and are shaped by reacting to what the medium shows; feedback latency and
hidden state prevent some ideas from being discovered at all.

This is also an important guardrail for our demo: Victor later explicitly wrote
that live coding by itself “misses the point” and that immediate update is a
prerequisite, not the finished interaction design. The environment should help a
person see and understand what a program is doing, not merely rerun it quickly.

Primary sources:

- [Official Vimeo page for _Inventing on Principle_](https://vimeo.com/906418692)
- [Bret Victor's official site, which links the talk](https://worrydream.com/#2012)
- [Bret Victor, “Learnable Programming”](https://worrydream.com/LearnableProgramming/)
- [Timestamped CC-BY transcript linked to the original video](https://blog.ezyang.com/2012/02/transcript-of-inventing-on-principleb/)

Timestamps below refer to the official Vimeo upload and were located using the
timestamped transcript.

## Exact sequence of the tree demo

| Time                                                   | Interaction                                                                                                                                                                                               | Why it matters                                                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [1:10](https://vimeo.com/906418692#t=1m10s)            | Victor states the principle and defines it as no delay and nothing hidden.                                                                                                                                | This is the design criterion, not merely an optimization target.                                                                   |
| [2:32](https://vimeo.com/906418692#t=2m32s)            | Baseline workflow: JavaScript canvas code is edited separately, then compiled/run to reveal a landscape with a tree.                                                                                      | The creator spends most of the cycle “blind,” imagining the result while in the text editor.                                       |
| [3:20](https://vimeo.com/906418692#t=3m20s)            | A new environment places the picture and code side by side. Sections of code draw the sky, mountains, and tree. Any code change redraws the picture immediately; there is no explicit compile/run action. | Code and output remain continuously synchronized.                                                                                  |
| [about 3:50–4:47](https://vimeo.com/906418692#t=3m50s) | Point at a numeric literal, hold Control, and drag/dial it up or down. Branch length and other parameters change continuously while scrubbing.                                                            | A literal becomes a direct manipulation handle, supporting rapid search through a design space.                                    |
| [4:48](https://vimeo.com/906418692#t=4m48s)            | Scrub the loop count controlling pink blossoms. Around twenty blossoms, rapid adjustment produces an unplanned shimmering/wind effect.                                                                    | This is the central discovery beat: continuous feedback reveals an animation idea that discrete edit/run cycles would likely hide. |
| [5:33](https://vimeo.com/906418692#t=5m33s)            | Add code for a sun. While moving through `fillCircle`, `fillRect`, and `fillText` autocomplete choices, each candidate is previewed immediately. Then scrub the circle coordinates and radius.            | Creation is reaction: autocomplete and defaults put something manipulable on screen before the creator has fully specified it.     |
| [6:12](https://vimeo.com/906418692#t=6m12s)            | Add `fillStyle`; Control on the color literal opens a palette. A white default unexpectedly suggests a moon/night scene before yellow is chosen.                                                          | Immediate, domain-appropriate manipulation lets alternative ideas surface.                                                         |
| [7:17](https://vimeo.com/906418692#t=7m17s)            | Hold Option and hover code lines; the pixels/shapes produced by that line highlight in the picture.                                                                                                       | Side-by-side panes are insufficient if the creator must keep the code-to-output mapping in their head.                             |
| [about 7:55–9:35](https://vimeo.com/906418692#t=7m55s) | The mapping works in reverse: Option-hover a picture pixel and the editor jumps to the line that drew it. Victor uses this to navigate directly to the sun, tree, and mountains and adjust them.          | Output becomes an index into source. Navigation, editing, and feedback form one tight loop.                                        |
| [9:36](https://vimeo.com/906418692#t=9m36s)            | Victor returns to the principle: ideas need an environment in which the creator can nurture and shape them.                                                                                               | The tree is evidence for the principle, not the principle itself.                                                                  |

The original tree demo therefore combines several distinct ideas:

1. side-by-side source and rendered output;
2. redraw on every valid change;
3. direct manipulation of source literals;
4. domain-aware choices (visual autocomplete and a color palette);
5. code-to-output highlighting; and
6. output-to-code navigation.

Calling it only a “live preview” loses the most interesting half of the demo.

## Later programming demonstrations are separate

The talk subsequently broadens the same principle. These are not part of the
tree interaction, although they clarify what “nothing hidden” means:

- [10:26](https://vimeo.com/906418692#t=10m26s): a running platform game adds
  state, time, and interaction. Ordinary hot editing is shown to be inadequate
  because the creator still cannot immediately judge a past jump.
- [12:43](https://vimeo.com/906418692#t=12m43s): recorded input is replayed while
  scrubbing time and executing changed code.
- [13:20](https://vimeo.com/906418692#t=13m20s): time is mapped to space as a
  past-and-future trail. Scrubbing a jump parameter changes the visible future
  trajectory immediately.
- [18:06](https://vimeo.com/906418692#t=18m6s): while writing binary search, each
  expression's concrete value is shown beside the abstract code for example
  inputs.
- [20:14](https://vimeo.com/906418692#t=20m14s): loop iterations become columns,
  exposing the full dynamic execution and making an infinite-loop case visible.
- [23:17](https://vimeo.com/906418692#t=23m17s): the circuit demo visualizes
  voltage and current over time, supports scrubbing, and preserves before/after
  waveforms for comparison.
- [29:06](https://vimeo.com/906418692#t=29m6s): the animation demo replaces
  guessed keyframes with direct, two-handed performance and immediate playback.

These examples show a progression:

`final output` → `source/output correspondence` → `state and execution over time`
→ `data and comparisons` → `embodied creation`

## Scope for this repository

The focused LVCE demo should recreate the recognizable tree experience, not the
entire talk.

### Recreate in v1

- An extension command that opens/initializes the demo.
- A focused, code-shaped editing surface on the left and a tree scene on the
  right.
- Immediate preview updates while editing, with no Run button as the normal
  loop.
- A handful of high-impact numeric and color literals near the top of the file,
  so ordinary typing is enough to explore a large visual design space.
- A deterministic rendering that makes each edit easy to compare with the last.
- A polished initial program that is short enough to understand on screen.
- A source program that is compact enough for whole-value edits to stay in the
  immediate feedback loop.

### Future fidelity targets

- Scrubbable numeric literals, especially branch geometry and blossom count.
- A discovery moment driven by continuous scrubbing rather than discrete
  typing.
- Code-to-output highlighting for the major drawing regions, followed by
  reverse output-to-code navigation.
- Visual autocomplete and a color-literal palette.
- Helpful recovery from incomplete intermediate syntax while retaining the last
  valid output.

These are central to the original interaction, but they require editor and
preview affordances beyond the native v1 path. They should not be implied in the
first release.

### Do not imply that this first demo recreates

- Recorded-input replay, time scrubbing, future trails, or other dynamic
  execution from the platform-game demo.
- Inline values and per-iteration columns from the binary-search demo.
- Circuit simulation or the direct-performance animation tool.
- Arbitrary, safely sandboxed JavaScript execution if the implementation instead
  parses a deliberately small scene description.

This narrower scope demonstrates the prerequisite Victor identified: immediate
feedback during creation. It deliberately does not claim the full direct
manipulation or source/output correspondence of the original environment.

## Local LVCE feasibility notes

The local `about-view` checkout provides the relevant project shape:

- `packages/server/package.json` depends on `@lvce-editor/server` and its `dev`
  script invokes the server with an e2e test path.
- `packages/build/src/dev.ts` runs a watch build and
  `node_modules/@lvce-editor/server/bin/server.js` together.
- `packages/build/src/build-static.ts` uses the LVCE shared process to export a
  static editor build and then wires in the custom worker bundle.
- `packages/about-view/src/parts/Listen/Listen.ts` registers the view's command
  map before initializing its worker connections.
- The installed `@lvce-editor/server/src/server.js` accepts
  `--only-extension=...` and `--test-path=...`, which is enough to host a
  purpose-built local extension/test fixture.

Those are source-backed scaffold capabilities only. They do **not** establish
that LVCE already provides Victor-style literal scrubbing or code↔pixel
provenance; those interactions belong to this demo's extension/UI.

During implementation, direct testing found two missing pieces in LVCE's native
path. The preview worker reparsed editor changes but did not rebuild its sandbox
document or rerun changed scripts. Separately, reference nodes such as transferred
Canvas elements ignored their serialized attributes during initial rendering and
incremental diffing. Those defects were fixed in their owning repositories.

The demo now uses the native HTML editor and preview. Its script runs in LVCE's
preview sandbox, draws through a transferred `OffscreenCanvas`, and updates both
the Canvas and ordinary DOM status text after unsaved editor changes. The static
site is a generated LVCE build with the demo extension included.
