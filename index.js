const express = require("express")
const app = express()
const path = require("path")
const mysql = require("mysql2/promise")
const config = require("./config")


app.use(express.static(path.resolve(__dirname, 'client')))
app.use(express.json())

app.delete('*', async function(req, res, next) {
    const conn = await mysql.createConnection(config)
    try {
        await conn.execute(`TRUNCATE TABLE leaderboard`)
        const [rows, fields] = await conn.execute("select * from leaderboard");
        let sendingData = JSON.stringify(rows)
        res.setHeader("Content-type", 'text/plain')
        res.status(200).send(sendingData)
        next()
    } catch (error) {
        throw error
    }
    conn.end()
})
app.post('*', async function(req, res, next) {
    let data = req.body
    const conn = await mysql.createConnection(config)

    try {
        if (Object.keys(data).length > 0) {
            await conn.execute(`INSERT INTO leaderboard (winner,date) VALUES ('${data.winner}','${data.Date}');`)
        }
        const [rows, fields] = await conn.execute("select * from leaderboard");
        let sendingData = JSON.stringify(rows)
        res.setHeader("Content-type", 'text/plain')
        res.status(200).send(sendingData)
        next()
    } catch (error) {
        throw error
    }
    conn.end()

})

app.listen(8080, () => {
    console.log("server has been started on port 8080...")
})