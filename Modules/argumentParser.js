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
        events: []
    }

    args.map(x => {
        
    })


    return newArgs
}