

import React from "react";

import gengarGif from "../assets/GengarLoaderEdit.gif";
import poketrisLogo from "../assets/poketrisLOGO.png";

export default function LoadingScreen({ progress = 0 }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95 min-h-screen min-w-full">
      <div className="flex flex-col items-center w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-2">
        <img
          src={poketrisLogo}
          alt="Poketris Logo"
          className="w-full max-w-[500px] h-auto drop-shadow-xl mt-2 md:mt-8 lg:mt-12 xl:mt-16"
          style={{ imageRendering: "crisp-edges" }}
        />
        <img
          src={gengarGif}
          alt="Loading..."
          className="w-full max-w-[300px] h-auto mb-3"
          style={{ imageRendering: "pixelated" }}
        />
        <p className="text-white text-lg sm:text-xl font-bold mb-4 text-center">Loading resources...</p>
        <div className="w-full max-w-[220px] h-5 bg-gray-800 overflow-hidden border border-purple-700 mb-2" style={{ borderRadius: '2px' }}>
          <div
            className="h-full bg-purple-500 transition-all duration-200"
            style={{ width: `${progress}%`, borderRadius: '1px 0 0 1px' }}
          />
        </div>
        <span className="text-purple-200 mb-1 text-center">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
