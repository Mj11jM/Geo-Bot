const {Guild} = require('../tables')

const guild_create = async (ctx, guild) => {
    const priorGuild = Guild.findOne({guild_id: guild.id})
    if (!priorGuild) {
        const newGuild = new Guild()
        guild.guild_id = guild.id
        guild.guild_name = guild.name
        await newGuild.save()
    }
    await ctx.bot.editStatus('online', {name: `over ${ctx.bot.guilds.size} server(s)`, type: 3})
}

const guild_delete = async (ctx, guild) => {

}

const ban_add = async (ctx, guild, user) => {

}

const ban_remove = async (ctx, guild, user) => {

}

const guild_update = async (ctx, newGuild, oldGuild) => {

}

const emoji_update = async (ctx, guild, newEmoji, oldEmoji) => {

}

const invite_create = async (ctx, guild, invite) => {

}

const invite_delete = async (ctx, guild, invite) => {

}

module.exports = {
    ban_add,
    ban_remove,
    guild_create,
    guild_delete,
    guild_update,
    emoji_update,
    invite_create,
    invite_delete
}