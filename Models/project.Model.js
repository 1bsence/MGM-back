const Database = require("./database.Model.js")
const Employee = require("./employee.Model.js")
const { randomUUID } = require("crypto")


async function createProject(project) {
    const newProject = {
        id: randomUUID(),
        name: project.name,
        span: project.span,
        status: project.status,
        start: project.start,
        deadline: project.deadline,
        manager: " ",
        employees: [],
        description: project.description,
        technologies: project.technologies
    }
    return newProject
}

async function newOrganizationProject(organization, project) {

    if (!(await searchProject(organization, project.name))) {
        const organizationProjects = (await Database.listOrganizationField(organization, "projects", "projects"))

        const newProject = await createProject(project)

        organizationProjects.push(newProject)

        await Database.replaceOrganizationField(organization, "projects", "projects", organizationProjects)

        orgname = await Database.listOrganizationField(organization, "organization", "name")
        project = newProject
        return {
            organization: {
                id: organization,
                name: orgname
            },
            project
        }
    }
    else {
        return { id: 409 }
    }
}

async function searchProject(organization, name) {
    const projectlist = await Database.listOrganizationField(organization, "projects", "projects")
    for (i = 0; i < projectlist.length; i++) {
        if (projectlist[i].name === name) {
            return true
        }
    }
    return false
}
/*
        name: project.name,
        span: project.span,
        status: project.status,
        start: project.start,
        deadline: project.deadline,
        manager: " ",
        employees: [],
        description: project.description,
        technologies: project.technologies
*/
async function updateOrganizationProject(organization, project) {

    const organizationProjects = await Database.listOrganizationField(organization, "projects", "projects")
    for (i = 0; i < organizationProjects.length; i++) {
        if (organizationProjects[i].id === project.id) {
            organizationProjects[i] = project
            
            await Database.replaceOrganizationField(organization,"projects","projects",organizationProjects)
            return project
        }
    }
}

async function deleteOrganizationProject(organization,project){
    noGo = ["In Progress","Closing","Closed"]
    if(noGo.find((str) => str === project.status))
    {
        return {id:405}
    }
    organizationProjects = await Database.listOrganizationField(organization, "projects", "projects")
    newProjects = []
    for(i = 0; i< organizationProjects.length; i++)
    {
        if(organizationProjects[i].id !== project.id)
        {
            newProjects.push(organizationProjects[i])
        }
    }

    await Database.replaceOrganizationField(organization,"projects","projects",newProjects)
    return {id: 204}
}

async function listProject(organization, id) {
    const projectlist = await Database.listOrganizationField(organization, "projects", "projects")
    for (i = 0; i < projectlist.length; i++) {
        if (projectlist[i].id === id) {
            return projectlist[i]
        }
    }
    return false
}

async function listProjects(organization) {
    return await Database.listOrganizationField(organization, "projects", "projects")
}
module.exports = {
    newOrganizationProject,
    updateOrganizationProject,
    deleteOrganizationProject,
    listProject,
    listProjects
}