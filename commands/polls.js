const {pcmd} = require('../utils/cmd')
const {createPoll} = require('../modules/polls')

pcmd(['administrator'], ['create', 'poll'], async (ctx, ...args) => {
    let allArgs = args
    await ctx.pgn.addConfirmation(ctx.message.author.id, ctx.message.channel.id, {
        question: "Do you want to only allow one response per user for this poll? (Not implemented, choose either)",
        onConfirm: (x) => createPoll(ctx, allArgs, true),
        onDecline: (x) => createPoll(ctx, allArgs, false)
    })
})
