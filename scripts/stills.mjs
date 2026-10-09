// uso: node scripts/stills.mjs salida.png 330 600 1000 ...  (contact sheet de fotogramas)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const [out, ...frames] = process.argv.slice(2);
const entry = path.resolve('src/index.ts');
const serveUrl = await bundle({entryPoint: entry, onProgress: () => {}});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const comp = await selectComposition({serveUrl, id: 'Oppenheimer', browserExecutable});
console.log('duración total', comp.durationInFrames, 'fotogramas');
const dir = '/tmp/stills';
fs.mkdirSync(dir, {recursive: true});
const files = [];
for (const f of frames) {
  const file = `${dir}/f${f}.png`;
  await renderStill({composition: comp, serveUrl, output: file, frame: Number(f), browserExecutable, imageFormat: 'png'});
  files.push(file);
}
const cols = Math.min(3, files.length);
const rows = Math.ceil(files.length / cols);
const inputs = files.map((f) => `-i ${f}`).join(' ');
const scale = files.map((_, i) => `[${i}]scale=640:360[s${i}]`).join(';');
const lay = files.map((_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|');
const ins = files.map((_, i) => `[s${i}]`).join('');
execSync(`ffmpeg -v error -y ${inputs} -filter_complex "${scale};${ins}xstack=inputs=${files.length}:layout=${lay}[o]" -map "[o]" ${out}`);
console.log('ok', out);
