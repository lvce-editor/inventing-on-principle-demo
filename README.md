# Inventing on Principle: Live Tree

A small, playful demo of Bret Victor's principle that creators should have an immediate connection to what they create. Change the tiny program on the left and its tree redraws on the right—without saving, pressing Run, or leaving the thought.

This is an independent homage built with `@lvce-editor/server`, not a recreation of Victor's original environment. It focuses on the essential prerequisite: a tight edit/feedback loop. Numeric scrubbing and code-to-output provenance remain explicit future fidelity targets.

## Try it

The standalone demo is published at [lvce-editor.github.io/inventing-on-principle-demo](https://lvce-editor.github.io/inventing-on-principle-demo/).

To run it inside LVCE, use Node 24:

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>, press F1, then run:

> Inventing on Principle: Open Live Tree Demo

The command opens a dedicated LVCE webview with its editable program and Canvas stage side by side. Start with these edits:

| Parameter      | Try                       | What changes                       |
| -------------- | ------------------------- | ---------------------------------- |
| `depth`        | `7` → `10`                | A 127-branch tree becomes 1,023    |
| `spread`       | `22` → `38`               | The crown opens outward            |
| `lengthRatio`  | `0.72` → `0.8`            | Branches become long and luxuriant |
| `wind`         | `0` → `0.14`              | The whole tree leans               |
| `blossomCount` | `18` → `48`               | Pink blossoms fill the tips        |
| `leafColor`    | `'#718355'` → `'#c46f3a'` | Summer turns to autumn             |

A temporary incomplete assignment does not blank or replace the output. The status explains what needs finishing while the last valid tree remains visible.

## How it works

The extension contributes `inventingOnPrinciple.openLiveTree`. The command opens an `inventing-on-principle.live-tree` resource, whose selector is handled by a purpose-built LVCE webview and worker.

The source surface intentionally accepts six constrained `const` assignments rather than evaluating arbitrary JavaScript. Each valid input event parses those values and synchronously redraws a deterministic recursive Canvas tree. This makes the feedback loop immediate, safe, and easy to compare.

LVCE's current native HTML preview updates markup and styles when a document changes, but does not rerun changed scripts. Keeping the parse/render loop inside this focused webview avoids claiming a native scripted-preview capability that is not there yet. The webview and standalone page share the same JavaScript and CSS.

## Static site and GitHub Pages

```sh
npm run build:site
```

This creates `dist/site/index.html` plus its local assets. CI builds and validates that artifact on every pull request. Successful `main` and manual workflows upload the same artifact and deploy it through GitHub Pages.

## Research

The original tree sequence runs roughly from 3:20 to 9:35 in [_Inventing on Principle_](https://vimeo.com/906418692). It combines immediate redraw, literal scrubbing, discovery through continuous feedback, and bidirectional source/output navigation. See the [research note](docs/research.md) for a timestamped breakdown and the explicit v1 boundary.

Victor's broader explanation is also worth reading in [_Learnable Programming_](https://worrydream.com/LearnableProgramming/): instant updates are a prerequisite for a responsive creative medium, not the whole interaction design.

## Development

```sh
npm run format
npm run build
npm test
npm run type-check
npm run lint
npm run e2e:headless
```

MIT licensed.
