const {Reactions} = require('../Tables')

const reactionRoleHandler = async (ctx, message, reaction, member, add) => {
    let reroDB = await Reactions.findOne({guild_id: message.guildID, message_id: message.id})
    if (!reroDB) {
        return
    }
    let dbReaction = `${reaction.name}${reaction.id? `:${reaction.id}`: ''}`
    let dbReros = reroDB.reaction_roles.filter(x => x.emoji === dbReaction).shift()
    if (!dbReros) {
        if (add) {
            await message.removeReaction(dbReaction, member.id)
        }
        return
    }
    if (add) {
        await member.addRole(dbReros.role)
    } else {
        await member.removeRole(dbReros.role)
    }
}


module.exports = {
    reactionRoleHandler
}