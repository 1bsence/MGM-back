const Organization = require("../Models/organization.Model.js")

const {getPostData} = require("../utilities.js")

const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 2592000,// 30 days
    'Access-Control-Allow-Headers':'*',
    'Access-Control-Allow-Credentials': 'true',
    "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    /** add other headers as per requirement */
}

async function newOrganization(req,res)
{
    result = await Organization.createOrganization(await getPostData(req))
    res.writeHead(201,headers)
    res.end(JSON.stringify(result)) 
}

module.exports = {
    newOrganization
}