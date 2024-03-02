const Database = require("../Models/databaseModel.js")
const { createEmployee } = require("../Models/employeeModel.js")

const { getPostData } = require("../utilities.js")

async function newOrganization(req,res)
{
    try{
       // const data = await getPostData(req)
        const result = await Database.createOrganization(await getPostData(req))
        if(result.id == 201)
        {
            res.writeHead(201,{"Content-Type": "application/json"})
            res.end(JSON.stringify(result)) 
        }
        else
        {
            res.writeHead(409,{"Content-Type": "application/json"})
            res.end(JSON.stringify(result)) 
        }
    }catch(error){
        console.log(error)
    }
}

async function newEmployee(req,res)
{
    const org_id = req.url.match(/\/signup\/(.*)/)[1]
    const data =await getPostData(req)
    const employee = await createEmployee(data.employee,"employee")
    const result = await Database.pushEmployee(org_id,employee)
    if(result.id === 201)
    {
        res.writeHead(201,{"Content-Type": "application/json"})
        res.end(JSON.stringify(result)) 
    }
    else{
        res.writeHead(409,{"Content-Type": "application/json"})
        res.end(JSON.stringify(result)) 
    }
}

module.exports = {
    newOrganization,
    newEmployee,
}