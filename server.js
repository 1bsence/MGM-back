const http = require("http")

const { searchByDepartment,newEmployee, loginEmployee, promoteEmployee } = require("./Controllers/employee.Controller.js")
const { newOrganization } = require("./Controllers/organization.Controller.js")
const { getcondata } = require("./Controllers/database.Controller.js")
const { addDepartment,readDepartment,modifyDepartment,removeDepartment } = require("./Controllers/department.Controller.js")

const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 2592000,// 30 days
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
    "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    /** add other headers as per requirement */
};
const server = http.createServer((req, res) => {

    if (req.url === "/signup" && req.method === "POST") {
        newOrganization(req, res)
    }
    else if (req.url === "/promotion" && req.method === "POST") {
        promoteEmployee(req, res)
    }
    else if (req.url.match(/\/signup\/(.*)/) && req.method === "POST") {
        newEmployee(req, res)
    }
    else if (req.url === "/seecon" && req.method === "POST") {
        getcondata(req, res)
    }
    else if (req.url === "/login" && req.method === "POST") {
        loginEmployee(req, res)
    }
    else if (req.url === "/home" && req.method === "GET") {
        res.writeHead(200, headers)
        res.end(JSON.stringify({ message: "MGM BACK END" }))
    }
    else if (req.url === "/department/create" && req.method === "POST") {
        addDepartment(req, res)
    }
    else if (req.url === "/department/read" && req.method === "POST") {
        readDepartment(req, res)
    }
    else if (req.url === "/department/modify" && req.method === "POST") {
        modifyDepartment(req, res)
    }
    else if (req.url === "/department/remove" && req.method === "POST") {
        removeDepartment(req, res)
    }
    else if (req.url === "/searchbydepartment" && req.method === "POST") {
        searchByDepartment(req, res)
    }
    else {
        res.writeHead(404, headers)
        res.end(JSON.stringify({ message: "Route Not Found" }))
    }
})

exports.headers = headers
const PORT = process.env.PORT || 3030

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
