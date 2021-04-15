const {pcmd} = require('../Utils/cmd')
const _ = require('lodash')

pcmd(['manageRoles'], ['reaction', 'role', 'add'], ['reaction', 'roles', 'add'], ['rero', 'add'], async (ctx, ...args) => {
    const groups = _.chunk(args, 2)
    console.log(groups)
    console.log(ctx.msg)
})