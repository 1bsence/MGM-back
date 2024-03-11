const Employee = require("./employee.Model.js")
const Database = require("./database.Model.js")

const { randomUUID } = require('crypto')

async function createOrganization(data) {
    const conid = randomUUID()
    if (await hasValidName(data.organization.name)) {
        return { id: 409, message: "Numele organizatiei este deja folosit" }
    }
    if (await Employee.searchEmployee(data.employee)) {
        return { id: 409, message: "Emailul este deja folosit" }
    }
    await Database.createContainerField(conid, {
        id: "organization",
        name: data.organization.name,
        address: data.organization.address
    })
    await Database.createContainerField(conid, {
        id: "projects",
        projects: []
    })
    await Database.createContainerField(conid, {
        id: "departments",
        departments: []
    })
    await Database.createContainerField(conid, {
        id: "skills",
        skills: []
    })
    const employee = await Employee.createEmployee(data.employee, ["Employee","Administrator"])
    await Database.createContainerField(conid, {
        id: "employees",
        employees: [employee]
    })
    return {
        organization: {
            id: conid,
            name: data.organization.name,
            address: data.organization.address
        },
        employee
    }
}

async function hasValidName(name) {
    const conids = (await Database.listConIDs()).filter(function (val) {
        return val !== "Organizations"
    })
    for (i = 0; i < conids.length; i++) {
        if ((await Database.listOrganizationField(conids[i], "organization", "name")) === name) {
            return true
        }
    }
    return false
}

module.exports = {
    createOrganization
}