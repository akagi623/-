
import React from 'react';
import { Unit, TerrainName, Position, Player, PlayerId } from '../game/types';
import { TILE_SIZE, TERRAINS } from '../game/constants';
import UnitComponent from './Unit';

interface BoardProps {
  map: TerrainName[][];
  units: Unit[];
  players: Record<PlayerId, Player>;
  onTileClick: (x: number, y: number, unitOnTile: Unit | undefined) => void;
  selectedUnitId: number | null;
  movableTiles: Position[];
  attackableTiles: Position[];
}

const Board: React.FC<BoardProps> = ({ map, units, players, onTileClick, selectedUnitId, movableTiles, attackableTiles }) => {
  const movableSet = new Set(movableTiles.map(t => `${t.x},${t.y}`));
  const attackableSet = new Set(attackableTiles.map(t => `${t.x},${t.y}`));
  
  const selectedUnit = units.find(u => u.id === selectedUnitId);

  return (
    <div className="relative inline-block border-4 border-gray-700 shadow-2xl bg-gray-800 p-2 rounded-lg">
      <div 
        className="relative" 
        style={{ width: TILE_SIZE * map[0].length, height: TILE_SIZE * map.length }}
      >
        {/* Terrain and overlay grid */}
        {map.map((row, y) => (
          <div key={y} className="flex">
            {row.map((terrainKey, x) => {
              const isMovable = movableSet.has(`${x},${y}`);
              const isAttackable = attackableSet.has(`${x},${y}`);
              const unitOnTile = units.find(u => u.x === x && u.y === y);
              return (
                <div
                  key={x}
                  className="relative cursor-pointer"
                  style={{ width: TILE_SIZE, height: TILE_SIZE }}
                  onClick={() => onTileClick(x, y, unitOnTile)}
                >
                  <div className="absolute inset-0 border border-black/20" style={{ backgroundColor: TERRAINS[terrainKey].color }}></div>
                  {isMovable && <div className="absolute inset-0 bg-blue-400/50 pointer-events-none ring-2 ring-blue-300"></div>}
                  {isAttackable && <div className="absolute inset-0 bg-red-500/60 pointer-events-none ring-2 ring-red-400 animate-pulse"></div>}
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Units and selection indicator */}
        <div className="absolute inset-0 pointer-events-none">
          {units.map(unit => (
            <div key={unit.id} style={{ position: 'absolute', left: `${unit.x * TILE_SIZE}px`, top: `${unit.y * TILE_SIZE}px`, width: TILE_SIZE, height: TILE_SIZE }}>
              <UnitComponent unit={unit} playerColor={players[unit.owner].color} />
            </div>
          ))}
          {selectedUnit && (
             <div 
                className="absolute border-4 border-yellow-400 pointer-events-none animate-pulse rounded-sm" 
                style={{ left: `${selectedUnit.x * TILE_SIZE}px`, top: `${selectedUnit.y * TILE_SIZE}px`, width: TILE_SIZE, height: TILE_SIZE, transition: 'all 0.2s ease-out' }}
             ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
