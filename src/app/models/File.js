const db = require('../../config/db')
const fs = require('fs')

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
    },
    async takeFiles(id){
        return db.query(`
        SELECT * FROM recipe_files WHERE recipe_id =$1 `, [id])
    },
    async showFiles(fileId){
        return db.query(`
        SELECT * FROM files WHERE id = $1`, [fileId])
    },
    async deleteFromRecipeFiles(id){
        try{
            const result = await db.query(`SELECT * FROM recipe_files WHERE file_id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

        }catch(err){
            console.error(err)
        }

        return db.query(`
        DELETE FROM recipe_files WHERE file_id = $1`, [id])
    },
    deleteFromFiles(id){
        return db.query(`
        DELETE FROM files WHERE id = $1`, [id])
    }
}