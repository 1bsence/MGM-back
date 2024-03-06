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
/*
async function deletecons()
{
    const conids = (await listConIDs()).filter(function (val) {
        return val !== "Organizations"
    })
    for(i = 0; i < conids.length;i++)
    {
        await Cosmos_DB.container(conids[i]).delete()
    }
}
deletecons()
*/
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
//innoieste datele din baza, folosit pentru a updata un item dintr-un container eg departamente/proiecte/angajati
//organization - id organizatie, container - numele containerului eg projects/departments/employees
//fieldid = numele campului nou dupa inlocuire PUNE-L LA FEL CA LA CONTAINER: container = "employees" =>fieldid = "employees"!!!! altfel crapa codul boss
//newfield lista cu valorile updatate eg lista angajatilor cu schimbari /departamente cu schimbari
async function replaceOrganizationField(organization,container,fieldid,newfield)
{
    await Cosmos_DB.container(organization).item(container).replace({id:container,[fieldid]: newfield})
}

async function createContainerField(organization,field)
{
    await Cosmos_DB.containers.createIfNotExists({id:organization})
    await Cosmos_DB.container(organization).items.create(field)

}

module.exports = {
    readContainerItems,
    listOrganizationField,
    listConIDs,
    replaceOrganizationField,
    createContainerField,
}