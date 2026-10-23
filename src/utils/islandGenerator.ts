// Procedural island shape generation with organic coastlines
// Uses pseudo-random noise based on seed for consistent shapes

class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

export function generateIslandPath(
  centerX: number,
  centerY: number,
  baseRadius: number,
  seed: string
): string {
  const random = new Random(hashString(seed));
  const points: { x: number; y: number }[] = [];
  const numPoints = 16 + Math.floor(random.next() * 8);
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radiusVariation = 0.7 + random.next() * 0.6;
    const noise = Math.sin(angle * 3) * 0.15 + Math.sin(angle * 5) * 0.1;
    const r = baseRadius * (radiusVariation + noise);
    
    points.push({
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
    });
  }

  // Create smooth path using quadratic curves
  let path = `M ${points[0].x},${points[0].y}`;
  
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const controlX = (current.x + next.x) / 2 + (random.next() - 0.5) * baseRadius * 0.2;
    const controlY = (current.y + next.y) / 2 + (random.next() - 0.5) * baseRadius * 0.2;
    
    path += ` Q ${controlX},${controlY} ${next.x},${next.y}`;
  }
  
  path += ' Z';
  return path;
}

export function generateHatchingLines(
  bounds: { x: number; y: number; width: number; height: number },
  density: number = 3
): string[] {
  const lines: string[] = [];
  const spacing = density;
  
  for (let y = bounds.y; y < bounds.y + bounds.height; y += spacing) {
    lines.push(`M ${bounds.x},${y} L ${bounds.x + bounds.width},${y}`);
  }
  
  return lines;
}

export function generateShorelineRings(
  centerX: number,
  centerY: number,
  baseRadius: number,
  seed: string,
  numRings: number = 2
): string[] {
  const paths: string[] = [];
  
  for (let i = 1; i <= numRings; i++) {
    const ringRadius = baseRadius + i * 3;
    paths.push(generateIslandPath(centerX, centerY, ringRadius, seed + i));
  }
  
  return paths;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Generate cloud shapes for stormy weather
export function generateCloudPath(
  x: number,
  y: number,
  width: number,
  seed: string
): string {
  const random = new Random(hashString(seed));
  const numBumps = 5 + Math.floor(random.next() * 3);
  const bumpWidth = width / numBumps;
  const height = width * 0.4;
  
  let path = `M ${x},${y + height}`;
  
  for (let i = 0; i < numBumps; i++) {
    const bumpX = x + i * bumpWidth;
    const bumpHeight = height * (0.6 + random.next() * 0.4);
    const controlX1 = bumpX + bumpWidth * 0.25;
    const controlY1 = y + height - bumpHeight;
    const controlX2 = bumpX + bumpWidth * 0.75;
    const controlY2 = y + height - bumpHeight;
    const endX = bumpX + bumpWidth;
    const endY = y + height;
    
    path += ` C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
  }
  
  path += ` L ${x + width},${y + height} L ${x},${y + height} Z`;
  return path;
}

// Collision detection for layout
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function checkCollision(box1: Box, box2: Box, padding: number = 10): boolean {
  return !(
    box1.x + box1.width + padding < box2.x ||
    box2.x + box2.width + padding < box1.x ||
    box1.y + box1.height + padding < box2.y ||
    box2.y + box2.height + padding < box1.y
  );
}

export function findNonOverlappingPosition(
  existingBoxes: Box[],
  size: number,
  bounds: { width: number; height: number },
  maxAttempts: number = 50
): { x: number; y: number } | null {
  const random = new Random(Date.now());
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = size + random.next() * (bounds.width - size * 2);
    const y = size + random.next() * (bounds.height - size * 2);
    
    const newBox: Box = { x: x - size, y: y - size, width: size * 2, height: size * 2 };
    
    const hasCollision = existingBoxes.some(box => checkCollision(newBox, box));
    
    if (!hasCollision) {
      return { x, y };
    }
  }
  
  return null;
}
