/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { loadPyodide, PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface | null = null;
let initPromise: Promise<PyodideInterface> | null = null;

export type PythonStatus = 'idle' | 'loading' | 'ready' | 'error';

export async function initPython(onStatus?: (s: PythonStatus) => void): Promise<PyodideInterface> {
  if (pyodide) return pyodide;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    onStatus?.('loading');
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/',
    });
    const response = await fetch('/src/services/rendering_logic.py');
    const pythonCode = await response.text();
    await pyodide.runPythonAsync(pythonCode);
    onStatus?.('ready');
    return pyodide;
  })();

  initPromise.catch(() => onStatus?.('error'));
  return initPromise;
}

export async function runPythonShading(intensity: number, color: string): Promise<string> {
  const py = await initPython();
  py.globals.set('shading_intensity', intensity);
  py.globals.set('shading_color', color);
  return py.runPython('calculate_shading(shading_intensity, shading_color)');
}

export async function parseOBJInPython(objContent: string) {
  const py = await initPython();
  py.globals.set('obj_to_parse', objContent);
  const result = await py.runPythonAsync(`
parser = OBJParser()
result = parser.parse(obj_to_parse)
result
  `);
  return result.toJs();
}
