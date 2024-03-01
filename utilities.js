const fs = require("fs")

function WriteToFile(filename,content)
{
    const file_content = JSON.parse(fs.readFileSync(filename))
    file_content.push(content)
    fs.writeFile(filename, JSON.stringify(file_content,null,4),"utf8",(err) => {
        if (err)
        {
            console.log(err)
        }
    })
}

function getRights(filename,id)
{
    const file_content = JSON.parse(fs.readFileSync(filename))
    return file_content.find(right => right.id = id) 
}

async function getPostData(req)
{
    return new Promise( async (resolve,reject) =>{
        try
        {
            let body = ""
            req.on('data',(chunk) => {
                body += chunk.toString()
            })
            req.on("end",() =>{
                resolve(JSON.parse(body))
            })
        }
        catch(error){
            reject(error)
        }
    })
}

module.exports = {
    WriteToFile,
    getPostData,
    getRights
}