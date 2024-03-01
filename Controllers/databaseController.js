const Database = require("../Models/databaseModel")
const { getPostData } = require("../utilities.js")

async function db_neworg(req,res)
{
    try{
        const data = await getPostData(req)
        const result = await Database.createOrganization(data)
        res.writeHead(201,{"Content-Type": "application/json"})
        res.end(JSON.stringify(result))  
    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    db_neworg
}