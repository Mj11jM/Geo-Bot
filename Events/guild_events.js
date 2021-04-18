const {Guild} = require('../Tables')

const guild_create = async (ctx, guild) => {
    const priorGuild = Guild.findOne({guild_id: guild.id})
    if (!priorGuild) {
        const newGuild = new Guild()
        guild.guild_id = guild.id
        guild.guild_name = guild.name
        await newGuild.save()
    }
}

const guild_delete = async (ctx, guild) => {

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
    guild_create,
    guild_delete,
    guild_update,
    emoji_update,
    invite_create,
    invite_delete
}