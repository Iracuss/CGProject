#include "Engine.hpp"
#include <iostream>


// Everything is kind of named super bland so need to fix
Engine::Engine() : m_isRunning(false)
{}

Engine::~Engine() 
{
    shutdown();
}

void Engine::init()
{
    m_isRunning = window.loadGLFWandGlad();
    if(!m_isRunning)
    {
        return;
    }
    window.render.init();
}

void Engine::update()
{

}

void Engine::shutdown()
{
    glDeleteVertexArrays(1, &window.render.cubeMesh.VAO);
    glDeleteBuffers(1, &window.render.cubeMesh.VBO);

    glfwDestroyWindow(window.window);
    glfwTerminate();

    m_isRunning = false;
}

void Engine::run()
{
    init();
    if(m_isRunning)
    {
        //gets in here before exiting
        while(!glfwWindowShouldClose(window.window))
        {
            //maybe put this in a different class all can use so I don't pass it
            currentFrame = (float)glfwGetTime();
            deltaTime = currentFrame - lastFrame;
            lastFrame = currentFrame;

            window.render.renderCamera.processInput(window.window, deltaTime);

            //update?

            window.render.render(window.window);

        }
    }
    shutdown();
}