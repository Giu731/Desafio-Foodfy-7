const {date } = require("../../lib/utils")
const Recipe_admin = require("../models/Recipe_admin")
const File = require("../models/File")

module.exports = {
    index(req, res){
        Recipe_admin.all(function(recipes){
            return res.render ("admin/recipes/index", { recipes})
        })
    },
    create(req, res){
        Recipe_admin.chefsSelectOptions(function(options){
            return res.render('admin/recipes/create.njk', {chefOptions: options})

        })
    },
    async post(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]=="" && key != "information"){
                return res.send("Por favor, preencha todos os campos.")
            }
        }

        if(req.files.length == 0){
            return res.send ("Por favor, selecione ao menos um arquivo")
        }

        const filesPromise = req.files.map(file => File.create({...file}))
        const resultsFile = await Promise.all(filesPromise)


        await Recipe_admin.create(req.body, function(recipe){
            resultsFile.map(id => File.linkToRecipeFile(id, recipe.id))
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },
    show(req, res){
        Recipe_admin.find(req.params.id, function(recipe){
            if(!recipe) return res.send("Recipe not found")

            return res.render("admin/recipes/show", {recipe})
        })
    },
    edit(req, res){
        Recipe_admin.find(req.params.id, function(recipe){
            if(!recipe) return res.send("Recipe not found")

            Recipe_admin.chefsSelectOptions(function(options){
                return res.render("admin/recipes/edit", {recipe, chefOptions: options})
            })
        })
    },
    put(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]==""){
                return res.send("Por favor, preencha todos os campos.")
            }
        }
        
        Recipe_admin.update(req.body, function(){
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res){
        Recipe_admin.delete(req.body.id, function(){
            return res.redirect("/admin/recipes")
        })
    }
    
}

