const Custom_Role = require("../Models/custom_role.Model.js")
const { getPostData } = require("../utilities.js")

const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 2592000,// 30 days
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Credentials': 'true',
    "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    /** add other headers as per requirement */
}

async function handleRoles(req,res)
{
    const data = await getPostData(req)
    if(data.action === "new")
    {
        Custom_Role.newCRole(data.organization,data.role)
        res.writeHead(200,headers)
        res.end(JSON.stringify({id: 204}))
    }
    else if(data.action === "read")
    {
        result = await Custom_Role.readCRoles(data.organization)
        res.writeHead(200,headers)
        res.end(JSON.stringify(result))
    }
    else if(data.action === "delete")
    {
        Custom_Role.deleteCRole(data.organization,data.role)
        res.writeHead(200,headers)
        res.end(JSON.stringify({id: 204}))
    }
    else if(data.action === "modify")
    {
        Custom_Role.modifyCRole(data.organization,data.role,data.newrole)
        res.writeHead(200,headers)
        res.end(JSON.stringify({id: 204}))
    }
}

module.exports = {
    handleRoles
}