const http = require("http")

const { getEmployees, createEmployee, login } = require("./Controllers/employeeController.js")

const {db_CreateEmployee} = require("./Controllers/databaseController.js")


const server = http.createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
    }
    if(req.url === "/api/employees" && req.method === "GET")
    {
        getEmployees(req,res)
    }
    else if(req.url ==="/api/signup" && req.method === "POST")
    {
        db_CreateEmployee(req,res)
    }
    else if(req.url ==="/api/login" && req.method === "GET")
    {
        login(req,res)
    }
    else
    {
        res.writeHead(404,{"Content-Type":"application/json"})
        res.end(JSON.stringify({message: "Route Not Found"}))
    }
})


const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
