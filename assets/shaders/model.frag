#version 330 core

in vec2 vTexCoords;
in vec3 vNormal;
in vec3 FragPos;

out vec4 FragColor;

struct Material {
    sampler2D texture_diffuse1;
    sampler2D texture_specular1;
    float shininess;
};

struct Light {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform Material material;
uniform Light light;
uniform vec3 viewPos;
uniform bool useDiffuseTexture;
uniform vec3 objectColor;

vec3 calculateLighting(vec3 normal, vec3 fragPos, vec3 baseColor)
{
    vec3 ambient = light.ambient * baseColor;

    vec3 norm = normalize(normal);
    vec3 lightDir = normalize(light.position - fragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * baseColor;

    vec3 viewDir = normalize(viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * spec;

    return ambient + diffuse + specular;
}

void main()
{
    vec3 baseColor = useDiffuseTexture ? texture(material.texture_diffuse1, vTexCoords).rgb : objectColor;
    vec3 color = calculateLighting(vNormal, FragPos, baseColor);
    FragColor = vec4(color, 1.0);
}
