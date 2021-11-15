const {model, Schema} = require('mongoose')

module.exports = model('Reminders', new Schema({
    guild_id:             { type: String, index: true },
    user_id:              { type: String },
    channel_id:           { type: String },
    message:              { type: String },

    channel_reminder:     { type: Boolean },
    reminded:             { type: Boolean, default: false },


    remind_at:            { type: Date }

}))
