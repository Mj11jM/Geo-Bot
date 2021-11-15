const {Guild} = require("../tables");


const fetchOrCreateGuild = async (message) => {
    if (!message.guildID)
        return false

    let activeGuild = await Guild.findOne({guild_id: message.guildID})
    if (!activeGuild){
        activeGuild = new Guild()
        activeGuild.guild_id = message.guildID
        activeGuild.guild_name = message.member.guild.name
        await activeGuild.save()
    }
    return activeGuild
}

module.exports = {
    fetchOrCreateGuild,
}