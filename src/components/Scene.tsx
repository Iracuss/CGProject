/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Center } from '@react-three/drei';
import { SceneSettings, ObjectType, ParsedOBJ, ShadingModel } from '../types';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface SceneProps {
  settings: SceneSettings;
  objData?: ParsedOBJ | null;
}

export interface SceneHandle {
  resetCamera: () => void;
  screenshot: () => void;
}

function ShadedMaterial({ shadingModel, color, wireframe, roughness, metalness }: {
  shadingModel: ShadingModel;
  color: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
}) {
  // roughness=0 → shininess=300 (sharp), roughness=1 → shininess=1 (fully matte but non-zero)
  const shininess = Math.max(1, Math.round((1 - roughness) * 300));
  if (shadingModel === 'basic')    return <meshBasicMaterial color={color} wireframe={wireframe} />;
  if (shadingModel === 'lambert')  return <meshLambertMaterial color={color} wireframe={wireframe} />;
  if (shadingModel === 'phong')    return <meshPhongMaterial color={color} wireframe={wireframe} shininess={shininess} />;
  return <meshStandardMaterial color={color} wireframe={wireframe} roughness={roughness} metalness={metalness} />;
}

function Shape({ type, color, wireframe, roughness, metalness, shadingModel }: {
  type: ObjectType;
  color: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
  shadingModel: ShadingModel;
}) {
  return (
    <mesh castShadow receiveShadow>
      {type === ObjectType.CUBE && <boxGeometry args={[2, 2, 2]} />}
      {type === ObjectType.SPHERE && <sphereGeometry args={[1.5, 32, 32]} />}
      {type === ObjectType.PLANE && <planeGeometry args={[3, 3]} />}
      {type === ObjectType.TORUS && <torusGeometry args={[1.2, 0.4, 16, 100]} />}
      <ShadedMaterial shadingModel={shadingModel} color={color} wireframe={wireframe} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

function OBJMesh({ objData, color, wireframe, roughness, metalness, shadingModel }: {
  objData: ParsedOBJ;
  color: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
  shadingModel: ShadingModel;
}) {
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();

    if (objData.vertices && objData.vertices.length > 0) {
      const positions = new Float32Array(objData.vertices.flat());
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      geom.computeBoundingBox();
      if (geom.boundingBox) {
        const center = new THREE.Vector3();
        geom.boundingBox.getCenter(center);
        geom.translate(-center.x, -center.y, -center.z);

        const size = new THREE.Vector3();
        geom.boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        geom.scale(scale, scale, scale);
      }
    }

    if (objData.faces && objData.faces.length > 0) {
      const indices = new Uint32Array(objData.faces.flat());
      geom.setIndex(new THREE.BufferAttribute(indices, 1));
    }

    geom.computeVertexNormals();
    return geom;
  }, [objData]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <ShadedMaterial shadingModel={shadingModel} color={color} wireframe={wireframe} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

function ScreenshotCapture({ glRef }: { glRef: React.RefObject<THREE.WebGLRenderer | null> }) {
  const { gl } = useThree();
  glRef.current = gl;
  return null;
}

function SceneInner({ settings, objData, orbitRef, glRef }: SceneProps & {
  orbitRef: React.RefObject<OrbitControlsImpl | null>;
  glRef: React.RefObject<THREE.WebGLRenderer | null>;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
      <OrbitControls
        ref={orbitRef}
        makeDefault
        autoRotate={settings.autoRotate}
        autoRotateSpeed={2}
        enableDamping
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        dampingFactor={0.05}
      />

      <ambientLight intensity={settings.ambientIntensity} />
      <pointLight
        position={settings.lightPosition}
        intensity={settings.pointIntensity}
        castShadow
        color={settings.lightColor}
        shadow-mapSize={[1024, 1024]}
      />

      <mesh position={settings.lightPosition}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={settings.lightColor} />
      </mesh>

      <Center top>
        {objData ? (
          <OBJMesh
            objData={objData}
            color={settings.objectColor}
            wireframe={settings.wireframe}
            roughness={settings.roughness}
            metalness={settings.metalness}
            shadingModel={settings.shadingModel}
          />
        ) : (
          <Shape
            type={settings.objectType}
            color={settings.objectColor}
            wireframe={settings.wireframe}
            roughness={settings.roughness}
            metalness={settings.metalness}
            shadingModel={settings.shadingModel}
          />
        )}
      </Center>

      <Grid
        infiniteGrid
        fadeDistance={30}
        fadeStrength={8}
        sectionSize={2}
        sectionColor="#2a2a2a"
        cellColor="#1a1a1a"
      />

      <color attach="background" args={['#0d0d0d']} />
      <ScreenshotCapture glRef={glRef} />
    </>
  );
}

const Scene = forwardRef<SceneHandle, SceneProps>(function Scene({ settings, objData }, ref) {
  const orbitRef = useRef<OrbitControlsImpl | null>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  useImperativeHandle(ref, () => ({
    resetCamera: () => orbitRef.current?.reset(),
    screenshot: () => {
      const gl = glRef.current;
      if (!gl) return;
      const url = gl.domElement.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'render.png';
      a.click();
    },
  }));

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
      <SceneInner settings={settings} objData={objData} orbitRef={orbitRef} glRef={glRef} />
    </Canvas>
  );
});

export default Scene;
