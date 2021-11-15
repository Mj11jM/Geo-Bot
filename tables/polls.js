const {model, Schema} = require('mongoose')

module.exports = model('Polls', new Schema({
    guild_id:             { type: String, index: true },
    message_id:           { type: String },
}))