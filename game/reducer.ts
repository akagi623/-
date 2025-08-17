
import { GameState, GameAction, PlayerId } from './types';
import { initialMap, MAP_WIDTH, PLAYERS_INITIAL } from './constants';
import { calculateMovableRange, calculateAttackableRange, calculateDamage, createUnit, resetUnitIdCounter } from './utils';

export const getInitialState = (): GameState => {
    resetUnitIdCounter();
    return {
        turn: 'player1',
        players: JSON.parse(JSON.stringify(PLAYERS_INITIAL)), // Deep copy
        units: [
            createUnit('INFANTRY', 'player1', 1, 3),
            createUnit('TANK', 'player1', 2, 2),
            createUnit('INFANTRY', 'player2', 6, 3),
            createUnit('TANK', 'player2', 5, 4),
        ],
        selectedUnitId: null,
        movableTiles: [],
        attackableTiles: [],
        winner: null,
    };
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.winner && action.type !== 'RESTART') {
    return state;
  }

  switch (action.type) {
    case 'SELECT_UNIT': {
      const unit = state.units.find(u => u.id === action.payload.unitId);
      if (unit && unit.owner === state.turn && !unit.hasMoved && !unit.hasAttacked) {
        const movableTiles = calculateMovableRange(unit, initialMap, state.units);
        const attackableTiles = calculateAttackableRange(unit, state.units);
        return { ...state, selectedUnitId: unit.id, movableTiles, attackableTiles };
      }
      return state;
    }
    case 'DESELECT': {
      return { ...state, selectedUnitId: null, movableTiles: [], attackableTiles: [] };
    }
    case 'MOVE_UNIT': {
      const { x, y } = action.payload;
      const newUnits = state.units.map(u => u.id === state.selectedUnitId ? { ...u, x, y, hasMoved: true } : u);
      const movedUnit = newUnits.find(u => u.id === state.selectedUnitId)!;
      const attackableTiles = calculateAttackableRange(movedUnit, newUnits);
      return { ...state, units: newUnits, movableTiles: [], attackableTiles };
    }
    case 'ATTACK': {
        const { targetX, targetY } = action.payload;
        const attacker = state.units.find(u => u.id === state.selectedUnitId);
        const defender = state.units.find(u => u.x === targetX && u.y === targetY);
        if (!attacker || !defender) return state;

        const damage = calculateDamage(attacker, defender, initialMap);
        const newHp = defender.hp - damage;

        let newUnits = state.units.map(u => {
            if (u.id === defender.id) return { ...u, hp: newHp };
            if (u.id === attacker.id) return { ...u, hasMoved: true, hasAttacked: true };
            return u;
        }).filter(u => u.hp > 0);

        const player1UnitsLeft = newUnits.some(u => u.owner === 'player1');
        const player2UnitsLeft = newUnits.some(u => u.owner === 'player2');
        let winner: PlayerId | null = null;
        if (!player1UnitsLeft) winner = 'player2';
        else if (!player2UnitsLeft) winner = 'player1';

        return { ...state, units: newUnits, selectedUnitId: null, movableTiles: [], attackableTiles: [], winner };
    }
    case 'WAIT': {
        return {
            ...state,
            units: state.units.map(u => u.id === state.selectedUnitId ? { ...u, hasMoved: true, hasAttacked: true } : u),
            selectedUnitId: null,
            movableTiles: [],
            attackableTiles: [],
        };
    }
    case 'END_TURN': {
      const nextTurn = state.turn === 'player1' ? 'player2' : 'player1';
      const currentTurn = state.turn;
      const cityIncome = initialMap.flat().reduce((acc, tile, index) => {
        if (tile === 'CITY') {
          const x = index % MAP_WIDTH;
          const y = Math.floor(index / MAP_WIDTH);
          const occupyingUnit = state.units.find(u => u.x === x && u.y === y && u.owner === currentTurn);
          if (occupyingUnit) return acc + 100;
        }
        return acc;
      }, 0);
      const baseIncome = 500;
      const totalIncome = baseIncome + cityIncome;
      return {
        ...state,
        turn: nextTurn,
        selectedUnitId: null,
        movableTiles: [],
        attackableTiles: [],
        units: state.units.map(u => ({ ...u, hasMoved: false, hasAttacked: false })),
        players: { ...state.players, [currentTurn]: { ...state.players[currentTurn], funds: state.players[currentTurn].funds + totalIncome } }
      };
    }
    case 'RESTART': {
        return getInitialState();
    }
    default:
      throw new Error('Unhandled action type');
  }
}
