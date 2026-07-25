# Inventing on Principle: Live Tree

A small, playful demo of Bret Victor's principle that creators should have an
immediate connection to what they create. Run one LVCE command and a real HTML
source file opens beside its Canvas preview. Change the source—without saving or
pressing Run—and the tree responds.

This is an independent homage built with `@lvce-editor/server`, not a recreation
of Victor's original environment. The first version focuses on its essential
prerequisite: a tight edit/feedback loop. Numeric scrubbing and code-to-output
provenance are documented future fidelity targets.

## Try it

Requires Node 24.

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>, then run:

> Inventing on Principle: Open Live Tree Demo

The command opens [`demo/live-tree.html`](demo/live-tree.html) on the left and
LVCE's native live HTML preview on the right. Start with these edits near the top
of the file:

| Parameter      | Try                       | What changes                       |
| -------------- | ------------------------- | ---------------------------------- |
| `depth`        | `7` → `10`                | A 127-branch tree becomes 1,023    |
| `spread`       | `22` → `38`               | The crown opens outward            |
| `lengthRatio`  | `0.72` → `0.8`            | Branches become long and luxuriant |
| `wind`         | `0` → `0.14`              | The whole tree leans               |
| `blossomCount` | `18` → `48`               | Pink blossoms fill the tips        |
| `leafColor`    | `'#718355'` → `'#c46f3a'` | Summer turns to autumn             |

There is no Run button in the loop and changes need not be saved. Even a
temporary syntax error is safe: finish the edit and the preview recovers.
Restore the starting source with:

```sh
git restore demo/live-tree.html
```

## How it works

The extension contributes one command,
`inventingOnPrinciple.openLiveTree`. It opens the tracked demo source with
`Main.openUri`, shows the same URI through `Layout.showPreview`, and returns
focus to the editor. LVCE's native preview follows the editor's unsaved document
updates; the demo itself is a self-contained, deterministic HTML/Canvas program
with no CDN, evaluator, or custom message bridge.

The browser e2e test exercises the complete interaction: command activation,
split source/preview layout, unsaved depth changes, a syntax error, recovery, and
idempotent reopening.

## Research

The original tree sequence runs roughly from 3:20 to 9:35 in
[_Inventing on Principle_](https://vimeo.com/906418692). It combines immediate
redraw, literal scrubbing, discovery through continuous feedback, and
bidirectional source/output navigation. See the
[research note](docs/research.md) for a timestamped breakdown and the explicit
v1 boundary.

Victor's broader explanation is also worth reading in
[_Learnable Programming_](https://worrydream.com/LearnableProgramming/):
instant updates are a prerequisite for a responsive creative medium, not the
whole interaction design.

## Development

```sh
npm run format
npm run lint
npm test
npm run type-check
npm run e2e:headless
```

MIT licensed.
