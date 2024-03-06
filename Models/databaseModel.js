const {CosmosClient} = require("@azure/cosmos")

require('dotenv').config()


const endpoint = process.env.COSMOS_ENDPOINT
const key  = process.env.COSMOS_KEY
const dbid = process.env.COSMOS_DBID

const Cosmos_DB = new CosmosClient({endpoint,key}).database(dbid)

//returns a list of every organization id
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
//returns a list of every item in a container
//used to see full organization data
async function readContainerItems(conID)
{
    const result  = (await Cosmos_DB.containers.readAll().fetchAll()).resources.find(e => e.id === conID)
    if(!result)
    {
        return {id: "404"}
    }
    return (await Cosmos_DB.container(conID).items.readAll().fetchAll()).resources
}

//returneaza lista departamentelor,proiectelor,angajatilor 
//organization: id organizatie, container, id container, field id field
async function listOrganizationField(organization,container,field)
{
    const items = (await Cosmos_DB.container(organization).item(container,undefined).read()).resource[field]
    return items
}

async function replaceOrganizationField(organization,container,newfield)
{
    await Cosmos_DB.container(organization).item(container).replace({id:container,employees: newfield})
}

async function createContainerField(organization,field)
{
    await Cosmos_DB.containers.createIfNotExists({id:organization})

}

module.exports = {
    readContainerItems,
    listOrganizationField,
    listConIDs,
    replaceOrganizationField,
    createContainerField,
}