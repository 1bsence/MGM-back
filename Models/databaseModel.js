const {CosmosClient} = require("@azure/cosmos")
const Employee = require("./employeeModel.js")
require('dotenv').config()
const { randomUUID } = require('crypto')

const endpoint = process.env.COSMOS_ENDPOINT
const key  = process.env.COSMOS_KEY
const dbid = process.env.COSMOS_DBID

const Cosmos_DB = new CosmosClient({endpoint,key}).database(dbid)

const org_conID = "Organizations"

//Cosmos_DB.container(org_conID).delete()

async function createOrganization(data)
{
    await Cosmos_DB.containers.createIfNotExists({id:org_conID}) //ar trebui sa fie deja creat, failsafe
    
    const resources = {
        id: randomUUID(),
        name: data.organization.organization_name,
        //url: data.organization.organization_name.replace(/[^A-Z0-9]+/ig, "_"),
        address: data.organization.organization_address,
        projects: [],
        departments: [],
        custom_roles: [],
        employees: [ 
            await Employee.createEmployee(data.employee,"administrator")
        ]
    }
    if((await searchEmployeeEmail(data.employee)))
    {
        return {id:409,message:`email ${data.employee.email} is already used!`} 
    }
    else if(!(await isValidOrganization(resources)))
    {
        return {id:409,message: `Organization name ${resources.name} already taken!`}
    }
    else
    {
    await Cosmos_DB.container(org_conID).items.create(resources)
    return {id:201,organization:resources}
    }

}

async function readContainerItems(conID)
{
    const result  = (await Cosmos_DB.containers.readAll().fetchAll()).resources.find(e => e.id === conID)
    if(!result)
    {
        return {id: "404"}
    }
    return (await Cosmos_DB.container(conID).items.readAll().fetchAll()).resources
}

async function isValidOrganization(resource)
{
    console.log(org)
    org = (await readContainerItems(org_conID)).find(org => org.name === resource.name)
    if(org)
    {
        return false
    }
    return true
}

async function pushEmployee(org_id,employee)
{
    if(!(await searchEmployeeEmail(employee)))
    {
        const org = (await readContainerItems(org_conID)).find(org => org.id === org_id)
        if(org)
            {org.employees.push(employee)
            Cosmos_DB.container(org_conID).item(org.id).replace(org)
            //console.log(org)
            return {id: 201, employee: employee}
        }
        else
        {
            return{id:409}
        }
    }
    return{id:409}
}

//searches all organizations for an employee who has the same email as the parameter employee does
//if emails match returns complete employee object that matches, otherwise returns false
//can be upgraded to search for projects/departments
//needs to be configurable to math email or email&password
async function searchEmployeeEmail(employee)
{
    const orgs = await readContainerItems(org_conID)
    for(i = 0;i<orgs.length;i++)
    {
        org = orgs[i]
        for(j = 0;j<org.employees.length;j++)
        {
            if( org.employees[j].email === employee.email )
            {
                return org.employees[j]
            }
        }
    }
    return false
}


async function searchEmployeeCredentials(employee)
{
    const orgs = await readContainerItems(org_conID)
    for(i = 0;i<orgs.length;i++)
    {
        org = orgs[i]
        for(j = 0;j<org.employees.length;j++)
        {
            if( org.employees[j].email === employee.email && org.employees[j].password === employee.password )
            {
                return {organization: {id: org.id,name: org.name}, employee: org.employees[j]}
            }
        }
    }
    return false
}


module.exports = {
    createOrganization,
    readContainerItems,
    pushEmployee,
    searchEmployeeCredentials,
    searchEmployeeEmail,

}