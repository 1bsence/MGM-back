const {CosmosClient} = require("@azure/cosmos")

const fs = require("fs")

require('dotenv').config()

// const Credentials = JSON.parse(fs.readFileSync("database.json")) am schimbat pe .env
//dai in consola npm i dotenv si adaugi in fisierul tau .env variabilele de mediu
//exemplu: COSMOS_ENDPOINT = "https://endpoint"
const endpoint = process.env.COSMOS_ENDPOINT
const key  = process.env.COSMOS_KEY
const dbid = process.env.COSMOS_DBID

const Cosmos_DB = new CosmosClient({endpoint,key}).database(dbid)

//Functie standard pt scris in baza de date
//conID se completeaza la apel cu numele containerului
//Data e un Obiect cu ce se va scrie efectic in baza, obligatoriu camp id
async function writeToDataBase(conID,Data)
{
    return new Promise(async (resolve,reject) =>{
        await Cosmos_DB.containers.createIfNotExists({id:conID})
        const resources = (await Cosmos_DB.container(conID).items.readAll().fetchAll()).resources
        if(resources.find((element) => element.id === Data.id))
        {
            resolve({id:"409"})
        }
        else
        {
            await Cosmos_DB.container(conID).items.create(Data)
            resolve({id:"201"})
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
            resolve(result)  
        }
    })
}

module.exports = {
    writeToDataBase,
    readContainerItems,
}
