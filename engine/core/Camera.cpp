#include "Camera.hpp"

// This should go into an input class
void Camera::mouse_callback(GLFWwindow* window, double xpos, double ypos)
{

    Camera* camera = static_cast<Camera*>(glfwGetWindowUserPointer(window));
    if(!camera) return;

    if(camera->firstMouse)
    {
        camera->lastX = xpos;
        camera->lastY = ypos;
        camera->firstMouse = false;
    }

    float sensitivity = 0.1f;
    float xoffset = (xpos - camera->lastX) * sensitivity;
    float yoffset = (camera->lastY - ypos) * sensitivity; // got to reverse it for y

    camera->lastX = xpos;
    camera->lastY = ypos;

    camera->yaw += xoffset;
    camera->pitch += yoffset;

    // Limit looking up or down
    if(camera->pitch > 89.0f)
    {
        camera->pitch = 89.0f;
    }
    if(camera->pitch < -89.0f)
    {
        camera->pitch = -89.0f;
    }

    glm::vec3 direction;
    direction.x = cos(glm::radians(camera->yaw)) * cos(glm::radians(camera->pitch));
    direction.y = sin(glm::radians(camera->pitch));
    direction.z = sin(glm::radians(camera->yaw)) * cos(glm::radians(camera->pitch));
    camera->cameraFront = glm::normalize(direction);
}

glm::mat4 Camera::cameraView()
{
    glm::mat4 view = glm::lookAt(
        cameraPos,
        cameraPos + cameraFront,
        cameraUp
    );
    return view;
}

// Probably want this to be in a input.cpp file
void Camera::processInput(GLFWwindow* window, float deltaTime)
{
    float cameraSpeed = 2.5f * deltaTime;

    if(glfwGetKey(window, GLFW_KEY_LEFT_SHIFT) == GLFW_PRESS)
    {
        cameraSpeed *= 2.0f;
    }
    if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, true);
    }
    if(glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
    {
        cameraPos += cameraSpeed * cameraFront;
    }
    if(glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
    {
        cameraPos -= cameraSpeed * cameraFront;
    }
    if(glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
    {
        cameraPos -= glm::normalize(glm::cross(cameraFront, cameraUp)) * cameraSpeed;
    }
    if(glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
    {
        cameraPos += glm::normalize(glm::cross(cameraFront, cameraUp)) * cameraSpeed;
    }
    if(glfwGetKey(window, GLFW_KEY_SPACE) == GLFW_PRESS)
    {
        cameraPos += cameraUp * cameraSpeed;
    }
    if(glfwGetKey(window, GLFW_KEY_LEFT_CONTROL) == GLFW_PRESS)
    {
        cameraPos -= cameraUp * cameraSpeed;
    }
    if(glfwGetKey(window, GLFW_KEY_M) == GLFW_PRESS)
    {
        if(!wireframe)
        {
            glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
            wireframe = true;
        }
    }
    if(glfwGetKey(window, GLFW_KEY_N) == GLFW_PRESS)
    {
        if(wireframe)
        {
            glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
            wireframe = false;
        }
    }
}