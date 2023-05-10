import moment from 'moment'

const getDateByDuration = (duration) => {
    let start, end
    switch (duration) {
        case 'today':
            start = moment().startOf('day')
            end = moment().endOf('day')
            break
        case 'week':
            start = moment().startOf('week')
            end = moment().endOf('week')
            break
        case 'last7days':
            start = moment().subtract(6, 'days').startOf('days')
            end = moment().endOf('days')
            break
        case 'month':
            start = moment().startOf('month')
            end = moment().endOf('month')
            break
        case 'year':
            start = moment().startOf('year')
            end = moment().endOf('year')
            break
        case 'last30days':
            start = moment().subtract(29, 'days').startOf('days')
            end = moment().endOf('days')
            break
        case 'lastmonth':
            start = moment().subtract(1, 'month').startOf('month')
            end = moment().subtract(1, 'month').endOf('month')
            break
        default:
            start = moment().startOf('month')
            end = moment().endOf('month')
    }
    return { start: start.format('YYYY-MM-DD') + 'T00:00:00.000Z', end: end.format('YYYY-MM-DD') + 'T24:00:00.000Z' }
}

const getSystemDate = (time = false) => {
    let date_ob = new Date()
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2)
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
    // current year
    let year = date_ob.getFullYear()
    // current hours
    let hours = date_ob.getHours()
    // current minutes
    let minutes = date_ob.getMinutes()
    // current seconds
    let seconds = date_ob.getSeconds()
    // prints date in YYYY-MM-DD format
    let finalDate = year + "-" + month + "-" + date
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    let dateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    return time ? dateTime : finalDate
}

const getDate = (format = 'YYYY-MM-DDTHH:mm:ss.000Z') => {
    return moment().format(format)
}

const rand = (length = 100) => {
    return Math.floor((Math.random() * 100000) + length)
}


export { getDateByDuration, getDate, getSystemDate, rand }