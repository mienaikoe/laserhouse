export interface Point {
  x: number; // in mm
  y: number; // in mm
}

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
}
