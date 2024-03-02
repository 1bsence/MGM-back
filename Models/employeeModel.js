const {getRights} = require("../utilities.js")
const { randomUUID } = require('crypto')

async function createEmployee(employee,role)
{
    return {
        id: randomUUID(),
        name: employee.name,
        email: employee.email,
        password: employee.password,
        role: await getRights("rights.json",role).id,
        skills: "",
        rights: await getRights("rights.json",role),
        projects: [],
        department: ""
    }
}

module.exports = {
    createEmployee,
}