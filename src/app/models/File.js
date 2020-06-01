const db = require('../../config/db')

module.exports = {
    create({filename, path}){
        const query = `
        INSERT INTO files(
            name,
            path
        ) VALUES ($1, $2)
        RETURNING id
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },
    linkToRecipeFile(fileId, receitaId){
        const query = `
        INSERT INTO recipe_files(
            file_id,
            recipe_id
        ) VALUES ($1, $2)
        RETURNING id
        `

        const values = [
            fileId,
            receitaId
        ]

        return db.query(query, values)
    }
}