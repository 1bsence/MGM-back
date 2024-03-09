const Department = require("../Models/department.Model.js")
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

async function addDepartment(req, res) {
    data = await getPostData(req)
    const result = await Department.newOrganizationDepartment(data.organization.id, data.department)
    res.writeHead(201, headers)
    res.end(JSON.stringify(result))
}

async function readDepartment(req, res) {
    const data = await getPostData(req)
    console.log(data)
    result = await Department.listDepartment(data.organization.id, data.department.id)
    if (result) {
        res.writeHead(201, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}

async function modifyDepartment(req, res) {
    const data = await getPostData(req)
    result = await Department.updateOrganizationDepartment(data.organization.id, data.department)
    if (result) {
        res.writeHead(201, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}

async function removeDepartment(req, res) {
    const data = await getPostData(req)
    result = await Department.deleteOrganizationDepartment(data.organization.id, data.department)
    if (result.id === 204) {
        res.writeHead(204, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end("Not Found")
    }
}

module.exports = {
    addDepartment,
    removeDepartment,
    modifyDepartment,
    readDepartment
}