const Employee = require("../Models/employee.Model.js")
const Project = require("../Models/project.Model.js")
const Database = require("../Models/database.Model.js")

const { getPostData } = require("../utilities.js")
const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 2592000,// 30 days
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
    "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    /** add other headers as per requirement */
}


/*
{
    notification: {
        organization:
        id:
        parent:
        response:
    }
}
*/
async function handleProjectNotification(req, res) {
    const data = await getPostData(req)
    project = await Project.listProject(data.organization, data.parent)
    const employees = await Database.listOrganizationField(data.organization,"employees","employees")
    depmanager = employees.find((obj) => obj.notifications.find((not) => not.id === data.id))
    depmanager.notifications.splice(depmanager.notifications.findIndex((not) => not.id === data.id),1)
    if (data.response === "accept") {
        index = project.employees.findIndex((obj) => obj.awaiting === data.id)
        newemployee = employees.find((obj) => obj.id === project.employees[index].employee)

        newemployee.projects.push(project.name)
        Employee.newEmployeeNotification(data.organization,newemployee.id,"You have been assigned to a new project!")

        project.employees[index] = {
            employee: project.employees[index].employee,
            role: project.employees[index].role,
            hours: project.employees[index].hours,
            status: "active",
        }
        projects = await Database.listOrganizationField(data.organization,"projects","projects")

        projects[projects.findIndex((obj) => obj.id === data.parent)] = project

        await Database.replaceOrganizationField(data.organization,"projects","projects",projects)
        await Database.replaceOrganizationField(data.organization,"employees","employees",employees)
        res.writeHead(200,headers)
        res.end("IT WORKS")
    }
    else if (data.response === "reject") {

    }
}


module.exports = {
    handleProjectNotification
}