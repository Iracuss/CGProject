#include "RenderObject.hpp"
    
// RenderObject::RenderObject(Mesh& mesh, Shader& shader) : m_mesh(&mesh), m_shader(&shader) 
// {
//     m_transform.position = glm::vec3(0.0f, 0.0f, 0.0f);
//     m_transform.rotation = glm::vec3(0.0f);
//     m_transform.scale = glm::vec3(1.0f);
// }
    
RenderObject::RenderObject(Model& model) : m_model(&model)
{
    m_transform.position = glm::vec3(0.0f, 0.0f, 0.0f);
    m_transform.rotation = glm::vec3(0.0f);
    m_transform.scale = glm::vec3(1.0f);
}
    
// RenderObject::RenderObject(Mesh& mesh, Shader& shader, Texture& texture) : m_mesh(&mesh), m_shader(&shader), m_texture(&texture) 
// {
//     m_transform.position = glm::vec3(0.0f, 0.0f, 0.0f);
//     m_transform.rotation = glm::vec3(0.0f);
//     m_transform.scale = glm::vec3(1.0f);
// }

RenderObject::RenderObject() {}
RenderObject::~RenderObject() {}
