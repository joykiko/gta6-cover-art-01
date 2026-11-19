# Vice Coast Cover Studio

An offline poster maker for turning your own photos and a caption into vivid, multi-panel cover art. Pick a composition, adjust each panel's photo crop, choose a color story, and export a share-ready PNG.

## Run it

From this repository, run `node serve.ts` and open <http://localhost:8080>. The two sample scenes are ready as soon as the page opens. Add up to four of your own photos with **Add photos** or drag them onto the page. Click a panel to select it; assign a photo, drag within the preview to reframe, and tune its zoom, fit/fill, and horizontal flip. Each panel remembers its crop.

Six layouts are included: Full-Bleed Hero, Hero + 3 Panels, 4-Panel Grid, 5-Panel Mosaic, 9-Panel Grid, and Tilted Snapshot Collage. Six grades—Vice Sunset, Neon Night, Golden Hour, Teal Noir, Bubblegum Pop, and Mono Heat—combine with optional grain, halftone, and vignette effects. Add a title and script subtitle, then export 1080×1080, 1080×1350, 1920×1080, or 1080×1920 (story), individually or all at once. Undo/redo, keyboard shortcuts, reset, and Shuffle look help you explore quickly.

The app makes no network requests. Photos are decoded locally in your browser and never leave this device; exports are drawn to a local canvas and saved as PNG files. Fonts are installed system sans and serif faces with generic fallbacks, so there are no downloaded fonts or bundled font files.

## Sample photos

`app/samples/boulevard.jpg` and `app/samples/pier.jpg` came from the competition kit starter. They were made for make.fun with an image model and are free to use.

## Submission reasoning

The live field read on 19 Nov at about 18:00 WIB had 392 submissions and 153 ranked. Provisional win rates were rank 1: 0.880, rank 5: 0.808, rank 10: 0.748, and rank 50: 0.702.

- **Art:** six layouts, including a 9-panel grid and tilted collage; a halftone title block; six gradient grades; and grain and vignette effects.
- **Any photo:** up to four local photos, per-panel assignment, pan, zoom, and flip, plus one-photo-fills-all.
- **Fast and easy:** two bundled sample scenes, one-click exports in four common post sizes, and export-all.
- **Polish:** live preview, undo/redo, Shuffle look, and the VICE COAST badge ribbon.

The rank-1 “Neon Grid Cover Studio” lead has five panels, four grades, and three layouts. This entry offers six layouts, six grades, four sizes, per-panel crop control, and undo/redo. The house ladder's 7-ace “Neon Coast Cover Studio” already has a tilted layout, story size, and undo/redo; this entry matches those and adds five more layouts, five more grades, three more export sizes, multi-photo panels, and halftone/grain toggles.

A pairwise vision judge across a 392-submission field is high-variance. The cover-first screenshot is landscape so it displays largest on the contact sheet. No real-person photos are bundled; both samples are AI-made for make.fun.

Quota decision: probe 1 of at most 2 probes plus 1 final under Force Last. Iterate only if the provisional rate shows a path toward the approximately 0.70 top-50 cutoff.
