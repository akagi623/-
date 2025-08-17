
import React from 'react';
import { Unit } from '../game/types';
import { UNIT_TYPES } from '../game/constants';

interface UnitProps {
  unit: Unit;
  playerColor: string;
}

const UnitComponent: React.FC<UnitProps> = ({ unit, playerColor }) => {
  const isTank = UNIT_TYPES[unit.type].name === '戦車';
  const isActionDone = unit.hasMoved || unit.hasAttacked;

  const unitIcon = isTank ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-8v8m-4-8v8m-3 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div
      className={`absolute w-full h-full flex items-center justify-center transition-all duration-300 ease-in-out ${isActionDone ? 'opacity-60' : 'opacity-100'} pointer-events-none`}
    >
      <div className={`w-10/12 h-10/12 rounded-full ${playerColor} flex items-center justify-center shadow-lg border-2 border-white/50`}>
        {unitIcon}
      </div>
      <div className="absolute -bottom-1 w-full flex justify-center pointer-events-none">
        <div className="bg-black/70 text-white text-[10px] px-1 rounded-sm">{unit.hp}</div>
      </div>
    </div>
  );
};

export default UnitComponent;
