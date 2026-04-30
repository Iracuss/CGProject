#include "RenderObject.hpp"

RenderObject::RenderObject(Mesh& mesh) : m_mesh(&mesh), m_model(nullptr)
{
    m_transform.position = glm::vec3(0.0f, 0.0f, 0.0f);
    m_transform.rotation = glm::vec3(0.0f);
    m_transform.scale = glm::vec3(1.0f);
}

RenderObject::RenderObject(Model& model) : m_mesh(nullptr), m_model(&model)
{
    m_transform.position = glm::vec3(0.0f, 0.0f, 0.0f);
    m_transform.rotation = glm::vec3(0.0f);
    m_transform.scale = glm::vec3(1.0f);
}

void RenderObject::draw(Shader& shader)
{
    if(m_model)
    {
        m_model->draw(shader, m_transform.GetMatrix());
    }
    else if(m_mesh)
    {
        m_mesh->draw(shader, m_transform.GetMatrix());
    }
}

RenderObject::RenderObject() {}
RenderObject::~RenderObject() {}
