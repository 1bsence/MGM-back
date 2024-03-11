const Project = require("../Models/project.Model.js")
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

async function addProject(req, res) {
    data = await getPostData(req)
    const result = await Project.newOrganizationProject(data.organization.id, data.project)
    res.writeHead(201, headers)
    res.end(JSON.stringify(result))
}

async function modifyProject(req, res) {
    const data = await getPostData(req)
    result = await Project.updateOrganizationProject(data.organization.id, data.project)
    if (result) {
        res.writeHead(201, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}

async function removeProject(req, res) {
    const data = await getPostData(req)
    result = await Project.deleteOrganizationProject(data.organization.id, data.project)
    console.log(result)
    if (result.id === 204) {
        res.writeHead(204, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}

async function readProject(req, res) {
    const data = await getPostData(req)
    result = await Project.listProject(data.organization.id, data.department.id)
    if (result) {
        res.writeHead(201, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}


async function listAllProjects(req,res)
{
    const data = await getPostData(req)
    result = await Project.listProjects(data.id)
    res.writeHead(200, headers)
    res.end(JSON.stringify(result))
}
module.exports = {
    addProject,
    modifyProject,
    removeProject,
    readProject,
    listAllProjects
}