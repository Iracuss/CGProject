#ifndef LOAD_HPP
#define LOAD_HPP

#include <string>
#include <fstream>
#include <sstream>

inline std::string loadFile(const std::string& path)
{
    std::ifstream file(path);
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

#endif