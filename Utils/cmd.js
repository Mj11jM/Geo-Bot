const tree = {
    cmd: {},
    rct: {},
}

const cmd = (...args) => buildTree(args)

const pcmd = (perm, ...args) => buildTree(args, perm)

const rct = (...args) => {
    const callback = args.pop()
    const cursor = tree.rct

    args.map(alias => {
        if (!cursor.hasOwnProperty(alias)) {
            cursor[alias] = {}
        }

        cursor[alias]._callback = callback
    })
}

const buildTree = (args, perm) => {
    const callback = args.pop()
    const cursors = []

    args.map(alias => {
        let sequence = Array.isArray(alias) ? alias : [alias]
        let cursor = tree.cmd

        sequence.map(arg => {
            if (!cursor.hasOwnProperty(arg)) {
                cursor[arg] = {}
            }

            cursor = cursor[arg]
        })

        cursor._callback = callback

        if(perm)
            cursor._perm = perm

        cursors.push(cursor)
    })

    const chain = {
        access: (arg) => {
            cursors.map(x => {
                x._access = arg
            })
            return chain
        }
    }

    return chain
}

const trigger = async (type, ctx, args) => {
    let cursor = tree[type]

    while (cursor.hasOwnProperty(args[0])) {
        cursor = cursor[args[0]]
        args.shift()
        ctx.msg.shift()
    }

    if (!cursor.hasOwnProperty('_callback')) {
        return ctx.reply(`Unknown command! Please check your spelling and try again`, 'red')
    }

    if (cursor._perm) {
        let permCheck = !ctx.serverOwner || !ctx.guild.moderators || ctx.guild.moderators.includes(ctx.message.author.id) || !cursor._perm.find(x => !ctx.message.member.permissions.has(x))
        if(!permCheck && ctx.config.owner !== ctx.message.author.id)
            return ctx.reply(`Only moderators designated by server owner or those with **${cursor._perm.join(', ')}** permissions can run this command!`, 'red')
    }

    if(!ctx.guild && cursor._access !== 'dm') {
        return ctx.reply(`this command is server only!`, 'red')
    }

    const newArgs = [ctx || { }].concat(args)

    try {
        return await cursor._callback.apply({}, newArgs)
    } catch (err) {
        console.error(err) /* log actual error to the console */
        throw (err)
    }
}

module.exports = {
    cmd,
    pcmd,
    rct,
    trigger,
}