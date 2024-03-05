const {CosmosClient} = require("@azure/cosmos")

const Employee = require("./employeeModel.js")

require('dotenv').config()
const { randomUUID } = require('crypto')

const endpoint = process.env.COSMOS_ENDPOINT
const key  = process.env.COSMOS_KEY
const dbid = process.env.COSMOS_DBID

const Cosmos_DB = new CosmosClient({endpoint,key}).database(dbid)

async function listConIDs()
{
    const conz =(await Cosmos_DB.containers.readAll().fetchAll()).resources
    const idlist = []
    for(i = 0;i<conz.length;i++)
    {
        idlist.push(conz[i].id)
    }
    return idlist
}

async function createOrganization(data)
{
    const conid = randomUUID()
    if(await hasValidName(data.organization.name))
    {
        return {id: 409, message: "Numele organizatiei este deja folosit"}
    }
    if(await searchEmployee(data.employee))
    {
        return {id: 409, message: "Emailul este deja folosit"}
    }
    await Cosmos_DB.containers.createIfNotExists({id:conid}) // trebuie generat un conid dupa nume

    await Cosmos_DB.container(conid).items.create({
        id: "organization",
        name: data.organization.name,
        address: data.organization.address
    })
    await Cosmos_DB.container(conid).items.create({
        id: "projects",
        projects: []
    })
    await Cosmos_DB.container(conid).items.create({
        id: "departments",
        departments: []
    })
    const employee = await Employee.createEmployee(data.employee,"employee")
    await Cosmos_DB.container(conid).items.create({
        id: "employees",
        employees: [employee]
    })
    return {
        organization: {
            id: conid,
            name: data.organization.name
        },
        employee
    }
}

async function hasValidName(name)
{
    const conids = (await listConIDs()).filter(function (val) {
        return val !== "Organizations"
    })
    for(i = 0; i < conids.length;i++)
    {
        var organization = await (await Cosmos_DB.container(conids[i]).item("organization",undefined).read()).resource

        if(organization.name === name)
        {
            return true
        }
    }
    return false 
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

async function searchEmployee(employee)
{
    const conids = (await listConIDs()).filter(function (val) {
        return val !== "Organizations"
    })
    for(i = 0; i < conids.length;i++)
    {
        var organizationEmployees = await (await Cosmos_DB.container(conids[i]).item("employees",undefined).read()).resource.employees
        for(j = 0;j < organizationEmployees.length;j++)
        {
            if(organizationEmployees[j].email === employee.email)
            {
                return true
            }
        }
    }
    return false
}

async function searchEmployeeCredentials(employee)
{
    const conids = (await listConIDs()).filter(function (val) {
        return val !== "Organizations"
    })
    for(i = 0; i < conids.length;i++)
    {
        var organizationEmployees = await (await Cosmos_DB.container(conids[i]).item("employees",undefined).read()).resource.employees
        for(j = 0;j < organizationEmployees.length;j++)
        {
            if(organizationEmployees[j].email === employee.email && organizationEmployees[j].password === employee.password)
            {
                orgname = await (await Cosmos_DB.container(conids[i]).item("organization",undefined).read()).resource.name
                return {organization: {
                    id:conids[i],
                    name: orgname
                }, 
                employee: organizationEmployees[j]}
            }
        }
    }
    return false
}
async function newOrganizationEmployee(organization,employee)
{
    if(!(await searchEmployee(employee)))
    {
        organizationEmployees = (await getItemsFromContainer(organization,"employees","employees"))
        const newEmployee = await Employee.createEmployee(employee,"employee")
        organizationEmployees.push( newEmployee )
        await Cosmos_DB.container(organization).item("employees").replace({id:"employees",employees: organizationEmployees})
        orgname = await (await Cosmos_DB.container(organization).item("organization",undefined).read()).resource.name
        employee = newEmployee
        return {
            organization: {
                id:organization,
                name: orgname
            },
            employee
        }
    }
    else
    {
        return {id:409}
    }
}

//returneaza lista departamentelor,proiectelor,angajatilor 
//organization: id organizatie, container, id container, field id field
async function getItemsFromContainer(organization,container,field)
{
    const items = (await Cosmos_DB.container(organization).item(container,undefined).read()).resource[field]
    return items
}

module.exports = {
    createOrganization,
    readContainerItems,
    newOrganizationEmployee,
    searchEmployeeCredentials
}