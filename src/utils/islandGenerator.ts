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
  seed: string,
  variant: number = 0
): string {
  const random = new Random(hashString(seed) + variant);
  const points: { x: number; y: number }[] = [];
  
  // Vary island shape characteristics based on variant
  const numPoints = 12 + Math.floor(random.next() * 12);
  const jaggedness = variant % 3 === 0 ? 0.8 : variant % 3 === 1 ? 0.5 : 0.3;
  const roundness = 1 - jaggedness;
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radiusVariation = 0.6 + random.next() * 0.7;
    
    // Different noise patterns for variety
    let noise = 0;
    if (variant % 4 === 0) {
      noise = Math.sin(angle * 3) * 0.2 + Math.sin(angle * 7) * 0.1;
    } else if (variant % 4 === 1) {
      noise = Math.cos(angle * 5) * 0.15 + Math.sin(angle * 2) * 0.15;
    } else if (variant % 4 === 2) {
      noise = Math.sin(angle * 4) * 0.18 + Math.cos(angle * 6) * 0.08;
    } else {
      noise = Math.sin(angle * 2) * 0.12 + Math.sin(angle * 8) * 0.12;
    }
    
    const r = baseRadius * (radiusVariation + noise * jaggedness);
    
    points.push({
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
    });
  }

  // Create smooth path using quadratic curves with varying control points
  let path = `M ${points[0].x},${points[0].y}`;
  
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const controlOffset = baseRadius * 0.2 * roundness;
    const controlX = (current.x + next.x) / 2 + (random.next() - 0.5) * controlOffset;
    const controlY = (current.y + next.y) / 2 + (random.next() - 0.5) * controlOffset;
    
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
  maxAttempts: number = 100,
  padding: number = 60
): { x: number; y: number } | null {
  const random = new Random(Date.now());
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const x = size + padding + random.next() * (bounds.width - size * 2 - padding * 2);
    const y = size + padding + random.next() * (bounds.height - size * 2 - padding * 2);
    
    const newBox: Box = { 
      x: x - size - padding / 2, 
      y: y - size - padding / 2, 
      width: size * 2 + padding, 
      height: size * 2 + padding 
    };
    
    const hasCollision = existingBoxes.some(box => checkCollision(newBox, box, padding));
    
    if (!hasCollision) {
      return { x, y };
    }
  }
  
  return null;
}

// Generate cross-hatching for richer sea texture
export function generateSeaHatching(
  x: number,
  y: number,
  width: number,
  height: number,
  spacing: number = 8
): string[] {
  const lines: string[] = [];
  
  // Horizontal hatching
  for (let yPos = y; yPos < y + height; yPos += spacing) {
    lines.push(`M ${x},${yPos} L ${x + width},${yPos}`);
  }
  
  // Diagonal hatching
  for (let offset = -height; offset < width; offset += spacing * 2) {
    lines.push(`M ${x + offset},${y} L ${x + offset + height},${y + height}`);
  }
  
  return lines;
}
