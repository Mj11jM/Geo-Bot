const {pcmd} = require('../Utils/cmd')
const {Reactions} = require('../Tables')
const _ = require('lodash')

pcmd(['manageRoles'], ['reaction', 'role', 'add'], ['reaction', 'roles', 'add'], ['rero', 'add'], async (ctx, ...args) => {
    args = args.filter(x => x !== '').map(y => y.replace('\\', ''))
    const groups = _.chunk(args, 2)
    const pairs = []
    const rError = []
    let roleError = false
    let reroDB = new Reactions()
    let message = ``
    groups.map(x => {
        let reroPair = {}
        //Check for the role being in position 0 without or with _
        let role = ctx.message.member.guild.roles.filter(y => (y.name.toLowerCase() === x[0]) ||
            (y.name.toLowerCase() === x[0].replace(/_/g, ' ')))
        let emoji = x[1].split(':')

        //If no role found for this group, swap role and emoji
        if (role.length === 0) {
            role = ctx.message.member.guild.roles.filter(y => (y.name.toLowerCase() === x[1]) ||
                (y.name.toLowerCase() === x[1].replace(/_/g, ' ')))
            emoji = x[0].split(':')
        }
        if (role.length === 0) {
            roleError = true
            rError.push([x[0], x[1]])
            return
        }
        let message_emoji = emoji.join(':')
        if (emoji.length > 1) {
            let last = emoji.pop().replace(/\D/, '')
            emoji.shift()
            emoji.push(last)
        }
        reroPair.emoji = emoji.join(':')
        reroPair.role = role[0].id

        message += `${message_emoji} ${role[0].mention}\n`
        pairs.push(reroPair)
    })
    reroDB.reaction_roles = pairs
    reroDB.guild_id = ctx.message.guildID
    if (!roleError) {
        const embed = {
            description: message,
            footer: {
                text: new Date().toLocaleString('en-gb', {hour12: false})
            },
            author: {
                name: "Reaction Roles!"
            }
        }
        await ctx.send(ctx.message.channel.id, embed).then(async (message) => {
            reroDB.message_id = message.id
            await reroDB.save()
            pairs.map( async (x) => {
                await message.addReaction(x.emoji).catch(async (e) => {
                    await Reactions.findOneAndDelete({guild_id: message.guildID, message_id: message.id})
                    await message.delete().catch(e => e)
                    await ctx.reply(`Error applying emoji **${x.emoji}**. It may be in a server the bot is not in, or is currently unavailable.`, 'red')
                    return false
                })
            })
        })
    } else {
        return ctx.reply(`Cannot find roles in grouping(s) **${rError.join(', ')}**! If your role has a space in it, replace the space with \`_\``, 'red')
    }


})