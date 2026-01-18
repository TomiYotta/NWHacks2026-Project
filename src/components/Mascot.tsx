import React from 'react';
import { SleepDebtLevel } from '../types';

interface MascotProps {
  level: SleepDebtLevel;
}

const Mascot: React.FC<MascotProps> = ({ level }) => {
  const imageUrl = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Sloth.png";
  
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
                <div className="absolute top-[39%] left-[29%] w-[16%] h-[12%] bg-[#8B6E50] rounded-b-2xl z-20 border-b-4 border-black/30 shadow-md" />
                <div className="absolute top-[39%] right-[28%] w-[16%] h-[12%] bg-[#8B6E50] rounded-b-2xl z-20 border-b-4 border-black/30 shadow-md" />
             </>
          )}

          {/* --- STATE 3: HIGH (Extended Vigil) --- */}
          {/* No eyelids, but Eyes are Red, Baggy, and Fur is Messy (via SVG filter above) */}
          {level === SleepDebtLevel.High && (
             <>
                {/* Red Overlay on Eyes */}
                <div className="absolute top-[41%] left-[30%] w-[14%] h-[14%] bg-red-600 mix-blend-multiply opacity-50 rounded-full blur-[1px] z-10" />
                <div className="absolute top-[41%] right-[29%] w-[14%] h-[14%] bg-red-600 mix-blend-multiply opacity-50 rounded-full blur-[1px] z-10" />
                
                {/* Dark Circles / Bags */}
                <div className="absolute top-[53%] left-[29%] w-[16%] h-[6px] bg-purple-900/40 blur-[3px] rounded-full" />
                <div className="absolute top-[53%] right-[28%] w-[16%] h-[6px] bg-purple-900/40 blur-[3px] rounded-full" />
                
                {/* Floating Zzz (but broken/small to show fitful sleepiness) */}
                <div className="absolute -top-2 right-12 text-2xl font-bold text-slate-500 animate-pulse">?</div>
                <div className="absolute top-2 right-8 text-xl font-bold text-slate-600 animate-pulse delay-75">!</div>
             </>
          )}

          {/* --- STATE 4: SEVERE (Extreme Deprivation) --- */}
          {/* Caffeine, Wired Eyes, Shaking */}
          {level === SleepDebtLevel.Severe && (
             <>
                 {/* Wide Staring Eyes (White ring to force eye open look) */}
                 <div className="absolute top-[39%] left-[29%] w-[16%] h-[16%] border-[3px] border-white/90 rounded-full shadow-[0_0_15px_red] z-20" />
                 <div className="absolute top-[39%] right-[28%] w-[16%] h-[16%] border-[3px] border-white/90 rounded-full shadow-[0_0_15px_red] z-20" />

                 {/* Props */}
                 <div className="absolute bottom-4 -right-4 text-6xl drop-shadow-lg animate-bounce" style={{animationDuration: '0.4s'}}>🥤</div>
                 <div className="absolute bottom-4 -left-4 text-6xl drop-shadow-lg animate-bounce" style={{animationDuration: '0.5s'}}>☕</div>
                 <div className="absolute top-0 right-1/2 text-4xl animate-ping">⚡</div>
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