const  Employee = require("../Models/employeeModel")

const { getPostData} = require("../utilities")

async function createOrganization(req,res){
    const data = await getPostData(req)
    const result = await Employee.newOrganization(data.organization,data.employee)
    res.writeHead(201,{"Content-Type": "application/json"})
    res.end(JSON.stringify(result))
}

async function seeCON(req,res){
    const data = await getPostData(req)

    const result = await Employee.seeContainer(data.id)
    
    res.writeHead(201,{"Content-Type": "application/json"})
    res.end(JSON.stringify(result))  

}

module.exports = {
    createOrganization,
    seeCON
}
