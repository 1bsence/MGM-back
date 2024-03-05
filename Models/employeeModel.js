const {getRights} = require("../utilities.js")
const { randomUUID } = require('crypto')

async function createEmployee(employee,role)
{
    return {
        id: randomUUID(),
        name: employee.name,
        email: employee.email,
        password: employee.password,
        role: "employee",
        skills: [],
        rights: await getRights("rights.json",role),
        projects: [],
        department: ""
    }
}

async function readContainerItems(conID)
{
    const result  = (await Cosmos_DB.containers.readAll().fetchAll()).resources.find(e => e.id === conID)
    if(!result)
    {
        return {id: "404"}
    }
    return (await Cosmos_DB.container(conID).items.readAll().fetchAll()).resources
}

module.exports = {
    createEmployee,
}