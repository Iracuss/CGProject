#ifndef CAMERA_HPP
#define CAMERA_HPP

#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <iostream>
#include <math.h>
#include <vector>

class Camera
{
public:

    static void mouse_callback(GLFWwindow* window, double xpos, double ypos);
    glm::mat4 cameraView();
    void processInput(GLFWwindow* window, float deltaTime);

private:

    glm::vec3 cameraPos = glm::vec3(0.0f, 0.0f, 3.0f);
    glm::vec3 cameraFront = glm::vec3(0.0f, 0.0f, -1.0f);
    glm::vec3 cameraUp = glm::vec3(0.0f, 1.0f,  0.0f);

    float yaw = -90.0f;
    float pitch = 0.0f;
    float lastX = 400; // window center
    float lastY = 300;
    bool firstMouse = true;

    bool wireframe = false;
};


#endif