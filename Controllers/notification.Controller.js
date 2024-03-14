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
    project = await Project.listProject(data.organization,data.parent)
        for (j = 0; j < project.employees.length; j++) {
            if (project.employees[j].awaiting === data.id) {
                if (data.response) {
                    console.log(project.employees[j])
                    project.employees[j] = {
                        employee: project.employees[j].employee,
                        role: project.employees[j].role,
                        hours: project.employees[j].hours,
                        status: "active"
                    }
                    projects = await Project.listProjects(data.organization)
                    for(i = 0; i < projects.length;i++)
                    {
                        if(projects[i].id = project.id)
                        {
                            projects[i] = project
                        }
                        await Database.replaceOrganizationField(data.organization,"projects","projects",projects)
                    }
                    break
                }
            }
    }
    res.writeHead(200, headers)
    res.end(JSON.stringify({id:200}))
}

module.exports = {
    handleProjectNotification
}