const {pcmd} = require('../Utils/cmd')
const _ = require('lodash')

pcmd(['manageRoles'], ['reaction', 'role', 'add'], ['reaction', 'roles', 'add'], ['rero', 'add'], async (ctx, ...args) => {
    const groups = _.chunk(args, 2)
    let pairs = []
    groups.map(x => {
        let reroPair = {}
        let first = x[0]
        let firstRole = ctx.message.member.guild.roles.filter(y => y.name.toLowerCase() === first)
        console.log(firstRole)
    })
    await ctx.send(ctx.message.channel.id, `${groups.join(', ')}`)
})