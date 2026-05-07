/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Center, ContactShadows, Environment } from '@react-three/drei';
import { SceneSettings, ObjectType, ParsedOBJ } from '../types';
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

function Shape({ type, color, wireframe, roughness, metalness }: {
  type: ObjectType,
  color: string,
  wireframe: boolean,
  roughness: number,
  metalness: number
}) {
  return (
    <mesh castShadow receiveShadow>
      {type === ObjectType.CUBE && <boxGeometry args={[2, 2, 2]} />}
      {type === ObjectType.SPHERE && <sphereGeometry args={[1.5, 32, 32]} />}
      {type === ObjectType.PLANE && <planeGeometry args={[3, 3]} />}
      {type === ObjectType.TORUS && <torusGeometry args={[1.2, 0.4, 16, 100]} />}

      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

function OBJMesh({ objData, color, wireframe, roughness, metalness }: {
  objData: ParsedOBJ;
  color: string;
  wireframe: boolean;
  roughness: number;
  metalness: number;
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
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={roughness}
        metalness={metalness}
      />
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
            color={settings.shadedColor ?? settings.objectColor}
            wireframe={settings.wireframe}
            roughness={settings.roughness}
            metalness={settings.metalness}
          />
        ) : (
          <Shape
            type={settings.objectType}
            color={settings.shadedColor ?? settings.objectColor}
            wireframe={settings.wireframe}
            roughness={settings.roughness}
            metalness={settings.metalness}
          />
        )}
      </Center>

      <Grid
        infiniteGrid
        fadeDistance={40}
        fadeStrength={5}
        sectionSize={2}
        sectionColor="#a1a1aa"
        cellColor="#e4e4e7"
      />
      <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.25} far={10} color="#000000" />
      <Environment preset="city" />

      <color attach="background" args={['#f8fafc']} />
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
