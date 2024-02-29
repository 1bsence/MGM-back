const Database = require("../Models/databaseModel")

const {getPostData } = require("../utilities.js")

//conID -numele organizatiei, foarte sugestiv stiu multumesc!
//data -obiect cu primul angajat, vezi structura bazei de date 
async function newOrganization(organization,owner)
{
    return new Promise(async (resolve,reject) =>{

        resolve(await Database.writeToDataBase(organization.organization_name,{Organization_Address: organization.organization_hq, Employees: [ owner]}))
    })
}

async function seeContainer(conID)
{
    return Database.readContainerItems(conID)
}


module.exports = {
    newOrganization,
    seeContainer,
}