const {pcmd} = require('../Utils/cmd')
const _ = require('lodash')

pcmd(['manageRoles'], ['reaction', 'role', 'add'], ['reaction', 'roles', 'add'], ['rero', 'add'], async (ctx, ...args) => {
    const groups = _.chunk(args, 2)
    let pairs = []
    let error = false
    groups.map(x => {
        let reroPair = {}
        let role = ctx.message.member.guild.roles.filter(y => y.name.toLowerCase() === x[0])
        let emoji = x[1]
        if (role.length === 0) {
            role = ctx.message.member.guild.roles.filter(y => y.name.toLowerCase() === x[1])
            emoji = x[0]
        }
        if (role.length === 0) {
            error = true
            return ctx.reply(`No roles found using ${x[0]} and ${x[1]}. Please make sure you enter either the role name exactly, or the role ID.`, 'red')
        }
        reroPair.emoji = emoji
        reroPair.role = role[0]
        pairs.push(reroPair)

    })
    console.log(pairs)
    if (!error) {
        await ctx.send(ctx.message.channel.id, `${groups.join(', ')}`)

    }
})