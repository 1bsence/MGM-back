const Database = require("../Models/databaseModel.js")
const { createEmployee } = require("../Models/employeeModel.js")
const { getPostData } = require("../utilities.js")

const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 2592000,// 30 days
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Credentials': 'true',
    "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    /** add other headers as per requirement */
};

async function newOrganization(req,res)
{
    try{
       // const data = await getPostData(req)
        const result = await Database.createOrganization(await getPostData(req))
        if(result.id == 201)
        {
            res.writeHead(201,headers)
            res.end(JSON.stringify(result)) 
        }
        else
        {
            res.writeHead(409,headers)
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
        res.writeHead(201,headers)
        res.end(JSON.stringify(result)) 
    }
    else{
        res.writeHead(409,headers)
        res.end(JSON.stringify(result)) 
    }
}
async function loginEmployee(req,res)
{
    const result = await Database.searchEmployeeCredentials(await getPostData(req))
    if(result)
    {
        res.writeHead(201,headers)
        res.end(JSON.stringify(result)) 
    }
    else
    {
        res.writeHead(409,headers)
        res.end("409 not found!")
    }
}
module.exports = {
    newOrganization,
    newEmployee,
    loginEmployee
}