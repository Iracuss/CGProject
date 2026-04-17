#ifndef ENGINE_HPP
#define ENGINE_HPP

// #include "../graphics/Renderer.hpp"
#include "Window.hpp"

class Engine
{
public:
    Engine();
    ~Engine();

    void run();
    void shutdown();
    void init();
    void update();
private:

    float deltaTime = 0.0f;
    float lastFrame = 0.0f;
    float currentFrame = 0.0f;

    bool m_isRunning;

    // GLFWwindow* window;

    // Renderer render;
    Window window;
    // Camera camera;


};

#endif