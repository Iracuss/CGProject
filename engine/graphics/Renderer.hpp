#ifndef RENDERER_HPP
#define RENDERER_HPP

// #include "../math/Vertex.hpp"
// #include "../math/Cube.hpp"

#include "../core/Camera.hpp"
#include "../assets/Mesh.hpp"
#include "../assets/Shader.hpp"
#include "../math/Transform.hpp"
// #include "../math/Cube.hpp"
#include "Scene.hpp"

class Renderer
{
public:
    Renderer();
    ~Renderer();

    void init();
    void render(GLFWwindow* window);
    void loadShaders();

    static void framebuffer_size_callback(GLFWwindow* window, int width, int height);

    Camera renderCamera;
    Mesh cubeMesh;
    Shader m_shader;
    // Texture cubeTexture;
    Model backpack;
    Scene m_scene;
private:
    float fov = 90.0f;

    int width, height;
};

#endif