const {cmd} = require('../utils/cmd')
const {Reminders} = require('../tables')
const {
    getTimeFromReminder,

} = require('../modules/reminders')
const colors = require('../utils/colors')
const {toDiscordTimestamp} = require("../modules/misc");

cmd(['remind', 'me'], async (ctx, ...args) => {
    let time = ctx.msg.shift()
    time = await getTimeFromReminder(time)
    let message = ctx.msg.join(' ')

    let dbReminder = new Reminders()
    dbReminder.channel_reminder = false
    dbReminder.user_id = ctx.message.author.id
    dbReminder.channel_id = ctx.message.channel.id
    dbReminder.guild_id = ctx.guild.id
    dbReminder.message = message
    dbReminder.remind_at = new Date(time)
    await dbReminder.save()

    return ctx.reply(`I will remind you to \`${message}\` ${toDiscordTimestamp(Math.floor(time/1000), 'R')}!`)

})

cmd(['remind', 'here'], async (ctx, ...args) => {
    let time = ctx.msg.shift()
    time = await getTimeFromReminder(time)
    let hasPermission = true
    ctx.msg.map(x=> {
        if (x.startsWith('<@&')) {
            let roleID = x.slice(3, (x.length - 1))
            let role = ctx.message.channel.guild.roles.find(i => i.id === roleID)
            if (!role.mentionable && !ctx.message.member.permissions.has('mentionEveryone')){
                hasPermission = false
            }
        }
    })
    if (!hasPermission)
        return ctx.reply('You do not have the valid permissions to setup this reminder. You need to have the permissions to mention all roles for this message, or the role must be made publicly mentionable!', 'red')
    let message = ctx.msg.join(' ')

    let dbReminder = new Reminders()
    dbReminder.channel_reminder = true
    dbReminder.user_id = ctx.message.author.id
    dbReminder.channel_id = ctx.message.channel.id
    dbReminder.guild_id = ctx.guild.id
    dbReminder.message = message
    dbReminder.remind_at = new Date(time)
    await dbReminder.save()

    return ctx.reply(`I will remind ${ctx.message.channel.mention} to \`${message}\` ${toDiscordTimestamp(Math.floor(time/1000), 'R')}!`)
})

cmd(['remind', 'list'], ['reminder', 'list'], async (ctx, ...args) => {
    let activeReminders = await Reminders.find({user_id: ctx.message.author.id, reminded:false}).sort({remind_at: 1})
    let pages = []
    if (activeReminders.length === 0) {
        return ctx.reply('You have no active reminders!', 'red')
    }
    activeReminders.map((x, i) => {
        if (i % 5 === 0) pages.push(`Reminder # | Where? | Remind At | Reminder Message\n`)
        let timeLocale = toDiscordTimestamp(Math.floor(x.remind_at/1000))
        pages[Math.floor(i/5)] += `**${i + 1}** | ${x.channel_reminder? `<#${x.channel_id}>`: `DM or <#${x.channel_id}>`} | **${timeLocale}** | ${x.message}\n\n`
    })

    return ctx.pgn.addPagination(ctx.message.author.id, ctx.message.channel.id, {
        pages: pages,
        buttons: ['back', 'forward'],
        embed: {
            author: { name: `${ctx.message.author.username}, here are your reminders.` },
            color: colors.green,
        }
    })
})

cmd(['remind', 'delete'], ['reminder', 'delete'], async (ctx, ...args) => {
    let activeReminders = await Reminders.find({user_id: ctx.message.author.id, reminded:false}).sort({remind_at: 1})
    if (activeReminders.length === 0) {
        return ctx.reply('You have no active reminders!', 'red')
    }

    let number = parseInt(args[0])

    if (args.length === 0 || isNaN(number)) {
        return ctx.reply('You need to input a number to delete!', 'red')
    }

    if (number > activeReminders.length) {
        return ctx.reply('You have chosen a number higher than the amount of reminders!', 'red')
    }

    let toDelete = activeReminders[number - 1]
    await Reminders.deleteOne(toDelete)

    return ctx.reply(`Deleted reminder **${number}**!`)
})
