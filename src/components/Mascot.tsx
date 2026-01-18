// src/components/Mascot.tsx
import React from 'react';
import { SleepDebtLevel } from '../types';

interface MascotProps {
  level: SleepDebtLevel;
}

const Mascot: React.FC<MascotProps> = ({ level }) => {
  // Map each level to its corresponding sloth image
  const getImageUrl = () => {
    switch(level) {
      case SleepDebtLevel.Low:
      case SleepDebtLevel.Minimal:
        return "/src/images/Happy-sloth.png";
      case SleepDebtLevel.Moderate:
        return "/src/images/sloth_2.png";
      case SleepDebtLevel.High:
        return "/src/images/sloth_3.png";
      case SleepDebtLevel.Severe:
        return "/src/images/sloth_4.png";
      default:
        return "/src/images/Happy-sloth.png";
    }
  };

  const imageUrl = getImageUrl();
  
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center select-none">
      <div className="relative w-full h-full">
          <img 
            key={level}
            src={imageUrl} 
            alt="Sloth Mascot" 
            className="w-full h-full object-contain drop-shadow-2xl animate-poof"
          />
      </div>

       <style>{`
        @keyframes poof {
          0% { 
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
          100% { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-poof {
          animation: poof 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Mascot;