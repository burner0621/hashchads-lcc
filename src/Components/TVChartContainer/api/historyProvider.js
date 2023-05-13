/* eslint-disable no-mixed-spaces-and-tabs */
import pairs from './pairs'
var rp = require('request-promise').defaults({json: true})
const api_root = 'https://min-api.cryptocompare.com'
const history = {}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	history: history,

  getBars: async function(symbolInfo, resolution, _from, to, first, limit) {
	  // eslint-disable-next-line no-mixed-spaces-and-tabs
	  var split_symbol = symbolInfo.name.split(/[:/]/)
		const url = resolution === 'D' ? '/data/histoday' : resolution >= 60 ? '/data/histohour' : '/data/histominute'
		const qs = {
        e: pairs[split_symbol[0] + "/" + split_symbol[1]],
				fsym: split_symbol[0],
				tsym: split_symbol[1],
				toTs:  to ? to : '',
				limit: limit ? limit : 2000, 
				// aggregate: 1//resolution 
			}
		// console.log({qs})
      const data = await rp({
          url: `${api_root}${url}`,
          qs,
      })
      // console.log({data})
      if (data.Response && data.Response === 'Error') {
          // console.log('CryptoCompare API error:',data.Message)
          return []
      }
      if (data.Data.length) {
          // console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
          var bars = data.Data.map(el => {
              return {
                  time: el.time * 1000,
                  low: el.low,
                  high: el.high,
                  open: el.open,
                  close: el.close,
                  volume: el.volumefrom
              }
          })
          if (first) {
              var lastBar = bars[bars.length - 1]
              history[symbolInfo.name] = { lastBar: lastBar }
          }
          return bars
      } else {
          return []
      }
  }
}