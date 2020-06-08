const Website = require('../models/Website')
const File = require("../models/File")


module.exports = {
    home(req, res){
        const { filter } = req.query

        if(filter){
            return res.redirect("/search", {filter})

        }else{
            Website.all(async function(recipes){
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
                return res.render("home", {items: recipeResults})
            })
        }
    },
    sobre(req, res){
        const { filter } = req.query

        if(filter){
            return res.redirect("/search", {filter})

        }else{
            return res.render("sobre")
        }
    },
    receitas(req, res){
        const { filter } = req.query

        if(filter){
            return res.redirect("/search", {filter})

        }else{
            Website.all(async function(recipes){
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
                return res.render("receitas", {items: recipeResults})
            })
        }  
    },
    show(req, res){
        const { filter } = req.query

        if(filter){
            return res.redirect("/search", {filter})

        }else{
            Website.find(req.params.id, async function(recipe){
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

                return res.render("paginareceita", {item: recipe, files})
            })
        }
        
    },
    search(req, res){
        const { filter } = req.query
        Website.findBy(filter, async function(recipes){
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
            return res.render("search", {filter, items: recipeResults})
        })
    },
    showChefs(req, res){
        const { filter } = req.query

        if(filter){
            return res.redirect("/search", {filter})

        }else{
            Website.showChefs(function(chefs){
                return res.render("chefs", {chefs})
            })
        }  
    }
}


