const { randomUUID } = require('crypto')
const Database = require("./database.Model.js")

//creates an employee object that can be appended to an organization's list
//of employees. employee: obj, role = employee/administrator...etc
async function createEmployee(employee, role) {
    return {
        id: randomUUID(),
        name: employee.name,
        email: employee.email,
        password: employee.password,
        roles: role,
        skills: [],
        projects: [],
        department: " ",
        notifications: []
    }
}
//checks if an email address is already in use
async function searchEmployee(employee) {
    const conids = (await Database.listConIDs())
    for (i = 0; i < conids.length; i++) {
        var organizationEmployees = await Database.listOrganizationField(conids[i], "employees", "employees")
        for (j = 0; j < organizationEmployees.length; j++) {
            if (organizationEmployees[j].email === employee.email) {
                return true
            }
        }
    }
    return false
}

async function searchEmployeeByID(organization, id) {
    var organizationEmployees = await Database.listOrganizationField(organization, "employees", "employees")
    for (j = 0; j < organizationEmployees.length; j++) {
        if (organizationEmployees[j].id === id) {
            return organizationEmployees[j]
        }
    }
    return false
}

async function listNotifications(organization, id) {
    var organizationEmployees = await Database.listOrganizationField(organization, "employees", "employees")
    for (j = 0; j < organizationEmployees.length; j++) {
        if (organizationEmployees[j].id === id) {
            return organizationEmployees[j].notifications
        }
    }
    return false
}

// searches for an employees email and password throughout every organization container
//if it finds a match returns the organization id,name and employee object
//used for logging in, employee object is : {email, password}
async function searchEmployeeCredentials(employee) {
    const conids = (await Database.listConIDs())
    for (i = 0; i < conids.length; i++) {
        var organizationEmployees = await Database.listOrganizationField(conids[i], "employees", "employees")
        for (j = 0; j < organizationEmployees.length; j++) {
            if (organizationEmployees[j].email === employee.email && organizationEmployees[j].password === employee.password) {
                return {
                    organization: {
                        id: conids[i],
                        name: await Database.listOrganizationField(conids[i], "organization", "name"),
                        address: await Database.listOrganizationField(conids[i], "organization", "address")
                    },
                    employee: organizationEmployees[j]
                }
            }
        }
    }
    return false
}
//Apends an employee to the list of employees of an organization
// organization = organization id
// employee = employee object to be appended
async function newOrganizationEmployee(organization, employee) {
    if (!(await searchEmployee(employee))) {
        organizationEmployees = (await Database.listOrganizationField(organization, "employees", "employees"))

        const newEmployee = await createEmployee(employee, ["Employee"])

        organizationEmployees.push(newEmployee)

        await Database.replaceOrganizationField(organization, "employees", "employees", organizationEmployees)

        orgname = await Database.listOrganizationField(organization, "organization", "name")
        employee = newEmployee
        return {
            organization: {
                id: organization,
                name: await Database.listOrganizationField(organization, "organization", "name"),
                address: await Database.listOrganizationField(organization, "organization", "address")
            },
            employee
        }
    }
    else {
        return { id: 409 }
    }
}
//updateaza campul departament al unui obiect angajat 
// organization = id organizatie, employees = lista DOAR CU ID-URILE ANGAJATILOR DIN DEPARTAMENT
//departmentname - numele departamentului
async function updateEmployeeDepartment(organization, employees, departmentname) {
    const oldemployees = await Database.listOrganizationField(organization, "employees", "employees");
    for (i = 0; i < oldemployees.length; i++) {
        for (j = 0; j < employees.length; j++) {
            if (oldemployees[i].id === employees[j]) {
                oldemployees[i].department = departmentname
            }
        }
    }
    await Database.replaceOrganizationField(organization, "employees", "employees", oldemployees)
}
//updates the roles of an employee, organization = org id, employee, employee id, role, role to be added or removed, add = +/-
async function updateEmployeeRoles(organization, employee, roles) {
    if (!roles.find((obj) => obj === "Employee")) {
        roles.push("Employee")
    }
    const oldemployees = await Database.listOrganizationField(organization, "employees", "employees");
    for (i = 0; i < oldemployees.length; i++) {
        if (oldemployees[i].id === employee) {
            oldemployees[i].roles = roles
            await Database.replaceOrganizationField(organization, "employees", "employees", oldemployees)

            await newEmployeeNotification(organization, employee, { message: "Your roles have been updated!",type:"inform" })
            return { id: 204 }
        }
    }
    return { id: 404 }
}
//organization = id organizationd, field = employee field to be matched, fieldValue
//returns list of matching employees
async function searchEmployeesByDepartment(organization, department) {
    const employees = await Database.listOrganizationField(organization, "employees", "employees");
    matchingEmployees = []
    for (i = 0; i < employees.length; i++) {
        emps = employees[i]
        if (emps.department === department || department === "any") {
            matchingEmployees.push({
                id: emps.id,
                name: emps.name,
                roles: emps.roles,
                skills: emps.skills,
                department: emps.department
            })
        }
    }
    return matchingEmployees
}

async function searchEmployeesByRole(organization, role) {
    const employees = await Database.listOrganizationField(organization, "employees", "employees");
    matchingEmployees = []
    for (i = 0; i < employees.length; i++) {
        emps = employees[i]
        if (emps.roles.find((obj) => obj === role)) {
            matchingEmployees.push({
                id: emps.id,
                name: emps.name,
                roles: emps.roles,
                skills: emps.skills,
                department:emps.department
            })
        }
    }
    return matchingEmployees
}



async function newEmployeeNotification(organization, employee, notification) {
    const oldemployees = await Database.listOrganizationField(organization, "employees", "employees")
    for (i = 0; i < oldemployees.length; i++) {
        if (oldemployees[i].id === employee) {
            if(!notification.id){
            notification.id = randomUUID()
            }
            oldemployees[i].notifications.push(notification)
            await Database.replaceOrganizationField(organization, "employees", "employees", oldemployees)
        }
    }
}

async function deleteEmployeeNotification(organization, employee, notification) {
    newNotifications = []
    const oldemployees = await Database.listOrganizationField(organization, "employees", "employees");
    for (i = 0; i < oldemployees.length; i++) {
        if (oldemployees[i].id === employee) {
            for (j = 0; j < oldemployees[i].notifications.length; j++) {
                if (oldemployees[i].notifications[j].id !== notification) {
                    newNotifications.push(oldemployees[i].notifications[j])
                }
            }
            oldemployees[i].notifications = newNotifications
            await Database.replaceOrganizationField(organization, "employees", "employees", oldemployees)
            return { id: 204 }
        }
    }
    return { id: 404 }
}

async function getAllEmployees(organization) {
    const employees = await Database.listOrganizationField(organization, "employees", "employees");
    matchingEmployees = []
    for (i = 0; i < employees.length; i++) {
        emps = employees[i]
        matchingEmployees.push({
            id: emps.id,
            name: emps.name,
            email: emps.email,
            roles: emps.roles,
            department: emps.department,
            projects: emps.projects,
            skills: emps.skills
        })
    }
    return matchingEmployees
}

async function newSkill(organization,employee,skill){
    const employees = await Database.listOrganizationField(organization, "employees", "employees")
    for(i = 0;i < employees.length;i++)
    {
        if(employees[i].id === employee)
        {
            employee_department = (await searchEmployeeByID(organization,employee)).department
            department_manager = (await Database.listOrganizationField(organization,"departments","departments")).find((dpt) => dpt.name === employee_department).manager
            notification = randomUUID()
            newEmployeeNotification(organization,department_manager,{id: notification,message: "An employee is awaiting validation for a new skill!",type:"action", parent: skill.id})
            skill.validated = "false"
            skill.awaiting = notification
            employees[i].skills.push(skill) 
            console.log(employees[i].skills)
            await Database.replaceOrganizationField(organization,"employees","employees",employees)
            return {id:204}
        }
    }
}

module.exports = {
    createEmployee,
    searchEmployee,
    newOrganizationEmployee,
    searchEmployeeCredentials,
    updateEmployeeDepartment,
    updateEmployeeRoles,
    searchEmployeesByDepartment,
    searchEmployeesByRole,
    newEmployeeNotification,
    deleteEmployeeNotification,
    getAllEmployees,
    searchEmployeeByID,
    newSkill,
    listNotifications
}