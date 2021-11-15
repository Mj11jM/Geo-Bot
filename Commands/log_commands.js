const {pcmd} = require('../utils/cmd')
const {Logs} = require('../tables')
const colors = require('../utils/colors')
const {parseArgs,
strictLogArgs,
looseLogArgs} = require('../modules/argumentParser')
const _ = require('lodash')

pcmd(["administrator"], 'log', async (ctx, ...args) => {
    let log = await Logs.findOne({guild_id: ctx.message.guildID, channel_id: ctx.message.channel.id})
    if (!log) {
        log = new Logs()
        log.guild_id = ctx.message.guildID
        log.channel_id = ctx.message.channel.id
    }
    const swapped = await looseLogArgs(ctx, log, args)
    await log.save()
    if (!swapped)
        return ctx.reply('An argument is required for this command!', 'red')
    let embed = {
        description: "Logging for this channel has been edited!",
        fields: []
    }
    if (swapped.enabled.length > 0)
        embed.fields.push({name: "Logs Enabled", value: swapped.enabled.join(" ")})
    if (swapped.disabled.length > 0)
        embed.fields.push({name: "Logs Disabled", value: swapped.disabled.join(" ")})
    if (swapped.not_found.length > 0)
        embed.fields.push({name: "Logs Not Found", value: swapped.not_found.join(" ")})
    await ctx.reply(embed)
})

pcmd(["administrator"], ['log', 'all'], ['log', 'everything'], async (ctx, ...args) => {
    let log = await Logs.findOne({guild_id: ctx.message.guildID, channel_id: ctx.message.channel.id})
    if (!log && args.length === 0) {
        log = new Logs()
        log.guild_id = ctx.message.guildID
        log.channel_id = ctx.message.channel.id
        log.all_events = true
        await log.save()
        await ctx.reply('Successfully created log channel. All events are currently enabled!')
    } else if (log && args.length === 0) {
        log.all_events = !log.all_events
        await log.save()
        await ctx.reply(`All events are now **${log.all_events? 'enabled': 'disabled'}**!`)
    }
})

pcmd(["administrator"], ['log', 'info'], ['log', 'status'], ['log', 'list'], ['log', 'ls'], async (ctx, ...args) => {
    let log = await Logs.find({guild_id: ctx.message.guildID})
    let pages = []
    if (log.length !== 0) {
        log.map(x => {
            let channel = ctx.bot.getChannel(x.channel_id)
            pages.push(
                {
                    title: `Log Info for #${channel.name}`,
                    description: `GLOBAL EVENTS: ${x.all_events? `✅\nThis means no matter what is listed below, all events are ***ENABLED***` : '❌'}`,
                    author: {
                        name: `Channel ID: ${x.channel_id}`
                    },
                    fields: [
                        {
                            name: "Channel Events",
                            value: `All Events: ${ctx.icons[x.channel_events.all]}
                            Channel Create: ${ctx.icons[x.channel_events.create]}
                            Channel Update: ${ctx.icons[x.channel_events.update]}
                            Channel Delete: ${ctx.icons[x.channel_events.delete]}
                            Channel Pin Update: ${ctx.icons[x.channel_events.pins]}`,
                            inline: true
                        },
                        {
                            name: "Guild Events",
                            value: `All Events: ${ctx.icons[x.guild_events.all]}
                            Guild Update: ${ctx.icons[x.guild_events.update]}
                            Invites Created/Deleted: ${ctx.icons[x.guild_events.invites]}`,
                            inline: true
                        },
                        {
                            name: "Member Events",
                            value: `All Events: ${ctx.icons[x.member_events.all]}
                            Member Join: ${ctx.icons[x.member_events.add]}
                            Member Update: ${ctx.icons[x.member_events.update]}
                            Member Leave: ${ctx.icons[x.member_events.remove]}
                            Presence Update: ${ctx.icons[x.member_events.presence]}`,
                            inline: true
                        },
                        {
                            name: "User Events",
                            value: `All Events: ${ctx.icons[x.user_events.all]}
                            Discriminator Change: ${ctx.icons[x.user_events.discriminator]}
                            Username Change: ${ctx.icons[x.user_events.username]}
                            Avatar Change: ${ctx.icons[x.user_events.avatar]}`,
                            inline: true
                        },
                        {
                            name: "Role Events",
                            value: `All Events: ${ctx.icons[x.role_events.all]}
                            Role Create: ${ctx.icons[x.role_events.create]}
                            Role Update: ${ctx.icons[x.role_events.update]}
                            Role Delete: ${ctx.icons[x.role_events.delete]}`,
                            inline: true
                        },
                        {
                            name: "Voice Events",
                            value: `All Events: ${ctx.icons[x.voice_events.all]}
                            Join Channel: ${ctx.icons[x.voice_events.join]}
                            Switch Channel: ${ctx.icons[x.voice_events.switch]}
                            Leave Channel: ${ctx.icons[x.voice_events.leave]}
                            Voice State: ${ctx.icons[x.voice_events.state]}`,
                            inline: true
                        }
                    ],
                    color: colors.green,
                    footer: {
                        text: "Page"
                    },
                }
            )
        })
        pages[0].footer.text = `Page 1/${pages.length}`
        await ctx.pgn.addPagination(ctx.message.author.id, ctx.message.channel.id, {
            pages,
            embed: pages[0],
            switchPage: (data) => data.embed = data.pages[data.pagenum]
        })
    } else {
        await ctx.reply('There are no active log channels in this server!', 'red')
    }
})

pcmd(['administrator'], ['log', 'add'], ['log', 'enable'], async (ctx, ...args) => {
    let log = await Logs.findOne({channel_id: ctx.message.channel.id, guild_id: ctx.message.guildID})
    if (!log) {
        log = new Logs()
        log.channel_id = ctx.message.channel.id
        log.guild_id = ctx.message.guildID
    }
    let swapped = await strictLogArgs(ctx, log, true, ...args)
    await ctx.reply(swapped.swapped.join(' '))
})

pcmd(['administrator'], ['log', 'remove'], ['log', 'disable'], async (ctx, ...args) => {
    let log = await Logs.findOne({channel_id: ctx.message.channel.id, guild_id: ctx.message.guildID})
    if (!log) {
        log = new Logs()
        log.channel_id = ctx.message.channel.id
        log.guild_id = ctx.message.guildID
    }
    let swapped = await strictLogArgs(ctx, log, false, ...args)
    await ctx.reply(swapped.swapped.join(' '))
})