#ifndef VERTEX_HPP
#define VERTEX_HPP

#include <glm/glm.hpp>
#include <string>

struct Vertex
{
    glm::vec3 position;
    glm::vec3 normal;
    glm::vec2 texCoords;
    glm::vec3 color = glm::vec3(1.0f);
};

struct g_texture
{
    unsigned int id;
    std::string type;
    std::string path;
};

#endif