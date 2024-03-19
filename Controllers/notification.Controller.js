const Notification = require("../Models/notification.Model.js")

const { getPostData } = require("../utilities.js")
const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': 2592000,// 30 days
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true',
    "Access-Control-Allow-Headers": "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
    /** add other headers as per requirement */
}


/*
{
    notification: {
        organization:
        id:
        parent:
        response:
    }
}
*/
async function handleProjectNotification(req, res) {
    data = await getPostData(req)
    if(data.response === "accept")
    {
        result = await Notification.acceptProjectNotification(data.organization, {
            id:data.id,
            parent:data.parent,
            response:data.response
        })
        res.writeHead(200,headers)
        res.end(JSON.stringify(result))
    }
    else if (data.response === "reject") {
        result = await Notification.rejectProjectNotification(data.organization, {
            id:data.id,
            parent:data.parent,
            response:data.response
        })
        res.writeHead(200,headers)
        res.end(JSON.stringify(result))
    }
    else if(data.response === "dissmis")
    {
        Notification.readNotification(data.organization, {
            id:data.id,
            parent:data.parent,
            response:data.response
        })
        res.writeHead(200,headers)
        res.end(JSON.stringify({id:204}))
    }
}


module.exports = {
    handleProjectNotification
}