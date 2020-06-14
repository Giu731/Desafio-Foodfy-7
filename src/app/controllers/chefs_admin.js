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

        const filesPromise = req.files.map(file => File.create({...file}))
        const resultsFile = await (await Promise.all(filesPromise)).map(file => file.rows[0].id)
        const fileId = resultsFile[0]

        console.error

        const chefResults = await Chef_admin.create(req.body, fileId)
        const chef = chefResults.rows[0]

        return res.redirect(`/admin/chefs/${chef.id}`)

    },
    show(req, res){
        Chef_admin.find(req.params.id, async function(chef){
            if(!chef) return res.send("Chef not found")

            const resultsFileChef = await File.showFiles(chef.file_id)
            let files = resultsFileChef.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))
            console.log(files[0].src)
            chef = {
                ...chef,
                avatar: files[0].src,
                avatarId: files[0].id
                
            }
            console.log(chef)

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
        Chef_admin.find(req.params.id, async function(chef){
            if(!chef) return res.send("Chef not found")

            const resultsFileChef = await File.showFiles(chef.file_id)
            let files = resultsFileChef.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))
            console.log(files[0])
            console.log(files[0].src)
            chef = {
                ...chef,
                avatar: files[0].src,
                avatarUrl: files[0].filename,
                avatarId: files[0].id
            }

            console.log(chef.avatar)
            return res.render("admin/chefs/edit", {chef})
        })
    },
    async put(req, res){
        let chefResults = req.body
        // console.log(chefResults)

        const keys = Object.keys(req.body)
        for(key of keys){
            if(req.body[key]=="" && key != "removed_files"){
                return res.send("Por favor, preencha todos os campos.")
            }
        }       

        console.log(req.files)
        if(req.files.lenght != 0 ){
            const newFilesPromise = req.files.map(file => File.create({...file}))
            const resultsFile = await (await Promise.all(newFilesPromise)).map(file => file.rows[0].id)
            newFileId = resultsFile[0]
            console.log(newFileId)
            req.body.file_id = newFileId

            chefResults = await Chef_admin.update(req.body)
        }

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1

            removedFiles.splice(lastIndex, 1)
            const removedFilesPromise = removedFiles.map(id => File.deleteFromFiles(id))

            await Promise.all(removedFilesPromise)
        }
            
        console.log(chefResults)
        return res.redirect(`/admin/chefs/${chefResults.id}`)
        
    },
    delete(req, res){
        Chef_admin.delete(req.body.id, function(){
            return res.redirect("/admin/chefs")
        })
    }
    
}
