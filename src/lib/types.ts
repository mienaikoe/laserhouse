export type Point = [number, number];

export interface Feature {
  type: "cut" | "engrave";
  origin: Point;
  width: number; // in mm
  height: number; // in mm
}

export interface Wall {
  point1: Point;
  point2: Point;
  floor?: Floor;
  features: Feature[];
}

export interface Floor {
  name: string;
  wallHeight: number; // in mm
  materialThickness: number; // in mm
  jointTabLength: number; // in mm
  walls: Wall[];
  internalWalls: Wall[];
  pageWidth: number; // in mm
  pageHeight: number; // in mm
}

export interface Hitbox {
  origin: Point;
  width: number; // in mm
  height: number; // in mm
  panel: Wall | Floor;
  type: 'wall' | 'floor';
  index?: number; // optional index for walls, used for rendering
}
