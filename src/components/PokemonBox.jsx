import pokeballIcon from "../assets/pokeball.png";
import { usePokeballs } from "../contexts/PokeballContext";

// Configuración de colores para cada tipo de pokeball
const POKEBALL_COLORS = {
  normal: { top: "#EE1C25", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
  super: { top: "#2A4BA0", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
  ultra: { top: "#3B3B3B", bottom: "#FFF", band: "#FFD700", button: "#FFF", buttonBorder: "#222" },
  master: { top: "#A040A0", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
};

// Componente SVG reutilizable para pokeballs
function PokeballSVG({ type, size = 32, idPrefix = '' }) {
  const colors = POKEBALL_COLORS[type] || POKEBALL_COLORS.normal;
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`${idPrefix}top-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.top} />
          <stop offset="100%" stopColor={colors.top} />
        </linearGradient>
        <linearGradient id={`${idPrefix}bottom-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.bottom} />
          <stop offset="100%" stopColor={colors.bottom} />
        </linearGradient>
      </defs>
      <path d="M 4,24 a 20,20 0 1,1 40,0" fill={`url(#${idPrefix}top-${type})`} stroke={colors.band} strokeWidth="2.5" />
      <path d="M 44,24 a 20,20 0 1,1 -40,0" fill={`url(#${idPrefix}bottom-${type})`} stroke={colors.band} strokeWidth="2.5" />
      <rect x="4" y="22.5" width="40" height="3" fill={colors.band} />
      <circle cx="24" cy="24" r="7" fill={colors.button} stroke={colors.buttonBorder} strokeWidth="2" />
    </svg>
  );
}

function PokeballButton({ type, label, color, disabled, onClick, style }) {
  return (
    <button
      className={`z-30 flex flex-col items-center justify-center rounded focus:outline-none transition-transform relative ${disabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:scale-110 cursor-pointer"}`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{ padding: '6px', margin: 0, width: 'fit-content', height: 'fit-content', background: 'rgba(30,30,40,0.7)', borderRadius: '8px', ...style }}
    >
      <PokeballSVG type={type} size={32} idPrefix="btn-" />
      {/* Contador debajo del SVG con más separación */}
      <span
        className="text-white font-bold text-xs drop-shadow"
        style={{ 
          marginTop: '4px',
          textShadow: '0 0 4px #000, 1px 1px 2px #000',
          lineHeight: '1',
          fontSize: '10px'
        }}
      >
        {label}
      </span>
    </button>
  );
}

import React, { useEffect, useRef } from "react";
import { TYPE_COLORS, TYPE_NAMES_ES, TYPE_NAMES_EN } from "../utils/typeColors";
import { useLanguage } from "../contexts/LanguageContext";

export default function PokemonBox({ pokemon, onChangePokemon, onCapture, disabled = false }) {
  // Determinar género random según la pokeapi species
  const [genderSymbol, setGenderSymbol] = React.useState({ symbol: null, color: null });
  // Efecto para obtener el género desde la species y asignar el símbolo
  useEffect(() => {
    if (!pokemon) return;
    setGenderSymbol({ symbol: null, color: null }); // Reset al cambiar de Pokémon
    fetch(`http://localhost:3000/api/cry?url=https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
      .then(res => res.json())
      .then(species => {
        const rate = species.gender_rate;
        // gender_rate: -1 = sin género, 0 = solo macho, 8 = solo hembra, 1-7 = mixto
        let symbol = null;
        let color = null;
        if (rate === -1) {
          symbol = null;
        } else if (rate === 0) {
          symbol = '♂';
          color = '#3498db';
        } else if (rate === 8) {
          symbol = '♀';
          color = '#e74c3c';
        } else {
          // Mixto: probabilidad según rate
          const femaleProb = rate / 8;
          if (Math.random() < femaleProb) {
            symbol = '♀';
            color = '#e74c3c';
          } else {
            symbol = '♂';
            color = '#3498db';
          }
        }
        setGenderSymbol({ symbol, color });
      })
      .catch(() => setGenderSymbol({ symbol: null, color: null }));
  }, [pokemon]);
  const [shakeOnEnter, setShakeOnEnter] = React.useState(false);
  const [entering, setEntering] = React.useState(false);
  const [hideSprite, setHideSprite] = React.useState(false);
  const { balls, useBall } = usePokeballs();
  const [currentHP, setCurrentHP] = React.useState(null);
  const [defeated, setDefeated] = React.useState(false);
  const [resettingHP, setResettingHP] = React.useState(true);
  const [damaged, setDamaged] = React.useState(false);
  const [damageAnimations, setDamageAnimations] = React.useState([]);
  const { language } = useLanguage();
  const TYPE_NAMES = language === "es" ? TYPE_NAMES_ES : TYPE_NAMES_EN;
  const isFirstPokemon = React.useRef(true);

  // Calcular el HP base del Pokémon
  const hpStat = pokemon?.stats
    ? pokemon.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 100
    : 100;

  // Animación de entrada al cambiar de Pokémon (pero no en el primer render)
  React.useEffect(() => {
    if (isFirstPokemon.current) {
      isFirstPokemon.current = false;
      return;
    }
    setEntering(true);
    const timeoutEnter = setTimeout(() => setEntering(false), 700); // fade in más suave
    return () => clearTimeout(timeoutEnter);
  }, [pokemon?.id]);

  // Shake y cry tras entrada
  React.useEffect(() => {
    if (entering) {
      const timeoutShake = setTimeout(() => setShakeOnEnter(true), 700);
      const timeoutUnshake = setTimeout(() => setShakeOnEnter(false), 880);
      return () => {
        clearTimeout(timeoutShake);
        clearTimeout(timeoutUnshake);
      };
    } else {
      setShakeOnEnter(false);
    }
  }, [entering]);

  // Reset de HP y barra instantánea al cambiar de Pokémon
  React.useEffect(() => {
    setResettingHP(true);
    setCurrentHP(hpStat);
    requestAnimationFrame(() => setResettingHP(false));
  }, [hpStat, pokemon?.id]);

  // Animación de daño no letal
  React.useEffect(() => {
    if (currentHP !== null && currentHP > 0 && currentHP < hpStat) {
      setDamaged(true);
      const timeout = setTimeout(() => setDamaged(false), 180);
      return () => clearTimeout(timeout);
    }
  }, [currentHP, hpStat]);

  // Animación de derrota: el shake ocurre después de la animación de la barra
  React.useEffect(() => {
    if (currentHP === 0) {
      // Espera el tiempo de la animación de la barra antes de hacer el shake
      const timeoutShake = setTimeout(() => setDefeated(true), 600);
      // Espera el tiempo total de la animación para ocultar el sprite
      const timeoutHide = setTimeout(() => setHideSprite(true), 600 + 480); // 600ms barra + 480ms caída
      return () => {
        clearTimeout(timeoutShake);
        clearTimeout(timeoutHide);
      };
    } else {
      setDefeated(false);
      setHideSprite(false);
    }
  }, [currentHP, pokemon]);

  // hpStat ya está declarado arriba

  // Controla si el HP se está reseteando por cambio de Pokémon
  React.useEffect(() => {
    setResettingHP(true);
    setCurrentHP(hpStat);
    // Espera un frame para quitar el flag y evitar animación
    const timeout = setTimeout(() => setResettingHP(false), 10);
    return () => clearTimeout(timeout);
  }, [hpStat, pokemon]);

  // Animación de derrota: el shake ocurre después de la animación de la barra
  React.useEffect(() => {
    if (currentHP === 0) {
      // Espera el tiempo de la animación de la barra antes de hacer el shake
      const timeout = setTimeout(() => setDefeated(true), 600);
      return () => clearTimeout(timeout);
    } else {
      setDefeated(false);
    }
  }, [currentHP, pokemon]);
  const handleFlee = async () => {
    const { default: getRandomPokemon } = await import("../utils/pokemons");
    getRandomPokemon().then((poke) => {
      if (typeof onChangePokemon === 'function') onChangePokemon(poke);
    });
  };

  useEffect(() => {
    if (pokemon) {
      const cryUrl = `http://localhost:3000/api/cry?url=https://pokeapi.co/media/sounds/cries/${pokemon.id}.mp3`;
      fetch(cryUrl, { method: "HEAD" })
        .then((res) => {
          if (res.ok) {
            console.log(
              `Cry disponible para ${pokemon.name} (id ${pokemon.id}):`,
              cryUrl
            );
          } else {
            console.log(`Sin cry para ${pokemon.name} (id ${pokemon.id})`);
          }
        })
        .catch(() => {
          console.log(
            `Error al verificar cry para ${pokemon.name} (id ${pokemon.id})`
          );
        });
    }
  }, [pokemon]);
  const audioRef = useRef(null);
  useEffect(() => {
    if (pokemon && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [pokemon]);

  if (!pokemon) {
    return (
      <p className="text-white">
        {language === "es" ? "Cargando Pokémon..." : "Loading Pokémon..."}
      </p>
    );
  }

  // Elimina duplicados: hpStat y resettingHP ya están declarados arriba
  const percent = currentHP !== null ? Math.max(0, Math.round((currentHP / hpStat) * 100)) : 100;
  // Color dinámico para la barra de vida
  let hpColor = "bg-green-400";
  if (percent <= 50 && percent > 20) hpColor = "bg-yellow-300";
  if (percent <= 20) hpColor = "bg-red-500";

  // Defense factor: suma de defensa y defensa especial
  const defenseFactor = pokemon.stats
    ? (pokemon.stats.find((stat) => stat.stat.name === "defense")?.base_stat ||
        0) +
      (pokemon.stats.find((stat) => stat.stat.name === "special-defense")
        ?.base_stat || 0)
    : 0;

  // Daño según tipo de ball
  const getBallDamage = (ballIndex) => {
    // Precios: 5, 15, 50, 100
    // Daño proporcional al precio: precio * 1.4 = daño base (40% más de daño)
    const prices = [5, 15, 50, 100];
    const baseDamage = Math.round(prices[ballIndex] * 1.4); // 7, 21, 70, 140
    
    // El defenseFactor reduce el daño como porcentaje
    // defenseFactor es la suma de defense + special-defense
    const reductionPercent = Math.min(0.5, defenseFactor * 0.001); // Max 50% de reducción
    const damage = Math.max(5, Math.round(baseDamage * (1 - reductionPercent)));
    
    return damage;
  };

  const handleUseBall = (ballIndex) => {
    if (balls[ballIndex] === 0 || currentHP === 0) return;
    const damage = getBallDamage(ballIndex);
    
    // Agregar animación de daño
    const damageId = Date.now();
    setDamageAnimations(prev => [...prev, { id: damageId, damage }]);
    setTimeout(() => {
      setDamageAnimations(prev => prev.filter(d => d.id !== damageId));
    }, 1000);
    
    setCurrentHP((prev) => {
      const newHP = Math.max(0, prev - damage);
      if (newHP === 0) {
        // Shake de daño normal al principio
        setDamaged(true);
        setTimeout(() => setDamaged(false), 180);
        // Shake letal tras vaciar la barra
        setTimeout(() => setDefeated(true), 600);
        
        // Enviar notificación de captura al componente padre
        const captureName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        const captureText = language === "es" 
          ? `¡Capturaste a ${captureName}!` 
          : `You caught ${captureName}!`;
        
        if (onCapture) {
          onCapture({
            text: captureText,
            sprite: pokemon.sprites.front_default,
            ballType: ['normal', 'super', 'ultra', 'master'][ballIndex]
          });
          // Limpiar notificación después de 3 segundos
          setTimeout(() => {
            onCapture(null);
          }, 3000);
        }
        
        // Esperar a que la animación de la barra y la animación de derrota terminen antes de cambiar el Pokémon
        setTimeout(() => {
          if (typeof onChangePokemon === 'function') {
            const getRandomPokemonAsync = async () => {
              const { default: getRandomPokemon } = await import("../utils/pokemons");
              const poke = await getRandomPokemon();
              onChangePokemon(poke);
            };
            getRandomPokemonAsync();
          }
        }, 1300); // 600ms barra + 700ms animación sprite
      }
      return newHP;
    });
    useBall(ballIndex);
  };

  // Tipos del Pokémon
  const types = pokemon.types || [];

  return (
    <div
      className="bg-gradient-to-l from-blue-950 via-red-900 to-black rounded p-3 flex flex-col items-center mr-2 xl:mr-5 max-h-fit z-20 opacity-85"
      style={{ width: '240px', minWidth: '240px', maxWidth: '240px', position: 'relative' }}
    >
      {/* Botón de huir */}
      <div className="w-full flex justify-center mb-2">
          <button
            className="bg-gradient-to-r from-red-700 to-black text-white font-bold px-3 py-2 rounded shadow hover:scale-105 hover:brightness-150 transition-transform text-xs uppercase cursor-pointer mb-2 min-w-[54px] xl:min-w-[60px] max-w-[80px] text-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
            onClick={handleFlee}
            disabled={entering || disabled}
            style={{paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px'}}
          >
            {language === "es" ? "Huir" : "Flee"}
          </button>
      </div>
      {/* Botones de pokeballs en una franja oscura */}
      <div className="w-full h-fit flex flex-row justify-center mb-2 gap-2 p-2 rounded" style={{ background: 'rgba(20, 20, 30, 0.85)' }}>
        <PokeballButton
          type="normal"
          color="#E53E3E"
          disabled={balls[0] === 0 || currentHP === 0 || disabled}
          onClick={() => handleUseBall(0)}
          label={balls[0]}
        />
        <PokeballButton
          type="super"
          color="#3182CE"
          disabled={balls[1] === 0 || currentHP === 0 || disabled}
          onClick={() => handleUseBall(1)}
          label={balls[1]}
        />
        <PokeballButton
          type="ultra"
          color="#ECC94B"
          disabled={balls[2] === 0 || currentHP === 0 || disabled}
          onClick={() => handleUseBall(2)}
          label={balls[2]}
        />
        <PokeballButton
          type="master"
          color="#9F7AEA"
          disabled={balls[3] === 0 || currentHP === 0 || disabled}
          onClick={() => handleUseBall(3)}
          label={balls[3]}
        />
      </div>
      <div
        style={{ opacity: 1, width: "100%" }}
        className="flex flex-col items-center brightness-100"
      >
        <audio
          ref={audioRef}
          src={`https://pokeapi.co/media/sounds/cries/${pokemon.id}.mp3`}
          preload="auto"
        />
        <p className="text-yellow-600 font-bold text-2xl mb-2 drop-shadow cursor-default text-center w-full">
          <span style={{
            minWidth: '56px',
            display: 'inline-block',
            fontVariantNumeric: 'tabular-nums',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            N° {pokemon.id}
          </span>
        </p>
        {pokemon.sprites.front_default ? (
          <div
            className="flex items-center justify-center bg-yellow-200 rounded border-4 border-red-900 mb-2 shadow-md overflow-hidden"
            style={{ position: 'relative', minHeight: '144px', width: '144px', height: '144px', maxWidth: '208px', maxHeight: '208px' }}
          >
            {(!hideSprite && pokemon.sprites.front_default) ? (
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className={`w-36 h-36 xl:w-52 xl:h-52 drop-shadow${defeated && currentHP === 0 ? ' defeated-pokemon' : ''}${damaged && !defeated ? ' damaged-pokemon' : ''}${entering ? ' entering-pokemon' : ''}${shakeOnEnter ? ' shake-on-enter' : ''}`}
                style={{ imageRendering: "pixelated", position: 'absolute', left: 0, top: 0, zIndex: 2, transition: defeated ? 'transform 0.7s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.3s' : 'none', width: '100%', height: '100%' }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML +=
                    '<span class=\"text-red-600\">Error al cargar sprite</span>';
                }}
              />
            ) : (
              <span
                className="drop-shadow flex items-center justify-center"
                style={{ position: 'absolute', left: 0, top: 0, zIndex: 2, opacity: 0, width: '100%', height: '100%' }}
              ></span>
            )}
            {/* Animación CSS */}
            <style>{`
              .shake-on-enter {
                animation: shake-damage 0.18s 1;
              }
              .defeated-pokemon {
                animation: shake-poke 0.14s 2, fall-poke 0.48s 0.32s forwards;
              }
              .damaged-pokemon {
                animation: shake-damage 0.18s 1;
              }
              .entering-pokemon {
                animation: enter-poke 0.7s cubic-bezier(.68,-0.55,.27,1.55);
              }
              @keyframes shake-poke {
                0% { transform: translateX(0); }
                15% { transform: translateX(-5px); }
                30% { transform: translateX(5px); }
                45% { transform: translateX(-4px); }
                60% { transform: translateX(4px); }
                75% { transform: translateX(-2px); }
                90% { transform: translateX(2px); }
                100% { transform: translateX(0); }
              }
              @keyframes shake-damage {
                0% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-3px); }
                100% { transform: translateX(0); }
              }
              @keyframes enter-poke {
                0% { opacity: 0; transform: translateY(32px); }
                60% { opacity: 1; transform: translateY(-6px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              @keyframes fall-poke {
                0% { opacity: 1; transform: translateY(0); }
                60% { opacity: 1; transform: translateY(40px); }
                80% { opacity: 0.7; transform: translateY(90px); }
                100% { opacity: 0; transform: translateY(130px); }
              }
            `}</style>
          </div>
        ) : (
          <div className="w-40 h-40 xl:w-56 xl:h-56 flex items-center justify-center bg-gray-700 text-white mb-2 rounded border-2 border-gray-300">
            <span>Sin sprite</span>
          </div>
        )}
        {/* Barra de vida estilo Pokémon */}
        <div className="w-full flex flex-col items-start mt-2 relative">
          {/* Fila superior: símbolo de género alineado a la derecha sobre la barra de vida */}
          <div className="flex flex-row items-center justify-between w-full mb-1 gap-x-4" style={{whiteSpace:'nowrap'}}>
            <div className="text-xs font-bold text-white drop-shadow tracking-wide font-mono" style={{whiteSpace:'nowrap'}}>
              HP: <span className="text-yellow-300">{currentHP !== null ? currentHP : hpStat}</span> / {hpStat}
            </div>
            <div className="flex items-center justify-end w-full" style={{whiteSpace:'nowrap'}}>
              <span
                className="inline-block w-[2em] text-right font-extrabold text-2xl select-none"
                style={{ color: genderSymbol.symbol ? genderSymbol.color : 'transparent', fontWeight: 'bold', whiteSpace: 'nowrap' }}
              >
                {genderSymbol.symbol ? genderSymbol.symbol : '♂'}
              </span>
            </div>
          </div>
          <div className="relative w-full h-6 border-4 border-black rounded-none overflow-hidden bg-gray-800 shadow-inner">
            {/* Borde interior blanco */}
            <div className="absolute inset-0 border border-white rounded-none pointer-events-none" />
            {/* Brillo superior */}
            <div className="absolute left-0 top-0 w-full h-2 bg-white bg-opacity-20 rounded-none pointer-events-none" />
            {/* Barra de vida */}
            <div
              className={`absolute left-0 top-0 h-full ${hpColor} transition-all duration-500 shadow-lg`}
              style={{ width: `${percent}%`, zIndex: 10, transition: resettingHP ? 'none' : 'width 0.5s' }}
            />
            
            {/* Animaciones de daño */}
            {damageAnimations.map(anim => (
              <div
                key={anim.id}
                className="absolute text-red-500 font-bold text-xl pointer-events-none z-50"
                style={{
                  left: '50%',
                  top: '-8px',
                  transform: 'translateX(-50%)',
                  animation: 'damage-float 1s ease-out forwards',
                  textShadow: '0 0 8px #000, 0 0 4px #f00, 1px 1px 0 #fff, -1px -1px 0 #fff'
                }}
              >
                -{anim.damage}
              </div>
            ))}
          </div>
          
          {/* Animación CSS para el daño flotante */}
          <style>{`
            @keyframes damage-float {
              0% { opacity: 1; transform: translateX(-50%) translateY(0); }
              100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
            }
          `}</style>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full mt-1 mb-0">
          <span></span>
          <span className="text-yellow-700 capitalize font-bold drop-shadow cursor-default text-center text-lg" style={{minWidth: '140px', maxWidth: '180px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            {pokemon.name}
          </span>
          <span></span>
        </div>
        {/* Tipos al final */}
        <div className="flex gap-2 mt-2 justify-center w-full flex-nowrap min-h-[32px]">
          {(pokemon.types || []).map((t) => (
            <span
              key={t.type.name}
              className="px-2 rounded text-xs font-bold uppercase shadow cursor-default w-[90px] truncate text-center overflow-hidden"
              style={{
                background: TYPE_COLORS[t.type.name] || "#fff",
                color: "#222",
                letterSpacing: "1px",
                filter: "brightness(1.1)",
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '6px',
                paddingBottom: '6px',
                lineHeight: '1',
              }}
            >
              {TYPE_NAMES[t.type.name] || t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
