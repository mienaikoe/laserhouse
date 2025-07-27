export type Point = [number, number];

export interface Feature {
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
  walls: Wall[];
  pageWidth: number; // in mm
  pageHeight: number; // in mm
}

export interface Hitbox {
  origin: Point;
  width: number; // in mm
  height: number; // in mm
  panel: Wall | Floor;
  type: 'wall' | 'floor';
}
