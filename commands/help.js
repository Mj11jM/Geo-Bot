const {cmd} = require('../utils/cmd')
const helpJSON = require('../help.json')

cmd('help', async (ctx, ...args) => {
    let helpSearch, capitalSearch
    if (args.length === 0)
        helpSearch = "base"
    else
        args.map((x, i) => {
            helpSearch = x
            capitalSearch = ctx.msg[i]
        })
    let helpEmbed = helpJSON.find(x => x.type.includes(helpSearch))
    if (!helpEmbed)
        return ctx.reply(`Help could not be found for \`${capitalSearch}\`! Please check your spelling and try again.`, 'red')
    let embed = {
        title: helpEmbed.title,
        description: helpEmbed.description,
        fields: helpEmbed.fields
    }
    ctx.reply(embed, 'blue')
})
