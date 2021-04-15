const parseArgs = async (ctx, ...args) => {
    if (args.length === 0) {
        return false
    }

    const newArgs = {
        ids: [],
        options: {
            start: false,
            stop: false
        },
        events: [],
        extra: []
    }

    args.map(x => {
        switch (x) {
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