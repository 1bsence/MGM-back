const Database = require("./database.Model")

async function newCRole(organization,role)
{
    custom_roles = await Database.listOrganizationField(organization,"custom_roles","custom_roles")
    if(!custom_roles.find((rol) => rol === role))
    {
        custom_roles.push(role)
    }
    else
    {
        return {id:409}
    }
    await Database.replaceOrganizationField(organization,"custom_roles","custom_roles",custom_roles)
    return {id:204}
}

async function readCRoles(organization)
{
    custom_roles = await Database.listOrganizationField(organization,"custom_roles","custom_roles")
    return custom_roles
}

async function deleteCRole(organization,role)
{
    custom_roles = await Database.listOrganizationField(organization,"custom_roles","custom_roles")
    custom_roles.splice(custom_roles.findIndex((rol) => rol === role),1)
    await Database.replaceOrganizationField(organization,"custom_roles","custom_roles",custom_roles)
    return {id:204}
}

async function modifyCRole(organization,role,newrole)
{
    custom_roles = await Database.listOrganizationField(organization,"custom_roles","custom_roles")
    custom_roles[custom_roles.findIndex((obj) => obj === role)] = newrole
    await Database.replaceOrganizationField(organization,"custom_roles","custom_roles",custom_roles)
    return {id:204}  
}

module.exports = {
    newCRole,
    readCRoles,
    deleteCRole,
    modifyCRole
}