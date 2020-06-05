const Chef_admin = require("../models/Chef_admin")
const File = require("../models/File")

module.exports = {
    index(req, res){
        Chef_admin.all(function(chefs){
            return res.render ("admin/chefs/index", { chefs})
        })
    },
    create(req, res){
        return res.render('admin/chefs/create.njk')
    },
    post(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]==""){
                return res.send("Por favor, preencha todos os campos.")
            }
        }
        
        if(req.files.length == 0){
            return res.send ("Por favor, selecione ao menos um arquivo")
        }

        // const filesPromise = req.files.map(file => File.create({...file}))
        // const resultsFile = await (await Promise.all(filesPromise)).map(file => file.rows[0].id)


        // const resultsRecipe = await Recipe_admin.create(req.body)
        // const recipeId = resultsRecipe.rows[0].id

        // resultsFile.map(id => File.linkToRecipeFile(id, recipeId))
        // console.error
       Chef_admin.create(req.body, async function(chef){
        const filesPromise = req.files.map(file => File.create({...file}))
        await Promise.all(filesPromise)

        console.error
            return res.redirect(`/admin/chefs/${chef.id}`)
       })
    },
    show(req, res){
        Chef_admin.find(req.params.id, function(chef){
            if(!chef) return res.send("Chef not found")

            Chef_admin.showRecipes(req.params.id, function(recipes){
                return res.render("admin/chefs/show", {chef, recipes})

            })
            

        })
    },
    edit(req, res){
        Chef_admin.find(req.params.id, function(chef){
            if(!chef) return res.send("Chef not found")

            return res.render("admin/chefs/edit", {chef})
        })
    },
    put(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]==""){
                return res.send("Por favor, preencha todos os campos.")
            }
        }
        
        Chef_admin.update(req.body, function(){
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res){
        Chef_admin.delete(req.body.id, function(){
            return res.redirect("/admin/chefs")
        })
    }
    
}
