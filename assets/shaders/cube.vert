#version 330 core

uniform mat4 u_MVP;

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aColor;
layout (location = 2) in vec2 aUV;

out vec3 vColor;
out vec2 vUV;

void main() {
    vColor = aColor;
    vUV = aUV;
    gl_Position = u_MVP * vec4(aPos, 1.0);
}