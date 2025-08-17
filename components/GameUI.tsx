
import React from 'react';
import { Unit, PlayerId, Player } from '../game/types';
import { UNIT_TYPES } from '../game/constants';

interface GameUIProps {
  turn: PlayerId;
  players: Record<PlayerId, Player>;
  onEndTurnClick: () => void;
  onWaitClick: () => void;
  selectedUnit: Unit | undefined;
}

const GameUI: React.FC<GameUIProps> = ({ turn, players, onEndTurnClick, onWaitClick, selectedUnit }) => {
  const currentPlayer = players[turn];
  const selectedUnitData = selectedUnit ? UNIT_TYPES[selectedUnit.type] : null;
  const showWaitButton = selectedUnit && selectedUnit.hasMoved && !selectedUnit.hasAttacked;

  return (
    <div className="w-full md:w-64 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex flex-col space-y-4 border-t-4 border-gray-700">
      <div>
        <h2 className={`font-bold text-2xl p-2 rounded ${currentPlayer.color} ${currentPlayer.textColor}`}>
          {turn === 'player1' ? 'プレイヤー1' : 'プレイヤー2'} のターン
        </h2>
        <p className="mt-2 text-lg">資金: <span className="font-mono">{players[turn].funds} G</span></p>
      </div>
      <div className="bg-gray-700 p-3 rounded-md min-h-[120px]">
        <h3 className="font-bold border-b border-gray-600 pb-1 mb-2">選択中ユニット</h3>
        {selectedUnit && selectedUnitData ? (
          <div className="text-sm space-y-1">
            <p>タイプ: <span className="font-semibold">{selectedUnitData.name}</span></p>
            <p>HP: <span className="font-semibold">{selectedUnit.hp} / 10</span></p>
            <p>攻撃/防御: <span className="font-semibold">{selectedUnitData.attack} / {selectedUnitData.defense}</span></p>
            <p>移動/射程: <span className="font-semibold">{selectedUnitData.move} / {selectedUnitData.range}</span></p>
            <p>状態: <span className="font-semibold">{selectedUnit.hasMoved ? (selectedUnit.hasAttacked ? '行動終了' : '攻撃/待機待ち') : '行動可能'}</span></p>
          </div>
        ) : <p className="text-gray-400">ユニットを選択してください。</p>}
      </div>
      {showWaitButton && (
        <button onClick={onWaitClick} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md">
          待機
        </button>
      )}
      <button onClick={onEndTurnClick} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md">
        ターン終了
      </button>
    </div>
  );
};

export default GameUI;
