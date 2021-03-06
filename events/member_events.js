const {Logs, Guild} = require('../tables')
const msToTime = require('pretty-ms')
const _ = require('lodash')
const {member_log} = require("../modules/logs/member_logs");

const member_add = async (ctx, guild, member) => {
    let botGuild = await Guild.findOne({guild_id: guild.id})
    if (botGuild && botGuild.auto_role)
        await member.addRole(botGuild.auto_role)
    await member_log()
    let logList = await Logs.find({guild_id: guild.id})
    logList = logList.filter(x => x.all_events || x.member_events.add || x.member_events.all)
    if (logList.length === 0) {
        return
    }
    const embed = {
        author: {
            name: `New Member ${member.username}!`,
            icon_url: member.avatarURL
        },
        fields: [
            {
                name: "Account Created",
                value:  new Date(member.createdAt).toLocaleString('en-gb', {hour12:false}),
                inline: true
            },
            {
                name: "Mention",
                value:  member.mention,
                inline: true
            },
            {
                name: "User ID",
                value:  member.id
            }
        ],
        footer: {
            text: new Date().toLocaleString('en-gb', {hour12:false})
        },
    }
    logList.map(async (x) => {
        await ctx.send(x.channel_id, embed)
    })
}

const member_remove = async (ctx, guild, member) => {
    let logList = await Logs.find({guild_id: guild.id})
    logList = logList.filter(x => x.all_events || x.member_events.remove || x.member_events.all)
    if (logList.length === 0) {
        return
    }
    let roles = ''
    member.roles.map(x => roles += `<@&${x}> `)
    if (roles === '')
        roles = 'None'
    const embed = {
        author: {
            name: `Member Left ${member.username}!`,
            icon_url: member.avatarURL
        },
        fields: [
            {
                name: "Mention",
                value:  member.mention,
                inline: true
            },
            {
                name: "User ID",
                value:  member.id,
                inline: true
            },
            {
                name: "Joined On",
                value:  new Date(member.joinedAt).toLocaleString('en-gb', {hour12:false})
            },
            {
              name: "Roles",
              value: roles
            },
            {
                name: "Time Since Joined",
                value: `${msToTime(new Date() - member.joinedAt, {verbose:true})} ago`
            }
        ],
        footer: {
            text: new Date().toLocaleString('en-gb', {hour12:false})
        },
    }
    logList.map(async (x) => {
        await ctx.send(x.channel_id, embed)
    })
}

const member_update = async (ctx, guild, member, oldMember) => {
    let logList = await Logs.find({guild_id: guild.id})
    logList = logList.filter(x => x.all_events || x.member_events.update || x.member_events.all)
    if (logList.length === 0) {
        return
    }
    if (member.roles.length !== oldMember.roles.length) {
        let add = member.roles.length > oldMember.roles.length
        let diff = add? _.difference(member.roles, oldMember.roles): _.difference(oldMember.roles, member.roles)
        let embed = {
            author: {
                name: `Member Updated: ${member.username}`,
                icon_url: member.avatarURL
            },
            fields: [],
            footer: {
                text: new Date().toLocaleString('en-gb', {hour12:false})
            },
        }
        let changed = ''
        diff.map(x => changed += `<@&${x}>\n`)
        if (add) {
            embed.fields.push({
                name: "Role Added",
                value: changed
            })
        } else {
            embed.fields.push({
                name: "Role Removed",
                value: changed
            })
        }
        logList.map(async (x) => {
            await ctx.send(x.channel_id, embed)
        })
    }
}

const presence_update = async (ctx, member, presence) => {

}

const user_update = async (ctx, newUser, oldUser) => {

}

module.exports = {
    member_add,
    member_remove,
    member_update,
    presence_update,
    user_update,
}
