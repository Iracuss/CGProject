#include "Mesh.hpp"

Mesh::Mesh() : VAO(0), VBO(0), EBO(0), vertices(), indicies(), textures() {}

Mesh::Mesh(const std::vector<Vertex>& v, const std::vector<unsigned int>& i, const std::vector<g_texture>& t) : vertices(v), indicies(i), textures(t)
{
    modelMatrix = glm::mat4(1.0f);
    setupMesh();

    // std::cout << "VAO: " << VAO << " VBO: " << VBO << " EBO: " << EBO << std::endl;


    // glBindBuffer(GL_ARRAY_BUFFER, 0);
    // glBindVertexArray(0);
}

Mesh::~Mesh()
{
    // shutdown(); // This is causing an issue with rendering
    // if (VAO != 0) {
    //     shutdown(); 
    // }
}

void Mesh::setupMesh()
{
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);


    glBindVertexArray(VAO);

    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(Vertex), vertices.data(), GL_STATIC_DRAW);

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, indicies.size() * sizeof(unsigned int), indicies.data(), GL_STATIC_DRAW);

    // Tell OpenGL how to interpret vertex data
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(
        0,              // layout location = 0
        3,              // 3 floats per vertex
        GL_FLOAT,       // type
        GL_FALSE,       // no normalization
        sizeof(Vertex),  // stride
        (void*)offsetof(Vertex, position)        // offset
    );

    // color attribute (location = 1)
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(
        1,
        3,
        GL_FLOAT,
        GL_FALSE,
        sizeof(Vertex),
        (void*)offsetof(Vertex, normal)
    );
    
    glEnableVertexAttribArray(2);
    glVertexAttribPointer(
        2, 
        2, 
        GL_FLOAT, 
        GL_FALSE, 
        sizeof(Vertex), 
        (void*)offsetof(Vertex, texCoords)
    );
}

void Mesh::shutdown()
{
    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glDeleteBuffers(1, &EBO);
}

void Mesh::draw(Shader& shader, const glm::mat4& worldTransform)
{
    unsigned int diffusedNr = 1;
    unsigned int specularNr = 1;
    for(unsigned int i = 0; i < textures.size(); i++)
    {
        if (textures[i].id != 0) {
            glActiveTexture(GL_TEXTURE0 + i);
            std::string number;
            std::string name = textures[i].type;

            if(name == "texture_diffuse")
            {
                number = std::to_string(diffusedNr++);
            } else if(name == "texture_specular") {
                number = std::to_string(specularNr++);
            }
            
            shader.setInt(("material." + name + number).c_str(), i);
            glBindTexture(GL_TEXTURE_2D, textures[i].id);
        }
    }
    glActiveTexture(GL_TEXTURE0);

    glm::mat4 finalMatrix = worldTransform * modelMatrix;
    shader.setMat4("model", finalMatrix);

    if(VAO == 0) return;

    glBindVertexArray(VAO);
    // std::cout << "Drawing with VAO: " << VAO << " indexCount: " << indexCount << std::endl;
    glDrawElements(GL_TRIANGLES, indicies.size(), GL_UNSIGNED_INT, 0);
    glBindVertexArray(0);
}