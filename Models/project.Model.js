const Database = require("./database.Model.js")
const Employee = require("./employee.Model.js")
const Department = require("./department.Model.js")
const { randomUUID } = require("crypto")


async function createProject(project) {
    const newProject = {
        id: randomUUID(),
        name: project.name,
        span: " ",
        status: " ",
        start: " ",
        deadline: " ",
        manager: " ",
        employees: [],
        description: " ",
        technologies: " "
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
        administrators = (await Employee.getAllEmployees(organization)).filter((employee)=>employee.roles.find((role) =>role === "Administrator"))
        for(i = 0; i < administrators.length;i++)
        {
            await Employee.newEmployeeNotification(organization,administrators[i].id,
                {
                    parent: project.id,
                    message:"A new project has been created!"})
        }   
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
            var newEmployees = []
            for(j = 0; j < project.employees.length; j++)
            {
                if(project.employees[j].status === undefined)
                {
                    employee_department = (await Employee.searchEmployeeByID(organization,project.employees[j].employee)).department
                    department_manager = (await Department.listDepartments(organization)).find((dpt) => dpt.name === employee_department).manager
                    notification = randomUUID()
                    Employee.newEmployeeNotification(organization,department_manager,{id: notification,message: "An employee has been proposed for a project!", parent: project.id})
                    project.employees[j].status = "proposed"
                    project.employees[j].awaiting = notification
                    newEmployees.push(project.employees[j])
                }
                else{
                    newEmployees.push( project.employees[j] )
                }
            }
            project.employees = newEmployees
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