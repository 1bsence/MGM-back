const {getRights} = require("../utilities.js")
const { randomUUID } = require('crypto')
const Database = require("./databaseModel.js")

//creates an employee object that can be appended to an organization's list
//of employees. employee: obj, role = employee/administrator...etc
async function createEmployee(employee,role)
{
    return {
        id: randomUUID(),
        name: employee.name,
        email: employee.email,
        password: employee.password,
        role: "employee",
        skills: [],
        rights: await getRights("rights.json",role),
        projects: [],
        department: ""
    }
}
//checks if an email address is already in use,
async function searchEmployee(employee)
{
    const conids = (await Database.listConIDs()).filter(function (val) {
        return val !== "Organizations"
    })
    for(i = 0; i < conids.length;i++)
    {
        var organizationEmployees = await Database.listOrganizationField(conids[i],"employees","employees")
        for(j = 0;j < organizationEmployees.length;j++)
        {
            if(organizationEmployees[j].email === employee.email)
            {
                return true
            }
        }
    }
    return false
}
// searches for an employees email and password throughout every organization container
//if it finds a match returns the organization id,name and employee object
//used for logging in, employee object is : {email, password}
async function searchEmployeeCredentials(employee)
{
    const conids = (await Database.listConIDs()).filter(function (val) {
        return val !== "Organizations"
    })
    for(i = 0; i < conids.length;i++)
    {
        var organizationEmployees = await Database.listOrganizationField(conids[i],"employees","employees")
        for(j = 0;j < organizationEmployees.length;j++)
        {
            if(organizationEmployees[j].email === employee.email && organizationEmployees[j].password === employee.password)
            {
                orgname = await Database.listOrganizationField(conids[i],"organization","name")
                console.log(orgname)
                return {
                    organization: {
                    id:conids[i],
                    name: orgname
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
async function newOrganizationEmployee(organization,employee)
{
    if(!(await searchEmployee(employee)))
    {
        organizationEmployees = (await Database.listOrganizationField(organization,"employees","employees"))

        const newEmployee = await createEmployee(employee,"employee")

        organizationEmployees.push( newEmployee )

        await Database.replaceOrganizationField(organization,"employees","employees",organizationEmployees)

        orgname = await Database.listOrganizationField(organization,"organization","name")
        employee = newEmployee
        return {
            organization: {
                id:organization,
                name: orgname
            },
            employee
        }
    }
    else
    {
        return {id:409}
    }
}
//updateaza campul departament al unui obiect angajat 
// organization = id organizatie, employees = lista DOAR CU ID-URILE ANGAJATILOR DIN DEPARTAMENT
//departmentname - numele departamentului

//TREBUIE SCHIMBATE DREPTURILE MANAGERULUI!!!
async function updateEmployeeDepartment(organization,employees,departmentname)
{
    const oldemployees = await Database.listOrganizationField(organization,"employees","employees");
    for(i = 0;i<oldemployees.length;i++)
    {
        for(j = 0;j<employees.length;j++)
        {
            if(oldemployees[i].id === employees[j])
            {
                oldemployees[i].department = departmentname
            }
        }
    }
    await Database.replaceOrganizationField(organization,"employees","employees",oldemployees)
}

module.exports = {
    createEmployee,
    searchEmployee,
    newOrganizationEmployee,
    searchEmployeeCredentials,
    updateEmployeeDepartment
}