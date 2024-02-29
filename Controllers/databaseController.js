const Database = require("../Models/databaseModel")
const { getPostData } = require("../utilities.js")

async function db_CreateEmployee(req,res)
{
    try{
        const data = await getPostData(req)
        if((await Database.writeToDataBase("Employees",data)).id === "201")
        {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.writeHead(201,{"Content-Type": "application/json"})
            res.end("Resource created successsfully")
        }
        else
        {
            res.writeHead(409,{"Content-Type": "application/json"})
            res.end("Resource already exists")
        }
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    db_CreateEmployee
}