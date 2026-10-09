# REPORTE_AUDIOS

## Método
- Whisper **no** se pudo usar: `faster-whisper` se instala pero el modelo no se descarga (huggingface.co devuelve 403). Se usó la alternativa: detección de silencios con numpy/ffmpeg + reparto de las palabras del guion proporcionalmente (ponderado por longitud de palabra y pausas de puntuación) y anclado a las pausas reales detectadas. Los tiempos por palabra son aproximados (error típico ≈ ±0,2–0,4 s entre pausas).
- Sin transcripción automática no pude *escuchar* los audios. La asignación a escenas se hizo por (1) orden cronológico de generación en ElevenLabs, (2) duración vs. nº de palabras de cada escena (2,2–2,6 palabras/s en las 10 primeras, coherente con la voz). Todo encaja de forma consistente; si alguna toma no corresponde, basta cambiar el orden en `scripts/process_audio.py`.
- Limpieza: recorte de silencios (≈120 ms de aire al inicio, 150 ms al final), fundidos de 15 ms, loudnorm a -16 LUFS / pico ≤ -1,5 dBTP, 48 kHz mono WAV.

## Tabla de asignación
| Escena | Archivo origen | Duración limpia | Palabras guion |
|---|---|---|---|
| 01 · GANCHO | `520f0df9_T08_50_32_.mp3` | 52.2 s | 129 |
| 02 · EL MIEDO | `eb9fb5a7_T08_57_54_.mp3` | 63.9 s | 147 |
| 03 · LOS DOS HOMBRES | `a910a15f_T08_58_58_.mp3` | 67.4 s | 151 |
| 04 · CÓMO FUNCIONA UNA BOMBA ATÓMICA | `b7db0dad_T08_59_45_.mp3` | 40.3 s | 104 |
| 05 · EL PROBLEMA DEL COMBUSTIBLE | `77af0356_T09_00_14_.mp3` | 58.6 s | 133 |
| 06 · EL PROBLEMA DE LA DETONACIÓN | `4cf2e3c9_T09_00_51_.mp3` | 52.3 s | 129 |
| 07 · TRINITY, Y EL GIRO | `29a0aa2e_T09_01_12_.mp3` | 41.8 s | 98 |
| 08 · HIROSHIMA Y NAGASAKI | `8a532b09_T09_05_58_.mp3` | 35.9 s | 87 |
| 09 · ¿VILLANO? LO QUE PASÓ DESPUÉS | `0410ffde_T09_06_39_.mp3` | 71.4 s | 177 |
| 10 · CIERRE | `acceffac_T09_07_12_.mp3` | 53.4 s | 126 |
| 11 · LLAMADA A LA ACCIÓN | `32273e2d_T09_08_10_.mp3` | 11.3 s | 39 |

## Tomas descartadas
- `8d630659…` (idéntico byte a byte a `520f0df9…`, escena 1): duplicado subido dos veces; eliminado a petición del usuario.
- No había tomas alternativas: 11 archivos = 11 escenas.

## Dudas / decisiones
- `guion_para_remotion_oppenheimer.md` y el .zip no se recibieron; se usó el texto del `.docx` como fuente de verdad (mismas 11 escenas). Los audios llegaron sueltos (sin .zip) y están en `audio_elevenlabs/raw/`.
- Escena 11: dura 11,3 s para 39 palabras (3,4 palabras/s, más rápido que el resto). El hueco `[TU PRÓXIMO VÍDEO]` probablemente se leyó como "tu próximo vídeo"; no verificable sin ASR. Los subtítulos de esa frase se reparten igualmente.
- No falta ninguna escena.
