const http = require("http")

const {newOrganization,newEmployee} = require("./Controllers/employeeController.js")

const {getcondata} = require("./Controllers/databaseController.js")

const server = http.createServer((req, res) => {

    if(req.url ==="/signup" && req.method === "POST")
    {
        newOrganization(req,res)
    }
    else if(req.url.match(/\/signup\/(.*)/) && req.method === "POST")
    {
        newEmployee(req,res)
    }
    else if(req.url ==="/seecon" && req.method === "GET")
    {
        getcondata(req,res)
    }
    else if(req.url ==="/home" && req.method === "GET")
    {
        res.writeHead(200,{"Content-Type":"application/json"})
        res.end(JSON.stringify({message: "MGM BACK END"}))  
    }
    else
    {
        res.writeHead(404,{"Content-Type":"application/json"})
        res.end(JSON.stringify({message: "Route Not Found"}))
    }
})


const PORT = process.env.PORT || 3030

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
