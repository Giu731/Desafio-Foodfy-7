const Website = require('../models/Website')

module.exports = {
    home(req, res){
        const { filter } = req.query

        if(filter){
            return res.redirect("/search", {filter})

        }else{
            Website.all(function(recipes){
                return res.render("home", {items: recipes})
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
            Website.all(function(recipes){
                return res.render("receitas", {items: recipes})
            })
        }  
    },
    show(req, res){
        const { filter } = req.query

        if(filter){
            return res.redirect("/search", {filter})

        }else{
            Website.find(req.params.id, function(recipe){
                if(!recipe) return res.send("Recipe not found")
    
                return res.render("paginareceita", {item: recipe})
            })
        }
        
    },
    search(req, res){
        const { filter } = req.query
        Website.findBy(filter, function(recipes){
              return res.render("search", {filter, items: recipes})
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


