## Fix for asset not showing up
```bash
cd ./assets/models/survival_guitar_backpack && pwd | pbcopy
```
Go into engine/graphics/Renderer.cpp \
Look for the function void Renderer::init() \
Replace my file path in backpack = Model("/scene.gltf"); \
Make and run after saving

## How to run
```bash
mkdir build && cd build
cmake ..
make
./render_engine