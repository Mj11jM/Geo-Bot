const {cmd, pcmd} = require('../Utils/cmd')
const {parseArgs} = require('../Modules/argumentParser')


pcmd(['manageMessages'], 'purge', 'prune', async (ctx, ...args) => {
    let pArgs = await parseArgs(ctx, ...args)
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

pcmd(['administrator'], ['set', 'prefix'], ['change', 'prefix'], ['prefix', 'set'], ['setprefix'], ['prefixset'], async (ctx, ...args) => {
})