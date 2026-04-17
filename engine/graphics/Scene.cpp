#include "Scene.hpp"

Scene::Scene() {}
Scene::~Scene() {}

void Scene::addObjectToScene(RenderObject& newObj)
{
    obj.push_back(newObj);
}
