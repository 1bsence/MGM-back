const Database = require("../Models/databaseModel.js")
const { getPostData } = require("../utilities.js")

async function getcondata(req,res)
{
    try{
        const data = await getPostData(req)
        const result = await Database.readContainerItems(data.id)

            res.writeHead(201,{"Content-Type": "application/json"})
            res.end(JSON.stringify(result))
            

    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getcondata
}