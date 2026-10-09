# Vídeo en máxima calidad (1080p, CRF 18, ~490 MB)

GitHub no admite archivos de más de 100 MB, así que está partido en trozos de 90 MB.
Descarga TODAS las partes (`.parte00.bin` … `.parte05.bin`) en la misma carpeta y únelas:

**Mac / Linux**
```bash
cat oppenheimer_final.mp4.parte*.bin > oppenheimer_final.mp4
```
**Windows (CMD)**
```bat
copy /b oppenheimer_final.mp4.parte00.bin + oppenheimer_final.mp4.parte01.bin + oppenheimer_final.mp4.parte02.bin + oppenheimer_final.mp4.parte03.bin + oppenheimer_final.mp4.parte04.bin + oppenheimer_final.mp4.parte05.bin oppenheimer_final.mp4
```
Comprobación opcional: `sha256sum oppenheimer_final.mp4` debe coincidir con `SHA256_video_completo.txt`.
