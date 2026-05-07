/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Settings, Boxes, Sun, RotateCw, Layers, FileUp, RefreshCw, Camera } from 'lucide-react';
import { SceneSettings, ObjectType, ShadingModel } from '../types';

interface ControlsProps {
  settings: SceneSettings;
  setSettings: (settings: Partial<SceneSettings>) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraReset: () => void;
  onScreenshot: () => void;
}

const SHADING_MODELS: { value: ShadingModel; label: string; desc: string }[] = [
  { value: 'basic',    label: 'Unlit',       desc: 'No lighting — raw albedo' },
  { value: 'lambert',  label: 'Lambert',      desc: 'Diffuse kd(N·L), Gouraud' },
  { value: 'phong',    label: 'Blinn-Phong',  desc: 'Diffuse + specular (N·H)ⁿ' },
  { value: 'standard', label: 'PBR / GGX',    desc: 'Microfacet BRDF (roughness α)' },
];

const MODEL_INFO: Record<ShadingModel, { summary: string; dimmed: string | null }> = {
  basic: {
    summary: 'Renders raw albedo with no lighting calculation. No N·L or N·H terms are evaluated.',
    dimmed: 'Lighting controls are inactive — Unlit ignores all light sources by definition.',
  },
  lambert: {
    summary: 'Diffuse-only Gouraud shading. Intensity per vertex = kd · max(N·L, 0), then interpolated across the face.',
    dimmed: 'Roughness and Metalness are inactive — Lambert has no specular term, so neither shininess nor Fresnel applies.',
  },
  phong: {
    summary: 'Per-fragment Blinn-Phong. Diffuse = kd(N·L), Specular = ks(N·H)ⁿ. Roughness slider sets the shininess exponent n (low roughness → high n → tight highlight).',
    dimmed: 'Metalness is inactive — Blinn-Phong has no Fresnel or conductor model, so the dielectric/metal distinction does not apply.',
  },
  standard: {
    summary: 'PBR with GGX microfacet BRDF. Roughness (α) controls the specular lobe width; Metalness (F₀) shifts reflected energy from diffuse to specular via the Fresnel equation. All parameters are active.',
    dimmed: null,
  },
};

export default function Controls({ settings, setSettings, onFileUpload, onCameraReset, onScreenshot }: ControlsProps) {
  const isLit       = settings.shadingModel !== 'basic';
  const hasSpecular = settings.shadingModel === 'phong' || settings.shadingModel === 'standard';
  const hasPBR      = settings.shadingModel === 'standard';

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

      {/* ── Shading Model ─────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Shading Model</label>
        <div className="grid grid-cols-2 gap-2">
          {SHADING_MODELS.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setSettings({ shadingModel: value })}
              className={`px-3 py-2 text-xs rounded-lg transition-all text-left ${
                settings.shadingModel === value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="font-semibold">{label}</div>
              <div className={`text-[9px] mt-0.5 leading-tight ${settings.shadingModel === value ? 'text-blue-200' : 'text-slate-400'}`}>
                {desc}
              </div>
            </button>
          ))}
        </div>

        {/* Model info / greyed-out explanation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <p className="text-[11px] text-slate-600 leading-relaxed">{MODEL_INFO[settings.shadingModel].summary}</p>
          {MODEL_INFO[settings.shadingModel].dimmed && (
            <div className="flex gap-1.5 items-start border-t border-slate-200 pt-2">
              <span className="text-amber-500 text-[10px] leading-relaxed flex-shrink-0">●</span>
              <p className="text-[10px] text-slate-400 leading-relaxed">{MODEL_INFO[settings.shadingModel].dimmed}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Geometry ──────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Boxes className="w-4 h-4" /> Geometry
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

      {/* ── Load OBJ ──────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <FileUp className="w-4 h-4" /> Load OBJ Mesh
        </label>
        <div className="bg-slate-50 p-4 rounded-xl">
          <label className="w-full flex flex-col items-center px-4 py-3 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">
            <FileUp className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">Select .obj File</span>
            <input type="file" accept=".obj" className="hidden" onChange={onFileUpload} />
          </label>
          <p className="text-[10px] text-slate-400 mt-2 text-center">Parsed in Python — vertices, faces, fan-triangulated</p>
        </div>
      </div>

      {/* ── Lighting ──────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Sun className="w-4 h-4" /> Lighting
        </label>

        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          <div className="text-[10px] font-semibold text-blue-700 mb-0.5">Illumination Equation</div>
          <div className="text-[10px] font-mono text-blue-600">I = Iₐkₐ + Iₗ[kd(N·L) + ks(N·H)ⁿ]</div>
        </div>

        <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
              <span>Ambient (Iₐ)</span>
              <span>{settings.ambientIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range" min="0" max="2" step="0.1"
              value={settings.ambientIntensity}
              onChange={(e) => setSettings({ ambientIntensity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-slate-400">Constant indirect light — uniform background illumination (Iₐkₐ)</p>
          </div>

          <div className={`space-y-1 transition-opacity ${!isLit ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
              <span>Point Light (Iₗ)</span>
              <span>{settings.pointIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range" min="0" max="10" step="0.1"
              value={settings.pointIntensity}
              onChange={(e) => setSettings({ pointIntensity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-slate-400">Direct light — drives diffuse N·L and specular (N·H)ⁿ terms</p>
          </div>

          <div className={`flex items-center justify-between transition-opacity ${!isLit ? 'opacity-40 pointer-events-none' : ''}`}>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Light Color</span>
            <input
              type="color"
              value={settings.lightColor}
              onChange={(e) => setSettings({ lightColor: e.target.value })}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer overflow-hidden p-0"
            />
          </div>

          <div className={`pt-1 space-y-2 transition-opacity ${!isLit ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Light Position</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Determines L = normalize(lightPos − fragPos)</p>
            </div>
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

      {/* ── Material Properties ───────────────────────── */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Material Properties
        </label>
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Diffuse Color (kd)</span>
              <input
                type="color"
                value={settings.objectColor}
                onChange={(e) => setSettings({ objectColor: e.target.value })}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer overflow-hidden p-0"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Albedo — base color modulated by the N·L dot product</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-slate-600">Wireframe</span>
              <p className="text-[10px] text-slate-400">Exposes mesh edge topology</p>
            </div>
            <button
              onClick={() => setSettings({ wireframe: !settings.wireframe })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.wireframe ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.wireframe ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div className={`space-y-1 transition-opacity ${!hasSpecular ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
              <span>Roughness (α)</span>
              <span>{settings.roughness.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.01"
              value={settings.roughness}
              onChange={(e) => setSettings({ roughness: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-slate-400">
              {hasPBR
                ? 'GGX microfacet width — low α = tight specular lobe'
                : 'Maps to Phong shininess n ≈ (1−α)² × 256'}
            </p>
          </div>

          <div className={`space-y-1 transition-opacity ${!hasPBR ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
              <span>Metalness (F₀)</span>
              <span>{settings.metalness.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.01"
              value={settings.metalness}
              onChange={(e) => setSettings({ metalness: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-slate-400">Fresnel reflectance — dielectric (0) to conductor (1); shifts diffuse → specular</p>
          </div>
        </div>
      </div>

      {/* ── Camera ────────────────────────────────────── */}
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

      {/* ── CG Legend ─────────────────────────────────── */}
      <div className="space-y-2 border-t border-slate-100 pt-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Vector Legend</div>
        <div className="bg-slate-50 rounded-xl p-3 font-mono text-[10px] text-slate-500 space-y-0.5">
          <div><span className="text-slate-700 font-bold">N</span> = surface normal at fragment</div>
          <div><span className="text-slate-700 font-bold">L</span> = direction to light source</div>
          <div><span className="text-slate-700 font-bold">V</span> = direction to camera</div>
          <div><span className="text-slate-700 font-bold">H</span> = normalize(L + V)  ← halfway vector</div>
          <div><span className="text-slate-700 font-bold">n</span> = shininess exponent</div>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2 space-y-0.5">
        <div>Left Click: Rotate • Right Click: Pan • Scroll: Zoom</div>
        <div>R: Reset Camera • Space: Auto-Rotate • W: Wireframe</div>
      </div>
    </motion.div>
  );
}
