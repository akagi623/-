
import { Terrain, UnitTypeInfo, TerrainName, UnitName, Player, PlayerId } from './types';

export const TILE_SIZE = 50;
export const MAP_WIDTH = 8;
export const MAP_HEIGHT = 7;

export const TERRAINS: Record<TerrainName, Terrain> = {
  PLAINS: { name: '平地', color: '#8FBC8F', moveCost: 1, defenseBonus: 0 },
  FOREST: { name: '森', color: '#228B22', moveCost: 2, defenseBonus: 2 },
  MOUNTAIN: { name: '山', color: '#A0522D', moveCost: 99, defenseBonus: 4 }, // Impassable
  CITY: { name: '都市', color: '#A9A9A9', moveCost: 1, defenseBonus: 3 },
};

export const UNIT_TYPES: Record<UnitName, UnitTypeInfo> = {
  INFANTRY: { name: '歩兵', attack: 5, defense: 2, range: 1, move: 3, cost: 100 },
  TANK: { name: '戦車', attack: 8, defense: 6, range: 1, move: 5, cost: 400 },
};

export const PLAYERS_INITIAL: Record<PlayerId, Player> = {
    player1: { funds: 1000, color: 'bg-blue-600', textColor: 'text-blue-200' },
    player2: { funds: 1000, color: 'bg-red-600', textColor: 'text-red-200' },
};

export const initialMap: TerrainName[][] = [
  ['PLAINS', 'PLAINS', 'FOREST', 'CITY', 'MOUNTAIN', 'PLAINS', 'PLAINS', 'PLAINS'],
  ['PLAINS', 'FOREST', 'FOREST', 'PLAINS', 'PLAINS', 'CITY', 'PLAINS', 'PLAINS'],
  ['PLAINS', 'PLAINS', 'PLAINS', 'PLAINS', 'PLAINS', 'PLAINS', 'FOREST', 'FOREST'],
  ['CITY', 'PLAINS', 'PLAINS', 'PLAINS', 'PLAINS', 'PLAINS', 'PLAINS', 'CITY'],
  ['FOREST', 'FOREST', 'PLAINS', 'PLAINS', 'PLAINS', 'PLAINS', 'PLAINS', 'PLAINS'],
  ['PLAINS', 'PLAINS', 'CITY', 'PLAINS', 'PLAINS', 'FOREST', 'FOREST', 'PLAINS'],
  ['PLAINS', 'PLAINS', 'PLAINS', 'MOUNTAIN', 'CITY', 'FOREST', 'PLAINS', 'PLAINS'],
];
