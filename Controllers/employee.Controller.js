const Employee = require("../Models/employee.Model.js")
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

async function newEmployee(req, res) {
    const org_id = req.url.match(/\/signup\/(.*)/)[1]
    const data = await getPostData(req)
    const employee = await Employee.createEmployee(data.employee, ["employee"])
    const result = await Employee.newOrganizationEmployee(org_id, employee)
    if (result.id === 201) {
        res.writeHead(201, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(409, headers)
        res.end(JSON.stringify(result))
    }
}
async function loginEmployee(req, res) {
    const result = await Employee.searchEmployeeCredentials(await getPostData(req))
    if (result) {
        res.writeHead(201, headers)
        res.end(JSON.stringify(result))
    }
    else {
        res.writeHead(404, headers)
        res.end(JSON.stringify({ id: 404 }))
    }
}

/* request:
{
    organization: orgid
    employee: employeeid
    role: new role: administrator/employee/department_manager/project_manager
    add: "+" to be added, anything else, "-" prefered to be deleted
}
*/
async function promoteEmployee(req, res) {
    data = await getPostData(req)
    const result = await Employee.updateEmployeeRoles(data.organization, data.employee, data.role, data.add)
    res.writeHead(200, headers)
    res.end(JSON.stringify(result))
}

async function searchByDepartment(req, res) {
    data = await getPostData(req)
    const result = await Employee.searchEmployeesByDepartment(data.organization, data.department)
    res.writeHead(200, headers)
    res.end(JSON.stringify(result))
}


module.exports = {
    loginEmployee,
    newEmployee,
    promoteEmployee,
    searchByDepartment
}