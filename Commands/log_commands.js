const {pcmd} = require('../Utils/cmd')
const {Logs} = require('../Tables')
const colors = require('../Utils/colors')
const _ = require('lodash')

pcmd(["administrator"], ['log', 'enable'], ['log', 'start'], ['log', 'set'], ['log', 'server'], async (ctx, ...args) => {
    let log = await Logs.findOne({guild_id: ctx.message.guildID, channel_id: ctx.message.channel.id})
    if (!log && args.length === 0) {
        console.log('test')
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
    if (log) {
        log.map(x => {
            let channel = ctx.bot.getChannel(x.channel_id)
            pages.push(
                {
                    title: `Log Info for #${channel.name}`,
                    description: `GLOBAL EVENTS: ${x.all_events? `**TRUE**\nThis means no matter what is listed below, all events are ***ENABLED***\nRun whatever fucking command I make to disable this!` : 'false'}`,
                    author: {
                        name: `Channel ID: ${x.channel_id}`
                    },
                    fields: [
                        {
                            name: "Channel Events",
                            value: `All Events: ${x.channel_events.all? `**true**` : 'false'}
                            Channel Create: ${x.channel_events.create? `**true**` : 'false'}
                            Channel Update: ${x.channel_events.update? `**true**` : 'false'}
                            Channel Delete: ${x.channel_events.delete? `**true**` : 'false'}
                            Channel Pin Update: ${x.channel_events.pins? `**true**` : 'false'}`,
                            inline: true
                        },
                        {
                            name: "Guild Events",
                            value: `All Events: ${x.guild_events.all? `**true**` : 'false'}
                            Guild Update: ${x.guild_events.update? `**true**` : 'false'}
                            Invites Created/Deleted: ${x.guild_events.invites? `**true**` : 'false'}`,
                            inline: true
                        },
                        {
                            name: "Member Events",
                            value: `All Events: ${x.member_events.all? `**true**` : 'false'}
                            Member Join: ${x.member_events.add? `**true**` : 'false'}
                            Member Update: ${x.member_events.update? `**true**` : 'false'}
                            Member Leave: ${x.member_events.remove? `**true**` : 'false'}
                            Presence Update: ${x.member_events.presence? `**true**` : 'false'}`,
                            inline: true
                        },
                        {
                            name: "User Events",
                            value: `All Events: ${x.user_events.all? `**true**` : 'false'}
                            Discriminator Change: ${x.user_events.discriminator? `**true**` : 'false'}
                            Username Change: ${x.user_events.username? `**true**` : 'false'}
                            Avatar Change: ${x.user_events.avatar? `**true**` : 'false'}`,
                            inline: true
                        },
                        {
                            name: "Role Events",
                            value: `All Events: ${x.role_events.all? `**true**` : 'false'}
                            Role Create: ${x.role_events.create? `**true**` : 'false'}
                            Role Update: ${x.role_events.update? `**true**` : 'false'}
                            Role Delete: ${x.role_events.delete? `**true**` : 'false'}`,
                            inline: true
                        },
                        {
                            name: "Voice Events",
                            value: `All Events: ${x.voice_events.all? `**true**` : 'false'}
                            Join Channel: ${x.voice_events.join? `**true**` : 'false'}
                            Switch Channel: ${x.voice_events.switch? `**true**` : 'false'}
                            Leave Channel: ${x.voice_events.leave? `**true**` : 'false'}
                            Voice State: ${x.voice_events.state? `**true**` : 'false'}`,
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
    }
    pages[0].footer.text = `Page 1/${pages.length}`
    await ctx.pgn.addPagination(ctx.message.author.id, ctx.message.channel.id, {
        pages,
        embed: pages[0],
        switchPage: (data) => data.embed = data.pages[data.pagenum]
    })
    // await ctx.send(ctx.message.channel.id, list[0])

})