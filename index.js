/*
Thanks to NoxCaos#4905 for letting me "borrow" some functions from the other project.
send, embedBuilder, direct, utils/cmd and utils/colors are all "borrowed" items, just slightly edited
 */

const Discord = require('eris')
const mongoose = require('mongoose')
const colors = require('./Utils/colors')
const paginator = require('discord-paginator')
const {trigger} = require('./Utils/cmd')
const config = require('./config.json')
const commands      = require('./commands')
const {fetchOrCreateUser} = require("./Modules/users");
const {fetchOrCreateGuild} = require('./Modules/guilds')

const {
    Channel,
    Guild,
    Member,
    Message,
    Reaction,
    Role,
    Voice,
} = require('./Events')

module.exports.schemas = require('./Tables')
const bot = new Discord(config.token, {maxShards: config.shards, getAllUsers: true, autoreconnect:true})
const pgn = paginator.create({bot,  pgnButtons: ['first', 'last', 'back', 'forward']})
const mongooseConnection = mongoose.connect(config.databaseURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})


const send = (channel, message) => {
    if ((typeof message === "string"))
        message = embedBuilder(message, 'green')

    if(message.description)
        message.description = message.description.replace(/\s\s+/gm, '\n')

    if(message.fields)
        message.fields.map(x => x.value = x.value.replace(/\s\s+/gm, '\n'))

    if(!message.color)
        message.color = colors['green']

    return bot.createMessage(channel, {embed: message})
}

const embedBuilder = (message, color) => {
    if(typeof message === 'object') {
        message.description = `${message.description}`
        message.color = colors[color]
        return message
    }

    return { description: `${message}`, color: colors[color] }
}

const direct = async (user, string, color = 'green') => {
    const ch = await bot.getDMChannel(user.id)
    return send(ch.id, embedBuilder(string, color))
}



const context = {
    mongooseConnection,
    bot,
    pgn,
    config,
    send,
    direct,

}

/*
0 = Playing
2 = Listening To
3 = Watching
 */
bot.on('ready', async () => {
    await bot.editStatus('online', {name: `over ${bot.guilds.size} server(s)`, type: 3})
    console.log(`${bot.user.username} online in ${bot.guilds.size} guild(s) with ${bot.users.size} users in them`)

})

bot.on('messageCreate', async (message) => {

    let curGuild = await fetchOrCreateGuild(message)
    if (!curGuild) {
        curGuild = {
            prefix: '--'
        }
    }
    if(message.author.bot || !message.content.startsWith(curGuild.prefix)) {
        return
    }


    const reply = (string, color = 'green') => send(message.channel.id, embedBuilder(string, color))
    const curUser = await fetchOrCreateUser(message)

    const msg = message.content.trim().substr(curGuild.prefix.length).split(' ')
    const ctx = Object.assign({}, context, {
        message,
        msg,
        reply,
        user: curUser,
        guild: curGuild,
        serverOwner: message.member.guild.ownerID !== message.author.id
    })
    const args = message.content.trim().substr(ctx.guild.prefix.length).toLowerCase().split(' ')


    await trigger('cmd', ctx, args)

})

bot.on('error', (error, id) => {
    console.log(id)
    console.log(error)
})
/*
----------------------------------------------------------------------------
                            Channel Events
----------------------------------------------------------------------------
 */
bot.on('channelCreate', async (channel) => {
    await Channel.channel_create(context,channel)
})
bot.on('channelUpdate', async (channel, oldChannel) => {
    await Channel.channel_update(context, channel, oldChannel)
})
bot.on('channelDelete', async (channel) => {
    await Channel.channel_delete(context, channel)
})
bot.on('channelPinUpdate', async (channel, timestamp, oldtimestamp) => {
    await Channel.channel_pin_update(context, channel, timestamp, oldtimestamp)
})
/*
----------------------------------------------------------------------------
                              Guild Events
----------------------------------------------------------------------------
 */
bot.on('guildCreate', async (guild) => {
    await Guild.guild_create(context, guild)
})
bot.on('guildDelete', async (guild) => {
    await Guild.guild_delete(context, guild)
})
bot.on('guildEmojisUpdate', async (guild, newEmoji, oldEmoji) => {
    await Guild.emoji_update(context, guild, newEmoji, oldEmoji)
})
bot.on('guildUpdate', async (newGuild, oldGuild) => {
    await Guild.guild_update(context, newGuild, oldGuild)
})
bot.on('inviteDelete', async (guild, invite) => {
    await Guild.invite_delete(context, guild, invite)
})
bot.on('inviteCreate', async (guild, oldInvite) => {
    await Guild.invite_create(context, guild, oldInvite)
})
/*
----------------------------------------------------------------------------
                            Role Events
----------------------------------------------------------------------------
 */
bot.on('guildRoleCreate', async (guild, role) => {
    await Role.role_create(context, guild, role)
})
bot.on('guildRoleDelete', async (guild, role) => {
    await Role.role_delete(context, guild, role)
})
bot.on('guildRoleUpdate', async (guild, role, oldRole) => {
    await Role.role_update(context, guild, role, oldRole)
})
/*
----------------------------------------------------------------------------
                            Member Events
----------------------------------------------------------------------------
 */
bot.on('guildMemberAdd', async (guild, member) => {
    await Member.member_add(context, guild, member)
})
bot.on('guildMemberRemove', async (guild, member) => {
    await Member.member_remove(context, guild, member)
})
bot.on('guildMemberUpdate', async (guild, member, oldMember) => {
    await Member.member_update(context, guild, member, oldMember)
})
/*
----------------------------------------------------------------------------
                            Message Events
----------------------------------------------------------------------------
 */
bot.on('messageDelete', async (message) => {
    await Message.message_delete(context, message)
})
bot.on('messageDeleteBulk', async (messageBulk) => {
    await Message.message_bulk_delete(context, messageBulk)
})
bot.on('messageUpdate', async (message, oldMessage) => {
    await Message.message_update(context, message, oldMessage)
})
/*
----------------------------------------------------------------------------
                            Reaction Events
----------------------------------------------------------------------------
 */
bot.on('messageReactionAdd', async (message, reaction, id) => {
    await Reaction.reaction_add(context, message, reaction, id)
})
bot.on('messageReactionRemove', async (message, reaction) => {
    await Reaction.reaction_remove(context, message, reaction)
})
bot.on('messageReactionRemoveEmoji', async (message, emoji) => {
    await Reaction.reaction_remove_emoji(context, message, emoji)
})
bot.on('messageReactionRemoveAll', async (message) => {
    await Reaction.reaction_remove_all(context, message)
})
/*
----------------------------------------------------------------------------
                            Presence Events
----------------------------------------------------------------------------
 */
bot.on('presenceUpdate', async (member, presence) => {
    await Member.presence_update(context, member, presence)
})
/*
----------------------------------------------------------------------------
                            User Events
----------------------------------------------------------------------------
 */
bot.on('userUpdate', async (user, oldUser) => {
    await Member.user_update(context, user, oldUser)
})
/*
----------------------------------------------------------------------------
                            Voice Events
----------------------------------------------------------------------------
 */
bot.on('voiceChannelJoin', async (member, voiceChannel) => {
    await Voice.channel_join(context, member, voiceChannel)
})
bot.on('voiceChannelLeave', async (member, voiceChannel) => {
    await Voice.channel_leave(context, member, voiceChannel)
})
bot.on('voiceChannelSwitch', async (member, newChannel, oldChannel) => {
    await Voice.channel_switch(context, member, newChannel, oldChannel)
})
bot.on('voiceStateUpdate', async (member, oldVoiceState) => {
    await Voice.state_update(context, member, oldVoiceState)
})

bot.connect()

