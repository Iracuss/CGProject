#include "Window.hpp"

Window::Window() : window(nullptr), width(800), height(600)
{}

Window::~Window() 
{
    
}

bool Window::loadGLFWandGlad()
{
    // init glfw
    if(!glfwInit())
    {
        std::cerr << "Failed to init GLFW\n";
        return false;
    }

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    #ifdef __APPLE__
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
    #endif

    // Create the window
    window = glfwCreateWindow(800, 600, "Renderer Engine", nullptr, nullptr);
    if(!window)
    {
        std::cerr << "Failed to create window\n";
        glfwTerminate();
        return false;
    }

    glfwMakeContextCurrent(window);

    // keep this here maybe
    glfwSetWindowUserPointer(window, &render);

    // load GLAD
    if(!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cerr << "Failed to init GLAD\n";
        return false;
    }

    glfwSetFramebufferSizeCallback(window, render.framebuffer_size_callback);

    glfwGetFramebufferSize(window, &width, &height);
    render.framebuffer_size_callback(window, width, height);

    glfwSetCursorPosCallback(window, render.renderCamera.mouse_callback);
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED); // hide and capture cursor

    glEnable(GL_DEPTH_TEST);

    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK); // Culls the back faces
    glFrontFace(GL_CCW); // Counter-Clockwise winding is "Front" (Standard)

    return true;
}
