import Numeral from 'numeral'
import { Text } from 'rebass'
import { timeframeOptions } from '../constants'
import dayjs from 'dayjs'

export const toK = (num, digit=4) => {
  if (digit === 4) return Numeral(num).format('0,0.[0000]')
  if (digit === 2) return Numeral(num).format('0,0.[00]')
  if (digit === 0) return Numeral(num).format('0,0')
}

export const formatDollarAmount = (num, digits) => {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return formatter.format(num)
}

export const formattedNum = (number, usd = false, acceptNegatives = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0
  }
  let num = parseFloat(number)

  if (num > 5000000000) {
    return (usd ? '$' : '') + toK(num.toFixed(2), 0)
  }

  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (num > 1000) {
    return usd ? formatDollarAmount(num, 2) : Number(parseFloat(num).toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (num < 0.1) {
      return formatDollarAmount(num, 4)
    } else {
      return formatDollarAmount(num, 0)
    }
  }

  return Number(parseFloat(num).toFixed(0)).toString()
}

export function formattedPercent(percent, useBrackets = false) {
  percent = parseFloat(percent)
  if (!percent || percent === 0) {
    return <Text fontWeight={500}>0%</Text>
  }

  if (percent < 0.0001 && percent > 0) {
    return (
      <Text fontWeight={500} color="green">
        {'< 0.0001%'}
      </Text>
    )
  }

  if (percent < 0 && percent > -0.0001) {
    return (
      <Text fontWeight={500} color="red">
        {'< 0.0001%'}
      </Text>
    )
  }

  let fixedPercent = percent.toFixed(2)
  if (fixedPercent === '0.00') {
    return '0%'
  }
  if (fixedPercent > 0) {
    if (fixedPercent > 100) {
      return <Text fontWeight={500} color="green">{`+${percent?.toFixed(0).toLocaleString()}%`}</Text>
    } else {
      return <Text fontWeight={500} color="green">{`+${fixedPercent}%`}</Text>
    }
  } else {
    return <Text fontWeight={500} color="red">{`${fixedPercent}%`}</Text>
  }
}

export function getTimeframe(timeWindow) {
  const utcEndTime = dayjs.utc()
  // based on window, get starttime
  let utcStartTime
  switch (timeWindow) {
    case timeframeOptions.WEEK:
      utcStartTime = utcEndTime.subtract(1, 'week').endOf('day').unix() - 1
      break
    case timeframeOptions.MONTH:
      utcStartTime = utcEndTime.subtract(1, 'month').endOf('day').unix() - 1
      break
    case timeframeOptions.ALL_TIME:
      utcStartTime = utcEndTime.subtract(1, 'year').endOf('day').unix() - 1
      break
    default:
      utcStartTime = utcEndTime.subtract(1, 'year').startOf('year').unix() - 1
      break
  }
  return utcStartTime
}

export const get2DayPercentChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
  // get volume info for both 24 hour periods
  let currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo)
  let previousChange = parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo)

  const adjustedPercentChange = (parseFloat(currentChange - previousChange) / parseFloat(previousChange)) * 100

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0]
  }
  return [currentChange, adjustedPercentChange]
}

export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) / parseFloat(value24HoursAgo)) * 100
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0
  }
  return adjustedPercentChange
}