const Database = require("./database.Model.js")
const { randomUUID } = require("crypto")

function createSkill(skill) {
    return {
        id: randomUUID(),
        name: skill.name,
        category: skill.category,
        author: skill.author,
        departments: [],
        description: skill.description,
        level: skill.level,
        endorsement: skill.endorsement,
        validated: skill.validated
    }
}

async function newOrganizationSkill(organization, skill) {

    if (!(await searchSkill(organization, skill.name))) {
        const organizationSkills = (await Database.listOrganizationField(organization, "skills", "skills"))

        const newSkill = await createSkill(skill)

        organizationSkills.push(newSkill)

        await Database.replaceOrganizationField(organization, "skills", "skills", organizationSkills)

        orgname = await Database.listOrganizationField(organization, "organization", "name")
        skill = newSkill
        return {
            organization: {
                id: organization,
                name: orgname
            },
            skill
        }
    }
    else {
        return { id: 409 }
    }
}

async function searchSkill(organization, name) {
    const skilllist = await Database.listOrganizationField(organization, "skills", "skills")
    for (i = 0; i < skilllist.length; i++) {
        if (skilllist[i].name === name) {
            return true
        }
    }
    return false
}

async function listSkills(organization) {
    const skills = await Database.listOrganizationField(organization, "skills", "skills")
    return skills
}

async function readSkill(organization, id) {
    const skills = await Database.listOrganizationField(organization, "skills", "skills")
    for (i = 0; i < skills.length; i++) {
        if (skills[i].id === id) {
            return skills[i]
        }
    }
    return false
}

async function deleteSkill(organization, skill) {
    await Database.deleteFromItemList(organization, "skills", "skills", skill.id)
    return { id: 204 }
}

async function updateSkill(organization, skill) {
    const skills = await Database.listOrganizationField(organization, "skills", "skills")
    for (i = 0; i < skills.length; i++) {
        if (skills[i].id === skill.id) {
            skills[i] = skill
            await Database.replaceOrganizationField(organization, "skills", "skills", skills)
            return { id: 204 }
        }
    }
    return { id: 409 }
}

module.exports = {
    newOrganizationSkill,
    listSkills,
    readSkill,
    deleteSkill,
    updateSkill
}