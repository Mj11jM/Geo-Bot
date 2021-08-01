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
const commands = require('./Commands')
const {fetchOrCreateUser} = require("./Modules/users");
const {fetchOrCreateGuild} = require('./Modules/guilds')
const {
    checkReminders,
    deleteReminders
} = require('./Modules/reminders')

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
const bot = new Discord(config.dev? config["token-dev"]: config.token, {maxShards: config.shards, getAllUsers: true, autoreconnect:true})
const pgn = paginator.create({bot,  pgnButtons: ['first', 'last', 'back', 'forward']})
const mongooseConnection = mongoose.connect(config.databaseURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})


const send = (channel, message, content) => {
    if ((typeof message === "string"))
        message = embedBuilder(message, 'green')

    if(message.description)
        message.description = message.description.replace(/\s\s+/gm, '\n')

    if(!message.color)
        message.color = colors['green']

    if (content)
        return bot.createMessage(channel, {content: content, embed: message})

    return bot.createMessage(channel, {embed: message})
}

const embedBuilder = (message, color) => {
    if(typeof message === 'object') {
        message.color = colors[color]
        return message
    }

    return { description: `${message}`, color: colors[color] }
}

const direct = async (user, string, color = 'green') => {
    const ch = await bot.getDMChannel(user.id)
    return send(ch.id, embedBuilder(string, color))
}

const icons = {
    zero:   '0️⃣',
    one:    '1️⃣',
    two:    '2️⃣',
    three:  '3️⃣',
    four:   '4️⃣',
    five:   '5️⃣',
    six:    '6️⃣',
    seven:  '7️⃣',
    eight:  '8️⃣',
    nine:   '9️⃣',
    ten:    '🔟',
    true:   `✅`,
    false:  `❌`,
}


const context = {
    mongooseConnection,
    bot,
    pgn,
    config,
    icons,
    send,
    direct,

}

// Preparation for the future where I actually use buttons!


// bot.on('rawWS', async (event) => {
//     if (event.t === 'INTERACTION_CREATE') {
//         // console.log(event)
//         let url = `/interactions/${event.d.id}/${event.d.token}/callback`
//         bot.emit('INTERACTION_CREATE', event.d)
//         let body = {
//             "type": 4,
//             "data": {
//                 "content": `<@${event.d.member.user.id}> YOU CLICKED THE TEST BUTTON!`
//             }
//         }
//         return bot.requestHandler.request("POST", url, true, body)
//     }
// })
//
// bot.on('INTERACTION_CREATE', async (data) => {
//     console.log(data)
// })

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

    const reply = (string, color = 'green', content = '') => send(message.channel.id, embedBuilder(string, color), content)
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

bot.on('error', (error) => {
    if (error.code && (error.code == 1006 || error.code == 1001)) {
        console.log('Connection reset')
    } else {
        console.log(error)
    }

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
bot.on('guildBanAdd', async (guild, user) => {
    await Guild.ban_add(context, guild, user)
})
bot.on('guildBanRemove', async (guild, user) => {
    await Guild.ban_remove(context, guild, user)
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
    if (!oldMember || member.bot) {
        return
    }
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
bot.on('messageReactionAdd', async (message, reaction, member) => {
    let fetchedMessage = await bot.getMessage(message.channel.id, message.id).catch(e => e)
    await Reaction.reaction_add(context, fetchedMessage, reaction, member)
})
bot.on('messageReactionRemove', async (message, reaction, memberID) => {
    let fetchedMessage = await bot.getMessage(message.channel.id, message.id)
    let member = fetchedMessage.channel.guild.members.get(memberID)
    await Reaction.reaction_remove(context, fetchedMessage, reaction, member)
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

const tick = () => {
    const now = new Date()
    checkReminders(context, now)
}

const ctick = () => {
    const now = new Date()
    deleteReminders(context, now)
}

setInterval(tick.bind({}, context), 1000)
setInterval(ctick.bind({}, context), 60000)


bot.connect()

