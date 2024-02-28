const  Employee = require("../Models/employeeModel")

const { getPostData} = require("../utilities")
async function getEmployees(req, res)
{
    try
    {
        const employees = await Employee.findAll()

        res.writeHead(200,{"Content-Type": "application/json"})
        res.end(JSON.stringify(employees))

    }
    catch(error)
    {
        console.log(error)
    }
}
async function login(req,res)
{
    try
    {
        const data = await getPostData(req)
        const employee = await Employee.validEmployee(data)
        console.log(employee)
        if(employee)
        {
            res.writeHead(201,{"Content-type":"application/json"})
            res.end(JSON.stringify(employee))
        }
        else
        {
            res.writeHead(404,{"Content-type":"application/json"})
            res.end(JSON.stringify({"error":"not found"}))
        }
    }
    catch(error)
    {
        console.log(error)
    }
}
async function createEmployee(req,res)
{
    try 
    {
        const employee = await getPostData(req)

        if(await Employee.validSignUp(employee))
        {
            Employee.create(employee)
            res.writeHead(201,{"Content-type":"application/json"})
            return res.end(JSON.stringify(employee))     
        }
        else
        {
            res.writeHead(401,{"Content-type":"application/json"})
            return res.end("email already in use")
        }
    }
    catch(error)
    {
        console.log(error)
    }
}

module.exports = {
    getEmployees,
    createEmployee,
    login
}
