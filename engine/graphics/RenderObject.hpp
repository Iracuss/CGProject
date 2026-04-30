#ifndef RENDEROBJ_HPP
#define RENDEROBJ_HPP

#include <glm/glm.hpp>
#include "../assets/Mesh.hpp"
#include "../assets/Model.hpp"
#include "../math/Transform.hpp"

class RenderObject
{
public:
    RenderObject(Mesh& mesh);
    RenderObject(Model& model);
    RenderObject();
    ~RenderObject();

    void draw(Shader& shader);

    Mesh* m_mesh = nullptr;
    Model* m_model = nullptr;
    glm::vec3 color = glm::vec3(1.0f);
    Transform m_transform;
};

#endif