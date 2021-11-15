const {Logs} = require('../tables')
const colors = require('../utils/colors')

const channel_create = async (ctx, channel) => {
    if (channel.type === 1)
        return

    let logList = await Logs.find({guild_id: channel.guild.id})
    logList = logList.filter(x => x.all_events || x.channel_events.all || x.channel_events.create)
    if (logList.length === 0) {
        return
    }
    const chanType = ['Text', 'Private', 'Voice']
    const embed = {
        author: {
            name: `${chanType[channel.type]} Channel Created: ${channel.name}!`
        },
        fields: [
            {
                name: "Channel ID",
                value:  `${channel.id}`
            }
        ],
        footer: {
            text: new Date().toLocaleString('en-gb', {hour12:false})
        },
    }
    logList.map(async (x) => {
        await ctx.send(x.channel_id, embed)
    })
}

const channel_update = async (ctx, channel, oldChannel) => {
    if (channel.name === oldChannel.name || channel.type === 1)
        return
    let logList = await Logs.find({guild_id: channel.guild.id})
    logList = logList.filter(x => x.all_events || x.channel_events.all || x.channel_events.update)
    if (logList.length === 0) {
        return
    }
    const chanType = ['Text', 'Private', 'Voice']
    const embed = {
        author: {
            name: `${chanType[channel.type]} Channel Re-Named: ${channel.name}!`
        },
        fields: [
            {
                name: "Old Channel Name",
                value:  `${oldChannel.name}`
            }
        ],
        footer: {
            text: new Date().toLocaleString('en-gb', {hour12:false})
        },
        color: colors.yellow
    }
    logList.map(async (x) => {
        await ctx.send(x.channel_id, embed)
    })
}

const channel_delete = async (ctx, channel) => {
    if (channel.type === 1)
        return

    let logList = await Logs.find({guild_id: channel.guild.id})
    logList = logList.filter(x => x.all_events || x.channel_events.all || x.channel_events.delete)
    if (logList.length === 0) {
        return
    }
    const chanType = ['Text', 'Private', 'Voice']
    const embed = {
        author: {
            name: `${chanType[channel.type]} Channel Deleted: ${channel.name}!`
        },
        fields: [
            {
                name: "Old Channel ID",
                value:  `${channel.id}`
            }
        ],
        footer: {
            text: new Date().toLocaleString('en-gb', {hour12:false})
        },
        color: colors.red
    }
    logList.map(async (x) => {
        await ctx.send(x.channel_id, embed)
    })
}

const channel_pin_update = async (ctx, channel, timestamp, oldTimestamp) => {

}

module.exports = {
    channel_create,
    channel_update,
    channel_delete,
    channel_pin_update
}
