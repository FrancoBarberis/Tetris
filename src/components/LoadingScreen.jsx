

import React from "react";
import gengarGif from "../assets/GengarLoaderEdit.gif";

export default function LoadingScreen({ progress = 0 }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95">
      <img
        src={gengarGif}
        alt="Cargando..."
        className="w-[420px] h-[420px] mb-8"
        style={{ imageRendering: "pixelated" }}
      />
      <p className="text-white text-2xl font-bold mb-6">Cargando recursos...</p>
      <div className="w-80 h-6 bg-gray-800 overflow-hidden border border-purple-700 mb-4" style={{ borderRadius: '2px' }}>
        <div
          className="h-full bg-purple-500 transition-all duration-200"
          style={{ width: `${progress}%`, borderRadius: '1px 0 0 1px' }}
        />
      </div>
      <span className="text-purple-200 mb-2">{Math.round(progress)}%</span>
    </div>
  );
}
