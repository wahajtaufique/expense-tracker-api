const {
    createLogger,
    transports,
    format
} = require('winston');
require('winston-mongodb')
const logger = createLogger({
    transports: [
        // new transports.File({
        //     filename: 'info.log',
        //     level: 'info',
        //     format: format.combine(format.timestamp(), format.json())
        // }),
        // new transports.File({
        //     filename: 'error.log',
        //     level: 'error',
        //     format: format.combine(format.timestamp(), format.json())
        // }),
        new transports.MongoDB({
            level: 'info',
            db: process.env.MONGODBURL,
            options: {
                useUnifiedTopology: true
            },
            collection: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.MongoDB({
            level: 'error',
            db: process.env.MONGODBURL,
            options: {
                useUnifiedTopology: true
            },
            collection: 'error',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;