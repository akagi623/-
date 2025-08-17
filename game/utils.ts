
import { Unit, UnitName, PlayerId, TerrainName, Position } from './types';
import { UNIT_TYPES, MAP_WIDTH, MAP_HEIGHT, TERRAINS } from './constants';

let unitIdCounter = 0;
export const createUnit = (type: UnitName, owner: PlayerId, x: number, y: number): Unit => ({
  id: unitIdCounter++,
  type,
  owner,
  x,
  y,
  hp: 10,
  hasMoved: false,
  hasAttacked: false,
});

export const resetUnitIdCounter = () => {
    unitIdCounter = 0;
};

export const calculateMovableRange = (startUnit: Unit, map: TerrainName[][], units: Unit[]): Position[] => {
  const unitType = UNIT_TYPES[startUnit.type];
  const startPos = { x: startUnit.x, y: startUnit.y };
  const movePoints = unitType.move;
  const queue: { pos: Position; cost: number }[] = [{ pos: startPos, cost: 0 }];
  const visited = new Set<string>([`${startPos.x},${startPos.y}`]);
  const reachable: Position[] = [];
  const enemyPositions = new Set(units.filter(u => u.owner !== startUnit.owner).map(u => `${u.x},${u.y}`));

  while (queue.length > 0) {
    const { pos, cost } = queue.shift()!;
    const neighbors = [{ x: pos.x + 1, y: pos.y }, { x: pos.x - 1, y: pos.y }, { x: pos.x, y: pos.y + 1 }, { x: pos.x, y: pos.y - 1 }];
    for (const neighbor of neighbors) {
      const { x, y } = neighbor;
      const key = `${x},${y}`;
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT && !visited.has(key)) {
        const terrain = TERRAINS[map[y][x]];
        const newCost = cost + terrain.moveCost;
        if (newCost <= movePoints) {
           visited.add(key);
           // Can't move through enemies, but can move onto empty tiles
           if (!enemyPositions.has(key)) {
             queue.push({ pos: neighbor, cost: newCost });
             reachable.push(neighbor);
           }
        }
      }
    }
  }
  return reachable;
};

export const calculateAttackableRange = (startUnit: Unit, units: Unit[]): Position[] => {
  const unitType = UNIT_TYPES[startUnit.type];
  const attackRange = unitType.range;
  return units.filter(targetUnit => 
    targetUnit.owner !== startUnit.owner &&
    (Math.abs(startUnit.x - targetUnit.x) + Math.abs(startUnit.y - targetUnit.y)) <= attackRange
  ).map(u => ({ x: u.x, y: u.y }));
};

export const calculateDamage = (attacker: Unit, defender: Unit, map: TerrainName[][]): number => {
    const attackerType = UNIT_TYPES[attacker.type];
    const defenderType = UNIT_TYPES[defender.type];
    const terrain = TERRAINS[map[defender.y][defender.x]];
    const defenseBonus = terrain.defenseBonus;
    const damage = Math.max(1, attackerType.attack - (defenderType.defense + defenseBonus));
    return damage;
};
