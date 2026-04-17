#ifndef MESH_HPP
#define MESH_HPP

// #include <GLFW/glfw3.h>
#include <glad/glad.h>
#include "../math/Vertex.hpp"
#include <iostream>
#include <vector>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include "Shader.hpp"
#include <cstddef>

class Mesh
{
public:
    Mesh(const std::vector<Vertex>& vertices, const std::vector<unsigned int>& indicies, const std::vector<g_texture>& t);
    Mesh();
    ~Mesh();

    void shutdown();
    void draw(Shader& shader, const glm::mat4& worldTransform);

    glm::mat4 modelMatrix;
    // unsigned int indexCount;
    unsigned int VAO, VBO, EBO;
private:
    std::vector<Vertex> vertices;
    std::vector<unsigned int> indicies;
    std::vector<g_texture> textures;

    void setupMesh();
};

#endif