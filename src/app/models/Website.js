const db = require("../../config/db")

module.exports = {
    all(callback){
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.created_at DESC
        `, function(err, results){
            if( err ) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    find(id, callback){
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results){
            if(err) throw `DataBase Erros! ${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback){
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.updated_at DESC
        `, function(err, results){
            if ( err ) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    showTotalRecipes(callback){
        db.query(`
        SELECT chefs.id, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        `, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results)
        })
    }, 
    showRecipes(id, callback){
        db.query(`
        SELECT recipes.*
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        ORDER BY recipes.created_at DESC`, [id], function(err, results){
            if ( err ) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    showChefs(callback){
        db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC
        `, function(err, results){
            if ( err ) throw `Database Error! ${err}`

            callback(results.rows)
        })
    }
}