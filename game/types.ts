
export type PlayerId = 'player1' | 'player2';

export type TerrainName = 'PLAINS' | 'FOREST' | 'MOUNTAIN' | 'CITY';

export type UnitName = 'INFANTRY' | 'TANK';

export interface Terrain {
  name: string;
  color: string;
  moveCost: number;
  defenseBonus: number;
}

export interface UnitTypeInfo {
  name: string;
  attack: number;
  defense: number;
  range: number;
  move: number;
  cost: number;
}

export interface Player {
  funds: number;
  color: string;
  textColor: string;
}

export interface Unit {
  id: number;
  type: UnitName;
  owner: PlayerId;
  x: number;
  y: number;
  hp: number;
  hasMoved: boolean;
  hasAttacked: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  turn: PlayerId;
  players: Record<PlayerId, Player>;
  units: Unit[];
  selectedUnitId: number | null;
  movableTiles: Position[];
  attackableTiles: Position[];
  winner: PlayerId | null;
}

export type GameAction =
  | { type: 'SELECT_UNIT'; payload: { unitId: number } }
  | { type: 'DESELECT' }
  | { type: 'MOVE_UNIT'; payload: Position }
  | { type: 'ATTACK'; payload: { targetX: number; targetY: number } }
  | { type: 'WAIT' }
  | { type: 'END_TURN' }
  | { type: 'RESTART' };
