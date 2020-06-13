const {date } = require("../../lib/utils")
const db = require("../../config/db")

module.exports = {
    all(callback){
        db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC
        `, function(err, results){
            if( err ) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    create(data, fileId){
        const query = `
        INSERT INTO chefs(
            name,
            created_at,
            file_id
        ) VALUES ($1, $2, $3)
        RETURNING id
        `
        const values = [
            data.name,
            date(Date.now()).iso,
            fileId
        ]

        return db.query(query, values)
    },
    find(id, callback){
        db.query(`
        SELECT *
        FROM chefs 
        WHERE id = $1`, [id], function(err, results){
            if(err) throw `DataBase Erros! ${err}`

            callback(results.rows[0])
        })
    },
    async update(data){
        const query = `
        UPDATE chefs SET
        name = ($1),
        file_id = ($2)
        WHERE id = $3
        `
        const values = [
            data.name,
            data.file_id,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id, callback){
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results){
            if (err) throw `Database Error! ${err}`

            return callback()
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
        WHERE chefs.id = $1`, [id], function(err, results){
            if ( err ) throw `Database Error! ${err}`

            callback(results.rows)
        })
    }
}