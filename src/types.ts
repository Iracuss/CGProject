/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ShadingModel = 'basic' | 'lambert' | 'phong' | 'standard';

export enum ObjectType {
  CUBE = 'Cube',
  SPHERE = 'Sphere',
  PLANE = 'Plane',
  TORUS = 'Torus'
}

export interface ParsedOBJ {
  vertexCount: number;
  faceCount: number;
  vertices: number[][];
  faces: number[][];
}

export interface SceneSettings {
  ambientIntensity: number;
  pointIntensity: number;
  lightColor: string;
  lightPosition: [number, number, number];
  objectColor: string;
  shadedColor?: string;
  objectType: ObjectType;
  wireframe: boolean;
  autoRotate: boolean;
  roughness: number;
  metalness: number;
  shadingModel: ShadingModel;
}

export const INITIAL_SETTINGS: SceneSettings = {
  ambientIntensity: 0.05,
  pointIntensity: 2.0,
  lightColor: '#ffffff',
  lightPosition: [5, 5, 5],
  objectColor: '#3b82f6', // Tailwind blue-500
  objectType: ObjectType.CUBE,
  wireframe: false,
  autoRotate: false,
  roughness: 0.5,
  metalness: 0.5,
  shadingModel: 'standard',
};
