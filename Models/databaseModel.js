const {CosmosClient} = require("@azure/cosmos")
const Employee = require("./employeeModel.js")
require('dotenv').config()

const endpoint = process.env.COSMOS_ENDPOINT
const key  = process.env.COSMOS_KEY
const dbid = process.env.COSMOS_DBID

const Cosmos_DB = new CosmosClient({endpoint,key}).database(dbid)

const org_conID = "Organizations"

//Cosmos_DB.container(org_conID).delete()

async function createOrganization(data)
{
    await Cosmos_DB.containers.createIfNotExists({id:org_conID}) //ar trebui sa fie deja creat, failsafe
    const resources = {
        name: data.organization.organization_name,
        //url: data.organization.organization_name.replace(/[^A-Z0-9]+/ig, "_"),
        address: data.organization.organization_address,
        projects: [],
        departments: [],
        custom_roles: [],
        employees: [ 
            await Employee.createEmployee(data.employee,"administrator")
        ]
    }
    if(await isValidOrganization(resources))
    {
        await Cosmos_DB.container(org_conID).items.create(resources)
        return {id:201,message: `org created`}
    }
    return {id:409,message: `Organization name already taken!`}
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

async function isValidOrganization(resource)
{
    org = (await readContainerItems(org_conID)).find(org => org.name === resource.name)
    if(org)
    {
        return false
    }
    return true
}

async function pushEmployee(org_id,employee)
{
    const org = (await readContainerItems(org_conID)).find(org => org.id === org_id)
    org.employees.push(employee)
    Cosmos_DB.container(org_conID).item(org.id).replace(org)
    //console.log(org)
    return {id: 201}
}


module.exports = {
    createOrganization,
    readContainerItems,
    pushEmployee,
}