const Database = require("./databaseModel.js")
const Employee = require("./employeeModel.js")
const {randomUUID} = require("crypto")


//used to generate a department object from frontend request data
async function createDepartment(department)
{
    const newDepartment = {
        id: randomUUID(),
        name: department.name,
        manager:department.manager,
        skills: department.skills,
        employees: department.employees
    }
    return newDepartment    
}
//creaza un departament nou in baza, organization - id organizatie, department - obiectul department din request
//TREBUIE SCHIMBATE DREPTURILE MANAGERULUI !!
async function newOrganizationDepartment(organization,department)
{
    if(!(await searchDepartment(organization,department.name)))
    {
        const organizationDepartments = (await Database.listOrganizationField(organization,"departments","departments"))

        const newDepartment = await createDepartment(department)

        organizationDepartments.push( newDepartment )

        await Database.replaceOrganizationField(organization,"departments","departments",organizationDepartments)

        await Employee.updateEmployeeDepartment(organization,department.employees,department.name)
        
        orgname = await Database.listOrganizationField(organization,"organization","name")
        department = newDepartment
        return {
            organization: {
                id:organization,
                name: orgname
            },
            department
        }
    }
    else
    {
        return {id:409}
    }
}
//verifica daca exista un departament cu acelasi nume in baza
//organization - id organizatie, nume- nume ce trebuie cautat
async function searchDepartment(organization,name)
{
    const departmentlist = await Database.listOrganizationField(organization,"departments","departments")
    for(i = 0;i<departmentlist.length;i++)
    {
        if(departmentlist[i].name === name)
        {
            return true
        }
    }
    return false
}

module.exports = {
    newOrganizationDepartment
}