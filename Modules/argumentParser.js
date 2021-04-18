const parseArgs = async (ctx, ...args) => {
    if (args.length === 0) {
        return false
    }

    let starts = ['add', 'enable', 'start', 'true']
    let stops = ['stop', 'disable', 'false', 'remove']
    let events = [
        'channel_create', 'channel_delete', 'channel_update', 'channel_pin_update',
        'discriminator_change', 'username_change', 'avatar_change', 'guild_update',
        'invites', 'role_create', 'role_delete', 'role_update', 'member_join',
        'member_update', 'member_leave', 'presence_update', 'join_channel',
        'switch_channel', 'leave_channel', 'voice_state']
    let eventGroups = ['channel', 'guild', 'member', 'user', 'role', 'voice', 'channel_events',
        'guild_events', 'member_events', 'user_events', 'role_events', 'voice_events']

    const newArgs = {
        ids: [],
        start: false,
        stop: false,
        events: [],
        extra: []
    }

    args.map(x => {
        switch (x) {
            case starts.includes(x):
                newArgs.start = true
                break
            case stops.includes(x):
                newArgs.stop = true
                break
            case events.includes(x):
            case eventGroups.includes(x):
                newArgs.events.push(x)
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
    parseArgs
}