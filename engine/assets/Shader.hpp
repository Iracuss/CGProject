#ifndef SHADER_HPP
#define SHADER_HPP

#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include "../utils/LoadFiles.hpp"
#include <string>
#include <iostream>
#include <glm/glm.hpp>
#include <glm/gtc/type_ptr.hpp>

class Shader
{
public:
    Shader();
    Shader(const std::string& vertSrc, const std::string& fragSrc);
    ~Shader();

    void use();
    void setMat4(const std::string& name, const glm::mat4& mat);
    void setInt(const std::string& name, int val);
    void setFloat(const std::string& name, float val);
    void setVec3(const std::string& name, const glm::vec3& vec);
    void setBool(const std::string& name, bool val);
    void setMat3(const std::string &name, const glm::mat3 &mat) const;

    unsigned int program;
private:
    std::string vertShader;
    std::string fragShader;
};


#endif