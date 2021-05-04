const {reactionRoleHandler} = require('../Modules/reaction_roles')

const reaction_add = async (ctx, message, reaction, member) => {
    ctx.pgn.trigger(member, message, reaction.name)
    if (member.bot) {
        return
    }
    await reactionRoleHandler(ctx, message, reaction, member, true)
}

const reaction_remove = async (ctx, message, reaction, member) => {
    if (member.bot) {
        return
    }
    await reactionRoleHandler(ctx, message, reaction, member, false)
}

const reaction_remove_emoji = async (ctx, message, emoji) => {

}

const reaction_remove_all = async (ctx, message) => {

}

module.exports = {
    reaction_add,
    reaction_remove,
    reaction_remove_all,
    reaction_remove_emoji
}