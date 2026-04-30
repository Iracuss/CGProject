#include "Renderer.hpp"
#include <cmath>

static Mesh createCubeMesh()
{
    std::vector<Vertex> vertices = {
        {{-0.5f, -0.5f,  0.5f}, {0.0f, 0.0f, 1.0f}, {0.0f, 0.0f}},
        {{ 0.5f, -0.5f,  0.5f}, {0.0f, 0.0f, 1.0f}, {1.0f, 0.0f}},
        {{ 0.5f,  0.5f,  0.5f}, {0.0f, 0.0f, 1.0f}, {1.0f, 1.0f}},
        {{-0.5f,  0.5f,  0.5f}, {0.0f, 0.0f, 1.0f}, {0.0f, 1.0f}},
        {{-0.5f, -0.5f, -0.5f}, {0.0f, 0.0f,-1.0f}, {1.0f, 0.0f}},
        {{ 0.5f, -0.5f, -0.5f}, {0.0f, 0.0f,-1.0f}, {0.0f, 0.0f}},
        {{ 0.5f,  0.5f, -0.5f}, {0.0f, 0.0f,-1.0f}, {0.0f, 1.0f}},
        {{-0.5f,  0.5f, -0.5f}, {0.0f, 0.0f,-1.0f}, {1.0f, 1.0f}},
        {{-0.5f, -0.5f, -0.5f}, {-1.0f, 0.0f, 0.0f}, {0.0f, 0.0f}},
        {{-0.5f, -0.5f,  0.5f}, {-1.0f, 0.0f, 0.0f}, {1.0f, 0.0f}},
        {{-0.5f,  0.5f,  0.5f}, {-1.0f, 0.0f, 0.0f}, {1.0f, 1.0f}},
        {{-0.5f,  0.5f, -0.5f}, {-1.0f, 0.0f, 0.0f}, {0.0f, 1.0f}},
        {{ 0.5f, -0.5f, -0.5f}, {1.0f, 0.0f, 0.0f}, {1.0f, 0.0f}},
        {{ 0.5f, -0.5f,  0.5f}, {1.0f, 0.0f, 0.0f}, {0.0f, 0.0f}},
        {{ 0.5f,  0.5f,  0.5f}, {1.0f, 0.0f, 0.0f}, {0.0f, 1.0f}},
        {{ 0.5f,  0.5f, -0.5f}, {1.0f, 0.0f, 0.0f}, {1.0f, 1.0f}},
        {{-0.5f,  0.5f,  0.5f}, {0.0f, 1.0f, 0.0f}, {0.0f, 0.0f}},
        {{ 0.5f,  0.5f,  0.5f}, {0.0f, 1.0f, 0.0f}, {1.0f, 0.0f}},
        {{ 0.5f,  0.5f, -0.5f}, {0.0f, 1.0f, 0.0f}, {1.0f, 1.0f}},
        {{-0.5f,  0.5f, -0.5f}, {0.0f, 1.0f, 0.0f}, {0.0f, 1.0f}},
        {{-0.5f, -0.5f,  0.5f}, {0.0f,-1.0f, 0.0f}, {0.0f, 1.0f}},
        {{ 0.5f, -0.5f,  0.5f}, {0.0f,-1.0f, 0.0f}, {1.0f, 1.0f}},
        {{ 0.5f, -0.5f, -0.5f}, {0.0f,-1.0f, 0.0f}, {1.0f, 0.0f}},
        {{-0.5f, -0.5f, -0.5f}, {0.0f,-1.0f, 0.0f}, {0.0f, 0.0f}}
    };

    std::vector<unsigned int> indices = {
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    };

    return Mesh(vertices, indices, {});
}

static Mesh createPlaneMesh()
{
    std::vector<Vertex> vertices = {
        {{-5.0f, 0.0f, -5.0f}, {0.0f, 1.0f, 0.0f}, {0.0f, 0.0f}},
        {{ 5.0f, 0.0f, -5.0f}, {0.0f, 1.0f, 0.0f}, {5.0f, 0.0f}},
        {{ 5.0f, 0.0f,  5.0f}, {0.0f, 1.0f, 0.0f}, {5.0f, 5.0f}},
        {{-5.0f, 0.0f,  5.0f}, {0.0f, 1.0f, 0.0f}, {0.0f, 5.0f}}
    };

    std::vector<unsigned int> indices = {
        0, 1, 2,
        0, 2, 3
    };

    return Mesh(vertices, indices, {});
}

static Mesh createSphereMesh(int latitudeSegments = 18, int longitudeSegments = 24)
{
    std::vector<Vertex> vertices;
    std::vector<unsigned int> indices;

    for(int y = 0; y <= latitudeSegments; ++y)
    {
        float theta = (float)y / latitudeSegments * glm::pi<float>();
        float sinTheta = sin(theta);
        float cosTheta = cos(theta);

        for(int x = 0; x <= longitudeSegments; ++x)
        {
            float phi = (float)x / longitudeSegments * glm::two_pi<float>();
            float sinPhi = sin(phi);
            float cosPhi = cos(phi);

            glm::vec3 position = {
                cosPhi * sinTheta,
                cosTheta,
                sinPhi * sinTheta
            };

            glm::vec2 texCoords = {
                1.0f - (float)x / longitudeSegments,
                1.0f - (float)y / latitudeSegments
            };

            vertices.push_back({position, position, texCoords, glm::vec3(0.8f, 0.4f, 0.2f)});
        }
    }

    for(int y = 0; y < latitudeSegments; ++y)
    {
        for(int x = 0; x < longitudeSegments; ++x)
        {
            int first = y * (longitudeSegments + 1) + x;
            int second = first + longitudeSegments + 1;

            indices.push_back(first);
            indices.push_back(second);
            indices.push_back(first + 1);

            indices.push_back(second);
            indices.push_back(second + 1);
            indices.push_back(first + 1);
        }
    }

    return Mesh(vertices, indices, {});
}

Renderer::Renderer()
    : width(800), height(600), lightPosition(2.0f, 2.0f, 2.0f), lightAmbient(0.2f), lightDiffuse(0.8f), lightSpecular(1.0f)
{}

Renderer::~Renderer()
{}

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

void Renderer::loadShaders()
{
}

void Renderer::init()
{
    m_shader = Shader("model", "model");
    std::cout << "Shader creation successful." << std::endl;

    cubeMesh = createCubeMesh();
    planeMesh = createPlaneMesh();
    sphereMesh = createSphereMesh(22, 28);

    RenderObject cube(cubeMesh);
    cube.m_transform.position = glm::vec3(-1.5f, 0.5f, 0.0f);
    cube.m_transform.scale = glm::vec3(1.0f);
    cube.color = glm::vec3(0.2f, 0.6f, 1.0f);
    m_scene.addObjectToScene(cube);

    RenderObject sphere(sphereMesh);
    sphere.m_transform.position = glm::vec3(1.5f, 0.7f, 0.0f);
    sphere.m_transform.scale = glm::vec3(0.7f);
    sphere.color = glm::vec3(0.9f, 0.5f, 0.2f);
    m_scene.addObjectToScene(sphere);

    RenderObject floorPlane(planeMesh);
    floorPlane.m_transform.position = glm::vec3(0.0f, -0.5f, 0.0f);
    floorPlane.m_transform.scale = glm::vec3(1.0f);
    floorPlane.color = glm::vec3(0.4f, 0.4f, 0.4f);
    m_scene.addObjectToScene(floorPlane);

    backpack = Model("../assets/models/survival_guitar_backpack/scene.gltf");
    std::cout << "Model creation successful." << std::endl;
    RenderObject bp(backpack);
    bp.m_transform.position = glm::vec3(0.0f, -0.2f, -2.0f);
    bp.m_transform.scale = glm::vec3(0.02f);
    m_scene.addObjectToScene(bp);

    std::cout << "RenderObject added to scene. Starting render loop soon." << std::endl;
    std::cout << "Controls: WASD + Space/Ctrl to move, mouse to look, U/O ambient, Y/H specular, I/K move light up/down, J/L move light left/right." << std::endl;
}

void Renderer::handleInput(GLFWwindow* window, float deltaTime)
{
    renderCamera.processInput(window, deltaTime);

    float rate = deltaTime * 0.75f;
    if(glfwGetKey(window, GLFW_KEY_U) == GLFW_PRESS)
    {
        ambientStrength = glm::clamp(ambientStrength + rate, 0.0f, 1.0f);
    }
    if(glfwGetKey(window, GLFW_KEY_O) == GLFW_PRESS)
    {
        ambientStrength = glm::clamp(ambientStrength - rate, 0.0f, 1.0f);
    }
    if(glfwGetKey(window, GLFW_KEY_Y) == GLFW_PRESS)
    {
        specularStrength = glm::clamp(specularStrength + rate, 0.0f, 2.0f);
    }
    if(glfwGetKey(window, GLFW_KEY_H) == GLFW_PRESS)
    {
        specularStrength = glm::clamp(specularStrength - rate, 0.0f, 2.0f);
    }
    if(glfwGetKey(window, GLFW_KEY_I) == GLFW_PRESS)
    {
        lightPosition.y += lightMoveSpeed * deltaTime;
    }
    if(glfwGetKey(window, GLFW_KEY_K) == GLFW_PRESS)
    {
        lightPosition.y -= lightMoveSpeed * deltaTime;
    }
    if(glfwGetKey(window, GLFW_KEY_J) == GLFW_PRESS)
    {
        lightPosition.x -= lightMoveSpeed * deltaTime;
    }
    if(glfwGetKey(window, GLFW_KEY_L) == GLFW_PRESS)
    {
        lightPosition.x += lightMoveSpeed * deltaTime;
    }
}

void Renderer::render(GLFWwindow* window)
{
    glClearColor(0.1f, 0.1f, 0.15f, 1.0f);
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
    m_shader.setVec3("viewPos", renderCamera.getPosition());
    m_shader.setVec3("light.position", lightPosition);
    m_shader.setVec3("light.ambient", lightAmbient * ambientStrength);
    m_shader.setVec3("light.diffuse", lightDiffuse);
    m_shader.setVec3("light.specular", lightSpecular * specularStrength);
    m_shader.setFloat("material.shininess", 32.0f);

    for(auto& obj : m_scene.obj)
    {
        m_shader.setMat4("model", obj.m_transform.GetMatrix());

        if(obj.m_model)
        {
            m_shader.setBool("useDiffuseTexture", true);
        }
        else
        {
            m_shader.setBool("useDiffuseTexture", false);
            m_shader.setVec3("objectColor", obj.color);
        }

        obj.draw(m_shader);
    }

    glfwSwapBuffers(window);
    glfwPollEvents();
}
