const {cmd, pcmd} = require('../Utils/cmd')
const {parseArgs} = require('../Modules/argumentParser')


pcmd(['manageMessages'], 'purge', 'prune', async (ctx, ...args) => {
    let pArgs = await parseArgs(ctx, args)
    let messages

    if (pArgs.ids.length > 0) {
        messages = await ctx.message.channel.getMessages({limit:250})
    } else {
        messages = await ctx.message.channel.getMessages({limit:Number(pArgs.extra[0]) + 1})
    }
    const msgList = []
    let deleteIDLimit = Number(pArgs.extra[0]) + (pArgs.ids[0] === ctx.message.author.id? 1: 0)
    messages.map(x => {
        if (pArgs.ids.length > 0) {
            if (x.author.id === pArgs.ids[0] && msgList.length < deleteIDLimit){
                msgList.push(x.id)
            }
        } else {
            msgList.push(x.id)
        }
    })
    try {
        await ctx.message.channel.deleteMessages(msgList, 'purge')
    } catch (e) {
        return ctx.reply(`Unable to delete these messages through bulk delete. Please do it manually.\nReason: ${e}`, 'red')
    }
})

pcmd(['manageServer'], ['set', 'prefix'], ['change', 'prefix'], ['prefix', 'set'], ['setprefix'], ['prefixset'], async (ctx, arg) => {
    if(!arg)
        return ctx.reply('You need to specify a prefix to change to!', 'red')
    if (arg.length > 5)
        return ctx.reply('Prefix can not be longer than 5 characters!', 'red')
    ctx.guild.prefix = arg
    await ctx.guild.save()
    return ctx.reply(`Guild prefix has been set to \`${arg}\``)
})

pcmd(['administrator'], ['autorole', 'set'], ['autorole', 'add'], async(ctx, ...args) => {
    let pArgs = await parseArgs(ctx, args)
    if (pArgs.ids.length === 0)
        return ctx.reply('Please supply a role to set for autorole!', 'red')

    let roleCheck = ctx.message.channel.guild.roles.has(pArgs.ids[0])
    if (!roleCheck)
        return ctx.reply('Invalid role supplied, please check you are using a valid role mention or ID', 'red')
    ctx.guild.auto_role = pArgs.ids[0]
    await ctx.guild.save()
    return ctx.reply(`Autorole has been set to <@&${pArgs.ids[0]}>`)
})

pcmd(['administrator'], ['autorole', 'remove'], ['autorole', 'delete'], async(ctx, ...args) => {
    ctx.guild.auto_role = null
    await ctx.guild.save()
    return ctx.reply(`Autorole has been removed!`)
})