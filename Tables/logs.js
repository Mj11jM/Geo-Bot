const {model, Schema} = require('mongoose')

module.exports = model('Logs', new Schema({
    guild_id:             { type: String, index: true },
    channel_id:           { type: String },
    all_events:           { type: Boolean, default: false},

    channel_events: {
        all: {type: Boolean, default: false},
        create: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
        delete: {type: Boolean, default: false},
        pins: {type: Boolean, default: false},
    },

    guild_events: {
        all: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
        invites: {type: Boolean, default: false},
    },

    member_events: {
        all: {type: Boolean, default: false},
        add: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
        remove: {type: Boolean, default: false},
        presence: {type: Boolean, default: false},
    },

    user_events: {
        all: {type: Boolean, default: false},
        discriminator: {type: Boolean, default: false},
        username: {type: Boolean, default: false},
        avatar: {type: Boolean, default: false},
    },

    role_events: {
        all: {type: Boolean, default: false},
        create: {type: Boolean, default: false},
        delete: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
    },

    voice_events: {
        all: {type: Boolean, default: false},
        join: {type: Boolean, default: false},
        leave: {type: Boolean, default: false},
        switch: {type: Boolean, default: false},
        state: {type: Boolean, default: false},
    }
}))