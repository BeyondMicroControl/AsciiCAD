# Glyph “material model”

_two channels_:

1.  **luminance/coverage** (how much ink the glyph puts down)
    
2.  **structure/texture** (where that ink sits: edges, orientation, frequency, corners, etc.)
    

A workable way to quantise + vote is to treat each glyph as a _little image_ (its raster) and precompute a small set of **features** that match the features we extract from the picture per cell. Then matching is “nearest neighbor” (or multi-stage voting) with knobs to control what matters.

1) Treat every glyph as data: raster → features
-----------------------------------------------

Render each candidate glyph (monospace) to a tiny bitmap at a fixed resolution (e.g. 16×16 or 24×24). From that bitmap compute features:

### A. Luminance / coverage (easy channel)

*   **Ink coverage**: mean of (1 - pixel brightness). This is our “density”.
    
*   **Center-of-mass** of ink (optional): catches top/bottom heavy glyphs (e.g. ▀ vs ▄).
    
*   **Variance / contrast**: how “flat” vs “busy” the glyph is.
    

Quantise coverage into bins (e.g. 16 bins), so we can do fast filtering:

*   coverage\_bin = round(coverage \* (B-1))
    

### B. Edge / orientation (structure channel)

Run Sobel (or Scharr) _on the glyph bitmap_ and compute:

*   **Edge magnitude**: total edge energy.
    
*   **Orientation histogram**: e.g. 4-bin (H, V, /, ) or 8-bin (every 22.5°).
    
*   **Cornerness / junctionness**: e.g. Harris corner response sum, or a simple “energy in multiple directions at once”.
    

Quantise:

*   dominant orientation (argmax of histogram)
    
*   “anisotropy”: how strongly one orientation dominates (max / sum)
    
*   cornerness into bins (none / mild / strong)
    

This makes it easy to group glyphs:

*   **pure edge glyphs**: high anisotropy, low coverage (e.g. \_|/\\)
    
*   **corner glyphs**: high cornerness (box-drawing corners like U+256D–U+2570)
    
*   **junction glyphs**: energy in 3+ directions (┼, ├, ┬…)
    
*   **isotropic texture glyphs**: high edge energy but low anisotropy (▒, ▓, ⣿, etc.)
    

### C. Texture / frequency (the hard channel)

Capture “texture feel” with a tiny frequency descriptor:

*   2D DCT (or FFT) on the glyph bitmap → take a few low/mid frequency coefficients as a vector
    
*   or simpler: edge energy at multiple scales (blur σ=1,2,3 then Sobel) → a 3–4 number “multiscale energy” signature
    

Quantise texture into a few classes:

*   **smooth** (low energy all scales)
    
*   **fine grain** (energy mostly high-frequency)
    
*   **coarse** (energy shows up after blur / low frequencies)
    
*   **striped** (strong directional frequency)
    

This is how we distinguish, say, “▒” vs “▓” vs “█” or “⠿” vs “⣿”.

2) Extract the same features from the image per cell
----------------------------------------------------

For each cell (the area covered by one output character), compute features comparable to glyph features:

### A. Cell luminance

*   mean luminance (and maybe variance)
    

### B. Cell edge structure

Compute gradients in the cell (Sobel on the source, preferably on a slightly prefiltered version like DoG/LoG):

*   total edge magnitude
    
*   orientation histogram (4 or 8 bins)
    
*   anisotropy (dominance)
    
*   cornerness / junctionness (optional)
    

### C. Cell texture signature

*   multiscale edge energies, or a few DCT coefficients from the cell’s luminance patch
    

3) The voting / selection algorithm
-----------------------------------

Think “filter then score”.

### Stage 1 — Hard gating (fast, controllable)

Pick a **candidate set** of glyphs based on quantised bins:

*   coverage\_bin close to cell luminance target (±1 bin)
    
*   if strong edges: require edge\_energy above a threshold
    
*   if strong anisotropy: restrict to glyphs with matching dominant orientation (±1 bin)
    
*   if cornerness high: restrict to corner/junction glyph families
    
*   if texture class says “fine grain”: restrict to stipple families (▒, ⠶, ⠿, etc.)
    

This is where we control artistic choices. Sliders map nicely to these gates.

### Stage 2 — Soft scoring (precise match)

For candidates, compute a weighted distance:

score(g)=wL⋅dL+wE⋅dE+wT⋅dT+wC⋅dCscore(g)=wL​⋅dL​+wE​⋅dE​+wT​⋅dT​+wC​⋅dC​

Where:

*   dLdL​: difference in coverage (and optionally variance)
    
*   dEdE​: distance between orientation histograms (e.g. cosine distance) + edge energy difference
    
*   dTdT​: distance between texture vectors (e.g. L2 on DCT coeffs / multiscale energies)
    
*   dCdC​: cornerness / junctionness mismatch penalty
    

Pick lowest score.

### Stage 3 — Consensus / stability (the “compute shader” idea)

To avoid broken lines, don’t decide purely per pixel/cell in isolation:

**Option A: Tile consensus (8×8 threads concept)**

*   For each output cell, we already aggregate features from the cell patch.
    
*   Additionally, we enforce **neighborhood voting**:
    
    *   compute the “edge class” (none / H / V / diag / corner / junction / texture)
        
    *   let the final class be a majority vote over a 3×3 neighborhood
        
    *   then pick glyph within that class that best matches luminance/texture
        

**Option B: Energy minimization (more expensive, better)**Choose glyphs to minimize:

*   per-cell score (as above)
    
*   plus penalties for inconsistency:
    
    *   if two neighbors both have strong horizontal edges, penalize choosing mismatched edge glyphs
        
    *   encourage continuity in orientation along edges
        

This is basically a tiny Markov Random Field: very controllable with 2–3 penalty weights.

4) How to make it “controllable” (what users actually tweak)
------------------------------------------------------------

We want knobs that map to feature weights and gating thresholds, not raw math:

1.  **Brightness fidelity** (wL): “match tone”
    
2.  **Edge fidelity** (wE + edge threshold): “prefer edges”
    
3.  **Texture fidelity** (wT): “prefer texture”
    
4.  **Edge style**: choose allowed glyph families
    
    *   only ASCII edges (\_|/\\)
        
    *   box drawing (U+2500–U+257F)
        
    *   rounded corners (U+256D–U+2570)
        
    *   block shading (U+2580–U+259F)
        
    *   Braille (U+2800–U+28FF) for fine texture
        
5.  **Continuity** (neighbor penalty): “connect lines”
    
6.  **Detail scale**: controls prefilter (DoG sigma) and texture scale bins
    

This turns our system into a “shader” rather than a one-off mapper.

5) Practical glyph family design
----------------------------------

We already have a great taxonomy:

*   **Edges with clear orientation**: \_ | / \\ and box drawing lines (U+2500–U+250B, etc.)
    
*   **Corners / arcs / contours**: U+256D–U+2570, etc.
    
*   **Edge + luminance combined**: block elements and geometric shapes (U+2580–U+25FF)
    
*   **Texture-heavy**: shade blocks ░▒▓█ (U+2591–U+2588), Braille (U+2800–U+28FF), dense mosaics like ⣿
    

In the feature database, each family becomes a _candidate pool_ with its own statistical profile (coverage range, texture range). Our algorithm can either:

*   choose from the union, or
    
*   pick family per cell using the “edge class” vote, then select inside.
    

6) A clean quantisation scheme that works well
----------------------------------------------

Per glyph and per cell, quantise to:

*   Coverage: 16 bins (0..15)
    
*   Edge magnitude: 4 bins (none / low / med / high)
    
*   Dominant orientation: 4 bins (H,V,/, ) + “none”
    
*   Anisotropy: 3 bins (weak / medium / strong)
    
*   Cornerness: 3 bins (none / corner / junction)
    
*   Texture class: 4 bins (smooth / fine / coarse / striped)
    

That’s enough to do robust gating and still keep candidate sets small.

Next we can sketch a **concrete per-cell decision flow** like:

1.  classify cell → {flat, edge, corner, texture} using thresholds
    
2.  pick glyph family set allowed by user
    
3.  gate by coverage bin ±1
    
4.  match orientation if edge/corner
    
5.  rank by texture vector if texture-heavy
    
6.  apply neighborhood continuity vote
