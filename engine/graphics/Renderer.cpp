#include "Renderer.hpp"

// This entire file needs to be broken up into more functions to make it more clear

Renderer::Renderer() : width(800), height(600)
{}

Renderer::~Renderer() 
{
    
}

// Why not put this in the window class
void Renderer::framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    Renderer* renderer = static_cast<Renderer*>(glfwGetWindowUserPointer(window));
    if(renderer)
    {
        renderer->width = width;
        renderer->height = height;
    }
    glViewport(0, 0, width, height);
}

// This is stuff that I feel I should put into a shaderManager class
void Renderer::loadShaders()
{

}

// This is just a test thing, I will probably remove this
void Renderer::init()
{

    // We should be able to load a cube into renderobject just like these
    // for the transform we will hard code it as well
    // Remember we need a way to get a mesh and shader that is already made
    // This is so we are not creating multiple of the same shader and mesh for the same object type
    // cubeShader = Shader("cube", "cube");
    // cubeMesh = Mesh(temp_cubeVertices, temp_cubeIndices);
    // cubeTexture = Texture("dirt.jpg");

    backpack = Model("/Users/christiancuevas-iraheta/Desktop/school-repos/alloy/assets/models/survival_guitar_backpack/scene.gltf");
    // backpack = Model("/Users/christiancuevas-iraheta/Desktop/school-repos/alloy/assets/models/backpack/backpack.obj");
    std::cout << "Model creation successful." << std::endl;
    m_shader = Shader("model", "model");
    std::cout << "Shader creation successful." << std::endl;
    RenderObject bp(backpack);
    bp.m_transform.scale = glm::vec3(0.5f);
    bp.m_transform.rotation = glm::vec3(5.0f);
    // RenderObject cube2(cubeMesh, cubeShader, cubeTexture);

    // cube2.m_transform.position = glm::vec3(3.0f, 0.0f, 0.0f);
    // cube2.m_transform.rotation = glm::vec3(0.0f);
    // cube2.m_transform.scale = glm::vec3(1.0f);

    m_scene.addObjectToScene(bp);
    std::cout << "RenderObject added to scene. Starting render loop soon." << std::endl;
    // m_scene.addObjectToScene(cube2);
}

void Renderer::render(GLFWwindow* window)
{

    glClearColor(0.1f, 0.1f, 0.1f, 0.1f);

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glm::mat4 projection = glm::perspective(
        glm::radians(fov),
        (float)width / (float)height,
        0.1f,
        100.0f
    );

    glm::mat4 view = renderCamera.cameraView();

    m_shader.use();

    m_shader.setMat4("projection", projection);
    m_shader.setMat4("view", view);

    for(auto& obj : m_scene.obj)
    {
        glm::mat4 model = obj.m_transform.GetMatrix();
        
        // m_shader.setMat4("model", model);

        // glm::mat4 modelMatrix = obj.m_transform.GetMatrix();
        // m_shader.setMat4("model", modelMatrix);

        // obj.m_texture->bind(0);

        if(obj.m_model)
        {
            obj.m_model->draw(m_shader, model);
        } 
        // else if(obj.m_mesh)
        
        // obj.m_shader->setInt("u_Texture", 0);
        // // std::cout << "MVP uniform location: " << mvpLoc << std::endl;

        // glUniformMatrix4fv(mvpLoc, 1, GL_FALSE, glm::value_ptr(mvp));

        // obj.m_model->draw(shader);
    }

    glfwSwapBuffers(window);
    glfwPollEvents();
}
