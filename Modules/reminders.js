const {Reminders} = require('../Tables')

const checkReminders = async (ctx, now) => {
    let needsReminding = (await Reminders.find({reminded: false}).sort({remind_at: 1}))[0]
    if (!needsReminding || needsReminding.remind_at > now) {
        return
    }
    needsReminding.reminded = true
    await needsReminding.save()

    if (needsReminding.channel_reminder) {
        ctx.send(needsReminding.channel_id, `<@${needsReminding.user_id}> here's your reminder!`, needsReminding.message)
    } else {
        try {
            await ctx.direct({id: needsReminding.user_id}, needsReminding.message)
        } catch (e) {
            console.log(e)
            await ctx.send(needsReminding.channel_id,  `<@${needsReminding.user_id}> here's your reminder!`, needsReminding.message)
        }
    }

}

const deleteReminders = async (ctx, now) => {
    await Reminders.deleteMany({reminded:true})
}

const getTimeFromReminder = async (text) => {
    let now = Date.now()
    let split = text.split('')
    let amount = ''
    let error = false
    split.map(x => {
        if (isNaN(parseInt(x))) {
            switch (x) {
                case 's':
                    now += (parseInt(amount) * 1000)
                    amount = ''
                    break
                case 'm':
                    now += (parseInt(amount) * 60000)
                    amount = ''
                    break
                case 'h':
                    now += (parseInt(amount) * (60000 * 60))
                    amount = ''
                    break
                case 'd':
                    now += (parseInt(amount) * (60000 * 60 * 24))
                    amount = ''
                    break
                case 'w':
                    now += (parseInt(amount) * (60000 * 60 * 24 * 7))
                    amount = ''
                    break
                case 'M':
                    now += (parseInt(amount) * (60000 * 60 * 24 * 30))
                    amount = ''
                    break
                case 'y':
                    now += (parseInt(amount) * (60000 * 60 * 24 * 30 * 12))
                    amount = ''
                    break
                default:
                    error = true
            }
        } else {
            amount += x
        }
    })
    return new Date(now)

}

module.exports = {
    checkReminders,
    deleteReminders,
    getTimeFromReminder
}