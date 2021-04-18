const {pcmd} = require('../Utils/cmd')
const _ = require('lodash')

pcmd(['manageRoles'], ['reaction', 'role', 'add'], ['reaction', 'roles', 'add'], ['rero', 'add'], async (ctx, ...args) => {
    const groups = _.chunk(args, 2)
    let pairs = []
    let roleError, emojiError = false
    groups.map(x => {
        let reroPair = {}
        let role = ctx.message.member.guild.roles.filter(y => (y.name.toLowerCase() === x[0]) ||
            (y.name.toLowerCase() === x[0].replace('_', ' ')))
        let emoji = x[1].split(':')
        if (role.length === 0) {
            role = ctx.message.member.guild.roles.filter(y => (y.name.toLowerCase() === x[1]) ||
                (y.name.toLowerCase() === x[1].replace('_', ' ')))
            emoji = x[0].split(':')
        }
        if (role.length === 0) {
            roleError = true
            return ctx.reply(`No roles found using ${x[0]} and ${x[1]}. Please make sure you enter either the role name exactly, or the role ID.`, 'red')
        }
        if (emoji.length > 1) {
            emoji[emoji.length - 1] = emoji[emoji.length - 1].replace('>', '')
            emoji.shift()
        }
        reroPair.emoji = emoji.join(':')
        reroPair.role = role[0]
        pairs.push(reroPair)
    })
    console.log(pairs)
    if (!roleError) {
        await ctx.send(ctx.message.channel.id, `${groups.join(', ')}`).then(message => {
            pairs.map( x => {
                try {
                    message.addReaction(x.emoji)
                } catch (e) {
                    console.log(e)
                }

            })
        })
    }
})