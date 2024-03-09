const Database = require("../Models/database.Model.js")
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

async function getcondata(req,res)
{
    try{
        const data = await getPostData(req)
        const result = await Database.readContainerItems(data.id)

            res.writeHead(201,headers)
            res.end(JSON.stringify(result))
            

    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getcondata
}