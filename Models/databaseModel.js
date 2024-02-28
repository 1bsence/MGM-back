const {CosmosClient} = require("@azure/cosmos")

const fs = require("fs")

const Credentials = JSON.parse(fs.readFileSync("database.json"))
const endpoint = Credentials.endpoint
const key  = Credentials.key
const dbid = String(Credentials.dbid)


const Cosmos_DB = new CosmosClient({endpoint,key}).database(dbid)

//Functie standard pt scris in baza de date
//conID se completeaza la apel cu numele containerului
//Data e un Obiect cu ce se va scrie efectic in baza, obligatoriu camp id
async function writeToDataBase(conID,Data)
{
    return new Promise(async (resolve,reject) =>{
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


module.exports = {
    writeToDataBase
}
