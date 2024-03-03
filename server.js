const http = require("http")

const {newOrganization,newEmployee} = require("./Controllers/employeeController.js")

const {getcondata} = require("./Controllers/databaseController.js")

const server = http.createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': 2592000,// 30 days
        'Access-Control-Allow-Headers':'*',
        'Access-Control-Allow-Credentials': 'true',
        "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
        /** add other headers as per requirement */
      };

    if(req.url ==="/signup" && req.method === "POST")
    {
        newOrganization(req,res)
    }
    else if(req.url.match(/\/signup\/(.*)/) && req.method === "POST")
    {
        newEmployee(req,res)
    }
    else if(req.url ==="/seecon" && req.method === "POST")
    {
        getcondata(req,res)
    }
    else if(req.url ==="/home" && req.method === "GET")
    {
        res.writeHead(200,headers)
        res.end(JSON.stringify({message: "MGM BACK END"}))  
    }
    else
    {
        res.writeHead(404,headers)
        res.end(JSON.stringify({message: "Route Not Found"}))
    }
})


const PORT = process.env.PORT || 3030

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
