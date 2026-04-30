#ifndef MODEL_HPP
#define MODEL_HPP

#include <string>
#include <vector>
// #include "Texture.hpp"
#include "Mesh.hpp"
#include "Shader.hpp"
#include <assimp/Importer.hpp>
#include <assimp/scene.h>
#include <assimp/postprocess.h>

class Model
{
public:
    Model(const std::string& path, bool gamma = false);
    Model();
    ~Model();

    void draw(Shader& shader, const glm::mat4& worldTransform);
private:
    std::vector<Mesh> meshes;
    std::string directory;
    bool gammaCorrection;
    std::vector<g_texture> textures_loaded;

    void loadModel(std::string path);
    std::vector<g_texture> loadMaterialTextures(aiMaterial* mat, aiTextureType type, std::string typeName);

    void processNode(aiNode* node, const aiScene* scene, glm::mat4 parentTransform);
    Mesh processMesh(aiMesh* mesh, const aiScene* scene);
    unsigned int TextureFromFile(const char *path, const std::string &directory, bool gamma = false);
};

#endif