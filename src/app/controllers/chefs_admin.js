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
    async post(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]==""){
                return res.send("Por favor, preencha todos os campos.")
            }
        }
        
        console.log(req.files)
        if(req.files.length == 0){
            return res.send ("Por favor, selecione ao menos um arquivo")
        }

        const filesPromise = req.files.map(file => File.create({...file,
            chef_id: req.body.id}))
        await Promise.all(filesPromise)
    
        console.error

        await Chef_admin.create(req.body)
        return res.redirect(`/admin/chefs/${chef.id}`)

    },
    show(req, res){
        Chef_admin.find(req.params.id, function(chef){
            if(!chef) return res.send("Chef not found")

            Chef_admin.showRecipes(req.params.id, async function(recipes){
                let recipeResults = []
                for(recipe of recipes){
                    const resultsFile = await File.takeFiles(recipe.id)
                    const fileId = resultsFile.rows[0].file_id

                    const resultsShowFile = await File.showFiles(fileId)

                    let files = resultsShowFile.rows
                    files = files.map(file => ({
                        ...file,
                        src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
                    }))

                    const recipeFinal = {
                        ...recipe,
                        image: files
                    }
            
                    recipeResults.push(recipeFinal)
                }
                return res.render("admin/chefs/show", {chef, recipes: recipeResults})

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
