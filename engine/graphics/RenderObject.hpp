#ifndef RENDEROBJ_HPP
#define RENDEROBJ_HPP

// #include "../assets/Mesh.hpp"
// #include "../assets/Shader.hpp"
// #include "../assets/Texture.hpp"
#include "../assets/Model.hpp"
#include "../math/Transform.hpp"

class RenderObject
{
public:
    // RenderObject(Mesh& mesh, Shader& shader);
    // RenderObject(Mesh& mesh, Shader& shader, Texture& texture);
    RenderObject(Model& model);
    RenderObject();
    ~RenderObject();

    // Mesh* m_mesh;
    // Shader* m_shader;
    // Texture* m_texture;

    Model* m_model;
    Transform m_transform;
private:
};

#endif