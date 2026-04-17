// Right now we want to take out creating the window and dealing with it in the renderer
// Honestly this should take out the init from renderer and just create the window in engine

#ifndef WINDOW_HPP
#define WINDOW_HPP

#include "../graphics/Renderer.hpp"
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <iostream>
#include <math.h>
#include <vector>


class Window
{
public:
    Window();
    ~Window();

    bool loadGLFWandGlad();
    int width, height;
    Renderer render;
    GLFWwindow* window;

private:


};

#endif