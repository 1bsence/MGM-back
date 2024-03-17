const Employee = require("../Models/employee.Model.js")
const Project = require("../Models/project.Model.js")
const Database = require("../Models/database.Model.js")


async function acceptProjectNotification(organization, notification) {
    project = await Project.listProject(organization, notification.parent)

    const employees = await Database.listOrganizationField(organization, "employees", "employees")

    depmanager = employees.find((obj) => obj.notifications.find((not) => not.id === notification.id))

    depmanager.notifications.splice(depmanager.notifications.findIndex((not) => not.id === notification.id), 1)

    index = project.employees.findIndex((obj) => obj.awaiting === notification.id)

    newemployee = employees.find((obj) => obj.id === project.employees[index].employee)

    newemployee.projects.push(project.name)
    //FIX THIS HERE > SEND NOTIFICATION TO EMPLOYEE THAT HE HAS BEEN ADDED TO PROJECT
    //Employee.newEmployeeNotification(organization, newemployee.id, `You have been assigned to project: ${project.name}`)

    project.employees[index] = {
        employee: project.employees[index].employee,
        role: project.employees[index].role,
        hours: project.employees[index].hours,
        status: "active",
    }
    projects = await Database.listOrganizationField(organization, "projects", "projects")

    projects[projects.findIndex((obj) => obj.id === notification.parent)] = project

    await Database.replaceOrganizationField(data.organization, "projects", "projects", projects)
    await Database.replaceOrganizationField(data.organization, "employees", "employees", employees)

    return project
}

async function rejectProjectNotification(organization, notification) {
    project = await Project.listProject(organization, notification.parent)
    const employees = await Database.listOrganizationField(organization, "employees", "employees")
    depmanager = employees.find((obj) => obj.notifications.find((not) => not.id === notification.id))

    depmanager.notifications.splice(depmanager.notifications.findIndex((not) => not.id === notification.id), 1)

    project.employees = project.employees.filter((obj) => obj.awaiting != notification.id)

    projects = await Database.listOrganizationField(organization, "projects", "projects")

    projects[projects.findIndex((obj) => obj.id === notification.parent)] = project

    await Database.replaceOrganizationField(data.organization, "projects", "projects", projects)
    await Database.replaceOrganizationField(data.organization, "employees", "employees", employees)

    return project
}

async function readNotification(organization,notification)
{
    const employees = await Database.listOrganizationField(organization, "employees", "employees")
    e = employees.find((obj) => obj.notifications.find((not) => not.id === notification.id))

    e.notifications.splice(e.notifications.findIndex((not) => not.id === notification.id), 1)
    await Database.replaceOrganizationField(data.organization, "employees", "employees", employees)
}

module.exports = {
    acceptProjectNotification,
    rejectProjectNotification,
    readNotification
}