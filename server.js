const http = require("http")

const { searchByDepartment,newEmployee, loginEmployee, promoteEmployee,
    notifyEmployee,notifiedEmployee,listEmployees,searchByRole,addEmployeeSkill } = require("./Controllers/employee.Controller.js")
const { addDepartment,readDepartment,modifyDepartment,removeDepartment, listAllDepartments } = require("./Controllers/department.Controller.js")
const { addProject,modifyProject,removeProject,readProject,listAllProjects} = require("./Controllers/project.Controller.js")
const { getcondata,getallconsdata } = require("./Controllers/database.Controller.js")
const { newOrganization } = require("./Controllers/organization.Controller.js")
const { addSkill,readSkill,modifySkill,removeSkill} = require("./Controllers/skill.Controller.js")
const {handleProjectNotification} = require("./Controllers/notification.Controller.js")
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
    else if (req.url === "/employee/promotion" && req.method === "POST") {
        promoteEmployee(req, res)
    }
    else if (req.url === "/employee/seeall" && req.method === "POST") {
        listEmployees(req, res)
    }
    else if (req.url === "/project/seeall" && req.method === "POST") {
        listAllProjects(req, res)
    }
    else if (req.url === "/department/seeall" && req.method === "POST") {
        listAllDepartments(req, res)
    }
    else if (req.url === "/notification/create" && req.method === "POST") {
        notifyEmployee(req, res)
    }
    else if (req.url === "/notification/remove" && req.method === "POST") {
        notifiedEmployee(req, res)
    }
    else if (req.url.match(/\/signup\/(.*)/) && req.method === "POST") {
        newEmployee(req, res)
    }
    else if (req.url === "/seecon" && req.method === "POST") {
        getcondata(req, res)
    }
    else if (req.url === "/seecons" && req.method === "GET") {
        getallconsdata(req,res)
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
    else if (req.url === "/employee/searchbydepartment" && req.method === "POST") {
        searchByDepartment(req, res)
    }
    else if (req.url === "/employee/searchbyrole" && req.method === "POST") {
        searchByRole(req, res)
    }
    else if(req.url === "/employee/addskill" && req.method === "POST")
    {
        addEmployeeSkill(req,res)
    }
    else if (req.url === "/project/create" && req.method === "POST") {
        addProject(req, res)
    }
    else if (req.url === "/project/modify" && req.method === "POST") {
        modifyProject(req, res)
    }
    else if (req.url === "/project/remove" && req.method === "POST") {
        removeProject(req, res)
    }
    else if (req.url === "/project/read" && req.method === "POST") {
        readProject(req, res)
    }
    else if (req.url === "/skill/create" && req.method === "POST") {
        addSkill(req, res)
    }
    else if (req.url === "/skill/read" && req.method === "POST") {
        readSkill(req, res)
    }
    else if (req.url === "/skill/modify" && req.method === "POST") {
        modifySkill(req, res)
    }
    else if (req.url === "/skill/remove" && req.method === "POST") {
        removeSkill(req, res)
    }
    else if (req.url === "/notification/project" && req.method === "POST") {
        handleProjectNotification(req, res)
    }
    else {
        res.writeHead(404, headers)
        res.end(JSON.stringify({ message: "Route Not Found" }))
    }
})

exports.headers = headers
const PORT = process.env.PORT || 3030

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
