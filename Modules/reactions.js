const {Reactions} = require('../Tables')

const reactionRoleHandler = async (ctx, message, reaction, member, add) => {
    let reroDB = await Reactions.findOne({guild_id: message.guildID, message_id: message.id})
    if (!reroDB) {
        return false
    }
    let dbReaction = `${reaction.name.toLowerCase()}${reaction.id? `:${reaction.id}`: ''}`
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
    return true
}

const repeatReactionHandler = async (ctx, message, reaction, member) => {

}

const singleVotePollHandler = async (ctx, message, reaction, member) => {

}


module.exports = {
    reactionRoleHandler,
    repeatReactionHandler,
}