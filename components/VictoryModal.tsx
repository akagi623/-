
import React from 'react';
import { PlayerId, Player } from '../game/types';

interface VictoryModalProps {
  winner: PlayerId | null;
  winnerInfo: Player | null;
  onRestart: () => void;
}

const VictoryModal: React.FC<VictoryModalProps> = ({ winner, winnerInfo, onRestart }) => {
  if (!winner || !winnerInfo) return null;

  const winnerText = winner === 'player1' ? 'プレイヤー1' : 'プレイヤー2';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className={`bg-gray-800 p-8 rounded-lg shadow-xl text-center border-t-8 ${winnerInfo.color.replace('bg-', 'border-')}`}>
        <h2 className="text-4xl font-bold mb-4 text-yellow-300">ゲームクリア！</h2>
        <p className="text-2xl mb-8"><span className={`${winnerInfo.textColor} font-bold`}>{winnerText}</span> の勝利です！</p>
        <button
          onClick={onRestart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg"
        >
          もう一度プレイ
        </button>
      </div>
    </div>
  );
};

export default VictoryModal;
