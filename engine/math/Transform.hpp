#ifndef TRANSFORM_HPP
#define TRANSFORM_HPP

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

struct Transform
{
    glm::vec3 position = glm::vec3(0.0f);
    glm::vec3 rotation = glm::vec3(0.0f);
    glm::vec3 scale = glm::vec3(1.0f);

    glm::mat4 GetMatrix() const {
        glm::mat4 m = glm::mat4(1.0f);

        // translate
        m = glm::translate(m, position);
        
        // rotate around x y or z
        m = glm::rotate(m, rotation.x, glm::vec3(1,0,0));
        m = glm::rotate(m, rotation.y, glm::vec3(0,1,0));
        m = glm::rotate(m, rotation.z, glm::vec3(0,0,1));

        // scale
        m = glm::scale(m, scale);
        return m;
    }
};

#endif