// #include "Texture.hpp"

// Texture::Texture(const std::string& path)
// {
//     std::string tPath = "../assets/textures/" + path; // Need to provide if png or jpeg

//     std::cout << "Loading texture at: " << tPath << "\n";

//     glGenTextures(1, &id);
//     glBindTexture(GL_TEXTURE_2D, id);

//     glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
//     glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
//     glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
//     glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

//     stbi_set_flip_vertically_on_load(true);

//     unsigned char* data = stbi_load(tPath.c_str(), &width, &height, &channels, 0);
//     if(!data)
//     {
//         std::cout << "Failed to load texture: " << tPath.c_str() << std::endl;
//         return;
//     }

//     GLenum format = GL_RGB;
//     if(channels == 4)
//         format = GL_RGBA;
//     else if(channels == 3)
//         format = GL_RGB;

//     glTexImage2D(
//         GL_TEXTURE_2D,
//         0,
//         format,
//         width,
//         height,
//         0,
//         format,
//         GL_UNSIGNED_BYTE,
//         data
//     );
//     glGenerateMipmap(GL_TEXTURE_2D);

//     stbi_image_free(data);
// }

// Texture::Texture() {}

// Texture::~Texture() {}

// void Texture::bind(unsigned int unit)
// {
//     glActiveTexture(GL_TEXTURE0 + unit);
//     glBindTexture(GL_TEXTURE_2D, id);
// }

// void Texture::shutdown()
// {
//     glDeleteTextures(1, &id);
// }