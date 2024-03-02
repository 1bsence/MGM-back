const {CosmosClient} = require("@azure/cosmos")

const { randomUUID } = require('crypto')

const {getRights} = require("../utilities.js")

require('dotenv').config()

const endpoint = process.env.COSMOS_ENDPOINT
const key  = process.env.COSMOS_KEY
const dbid = process.env.COSMOS_DBID

const Cosmos_DB = new CosmosClient({endpoint,key}).database(dbid)

const org_conID = "Organizations"

/*
vezi documentatie.txt pentru detalii
*/
async function createOrganization(data)
{

    await Cosmos_DB.containers.createIfNotExists({id:org_conID}) //ar trebui sa fie deja creat, failsafe
    let url = data.organization.organization_name ? data.organization.organization_name.replace(/[^a-z0-9]/gi, '_') : ''; //am modificat incat sa nu mai dea eroare daca nu e nu gaseste organizatin_name (in cazde nu e, url va fi gol, trebuie de pus sa dea eroare in cazul asta)
    const resources = {
        name: data.organization.organization_name,
        url: url,
        address: data.organization.organization_address,
        projects: [],
        departments: [],
        custom_roles: [],
        employees: [ 
            {
                id: randomUUID(),
                name: data.employee.name,
                email: data.employee.email,
                password: data.employee.password,
                role: getRights("rights.json","administrator").id,
                skills: "",
                rights: getRights("rights.json","administrator"),
                projects: [],
                department: ""
            }
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
    const resources = (await Cosmos_DB.container(conID).items.readAll().fetchAll()).resources
    return {id: "200", data: resources}  
}

async function isValidOrganization(resource)
{

    org = (await readContainerItems(org_conID)).data.find(org => org.name === resource.name)
    if(org)
    {
        return false
    }
    return true

}

module.exports = {
    createOrganization,
    readContainerItems,
}
