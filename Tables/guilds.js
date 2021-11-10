const {model, Schema} = require('mongoose')

module.exports = model('Guilds', new Schema({
    guild_id:             { type: String, index: true },
    prefix:               { type: String, default: ">" },
    guild_name:           { type: String },
    greeting:             { type: String },
    greeting_channel:     { type: String },
    auto_role:            { type: String },


    greeting_images:      { type: Array, default: [] },
    moderators:           { type: Array, default: [] },
    game_channels:        { type: Array, default: [] },
    reaction_roles:       { type: Array, default: [] },

}))