const Employee = require("../Models/employee.Model.js")
const Project = require("../Models/project.Model.js")

const { getPostData } = require("../utilities.js")

/*
{
    notification: {
        id:
        parent:
        response:
    }
}
*/
async function handleNotification(req,res)
{
    const data = getPostData(req)

}