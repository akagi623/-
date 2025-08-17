
import React, { useReducer } from 'react';
import { Unit } from './game/types';
import { initialMap } from './game/constants';
import { gameReducer, getInitialState } from './game/reducer';
import Board from './components/Board';
import GameUI from './components/GameUI';
import VictoryModal from './components/VictoryModal';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  const handleTileClick = (x: number, y: number, unitOnTile: Unit | undefined) => {
    const { selectedUnitId, movableTiles, attackableTiles, turn, units } = state;
    const selectedUnit = units.find(u => u.id === selectedUnitId);

    if (selectedUnit) {
      const isMovable = movableTiles.some(t => t.x === x && t.y === y);
      const isAttackable = attackableTiles.some(t => t.x === x && t.y === y);

      if (isAttackable && unitOnTile && unitOnTile.owner !== turn) {
        dispatch({ type: 'ATTACK', payload: { targetX: x, targetY: y } });
      } else if (isMovable && !unitOnTile) {
        dispatch({ type: 'MOVE_UNIT', payload: { x, y } });
      } else if (unitOnTile && unitOnTile.id === selectedUnitId) {
        // Allow deselecting by clicking the selected unit again, if it hasn't acted.
        if (!selectedUnit.hasMoved && !selectedUnit.hasAttacked) {
          dispatch({ type: 'DESELECT' });
        }
      } else if (unitOnTile && unitOnTile.owner === turn) {
        // Select another of your own units
        dispatch({ type: 'SELECT_UNIT', payload: { unitId: unitOnTile.id } });
      } else {
        // Clicked an empty tile or enemy unit outside of range
        dispatch({ type: 'DESELECT' });
      }
    } else {
      // No unit is selected, so try to select one
      if (unitOnTile && unitOnTile.owner === turn) {
        dispatch({ type: 'SELECT_UNIT', payload: { unitId: unitOnTile.id } });
      }
    }
  };

  const selectedUnit = state.units.find(u => u.id === state.selectedUnitId);
  const winnerInfo = state.winner ? state.players[state.winner] : null;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <VictoryModal 
        winner={state.winner} 
        winnerInfo={winnerInfo} 
        onRestart={() => dispatch({ type: 'RESTART' })} 
      />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <Board
          map={initialMap}
          units={state.units}
          players={state.players}
          onTileClick={handleTileClick}
          selectedUnitId={state.selectedUnitId}
          movableTiles={state.movableTiles}
          attackableTiles={state.attackableTiles}
        />
        <GameUI
          turn={state.turn}
          players={state.players}
          onEndTurnClick={() => dispatch({ type: 'END_TURN' })}
          onWaitClick={() => dispatch({ type: 'WAIT' })}
          selectedUnit={selectedUnit}
        />
      </div>
    </div>
  );
}
