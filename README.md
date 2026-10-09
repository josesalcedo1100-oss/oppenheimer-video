# Oppenheimer y la bomba atómica — vídeo en Remotion

Vídeo documental de ~9,7 min (1920×1080, 30 fps) generado 100 % por código: motion graphics vectoriales, música y efectos sintetizados, y la narración de ElevenLabs.

## Cómo abrirlo
```bash
npm install
npm run studio          # abre Remotion Studio (composición "Oppenheimer")
```
Necesita Chromium. En este contenedor se usa `/opt/pw-browsers/chromium_headless_shell-1194/…/headless_shell` (ver `remotion.config.ts`); en tu equipo puedes borrar esa línea y Remotion usará el suyo.

## Cómo volver a renderizar
```bash
node scripts/render.mjs --tag=final --crf=18          # por tramos de 1500 fotogramas + audio, unidos con ffmpeg
node scripts/render.mjs --scale=0.25 --crf=30 --tag=prueba   # prueba rápida en baja resolución
```
Se reanuda solo: si un tramo ya existe en `out/parts_<tag>/` no se vuelve a renderizar.
Para ver un fotograma: `npx remotion still src/index.ts Oppenheimer out/f.png --frame=1200`.
Contact sheet de varios fotogramas: `node scripts/stills.mjs out/hoja.png 330 600 1000`.

## Qué puedes reemplazar
| Qué | Dónde | Notas |
|---|---|---|
| Narración | `audio_elevenlabs/raw/` → `python3 scripts/process_audio.py` | Regenera `public/audio/scene-XX.wav` y `manifest.json` (limpieza, -16 LUFS, tiempos por palabra). La duración de cada escena sale del audio: el vídeo se reajusta solo. Si cambias el orden/nombres, edita la lista `order` del script. |
| Música | `public/music/*.wav` (drone, strings, pulse, human, resolve, riser) | Se generan con `python3 scripts/make_sound.py`. Puedes sustituir cualquier pista por la tuya con el mismo nombre (se repite en bucle); los niveles por escena y el ducking están en `src/Mix.tsx`. |
| Efectos | `public/sfx/*.wav` | Mismos nombres. |
| Imágenes / vídeo reales | `public/img/`, `public/video/` y `src/assets.ts` | Enlaza el archivo en `ASSETS`; si es `null` se usa la recreación vectorial. |
| Texto de los rótulos | `src/scenes/SceneXX.tsx` | Los tiempos se enlazan a palabras de la locución con `cue('palabra')`. |

## Estructura
- `src/layout.ts` calcula la duración de cada escena (voz + márgenes) y `cueIn()` localiza palabras en el tiempo.
- `src/Mix.tsx` voz + música por escena con ducking automático calculado desde `manifest.json`.
- `src/components/` LíneaDeTiempo, RótuloDeFecha, Documento (con sello), PantallaDividida, MapaSVG, Contador, Silueta, Destello, Subtítulos, ChainSim (ratoneras), Fisión, uranio/plutonio, cañón vs. implosión, reactor.
- `REPORTE_AUDIOS.md` tabla de asignación de audios, método de tiempos y decisiones.

## Notas
- El hueco `[TU PRÓXIMO VÍDEO]` está como rótulo discreto en la pantalla final (20 s con espacio libre a ambos lados para las tarjetas de YouTube).
- Las cifras en pantalla coinciden con la locución; los documentos son recreaciones propias.
