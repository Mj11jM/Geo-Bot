const {cmd, pcmd} = require('../Utils/cmd')


pcmd(['manageMessages'], 'purge', async (ctx, ...args) => {
    console.log(args[0])
    let messages = await ctx.message.channel.getMessages(Number(args[0]) + 1)
    console.log(messages.length)
    const msgList = []
    messages.map(x => {
        msgList.push(x.id)
    })
    await ctx.message.channel.deleteMessages(msgList, 'purge')
})