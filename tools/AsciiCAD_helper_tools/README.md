# UTF character glyph helpers


## Generate Training data on UTF8 characters (menlo_parallel_dataset.h5)
<pre>
python3 generate_data.py                        
</pre>

## Create BMP image for any given UTF8 character
<pre>
 python3 char_to_bmp.py "Ȝ"
</pre>
__Example output__
<pre>
 >> Success! Using: /Users/owner/Library/Fonts/NotoSansMono-Regular.ttf
 >> File saved: char_64x64_0x021C.bmp
</pre>

## Score any BMP image against UTF8 training dataset
<pre>
python3 score_glyph.py  char_64x64_0x021C.bmp --stageA-topk 5000 --stageB-radius 2 --workers 8
</pre>
__Example output__
<pre>

tageA-topk 5000 --stageB-radius 2 --workers 8
Rank  Char   Hex Code   Match % (IoU)   v0.5
StageA: 16x16, topk=5000   StageB: radius=2, dilate=False, workers=8
--------------------------------------------------------------------------------
1     ⹉      U+2E49       31.40%
2     ⵏ      U+2D4F       30.74%
3     ❭      U+276D       30.27%
4     (      U+0028       30.00%
5     ἳ      U+1F33       29.88%
6            U+2E58       29.73%
7     ⟨      U+27E8       28.71%
8     ⎰      U+23B0       28.30%
9     ⁞      U+205E       28.29%
10    ❲      U+2772       28.22%
11    ┃      U+2503       28.19%
12    ╻      U+257B       28.16%
13    ❘      U+2758       28.12%
14    ꝛ      U+A75B       28.10%
15    ⸾      U+2E3E       27.94%
16    ;      U+003B       27.91%
17    ›      U+203A       27.85%
18    ❬      U+276C       27.49%
19    ⹌      U+2E4C       27.48%
20    ἰ      U+1F30       27.43%
21    ❫      U+276B       27.18%
22    ί      U+03AF       27.06%
23           U+2E57       26.98%
24    ⎩      U+23A9       26.91%
25    ┠      U+2520       26.81%
26    ⎤      U+23A4       26.79%
27    ⁅      U+2045       26.75%
28    ⎠      U+23A0       26.70%
29    ⵓ      U+2D53       26.67%
30    ⵑ      U+2D51       26.49%
31    }      U+007D       26.46%
32    ╿      U+257F       26.38%
33    ❯      U+276F       26.36%
34    ꞽ      U+A7BD       26.30%
35    ┎      U+250E       26.27%
36    ǃ      U+01C3       26.16%
37    ╵      U+2575       26.16%
38    ☇      U+2607       26.14%
39    ᪺      U+1ABA       26.02%
40    Ј      U+0408       26.01%
41    ⎬      U+23AC       26.01%
42    ⎢      U+23A2       25.99%
43    !      U+0021       25.90%
44    ⁏      U+204F       25.90%
45    ꙋ      U+A64B       25.76%
46    ɬ      U+026C       25.76%
47    ⁆      U+2046       25.75%
48    ɿ      U+027F       25.75%
49    ˧      U+02E7       25.73%
50    ꜝ      U+A71D       25.71%
51    ⎸      U+23B8       25.65%
52    ┒      U+2512       25.61%
53           U+2E55       25.56%
54    Ṫ      U+1E6A       25.56%
55    ¡      U+00A1       25.49%
56    ⵂ      U+2D42       25.43%
57    ┚      U+251A       25.40%
58    ɟ      U+025F       25.40%
59    ⎫      U+23AB       25.31%
60    ỉ      U+1EC9       25.30%
61    ╏      U+254F       25.29%
62    ǀ      U+01C0       25.27%
63    ⁝      U+205D       25.15%
64    ꜣ      U+A723       25.14%
</pre>

