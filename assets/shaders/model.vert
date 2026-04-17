#version 330 core

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;

out vec3 vNormal;
out vec2 vTexCoords;

void main() {
    vNormal = aNormal;
    vTexCoords = aTexCoords;
    gl_Position = projection * view * model * vec4(aPos, 1.0);
}