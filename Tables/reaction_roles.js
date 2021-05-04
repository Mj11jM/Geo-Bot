const {model, Schema} = require('mongoose')

module.exports = model('Reaction_Roles', new Schema({
    guild_id:             { type: String, index: true },
    message_id:           { type: String },
    reaction_roles:       { type: Array, default: [] },
}))