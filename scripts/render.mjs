// Render por tramos + audio aparte, unidos con ffmpeg.
// uso: node scripts/render.mjs [--scale=1] [--crf=18] [--part=1500] [--out=out/final.mp4] [--tag=full]
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {execSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=')[1];
const scale = Number(arg('scale', 1));
const crf = Number(arg('crf', 18));
const partLen = Number(arg('part', 1500));
const tag = arg('tag', 'full');
const outFile = arg('out', `out/${tag}.mp4`);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), onProgress: () => {}});
const comp = await selectComposition({serveUrl, id: 'Oppenheimer', browserExecutable});
const total = comp.durationInFrames;
console.log(`total ${total} fotogramas, scale ${scale}`);
const dir = `out/parts_${tag}`;
fs.mkdirSync(dir, {recursive: true});

// 1) audio completo (rápido)
const audio = `${dir}/audio.wav`;
if (!fs.existsSync(audio)) {
  await renderMedia({composition: comp, serveUrl, codec: 'wav', outputLocation: audio, browserExecutable, concurrency: 4});
  console.log('audio listo');
}
// 2) vídeo por tramos (se reanuda si ya existen)
const parts = [];
for (let a = 0, k = 0; a < total; a += partLen, k++) {
  const b = Math.min(total - 1, a + partLen - 1);
  const f = `${dir}/part-${String(k).padStart(2, '0')}.mp4`;
  parts.push(f);
  if (fs.existsSync(f)) {console.log('ya existe', f); continue;}
  await renderMedia({
    composition: comp, serveUrl, codec: 'h264', outputLocation: f + '.tmp.mp4', frameRange: [a, b], scale, crf, muted: true,
    browserExecutable, concurrency: 4, imageFormat: 'jpeg', jpegQuality: 92,
    onProgress: ({progress}) => process.stdout.write(`\rparte ${k} ${(progress * 100).toFixed(0)}%   `),
  });
  fs.renameSync(f + '.tmp.mp4', f);
  console.log(`\nparte ${k} (${a}-${b}) lista`);
}
// 3) unir
fs.writeFileSync(`${dir}/list.txt`, parts.map((p) => `file '${path.resolve(p)}'`).join('\n'));
execSync(`ffmpeg -v error -y -f concat -safe 0 -i ${dir}/list.txt -i ${audio} -map 0:v -map 1:a -c:v copy -af "alimiter=limit=0.89:level=disabled" -c:a aac -b:a 192k -movflags +faststart ${outFile}`, {stdio: 'inherit'});
console.log('LISTO', outFile);
