const http = require("http")

const { seeCON } = require("./Controllers/employeeController.js")

const { db_neworg } = require("./Controllers/databaseController.js")


const server = http.createServer((req, res) => {

    if(req.url ==="/api/signup" && req.method === "POST")
    {
        db_neworg(req,res)
    }
    else if(req.url ==="/api/seecon" && req.method === "GET")
    {
        seeCON(req,res)
    }
    else
    {
        res.writeHead(404,{"Content-Type":"application/json"})
        res.end(JSON.stringify({message: "Route Not Found"}))
    }
})


const PORT = process.env.PORT || 3030

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
