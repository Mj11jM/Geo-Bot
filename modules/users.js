const {User} = require('../tables')


const fetchOrCreateUser = async (message) => {
    let activeUser = await User.findOne({user_id: message.author.id})
    if (!activeUser){
        activeUser = new User()
        activeUser.user_id = message.author.id
        activeUser.username = message.author.username
    }
    if(activeUser.username !== message.author.username)
        activeUser.username = message.author.username

    await activeUser.save()
    return activeUser
}

module.exports = {
    fetchOrCreateUser,
}
