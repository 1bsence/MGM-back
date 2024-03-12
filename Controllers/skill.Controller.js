const Skill = require("../Models/skill.Model.js")
const { getPostData } = require("../utilities.js")

const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 2592000,// 30 days
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
    "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    /** add other headers as per requirement */
}

async function addSkill(req, res) {
    data = await getPostData(req)
    const result = await Skill.newOrganizationSkill(data.organization.id, data.skill)
    res.writeHead(201, headers)
    res.end(JSON.stringify(result))
}

async function readSkill(req,res){
    const data = await getPostData(req)
    result = await Skill.readSkill(data.organization.id, data.skill.id)
    if (result) {
        res.writeHead(201, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}
async function modifySkill(req,res){
    const data = await getPostData(req)
    result = await Skill.updateSkill(data.organization.id, data.skill)
    if (result) {
        res.writeHead(201, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}
async function removeSkill(req,res){
    const data = await getPostData(req)
    result = await Skill.deleteSkill(data.organization.id, data.skill)
    if (result.id === 204) {
        res.writeHead(200, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}    

module.exports = {
    addSkill,
    readSkill,
    modifySkill,
    removeSkill
}