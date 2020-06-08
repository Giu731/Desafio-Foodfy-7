const {date } = require("../../lib/utils")
const Recipe_admin = require("../models/Recipe_admin")
const File = require("../models/File")

module.exports = {
    index(req, res){
        Recipe_admin.all( async function(recipes){
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

            return res.render ("admin/recipes/index", { recipeResults})
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

            const resultsFile = (await File.takeFiles(recipe.id)).rows
            let files = new Array()
            for(file of resultsFile){

                const fileId = file.file_id

                const resultsShowFile = await File.showFiles(fileId)
                let filesResults = resultsShowFile.rows[0]

                filesResults = {
                    ...filesResults,
                    src: `${req.protocol}://${req.headers.host}${filesResults.path.replace("public","")}`
                }

                files.push(filesResults)
            }
           
            console.log(files)
            return res.render("admin/recipes/show", {recipe, files})
        })
    },
    async edit(req, res){
        Recipe_admin.find(req.params.id, async function(recipe){
            if(!recipe) return res.send("Recipe not found")

            const resultsFile = (await File.takeFiles(recipe.id)).rows
            let files = new Array()
            for(file of resultsFile){

                const fileId = file.file_id

                const resultsShowFile = await File.showFiles(fileId)
                let filesResults = resultsShowFile.rows[0]

                filesResults = {
                    ...filesResults,
                    src: `${req.protocol}://${req.headers.host}${filesResults.path.replace("public","")}`
                }

                files.push(filesResults)
            }

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
        
        console.log(req.files.length)

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            let removedFilesPromise = removedFiles.map(id => File.deleteFromRecipeFiles(id))
            await Promise.all(removedFilesPromise)
            removedFilesPromise = removedFiles.map(id => File.deleteFromFiles(id))
            await Promise.all(removedFilesPromise)
        }


        if(req.files.length !=0){
            const newFilesPromise = req.files.map(file => File.create({...file}))
            const resultsFile = await (await Promise.all(newFilesPromise)).map(file => file.rows[0].id)
            resultsFile.map(id => File.linkToRecipeFile(id, req.body.id))

        }


        Recipe_admin.update(req.body, function(){
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
        return res.redirect(`/admin/recipes/${req.body.id}`)

    },
    async delete(req, res){
        if( req.body.id){

            const resultsFile = (await File.takeFiles(req.body.id)).rows
            for(file of resultsFile){
                const fileId = file.file_id
                File.deleteFromRecipeFiles(fileId)
    
                File.deleteFromFiles(fileId)
            }    
        }

        await Recipe_admin.delete(req.body.id, function(){
            return res.redirect("/admin/recipes")
        })
    }
    
}

