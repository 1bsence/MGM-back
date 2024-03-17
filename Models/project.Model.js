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

async function teamFinder(organization, settings) {
    const employees = await Database.listOrganizationField(organization, "employees", "employees")
}

async function newOrganizationProject(organization, project) {

    if (!(await searchProject(organization, project.name))) {
        const organizationProjects = (await Database.listOrganizationField(organization, "projects", "projects"))

        const newProject = await createProject(project)

        organizationProjects.push(newProject)

        await Database.replaceOrganizationField(organization, "projects", "projects", organizationProjects)

        orgname = await Database.listOrganizationField(organization, "organization", "name")
        project = newProject
        administrators = (await Employee.getAllEmployees(organization)).filter((employee) => employee.roles.find((role) => role === "Administrator"))
        for (i = 0; i < administrators.length; i++) {
            await Employee.newEmployeeNotification(organization, administrators[i].id,
                {
                    parent: project.id,
                    message: "A new project has been created!",
                    type: "inform"
                })
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
    var newEmployees = []
    const organizationProjects = await Database.listOrganizationField(organization, "projects", "projects")
    const employees = await Database.listOrganizationField(organization, "employees", "employees")

    project_index = organizationProjects.findIndex(prj => prj.id === project.id)
    for (i = 0; i < project.employees.length; i++) {
        current_employee = project.employees[i]
        if (current_employee.status === undefined) {
            employee_department = (await Employee.searchEmployeeByID(organization, current_employee.employee)).department
            department_manager = (await Department.listDepartments(organization)).find((dpt) => dpt.name === employee_department).manager

            notification = randomUUID()
            emp_name = employees.find((obj) => obj.id === current_employee.employee).name
            Employee.newEmployeeNotification(organization, department_manager, {
                id: notification,
                message: `${emp_name} has been requested ${current_employee.hours} hours/day for ${project.name} project`,
                parent: project.id,
                type: "action"
            })

            current_employee.status = "proposed"
            current_employee.awaiting = notification

            newEmployees.push(current_employee)
        }
        else if (current_employee.status === "removing") {
            employee_department = (await Employee.searchEmployeeByID(organization, current_employee.employee)).department

            department_manager = (await Department.listDepartments(organization)).find((dpt) => dpt.name === employee_department).manager

            notification = randomUUID()
            emp_name = employees.find((obj) => obj.id === current_employee.employee).name
            Employee.newEmployeeNotification(organization, department_manager, {
                id: notification,
                message: `${emp_name} is being removed from  ${project.name} project. Reason: ${current_employee.reason}`,
                parent: project.id,
                type: "action"
            })

            current_employee.status = "removing"
            current_employee.awaiting = notification

            newEmployees.push(current_employee)
        }
        else {
            newEmployees.push(current_employee)
        }
    }
    project.employees = newEmployees
    organizationProjects[project_index] = project
    await Database.replaceOrganizationField(organization, "projects", "projects", organizationProjects)
    return project
}


async function deleteOrganizationProject(organization, project) {
    noGo = ["In Progress", "Closing", "Closed"]
    if (noGo.find((str) => str === project.status)) {
        return { id: 405 }
    }
    organizationProjects = await Database.listOrganizationField(organization, "projects", "projects")
    newProjects = []
    for (i = 0; i < organizationProjects.length; i++) {
        if (organizationProjects[i].id !== project.id) {
            newProjects.push(organizationProjects[i])
        }
    }

    await Database.replaceOrganizationField(organization, "projects", "projects", newProjects)
    return { id: 204 }
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