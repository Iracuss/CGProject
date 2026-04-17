cmake_minimum_required(VERSION 3.15)
project(render_engine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --------------------------------
# GLFW
# --------------------------------
add_subdirectory(libs/glfw)

# --------------------------------
# Assimp
# --------------------------------
add_subdirectory(libs/assimp)

# --------------------------------
# GLAD
# --------------------------------
add_library(glad libs/glad/src/glad.c)
target_include_directories(glad PUBLIC libs/glad/include)

# --------------------------------
# Source files
# --------------------------------
file(GLOB CORE_FILES "engine/core/*.cpp")
file(GLOB GRAPHIC_FILES "engine/graphics/*.cpp")
file(GLOB ASSET_FILES "engine/assets/*.cpp")
file(GLOB MATH_FILES "engine/math/*.cpp")

add_executable(render_engine ${CORE_FILES} ${GRAPHIC_FILES} ${ASSET_FILES} ${MATH_FILES})

# --------------------------------
# Assimp Includes
# --------------------------------
target_include_directories(render_engine PRIVATE libs/assimp/include)

# --------------------------------
# GLM (header-only)
# --------------------------------
target_include_directories(render_engine PUBLIC libs/glm)

# --------------------------------
# STB (header-only)
# --------------------------------
target_include_directories(render_engine PUBLIC libs/stb)

# --------------------------------
# Link libs
# --------------------------------
target_link_libraries(render_engine PRIVATE
    assimp
    glfw
    glad
)

# macOS frameworks
if(APPLE)
    find_library(COCOA Cocoa)
    find_library(OpenGL OpenGL)
    find_library(IOKIT IOKit)
    target_link_libraries(render_engine PRIVATE ${COCOA} ${OpenGL} ${IOKIT})
elseif(UNIX)
    find_package(OpenGL REQUIRED)
    target_link_libraries(render_engine PRIVATE OpenGL::GL)
endif()
