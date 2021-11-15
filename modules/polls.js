const createPoll = async (ctx, args, unique) => {
    let parts = ctx.msg.join(' ').split('|').filter(x=> x && x !== '|')
    let question = parts.shift().trim()
    let optLength = parts.length
    if (optLength > 10 )
        return
    let opt = ``
    parts.map((x, i) => opt += `${ctx.icons[i+1]}: ${x.trim()}\n`)
    let embed = {
        author: {name: question},
        description: opt
    }
    await ctx.send(ctx.message.channel.id, embed).then(async (message) => {
        for (let i = 0; i < optLength; i++)
            await message.addReaction(ctx.icons[i+1])
    })

}

module.exports = {
    createPoll
}