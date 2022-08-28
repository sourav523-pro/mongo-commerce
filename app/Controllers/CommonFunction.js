import moment from 'moment'

export const getDateByDuration = (duration) => {
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