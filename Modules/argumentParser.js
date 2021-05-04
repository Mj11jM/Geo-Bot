const parseArgs = async (ctx, ...args) => {
    if (args.length === 0) {
        return false
    }

    let starts = ['add', 'enable', 'start', 'true']
    let stops = ['stop', 'disable', 'false', 'remove']

    const newArgs = {
        ids: [],
        start: false,
        stop: false,
        extra: []
    }

    args.map(x => {
        switch (x) {
            case 'add':
            case 'enable':
            case 'start':
            case 'true':
                newArgs.start = true
                break
            case 'stop':
            case 'disable':
            case 'false':
            case 'remove':
                newArgs.stop = true
                break
            default:
                let ID = tryGetUserID(x)
                if (ID){
                    newArgs.ids.push(ID)
                } else {
                    newArgs.extra.push(x)
                }
        }
    })


    return newArgs
}

const strictLogArgs = async (ctx, log, enable, ...args) => {
    if (args.length === 0) {
        return false
    }

    let swapped = {
        swapped: [],
        not_found: []
    }

    args.map(x => {
        switch (x) {
            case 'guild_update':
                swapped.swapped.push("Guild Update")
                log.guild_events.update = enable
                break
            case 'invites':
                swapped.swapped.push("Invite Events")
                log.guild_events.invites = enable
                break
            case 'channel_create':
                swapped.swapped.push("Channel Create")
                log.channel_events.create = enable
                break
            case 'channel_delete':
                swapped.swapped.push("Channel Delete")
                log.channel_events.delete = enable
                break
            case 'channel_update':
                swapped.swapped.push("Channel Updates")
                log.channel_events.update = enable
                break
            case 'channel_pin_update':
                swapped.swapped.push("Channel Pin Update")
                log.channel_events.pins = enable
                break
            case 'avatar_change':
                swapped.swapped.push("Avatar Change")
                log.user_events.avatar = enable
                break
            case 'username_change':
                swapped.swapped.push("Username Change")
                log.user_events.username = enable
                break
            case 'discriminator_change':
                swapped.swapped.push("Discriminator Change")
                log.user_events.discriminator = enable
                break
            case 'member_join':
                swapped.swapped.push("Member Join")
                log.member_events.add = enable
                break
            case 'member_update':
            case 'member_updates':
                swapped.swapped.push("Member Updates")
                log.member_events.update = enable
                break
            case 'member_leave':
                swapped.swapped.push("Member Leave")
                log.member_events.remove = enable
                break
            case 'presence_update':
                swapped.swapped.push("Presence Updates")
                log.member_events.presence = enable
                break
            case 'join_channel':
                swapped.swapped.push("Voice Channel Join")
                log.voice_events.join = enable
                break
            case 'switch_channel':
                swapped.swapped.push("Voice Channel Switch")
                log.voice_events.switch = enable
                break
            case 'leave_channel':
                swapped.swapped.push("Voice Channel Leave")
                log.voice_events.leave = enable
                break
            case 'voice_state':
                swapped.swapped.push("Voice State")
                log.voice_events.state = enable
                break
            case 'role_create':
                swapped.swapped.push("Role Create")
                log.role_events.create = enable
                break
            case 'role_delete':
                swapped.swapped.push("Role Delete")
                log.role_events.delete = enable
                break
            case 'role_update':
                swapped.swapped.push("Role Update")
                log.role_events.update = enable
                break
            case 'channel_events':
                swapped.swapped.push("All Channel Events")
                log.channel_events.all = enable
                break
            case 'guild_events':
                swapped.swapped.push("All Guild Events")
                log.guild_events.all = enable
                break
            case 'member_events':
                swapped.swapped.push("All Member Events")
                log.member_events.all = enable
                break
            case 'user_events':
                swapped.swapped.push("All User Events")
                log.user_events.all = enable
                break
            case 'role_events':
                swapped.swapped.push("All Role Events")
                log.role_events.all = enable
                break
            case 'voice_events':
                swapped.swapped.push("All Voice Events")
                log.voice_events.all = enable
                break
            default:
                swapped.not_found.push(x)
        }
    })
    await log.save()
    return swapped
}

const looseLogArgs = async (ctx, log, ...args) => {
    if (args.length === 0) {
        return false
    }

    let swapped = {
        enabled: [],
        disabled: [],
        not_found: []
    }

    args.map(x => {
        switch (x) {
            case 'guild_update':
                log.guild_events.update? swapped.disabled.push(): swapped.enabled.push()
                log.guild_events.update = !log.guild_events.update
                break
            case 'invites':
                log.guild_events.invites? swapped.disabled.push(): swapped.enabled.push()
                log.guild_events.invites = !log.guild_events.invites
                break
            case 'channel_create':
                log.channel_events.create? swapped.disabled.push(): swapped.enabled.push()
                log.channel_events.create = !log.channel_events.create
                break
            case 'channel_delete':
                log.channel_events.delete? swapped.disabled.push(): swapped.enabled.push()
                log.channel_events.delete = !log.channel_events.delete
                break
            case 'channel_update':
                log.channel_events.update? swapped.disabled.push(): swapped.enabled.push()
                log.channel_events.update = !log.channel_events.update
                break
            case 'channel_pin_update':
                log.channel_events.pins? swapped.disabled.push(): swapped.enabled.push()
                log.channel_events.pins = !log.channel_events.pins
                break
            case 'avatar_change':
                log.user_events.avatar? swapped.disabled.push(): swapped.enabled.push()
                log.user_events.avatar = !log.user_events.avatar
                break
            case 'username_change':
                log.user_events.username? swapped.disabled.push(): swapped.enabled.push()
                log.user_events.username = !log.user_events.username
                break
            case 'discriminator_change':
                log.user_events.discriminator? swapped.disabled.push(): swapped.enabled.push()
                log.user_events.discriminator = !log.user_events.discriminator
                break
            case 'member_join':
                log.member_events.join? swapped.disabled.push(): swapped.enabled.push()
                log.member_events.join = !log.member_events.join
                break
            case 'member_update':
                log.member_events.update? swapped.disabled.push(): swapped.enabled.push()
                log.member_events.update = !log.member_events.update
                break
            case 'member_leave':
                log.member_events.leave? swapped.disabled.push(): swapped.enabled.push()
                log.member_events.leave = !log.member_events.leave
                break
            case 'presence_update':
                log.member_events.presence? swapped.disabled.push(): swapped.enabled.push()
                log.member_events.presence = !log.member_events.presence
                break
            case 'join_channel':
                log.voice_events.join? swapped.disabled.push(): swapped.enabled.push()
                log.voice_events.join = !log.voice_events.join
                break
            case 'switch_channel':
                log.voice_events.switch? swapped.disabled.push(): swapped.enabled.push()
                log.voice_events.switch = !log.voice_events.switch
                break
            case 'leave_channel':
                log.voice_events.leave? swapped.disabled.push(): swapped.enabled.push()
                log.voice_events.leave = !log.voice_events.leave
                break
            case 'voice_state':
                log.voice_events.state? swapped.disabled.push(): swapped.enabled.push()
                log.voice_events.state = !log.voice_events.state
                break
            case 'role_create':
                log.role_events.create? swapped.disabled.push(): swapped.enabled.push()
                log.role_events.create = !log.role_events.create
                break
            case 'role_delete':
                log.role_events.delete? swapped.disabled.push(): swapped.enabled.push()
                log.role_events.delete = !log.role_events.delete
                break
            case 'role_update':
                log.role_events.update? swapped.disabled.push(): swapped.enabled.push()
                log.role_events.update = !log.role_events.update
                break
            case 'channel_events':
                log.channel_events.all? swapped.disabled.push(): swapped.enabled.push()
                log.channel_events.all = !og.channel_events.all
                break
            case 'guild_events':
                log.guild_events.all? swapped.disabled.push(): swapped.enabled.push()
                log.guild_events.all = !log.guild_events.all
                break
            case 'member_events':
                log.member_events.all? swapped.disabled.push(): swapped.enabled.push()
                log.member_events.all = !log.member_events.all
                break
            case 'user_events':
                log.user_events.all? swapped.disabled.push(): swapped.enabled.push()
                log.user_events.all = !log.user_events.all
                break
            case 'role_events':
                log.role_events.all? swapped.disabled.push(): swapped.enabled.push()
                log.role_events.all = !log.role_events.all
                break
            case 'voice_events':
                log.voice_events.all? swapped.disabled.push(): swapped.enabled.push()
                log.voice_events.all = !log.voice_events.all
                break
            default:
                swapped.not_found.push(x)
        }
    })
    await log.save()
    return swapped
}

const tryGetUserID = (inp) => {
    inp = inp.trim()

    try {
        if (/^\d+$/.test(inp) && inp > (1000 * 60 * 60 * 24 * 30 * 2 ** 22)){
            return inp;
        } else {
            return inp.slice(0, -1).split('@')[1].replace('!', '');
        }
    }
    catch(err) { }

    return false
}

module.exports = {
    looseLogArgs,
    parseArgs,
    strictLogArgs
}