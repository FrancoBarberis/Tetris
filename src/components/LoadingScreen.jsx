

import React from "react";

import gengarGif from "../assets/GengarLoaderEdit.gif";
import poketrisLogo from "../assets/poketrisLOGO.png";

export default function LoadingScreen({ progress = 0 }) {
  const logoRef = React.useRef();
  const [logoWidth, setLogoWidth] = React.useState(220);
  React.useEffect(() => {
    if (logoRef.current) {
      setLogoWidth(logoRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (logoRef.current) setLogoWidth(logoRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95 min-h-screen min-w-full max-h-screen overflow-y-auto">
      <div className="flex flex-col items-center w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-2 max-h-screen overflow-y-auto">
        <img
          ref={logoRef}
          src={poketrisLogo}
          alt="Poketris Logo"
          className="w-full max-w-[500px] h-auto drop-shadow-xl mt-2 md:mt-6 lg:mt-8 xl:mt-10"
          style={{ imageRendering: "crisp-edges" }}
        />
        <img
          src={gengarGif}
          alt="Loading..."
          className="w-full max-w-[300px] h-auto mb-2"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="h-5 bg-gray-800 overflow-hidden border border-purple-700 mb-2 relative" style={{ borderRadius: '2px', width: logoWidth }}>
          <div
            className="h-full bg-purple-500 transition-all duration-200"
            style={{ width: `${progress}%`, borderRadius: '1px 0 0 1px' }}
          />
          <span
            className="absolute left-0 top-0 w-full h-full flex items-center justify-center text-xs font-bold text-purple-100 drop-shadow"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
