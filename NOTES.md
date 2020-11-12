# FFMPEG Output

## STREAMING

```bash
/Users/davidreed/tmp/sketches/node_modules/@ffmpeg-installer/darwin-x64/ffmpeg -framerate 30 -f image2pipe -c:v png -i - -vf fps=30 -y -an -preset slow -c:v libx264 -movflags faststart -profile:v high -crf 18 -pix_fmt yuv420p tmp/2020.11.12-14.54.31.mp4
```

## PASS IN IMAGES

```bash
/Users/davidreed/tmp/sketches/node_modules/@ffmpeg-installer/darwin-x64/ffmpeg -framerate 30 -f image2 -c:v png -i sketch2_%03d.png -vf fps=30 -y -an -preset slow -c:v libx264 -movflags faststart -profile:v high -crf 18 -pix_fmt yuv420p 2020.11.12-14.54.31.mp4
```
