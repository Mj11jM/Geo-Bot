/*
Returns a discord-styled timestamp, defaults to Short Date/Time automatically
Current Discord timestamp options are:
t	16:20	                        Short Time
T	16:20:30	                    Long Time
d	20/04/2021	                    Short Date
D	20 April 2021	                Long Date
f 	20 April 2021 16:20	            Short Date/Time
F	Tuesday, 20 April 2021 16:20	Long Date/Time
R	2 months ago	                Relative Time
 */
const toDiscordTimestamp = (time, format) => {
    return `<t:${time}:${format? format: 'f'}>`
}

module.exports = {
    toDiscordTimestamp,
}