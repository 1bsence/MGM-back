const employees = require("../json_formats/employees.json")

const { WriteToFile, getPostData, login } = require("../utilities.js")

function findAll()
{
    return new Promise((resolve, reject) => {
        resolve(employees)
    })
}

function create(employee)
{
    return new Promise((resolve,reject) => {
        WriteToFile("./json_formats/employees.json", employee)
        resolve(employee)
    })
}
async function validEmployee(data)
{
    return new Promise((resolve,reject) => {
        const result = employees.find(e => (e.email === data.email && e.password === data.password))
        resolve(result)
    })
}
async function validSignUp(data)
{
    return new Promise((resolve,reject) => {
        const result = employees.find(e => (e.email === data.email))
        
        resolve(!result)
    })
}


module.exports = {
    findAll,
    create,
    validEmployee,
    validSignUp
}