/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Settings, Boxes, Sun, RotateCw, Layers, FileUp, RefreshCw, Camera } from 'lucide-react';
import { SceneSettings, ObjectType } from '../types';

interface ControlsProps {
  settings: SceneSettings;
  setSettings: (settings: Partial<SceneSettings>) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraReset: () => void;
  onScreenshot: () => void;
}

export default function Controls({ settings, setSettings, onFileUpload, onCameraReset, onScreenshot }: ControlsProps) {
  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute right-4 top-4 mt-16 w-80 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200 flex flex-col gap-6 max-h-[85vh] overflow-y-auto z-30 pointer-events-auto"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <Settings className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-semibold text-slate-800">Scene Explorer</h2>
      </div>

      {/* Object Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Boxes className="w-4 h-4" /> Primitive Shape
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(ObjectType).map((type) => (
            <button
              key={type}
              onClick={() => setSettings({ objectType: type })}
              className={`px-3 py-2 text-sm rounded-lg transition-all ${
                settings.objectType === type 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* OBJ Parser Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <FileUp className="w-4 h-4" /> Python Core Tools
        </label>
        <div className="bg-slate-50 p-4 rounded-xl space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">OBJ Parser (Python)</span>
            <label className="w-full flex flex-col items-center px-4 py-3 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">
              <FileUp className="w-5 h-5 mb-1" />
              <span className="text-xs font-semibold">Select .obj File</span>
              <input type="file" accept=".obj" className="hidden" onChange={onFileUpload} />
            </label>
          </div>
        </div>
      </div>

      {/* Lighting Section */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Sun className="w-4 h-4" /> Lighting
        </label>
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
              <span>Ambient</span>
              <span>{settings.ambientIntensity.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="0" max="2" step="0.1" 
              value={settings.ambientIntensity}
              onChange={(e) => setSettings({ ambientIntensity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
              <span>Point Light</span>
              <span>{settings.pointIntensity.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="0" max="10" step="0.1" 
              value={settings.pointIntensity}
              onChange={(e) => setSettings({ pointIntensity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Light Color</span>
            <input
              type="color"
              value={settings.lightColor}
              onChange={(e) => setSettings({ lightColor: e.target.value })}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer overflow-hidden p-0"
            />
          </div>

          {/* Light Position */}
          <div className="pt-2 space-y-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Light Position</span>
            {(['x', 'y', 'z'] as const).map((axis, i) => (
              <div key={axis} className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 w-3">{axis.toUpperCase()}</span>
                <input
                  type="range" min="-10" max="10" step="0.5"
                  value={settings.lightPosition[i]}
                  onChange={(e) => {
                    const pos = [...settings.lightPosition] as [number, number, number];
                    pos[i] = parseFloat(e.target.value);
                    setSettings({ lightPosition: pos });
                  }}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs font-mono text-slate-400 w-6 text-right">{settings.lightPosition[i].toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Material Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Material & Color
        </label>
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Object Color</span>
            <input 
              type="color" 
              value={settings.objectColor}
              onChange={(e) => setSettings({ objectColor: e.target.value })}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer overflow-hidden p-0"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Wireframe</span>
            <button 
              onClick={() => setSettings({ wireframe: !settings.wireframe })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.wireframe ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.wireframe ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
              <span>Metalness</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={settings.metalness}
              onChange={(e) => setSettings({ metalness: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
              <span>Roughness</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={settings.roughness}
              onChange={(e) => setSettings({ roughness: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Interactions Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <RotateCw className="w-4 h-4" /> Camera
        </label>
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Auto-Rotate</span>
            <button
              onClick={() => setSettings({ autoRotate: !settings.autoRotate })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoRotate ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoRotate ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          <button
            onClick={onCameraReset}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Camera
          </button>
          <button
            onClick={onScreenshot}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" /> Save Screenshot
          </button>
        </div>
      </div>

      <div className="pt-2 text-[10px] text-slate-400 text-center border-t border-slate-100 space-y-0.5">
        <div>Left Click: Rotate • Right Click: Pan • Scroll: Zoom</div>
        <div>R: Reset Camera • Space: Auto-Rotate • W: Wireframe</div>
      </div>
    </motion.div>
  );
}
