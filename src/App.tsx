/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import Scene, { SceneHandle } from './components/Scene';
import Controls from './components/Controls';
import { INITIAL_SETTINGS, SceneSettings } from './types';
import { motion } from 'motion/react';
import { Boxes, Cpu, FileJson } from 'lucide-react';
import { initPython, PythonStatus, runPythonShading, parseOBJInPython } from './services/pythonEngine';

export default function App() {
  const [settings, setSettingsState] = useState<SceneSettings>(INITIAL_SETTINGS);
  const [pythonStatus, setPythonStatus] = useState<PythonStatus>('idle');
  const [pythonProcessing, setPythonProcessing] = useState(false);
  const [objStats, setObjStats] = useState<{ vertexCount: number, faceCount: number, vertices: number[][], faces: number[][] } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'loading' | 'success' | 'error', message: string } | null>(null);
  const sceneRef = useRef<SceneHandle>(null);

  useEffect(() => {
    initPython(setPythonStatus);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return;
      if (e.key === 'r' || e.key === 'R') sceneRef.current?.resetCamera();
      if (e.key === ' ') { e.preventDefault(); setSettingsState(s => ({ ...s, autoRotate: !s.autoRotate })); }
      if (e.key === 'w' || e.key === 'W') setSettingsState(s => ({ ...s, wireframe: !s.wireframe }));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const updateSettings = async (newSettings: Partial<SceneSettings>) => {
    const nextSettings = { ...settings, ...newSettings };

    if (newSettings.objectColor || newSettings.pointIntensity !== undefined) {
      setPythonProcessing(true);
      try {
        const shadedColor = await runPythonShading(
          nextSettings.pointIntensity,
          nextSettings.objectColor
        );
        nextSettings.shadedColor = shadedColor;
      } catch (e) {
        console.error('Python shading error:', e);
      } finally {
        setPythonProcessing(false);
      }
    }

    setSettingsState(nextSettings);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Selected OBJ file:', file.name);
    setUploadStatus({ type: 'loading', message: `Loading ${file.name}...` });
    
    const text = await file.text();

    try {
      const stats = await parseOBJInPython(text);
      console.log('Parsed OBJ stats:', stats);
      if (stats) {
        setObjStats(stats);
        setUploadStatus({ type: 'success', message: `✓ Parsed: ${stats.vertexCount} vertices, ${stats.faceCount} faces` });
        setTimeout(() => setUploadStatus(null), 3000);
      }
    } catch (e) {
      console.error('Python OBJ parsing error:', e);
      setUploadStatus({ type: 'error', message: 'Failed to parse OBJ file' });
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#0d0d0d] overflow-hidden font-sans">
      {/* 3D Viewport */}
      <div className="absolute inset-0 z-0">
        <Scene ref={sceneRef} settings={settings} objData={objStats} />
      </div>

      {/* Main Header UI */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-start z-20"
      >
        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-slate-200 pointer-events-auto flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-blue-200 shadow-md">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Project RENDERING</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Blinn-Phong · PBR · Three.js</p>
              {(pythonStatus === 'loading' || pythonProcessing) && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                >
                  <Cpu className="w-3 h-3 text-blue-500" />
                </motion.div>
              )}
              {pythonStatus === 'loading' && (
                <span className="text-[10px] text-blue-500 font-semibold uppercase tracking-wide">Loading Python…</span>
              )}
              {pythonStatus === 'ready' && (
                <span className="text-[10px] text-green-500 font-semibold uppercase tracking-wide">Python Ready</span>
              )}
              {pythonStatus === 'error' && (
                <span className="text-[10px] text-red-500 font-semibold uppercase tracking-wide">Python Error</span>
              )}
            </div>
          </div>
        </div>

        {uploadStatus ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`shadow-xl border p-4 rounded-2xl flex items-center gap-3 pointer-events-auto ${
              uploadStatus.type === 'loading' ? 'bg-blue-50 border-blue-200' :
              uploadStatus.type === 'success' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            }`}
          >
            {uploadStatus.type === 'loading' && (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Cpu className="w-5 h-5 text-blue-600" />
              </motion.div>
            )}
            {uploadStatus.type === 'success' && <FileJson className="w-5 h-5 text-green-600" />}
            {uploadStatus.type === 'error' && <Boxes className="w-5 h-5 text-red-600" />}
            <p className={`text-sm font-semibold ${
              uploadStatus.type === 'loading' ? 'text-blue-700' :
              uploadStatus.type === 'success' ? 'text-green-700' :
              'text-red-700'
            }`}>
              {uploadStatus.message}
            </p>
          </motion.div>
        ) : objStats ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 shadow-xl border border-blue-100 p-4 rounded-2xl flex items-center gap-4 pointer-events-auto"
          >
            <div className="bg-blue-50 p-2 rounded-lg">
              <FileJson className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-xs">
              <p className="text-slate-400 uppercase font-bold tracking-tighter">Python OBJ Stats</p>
              <div className="flex gap-3 text-slate-700 font-mono">
                <span>V: {objStats.vertexCount}</span>
                <span>F: {objStats.faceCount}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </motion.div>

      {/* Floating Controls Overlay */}
      <div className="z-10 pointer-events-none absolute inset-0">
        <Controls
          settings={settings}
          setSettings={updateSettings}
          onFileUpload={handleFileUpload}
          onCameraReset={() => sceneRef.current?.resetCamera()}
          onScreenshot={() => sceneRef.current?.screenshot()}
        />
      </div>

      {/* Attribution Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-6 text-[10px] uppercase font-bold tracking-[0.2em] text-white/20 z-10"
      >
        Developed by Hossein F. • Christian C. • Abraham V.
      </motion.div>
    </div>
  );
}
