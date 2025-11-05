
// Utilidad para cargar recursos y reportar progreso

import gengarGif from '../assets/GengarLoaderEdit.gif';
import poketrisLogo from '../assets/poketrisLOGO.png';
import eeveeImg from '../assets/Eevee 4k.jpg';
import eeveeVid from '../assets/EeveeVid.mp4';

export async function loadResources(onProgress) {
  // Lista de recursos a cargar (puedes agregar más)
  const resources = [
    gengarGif,
    poketrisLogo,
    eeveeImg,
    eeveeVid,
    // ...agrega más si es necesario
  ];
  let loaded = 0;
  const total = resources.length;

  // Simulación sincronizada con el GIF
  const GENGAR_GIF_DURATION = 1440; // ms, 20% más rápido, debe coincidir con App.jsx
  const MIN_CYCLES = 2;
  const MIN_TIME = GENGAR_GIF_DURATION * MIN_CYCLES;
  const start = Date.now();

  // Cargar imágenes y videos (real)
  await Promise.all(resources.map(src => {
    return new Promise(resolve => {
      const ext = src.split('.').pop().toLowerCase();
      if (ext === 'mp4') {
        setTimeout(() => { loaded++; resolve(); }, 500);
      } else {
        const img = new window.Image();
        img.onload = () => { loaded++; resolve(); };
        img.onerror = () => { loaded++; resolve(); };
        img.src = src;
      }
    });
  }));

  // Animar la barra para que llegue a 100% justo al terminar los 2 ciclos del gif (o antes si la carga real es más lenta)
  let elapsed = Date.now() - start;
  if (elapsed < MIN_TIME) {
    // Simular avance paulatino
    let fakeProgress = 0;
    const interval = 30;
    const steps = Math.floor((MIN_TIME - elapsed) / interval);
    for (let i = 1; i <= steps; i++) {
      await new Promise(res => setTimeout(res, interval));
      fakeProgress = Math.round((i / steps) * 100);
      onProgress(fakeProgress);
    }
    onProgress(100);
  } else {
    // Si la carga real fue más lenta, mostrar 100% directo
    onProgress(100);
  }
}
