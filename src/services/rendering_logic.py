# Project RENDERING - Python Logic Layer
# This code handles geometry processing and scene configuration

class OBJParser:
    def __init__(self):
        self.vertices = []
        self.faces = []

    def parse(self, obj_string):
        for line in obj_string.split('\n'):
            line = line.strip()
            if line.startswith('v '):
                parts = line.split()
                self.vertices.append([float(x) for x in parts[1:4]])
            elif line.startswith('f '):
                parts = line.split()
                # Strip texture/normal indices (e.g. "1/2/3" -> 1), convert to 0-based
                indices = [int(x.split('/')[0]) - 1 for x in parts[1:]]
                # Fan-triangulate: a polygon [0,1,2,3,4] -> [0,1,2], [0,2,3], [0,3,4]
                for i in range(1, len(indices) - 1):
                    self.faces.append([indices[0], indices[i], indices[i + 1]])

        return {
            "vertexCount": len(self.vertices),
            "faceCount": len(self.faces),
            "vertices": self.vertices,
            "faces": self.faces
        }

def calculate_shading(intensity, color_hex):
    """
    Demonstrates fundamental lighting methods mentioned in Objective 2.
    """
    # Simple Python logic to adjust brightness
    import re
    color_hex = color_hex.lstrip('#')
    rgb = tuple(int(color_hex[i:i+2], 16) for i in (0, 2, 4))
    
    # Apply intensity
    shaded_rgb = [min(255, int(x * intensity)) for x in rgb]
    return '#{:02x}{:02x}{:02x}'.format(*shaded_rgb)

# This serves as the 'State' that the Python logic maintains
scene_state = {
    "camera_pos": [5, 5, 5],
    "object_scale": 1.0,
    "last_parsed_stats": None
}

def update_scene(params):
    global scene_state
    for key in params:
        if key in scene_state:
            scene_state[key] = params[key]
    return scene_state
