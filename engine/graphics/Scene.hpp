#ifndef SCENE_HPP
#define SCENE_HPP

#include "RenderObject.hpp"
#include <vector>

class Scene
{
public:
    Scene();
    ~Scene();

    void addObjectToScene(RenderObject& newObj);

    std::vector<RenderObject> obj; // Do I want to limit this?

    // Need a way to remove certain objects form the scene
};

#endif