const Database = require("../Models/databaseModel")

const {getPostData } = require("../utilities.js")

//conID -numele organizatiei, foarte sugestiv stiu multumesc!
//data -obiect cu primul angajat, vezi structura bazei de date 


async function seeContainer(conID)
{
    return Database.readContainerItems(conID)
}


module.exports = {
    seeContainer,
}