const Database = require("./database.Model.js")
const Employee = require("./employee.Model.js")
const { randomUUID } = require("crypto")


//used to generate a department object from frontend request data
async function createDepartment(department) {
    const newDepartment = {
        id: randomUUID(),
        name: department.name,
        manager: " ",
        skills: [],
        employees: []
    }
    return newDepartment
}
//creaza un departament nou in baza, organization - id organizatie, department - obiectul department din request
async function newOrganizationDepartment(organization, department) {

    if (!(await searchDepartment(organization, department.name))) {
        const organizationDepartments = (await Database.listOrganizationField(organization, "departments", "departments"))

        const newDepartment = await createDepartment(department)

        organizationDepartments.push(newDepartment)

        await Database.replaceOrganizationField(organization, "departments", "departments", organizationDepartments)

        orgname = await Database.listOrganizationField(organization, "organization", "name")

        department = newDepartment
        administrators = (await Employee.getAllEmployees(organization)).filter((employee)=>employee.roles.find((role) =>role === "Administrator"))
        for(i = 0; i < administrators.length;i++)
        {
            await Employee.newEmployeeNotification(organization,administrators[i].id,
                {
                    parent: department.id,
                    message:"A new department has been created!"})
        }       
        return {
            organization: {
                id: organization,
                name: orgname
            },
            department
        }
    }
    else {
        return { id: 409 }
    }
}
//verifica daca exista un departament cu acelasi nume in baza
//organization - id organizatie, nume- nume ce trebuie cautat
async function searchDepartment(organization, name) {
    const departmentlist = await Database.listOrganizationField(organization, "departments", "departments")
    for (i = 0; i < departmentlist.length; i++) {
        if (departmentlist[i].name === name) {
            return true
        }
    }
    return false
}

async function listDepartment(organization, id) {
    const departmentlist = await Database.listOrganizationField(organization, "departments", "departments")
    for (i = 0; i < departmentlist.length; i++) {
        if (departmentlist[i].id === id) {
            return departmentlist[i]
        }
    }
    return false
}


//WORKS BUT DOES NOT UPDATE THE NAME IF IT ALREADY EXISTS IN THE DATABASE AND DOES NOT SEND A WARNING ABOUT THIS
async function updateOrganizationDepartment(organization, department) {
    department.employees.push(department.manager)

    const organizationDepartments = await Database.listOrganizationField(organization, "departments", "departments")
    for (i = 0; i < organizationDepartments.length; i++) {
        if (organizationDepartments[i].id === department.id) {
            let oldDepartment = organizationDepartments[i]

            await Employee.updateEmployeeDepartment(organization, oldDepartment.employees, " ")
            await Employee.updateEmployeeDepartment(organization, department.employees, " ")
            if (!(await searchDepartment(organization, department.name))) {
                oldDepartment.name = department.name
            }
            oldDepartment.manager = department.manager
            oldDepartment.skills = department.skills
            oldDepartment.employees = department.employees

            await Employee.updateEmployeeDepartment(organization, department.employees, department.name)
            for(j = 0;j < department.employees.length; j++)
            {
                await Employee.newEmployeeNotification(organization,department.employees[j],
                    {
                        parent: department.id,
                        message:"You have been assigned to a new department!"})
            }
            break
        }
    }

    await Database.replaceOrganizationField(organization, "departments", "departments", organizationDepartments)

    orgname = await Database.listOrganizationField(organization, "organization", "name")
    return {
        organization: {
            id: organization,
            name: orgname
        },
        department
    }
}
//organization = id organizaiton, department = department object to be deleted
async function deleteOrganizationDepartment(organization, department) {
    const oldemployees = await Employee.searchEmployeesByDepartment(organization, department.name)
    const oldemployeesids = []
    for (i = 0; i < oldemployees.length; i++) {
        oldemployeesids.push(oldemployees[i].id)
    }
    if (oldemployees.length > 0) {
        await Employee.updateEmployeeDepartment(organization, oldemployeesids, " ")
    }
    await Database.deleteFromItemList(organization, "departments", "departments", department.id)
    return { id: 204 }
}

async function listDepartments(organization) {
    return await Database.listOrganizationField(organization, "departments", "departments")
}

module.exports = {
    newOrganizationDepartment,
    updateOrganizationDepartment,
    deleteOrganizationDepartment,
    listDepartment,
    listDepartments
}