const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const recipes = require('./app/controllers/recipes_admin')
const chefs = require('./app/controllers/chefs_admin')
const foodfy = require('./app/controllers/foodfy')

routes.get("/", foodfy.home)
routes.get("/sobre", foodfy.sobre)
routes.get("/receitas", foodfy.receitas)
routes.get("/search", foodfy.search)
routes.get("/receitas/:id", foodfy.show)
routes.get("/chefs", foodfy.showChefs)

routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id", recipes.show)
routes.get("/admin/recipes/:id/edit", recipes.edit)

routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", chefs.edit)

routes.post("/admin/recipes", multer.array("photos", 5), recipes.post)
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put)
routes.delete("/admin/recipes", recipes.delete)

routes.post("/admin/chefs", chefs.post)
routes.put("/admin/chefs", chefs.put)
routes.delete("/admin/chefs", chefs.delete)


module.exports = routes