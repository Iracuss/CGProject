#include "Shader.hpp"

// This is whole project is such a nightmare right now
Shader::Shader(const std::string& vertSrc, const std::string& fragSrc)
{
    // This is relative to build path I think
    std::string vPath = "../assets/shaders/" + vertSrc + ".vert";
    std::string fPath = "../assets/shaders/" + fragSrc + ".frag";

    std::cout << "Loading vert shaders at: " << vPath << std::endl;
    std::cout << "Loading frag shaders at: " << fPath << std::endl;

    vertShader = loadFile(vPath);
    fragShader = loadFile(fPath);

    // std::cout << vertShader.size() << std::endl;
    // std::cout << fragShader.size() << std::endl;

    const char* vShader = vertShader.c_str();
    const char* fShader = fragShader.c_str();

    // std::cout << vertShader << std::endl;
    // std::cout << fragShader << std::endl;

    GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vShader, nullptr);
    glCompileShader(vertexShader);

    //Error checking
    int success;
    char infoLog[512];
    glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
    if (!success)
    {
        glGetShaderInfoLog(vertexShader, 512, nullptr, infoLog);
        std::cout << "VERTEX SHADER COMPILE ERROR:\n" << infoLog << std::endl;
    }


    GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fShader, nullptr);
    glCompileShader(fragmentShader);

    success = 0;
    infoLog[0] = '\0';
    glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
    if (!success)
    {
        glGetShaderInfoLog(fragmentShader, 512, nullptr, infoLog);
        std::cout << "FRAGMENT SHADER COMPILE ERROR:\n" << infoLog << std::endl;
    }

    program = glCreateProgram();
    glAttachShader(program, vertexShader);
    glAttachShader(program, fragmentShader);
    glLinkProgram(program);

    success = 0;
    glGetProgramiv(program, GL_LINK_STATUS, &success);
    if (!success) {
        char infoLog[512];
        glGetProgramInfoLog(program, 512, nullptr, infoLog);
        std::cout << "SHADER LINK ERROR:\n" << infoLog << std::endl;
    }

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);
}

Shader::Shader() : program(0) {}

Shader::~Shader() {}

void Shader::use()
{
    if(program != 0)
        glUseProgram(program);
}

void Shader::setMat4(const std::string& name, const glm::mat4& mat)
{
    // glm::mat4 mvp = projection * view * cubes[i].GetMatrix();
    const char* cName = name.c_str();

    int mvpLoc = glGetUniformLocation(program, cName);
    // std::cout << "MVP uniform location: " << mvpLoc << std::endl;

    glUniformMatrix4fv(mvpLoc, 1, GL_FALSE, glm::value_ptr(mat));
}

void Shader::setInt(const std::string& name, int val)
{
    glUniform1i(glGetUniformLocation(program, name.c_str()), val);
}

void Shader::setMat3(const std::string& name, const glm::mat3& mat) const
{
    glUniformMatrix3fv(glGetUniformLocation(program, name.c_str()), 1, GL_FALSE, glm::value_ptr(mat));
}
