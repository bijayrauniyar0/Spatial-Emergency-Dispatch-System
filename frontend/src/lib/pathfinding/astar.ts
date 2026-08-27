// Grid-based A* pathfinding for distance/ETA calculation
// Uses haversine distance as the cost function for a uniform-cost search
// This approximates great-circle paths without requiring real road data

const EARTH_RADIUS_METERS = 6371000;

interface Cell {
  x: number;
  y: number;
  gCost: number; // cost from start
  hCost: number; // heuristic cost to goal
  fCost: number; // g + h
  parent: Cell | null;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

function gridResolution(distance: number): number {
  // Adaptive grid resolution: ~20-30 cells per axis
  // Minimum cell size ~200m, maximum ~5km to keep computation bounded
  const cellSize = Math.max(200, Math.min(5000, distance / 25));
  return cellSize;
}

export function computeRoute(
  from: [lng: number, lat: number],
  to: [lng: number, lat: number],
  options?: { avgSpeedKmh?: number },
): {
  path: [lng: number, lat: number][];
  distanceMeters: number;
  etaSeconds: number;
} {
  const [fromLng, fromLat] = from;
  const [toLng, toLat] = to;
  const speedKmh = options?.avgSpeedKmh ?? 40;

  // Quick straight-line fallback if points are identical
  if (fromLat === toLat && fromLng === toLng) {
    return {
      path: [from],
      distanceMeters: 0,
      etaSeconds: 0,
    };
  }

  // Calculate straight-line distance for simplicity in grid setup
  const straightDistance = haversineDistance(fromLat, fromLng, toLat, toLng);
  const cellSize = gridResolution(straightDistance);

  // Build grid bounding box with padding
  const minLat = Math.min(fromLat, toLat) - (cellSize / EARTH_RADIUS_METERS) * (180 / Math.PI) * 1.2;
  const maxLat = Math.max(fromLat, toLat) + (cellSize / EARTH_RADIUS_METERS) * (180 / Math.PI) * 1.2;
  const minLng = Math.min(fromLng, toLng) - (cellSize / (EARTH_RADIUS_METERS * Math.cos(toRadians((minLat + maxLat) / 2)))) * (180 / Math.PI) * 1.2;
  const maxLng = Math.max(fromLng, toLng) + (cellSize / (EARTH_RADIUS_METERS * Math.cos(toRadians((minLat + maxLat) / 2)))) * (180 / Math.PI) * 1.2;

  const gridWidth = Math.max(2, Math.ceil((maxLng - minLng) / ((cellSize / (EARTH_RADIUS_METERS * Math.cos(toRadians((minLat + maxLat) / 2)))) * (180 / Math.PI))));
  const gridHeight = Math.max(2, Math.ceil((maxLat - minLat) / ((cellSize / EARTH_RADIUS_METERS) * (180 / Math.PI))));

  // Convert lat/lng to grid coordinates
  const startGridX = Math.floor((fromLng - minLng) / ((maxLng - minLng) / gridWidth));
  const startGridY = Math.floor((fromLat - minLat) / ((maxLat - minLat) / gridHeight));
  const goalGridX = Math.floor((toLng - minLng) / ((maxLng - minLng) / gridWidth));
  const goalGridY = Math.floor((toLat - minLat) / ((maxLat - minLat) / gridHeight));

  // Clamp to grid bounds
  const start = {
    x: Math.max(0, Math.min(gridWidth - 1, startGridX)),
    y: Math.max(0, Math.min(gridHeight - 1, startGridY)),
    gCost: 0,
    hCost: 0,
    fCost: 0,
    parent: null,
  };

  const goal = {
    x: Math.max(0, Math.min(gridWidth - 1, goalGridX)),
    y: Math.max(0, Math.min(gridHeight - 1, goalGridY)),
    gCost: 0,
    hCost: 0,
    fCost: 0,
    parent: null,
  };

  // A* search
  const openSet = new Set<string>();
  const closedSet = new Set<string>();
  const nodeMap = new Map<string, Cell>();

  const cellKey = (x: number, y: number) => `${x},${y}`;

  start.hCost = Math.hypot(goal.x - start.x, goal.y - start.y);
  start.fCost = start.hCost;
  nodeMap.set(cellKey(start.x, start.y), start);
  openSet.add(cellKey(start.x, start.y));

  const neighbors = [
    [0, -1], [1, 0], [0, 1], [-1, 0], // cardinal
    [1, -1], [1, 1], [-1, -1], [-1, 1], // diagonals
  ];

  let current: Cell | null = start;

  while (openSet.size > 0) {
    // Find node with lowest f cost
    let lowestF = Infinity;
    let currentKey: string | null = null;
    for (const key of openSet) {
      const node = nodeMap.get(key)!;
      if (node.fCost < lowestF) {
        lowestF = node.fCost;
        currentKey = key;
      }
    }

    if (!currentKey) break;
    current = nodeMap.get(currentKey)!;

    if (current.x === goal.x && current.y === goal.y) {
      break; // Found goal
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    for (const [dx, dy] of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;

      if (nx < 0 || nx >= gridWidth || ny < 0 || ny >= gridHeight) {
        continue;
      }

      const nKey = cellKey(nx, ny);
      if (closedSet.has(nKey)) {
        continue;
      }

      // Cost is 1 for cardinal, sqrt(2) for diagonals (simplified)
      const moveCost = dx === 0 || dy === 0 ? 1 : Math.sqrt(2);
      const tentativeGCost = current.gCost + moveCost;

      let neighbor = nodeMap.get(nKey);
      if (!neighbor) {
        neighbor = {
          x: nx,
          y: ny,
          gCost: tentativeGCost,
          hCost: Math.hypot(goal.x - nx, goal.y - ny),
          fCost: 0,
          parent: current,
        };
        neighbor.fCost = neighbor.gCost + neighbor.hCost;
        nodeMap.set(nKey, neighbor);
        openSet.add(nKey);
      } else if (tentativeGCost < neighbor.gCost) {
        neighbor.gCost = tentativeGCost;
        neighbor.fCost = neighbor.gCost + neighbor.hCost;
        neighbor.parent = current;
        if (closedSet.has(nKey)) {
          closedSet.delete(nKey);
          openSet.add(nKey);
        }
      }
    }
  }

  // Reconstruct path
  const gridPath: Cell[] = [];
  if (current) {
    let node: Cell | null = current;
    while (node) {
      gridPath.unshift(node);
      node = node.parent;
    }
  } else {
    // No path found, return straight line
    gridPath.push(start, goal);
  }

  // Convert grid path back to lat/lng
  const lngPerGrid = (maxLng - minLng) / gridWidth;
  const latPerGrid = (maxLat - minLat) / gridHeight;

  const path: [number, number][] = gridPath.map((cell) => [
    minLng + cell.x * lngPerGrid,
    minLat + cell.y * latPerGrid,
  ]);

  // Calculate total distance by summing haversine between consecutive points
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += haversineDistance(
      path[i][1],
      path[i][0],
      path[i + 1][1],
      path[i + 1][0],
    );
  }

  // Calculate ETA
  const speedMs = (speedKmh * 1000) / 3600;
  const etaSeconds = totalDistance / speedMs;

  return {
    path,
    distanceMeters: totalDistance,
    etaSeconds,
  };
}
