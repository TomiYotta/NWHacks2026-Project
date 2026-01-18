import React from 'react';
import { SleepDebtLevel } from '../types';

interface MascotProps {
  level: SleepDebtLevel;
}

const Mascot: React.FC<MascotProps> = ({ level }) => {
  const imageUrl = "/src/images/Happy-sloth.png";
  
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center select-none">
      
      {/* SVG Filters for "Messy Fur" effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="messy-fur">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          </filter>
        </defs>
      </svg>

      <div className={`relative w-full h-full transition-all duration-500
          ${level === SleepDebtLevel.Severe ? 'animate-vibrate' : ''}
      `}>
          
          {/* Base Image with conditional Filters */}
          {/* High/Severe get the 'messy-fur' filter to look ragged */}
          <img 
            src={imageUrl} 
            alt="Sloth Mascot" 
            style={{
                filter: (level === SleepDebtLevel.High || level === SleepDebtLevel.Severe) ? 'url(#messy-fur)' : 'none'
            }}
            className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-500
                ${level === SleepDebtLevel.Moderate ? 'brightness-95 sepia-[.2]' : ''}
                ${level === SleepDebtLevel.High ? 'brightness-90 contrast-125 saturate-50' : ''}
                ${level === SleepDebtLevel.Severe ? 'contrast-150 saturate-150' : ''}
            `}
          />

          {/* --- STATE 2: MODERATE (Overdue for Sleep) --- */}
          {/* Heavy Droopy Eyelids */}
          {level === SleepDebtLevel.Moderate && (
             <>
                <div className="absolute top-[44%] left-[36%] w-[12%] h-[10%] bg-[#d4a574] rounded-b-2xl z-20 border-b-2 border-black/20 shadow-md opacity-90" />
                <div className="absolute top-[44%] right-[36%] w-[12%] h-[10%] bg-[#d4a574] rounded-b-2xl z-20 border-b-2 border-black/20 shadow-md opacity-90" />
             </>
          )}

          {/* --- STATE 3: HIGH (Extended Vigil) --- */}
          {/* No eyelids, but Eyes are Red, Baggy, and Fur is Messy (via SVG filter above) */}
          {level === SleepDebtLevel.High && (
             <>
                {/* Red Overlay on Eyes */}
                <div className="absolute top-[45%] left-[37%] w-[11%] h-[11%] bg-red-500 mix-blend-multiply opacity-40 rounded-full blur-sm z-10" />
                <div className="absolute top-[45%] right-[37%] w-[11%] h-[11%] bg-red-500 mix-blend-multiply opacity-40 rounded-full blur-sm z-10" />
                
                {/* Dark Circles / Bags */}
                <div className="absolute top-[54%] left-[36%] w-[12%] h-[8%] bg-purple-900/50 blur-md rounded-full" />
                <div className="absolute top-[54%] right-[36%] w-[12%] h-[8%] bg-purple-900/50 blur-md rounded-full" />
                
                {/* Floating confusion symbols (fitful sleepiness) */}
                <div className="absolute top-8 right-12 text-3xl font-bold text-gray-400 animate-pulse opacity-60">?</div>
                <div className="absolute top-14 right-8 text-2xl font-bold text-gray-500 animate-pulse opacity-60" style={{animationDelay: '0.5s'}}>!</div>
             </>
          )}

          {/* --- STATE 4: SEVERE (Extreme Deprivation) --- */}
          {/* Caffeine, Wired Eyes, Shaking */}
          {level === SleepDebtLevel.Severe && (
             <>
                 {/* Wide Staring Eyes (White ring to force eye open look) */}
                 <div className="absolute top-[43%] left-[36%] w-[12%] h-[13%] border-[3px] border-white/80 rounded-full shadow-[0_0_12px_rgba(255,0,0,0.6)] z-20" />
                 <div className="absolute top-[43%] right-[36%] w-[12%] h-[13%] border-[3px] border-white/80 rounded-full shadow-[0_0_12px_rgba(255,0,0,0.6)] z-20" />

                 {/* Props */}
                 <div className="absolute bottom-8 -right-6 text-5xl drop-shadow-lg animate-bounce" style={{animationDuration: '0.4s'}}>🥤</div>
                 <div className="absolute bottom-8 -left-6 text-5xl drop-shadow-lg animate-bounce" style={{animationDuration: '0.5s'}}>☕</div>
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl animate-ping opacity-75">⚡</div>
             </>
          )}
      </div>

       <style>{`
        @keyframes vibrate {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 3px) rotate(-2deg); }
          40% { transform: translate(-3px, -3px) rotate(2deg); }
          60% { transform: translate(3px, 3px) rotate(-2deg); }
          80% { transform: translate(3px, -3px) rotate(2deg); }
          100% { transform: translate(0); }
        }
        .animate-vibrate {
          animation: vibrate 0.08s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Mascot;