const reaction_add = async (ctx, message, reaction, member) => {
    ctx.pgn.trigger(id, message, reaction.name)
}

const reaction_remove = async (ctx, message, reaction) => {

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