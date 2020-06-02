const {date } = require("../../lib/utils")
const Recipe_admin = require("../models/Recipe_admin")
const File = require("../models/File")

module.exports = {
    index(req, res){
        Recipe_admin.all( async function(recipes){
            // for(recipe in recipes){
            //     const resultsFile = await File.takeFiles(recipe.id)
            //     const fileId = resultsFile.rows[0].file_id

            //     const resultsShowFile = await File.showFiles(fileId)
            //     let files = resultsShowFile.rows
            //     files = files.map(file => ({
            //         ...file,
            //         src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            //     }))
            // }
           
            return res.render ("admin/recipes/index", { recipes})
        })
    },
    async create(req, res){
        const resultsOptions = await Recipe_admin.chefsSelectOptions()
            const options = resultsOptions.rows
            return res.render('admin/recipes/create.njk', {chefOptions: options})
        
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
        const resultsFile = await (await Promise.all(filesPromise)).map(file => file.rows[0].id)


        const resultsRecipe = await Recipe_admin.create(req.body)
        const recipeId = resultsRecipe.rows[0].id

        resultsFile.map(id => File.linkToRecipeFile(id, recipeId))
        console.error
        return res.redirect(`/admin/recipes/${recipeId}`)
    },
    async show(req, res){
        Recipe_admin.find(req.params.id, async function(recipe){
            if(!recipe) return res.send("Recipe not found")

            const resultsFile = await File.takeFiles(recipe.id)
            console.log(resultsFile)
            const fileId = resultsFile.rows[0].file_id

            const resultsShowFile = await File.showFiles(fileId)
            let files = resultsShowFile.rows
            console.log(files)
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))
           

            return res.render("admin/recipes/show", {recipe, files})
        })
    },
    async edit(req, res){
        Recipe_admin.find(req.params.id, async function(recipe){
            if(!recipe) return res.send("Recipe not found")

            const resultsFile = await File.takeFiles(recipe.id)
            const fileId = resultsFile.rows[0].file_id

            const resultsShowFile = await File.showFiles(fileId)
            let files = resultsShowFile.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))

            const resultsOptions = await Recipe_admin.chefsSelectOptions()
            const options = resultsOptions.rows
            return res.render("admin/recipes/edit", {recipe, chefOptions: options, files})
        })
    },
    async put(req, res){
        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]=="" && key != "information" && key != "removed_files"){
                return res.send("Por favor, preencha todos os campos.")
            }
        }
        
        if(req.files.length == 0){
            return res.send ("Por favor, selecione ao menos um arquivo")
        }

        if(req.files.length !=0){
            const newFilesPromise = req.files.map(file => File.create({...file}))
            const resultsFile = await (await Promise.all(newFilesPromise)).map(file => file.rows[0].id)
            resultsFile.map(id => File.linkToRecipeFile(id, req.body.id))

        }

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        Recipe_admin.update(req.body, function(){
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    async delete(req, res){
        if( req.files && req.files.length != 0){
            File.deleteFromRecipeFiles(req.body.id)

            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        Recipe_admin.delete(req.body.id, function(){
            return res.redirect("/admin/recipes")
        })
    }
    
}

