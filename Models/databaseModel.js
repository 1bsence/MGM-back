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
    return new Promise(async (resolve,reject) =>{
        await Cosmos_DB.containers.createIfNotExists({id:org_conID}) //ar trebui sa fie deja creat, failsafe
        const resources = {
            name: data.organization.organization_name,
            url: data.organization.organization_name.replace(/[^A-Z0-9]+/ig, "_"),
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
            resolve({id:201,message: `org created`})
        }
        else
        {
            resolve({id:409,message: `Organization name already taken!`})
        }
    })
}


async function readContainerItems(conID)
{
    return new Promise(async (resolve,reject) =>{
        const result  = (await Cosmos_DB.containers.readAll().fetchAll()).resources.find(e => e.id === conID)
        if(!result )
        {
            resolve({id: "404"})
        }
        else
        {
            const resources = (await Cosmos_DB.container(conID).items.readAll().fetchAll()).resources
            resolve({id: "200", data: resources})  
        }
    })
}

async function isValidOrganization(resource)
{
    return new Promise(async (resolve,reject) =>{
        org = (await readContainerItems(org_conID)).data.find(org => org.name === resource.name)
        if(org)
        {
            resolve(false)
        }
        else
        {
            resolve(true)
        }
    })
}

module.exports = {
    createOrganization,
    readContainerItems,
}
