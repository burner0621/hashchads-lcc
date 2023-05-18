import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'

// import { client } from '../apollo/client'
// import {
//   PAIR_DATA,
//   PAIR_CHART,
//   FILTERED_TRANSACTIONS,
//   PAIRS_CURRENT,
//   PAIRS_BULK,
//   PAIRS_HISTORICAL_BULK,
//   HOURLY_PAIR_RATES,
// } from '../apollo/queries'

import { useAllPairsInSaucerswap } from './GlobalData'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

// import {
//   getPercentChange,
//   get2DayPercentChange,
//   isAddress,
//   getBlocksFromTimestamps,
//   getTimestampsForChanges,
//   splitQuery,
// } from '../utils'
// import { timeframeOptions, TRACKED_OVERRIDES_PAIRS, TRACKED_OVERRIDES_TOKENS } from '../constants'
// import { useLatestBlocks } from './Application'
// import { updateNameData } from '../utils/data'

const UPDATE = 'UPDATE'
const UPDATE_PAIR_TXNS = 'UPDATE_PAIR_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_TOP_PAIRS = 'UPDATE_TOP_PAIRS'
const UPDATE_HOURLY_DATA = 'UPDATE_HOURLY_DATA'
const ETH_PRICE_KEY = 'ETH_PRICE_KEY'
const UPDATE_PAIR_DATA = 'UPDATE_PAIR_DATA'

dayjs.extend(utc)

export function safeAccess(object, path) {
  return object
    ? path.reduce(
      (accumulator, currentValue) => (accumulator && accumulator[currentValue] ? accumulator[currentValue] : null),
      object
    )
    : null
}

const PairDataContext = createContext()

function usePairDataContext() {
  return useContext(PairDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { pairAddress, data } = payload
      return {
        ...state,
        [pairAddress]: {
          ...state?.[pairAddress],
          ...data,
        },
      }
    }

    case UPDATE_PAIR_DATA: {
      const { address, pairData } = payload

      return {
        ...state,
        [address]: {
          ...state?.[address],
          pairData
        },
      }
    }

    // case UPDATE_TOP_PAIRS: {
    //   const { topPairs } = payload
    //   let added = {}
    //   topPairs.map((pair) => {
    //     return (added[pair.id] = pair)
    //   })
    //   return {
    //     ...state,
    //     ...added,
    //   }
    // }

    // case UPDATE_PAIR_TXNS: {
    //   const { address, transactions } = payload
    //   return {
    //     ...state,
    //     [address]: {
    //       ...(safeAccess(state, [address]) || {}),
    //       txns: transactions,
    //     },
    //   }
    // }

    case UPDATE_CHART_DATA: {
      const { address, dailyChartData, hourlyChartData } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          dailyChartData,
          hourlyChartData
        },
      }
    }

    // case UPDATE_HOURLY_DATA: {
    //   const { address, hourlyData, timeWindow } = payload
    //   return {
    //     ...state,
    //     [address]: {
    //       ...state?.[address],
    //       hourlyData: {
    //         ...state?.[address]?.hourlyData,
    //         [timeWindow]: hourlyData,
    //       },
    //     },
    //   }
    // }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})

  // update pair specific data
  const update = useCallback((pairAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        pairAddress,
        data,
      },
    })
  }, [])

  const updatePairData = useCallback((address, pairData) => {
    dispatch({
      type: UPDATE_PAIR_DATA,
      payload: {
        address,
        pairData
      },
    })
  }, [])

  // const updateTopPairs = useCallback((topPairs) => {
  //   dispatch({
  //     type: UPDATE_TOP_PAIRS,
  //     payload: {
  //       topPairs,
  //     },
  //   })
  // }, [])

  // const updatePairTxns = useCallback((address, transactions) => {
  //   dispatch({
  //     type: UPDATE_PAIR_TXNS,
  //     payload: { address, transactions },
  //   })
  // }, [])

  // const updateEthPrice = useCallback((ethPrice, oneDayPrice, ethPriceChange) => {
  //   dispatch({
  //     type: UPDATE_ETH_PRICE,
  //     payload: {
  //       ethPrice,
  //       oneDayPrice,
  //       ethPriceChange,
  //     },
  //   })
  // }, [])

  const updateChartData = useCallback((address, hourlyChartData, dailyChartData) => {
    dispatch({
      type: UPDATE_CHART_DATA,
      payload: { address, hourlyChartData, dailyChartData },
    })
  }, [])

  // const updateHourlyData = useCallback((address, hourlyData, timeWindow) => {
  //   dispatch({
  //     type: UPDATE_HOURLY_DATA,
  //     payload: { address, hourlyData, timeWindow },
  //   })
  // }, [])

  return (
    <PairDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updatePairData,
            updateChartData,
            // updateTopPairs,
            // updateHourlyData,
          },
        ],
        [state, update, updatePairData, updateChartData]
      )}
    >
      {children}
    </PairDataContext.Provider>
  )
}

// async function getBulkPairData(pairList, ethPrice) {
//   const [t1, t2, tWeek] = getTimestampsForChanges()
//   let [{ number: b1 }, { number: b2 }, { number: bWeek }] = await getBlocksFromTimestamps([t1, t2, tWeek])

//   try {
//     let current = await client.query({
//       query: PAIRS_BULK,
//       variables: {
//         allPairs: pairList,
//       },
//       fetchPolicy: 'cache-first',
//     })

//     let [oneDayResult, twoDayResult, oneWeekResult] = await Promise.all(
//       [b1, b2, bWeek].map(async (block) => {
//         let result = client.query({
//           query: PAIRS_HISTORICAL_BULK(block, pairList),
//           fetchPolicy: 'cache-first',
//         })
//         return result
//       })
//     )

//     let oneDayData = oneDayResult?.data?.pairs.reduce((obj, cur, i) => {
//       return { ...obj, [cur.id]: cur }
//     }, {})

//     let twoDayData = twoDayResult?.data?.pairs.reduce((obj, cur, i) => {
//       return { ...obj, [cur.id]: cur }
//     }, {})

//     let oneWeekData = oneWeekResult?.data?.pairs.reduce((obj, cur, i) => {
//       return { ...obj, [cur.id]: cur }
//     }, {})

//     let pairData = await Promise.all(
//       current &&
//         current.data.pairs.map(async (pair) => {
//           let data = pair
//           let oneDayHistory = oneDayData?.[pair.id]
//           if (!oneDayHistory) {
//             let newData = await client.query({
//               query: PAIR_DATA(pair.id, b1),
//               fetchPolicy: 'cache-first',
//             })
//             oneDayHistory = newData.data.pairs[0]
//           }
//           let twoDayHistory = twoDayData?.[pair.id]
//           if (!twoDayHistory) {
//             let newData = await client.query({
//               query: PAIR_DATA(pair.id, b2),
//               fetchPolicy: 'cache-first',
//             })
//             twoDayHistory = newData.data.pairs[0]
//           }
//           let oneWeekHistory = oneWeekData?.[pair.id]
//           if (!oneWeekHistory) {
//             let newData = await client.query({
//               query: PAIR_DATA(pair.id, bWeek),
//               fetchPolicy: 'cache-first',
//             })
//             oneWeekHistory = newData.data.pairs[0]
//           }
//           data = parseData(data, oneDayHistory, twoDayHistory, oneWeekHistory, ethPrice, b1)
//           return data
//         })
//     )
//     return pairData
//   } catch (e) {
//     console.log(e)
//   }
// }

// function parseData(data, oneDayData, twoDayData, oneWeekData, ethPrice, oneDayBlock) {
//   const pairAddress = data.id

//   // get volume changes
//   const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
//     data?.volumeUSD,
//     oneDayData?.volumeUSD ? oneDayData.volumeUSD : 0,
//     twoDayData?.volumeUSD ? twoDayData.volumeUSD : 0
//   )
//   const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
//     data?.untrackedVolumeUSD,
//     oneDayData?.untrackedVolumeUSD ? parseFloat(oneDayData?.untrackedVolumeUSD) : 0,
//     twoDayData?.untrackedVolumeUSD ? twoDayData?.untrackedVolumeUSD : 0
//   )

//   const oneWeekVolumeUSD = parseFloat(oneWeekData ? data?.volumeUSD - oneWeekData?.volumeUSD : data.volumeUSD)

//   const oneWeekVolumeUntracked = parseFloat(
//     oneWeekData ? data?.untrackedVolumeUSD - oneWeekData?.untrackedVolumeUSD : data.untrackedVolumeUSD
//   )

//   // set volume properties
//   data.oneDayVolumeUSD = parseFloat(oneDayVolumeUSD)
//   data.oneWeekVolumeUSD = oneWeekVolumeUSD
//   data.volumeChangeUSD = volumeChangeUSD
//   data.oneDayVolumeUntracked = oneDayVolumeUntracked
//   data.oneWeekVolumeUntracked = oneWeekVolumeUntracked
//   data.volumeChangeUntracked = volumeChangeUntracked

//   // set liquidity properties
//   data.trackedReserveUSD = data.trackedReserveETH * ethPrice
//   data.liquidityChangeUSD = getPercentChange(data.reserveUSD, oneDayData?.reserveUSD)

//   // format if pair hasnt existed for a day or a week
//   if (!oneDayData && data && data.createdAtBlockNumber > oneDayBlock) {
//     data.oneDayVolumeUSD = parseFloat(data.volumeUSD)
//   }
//   if (!oneDayData && data) {
//     data.oneDayVolumeUSD = parseFloat(data.volumeUSD)
//   }
//   if (!oneWeekData && data) {
//     data.oneWeekVolumeUSD = parseFloat(data.volumeUSD)
//   }

//   if (
//     TRACKED_OVERRIDES_PAIRS.includes(pairAddress) ||
//     TRACKED_OVERRIDES_TOKENS.includes(data.token0.id) ||
//     TRACKED_OVERRIDES_TOKENS.includes(data.token1.id)
//   ) {
//     data.oneDayVolumeUSD = oneDayVolumeUntracked
//     data.oneWeekVolumeUSD = oneWeekVolumeUntracked
//     data.volumeChangeUSD = volumeChangeUntracked
//     data.trackedReserveUSD = data.reserveUSD
//   }

//   // format incorrect names
//   updateNameData(data)

//   return data
// }

// const getPairTransactions = async (pairAddress) => {
//   const transactions = {}

//   try {
//     let result = await client.query({
//       query: FILTERED_TRANSACTIONS,
//       variables: {
//         allPairs: [pairAddress],
//       },
//       fetchPolicy: 'no-cache',
//     })
//     transactions.mints = result.data.mints
//     transactions.burns = result.data.burns
//     transactions.swaps = result.data.swaps
//   } catch (e) {
//     console.log(e)
//   }

//   return transactions
// }

const getPairChartData = async (pairAddress, pairId) => {
  const utcEndTime = dayjs.utc()
  let utcStartTime = utcEndTime.subtract(1, 'year').startOf('minute')
  let startTime = utcStartTime.unix() - 1

  try {
    let response = await fetch(`https://api.saucerswap.finance/pools/conversionRates/${pairId}?interval=DAY&from=${startTime}&to=${Date.now() / 1000}`)
    if (response.status === 200) {
      const dailyData = await response.json()
      response = await fetch(`https://api.saucerswap.finance/pools/conversionRates/${pairId}?interval=HOUR&from=${startTime}&to=${Date.now() / 1000}`)
      if (response.status === 200) {
        const hourlyData = await response.json()
        return [hourlyData, dailyData]
      }
      return [undefined, dailyData]
    }
  } catch (e) {
    return []
  }
}

// const getHourlyRateData = async (pairAddress, startTime, latestBlock) => {
//   try {
//     const utcEndTime = dayjs.utc()
//     let time = startTime

//     // create an array of hour start times until we reach current hour
//     const timestamps = []
//     while (time <= utcEndTime.unix() - 3600) {
//       timestamps.push(time)
//       time += 3600
//     }

//     // backout if invalid timestamp format
//     if (timestamps.length === 0) {
//       return []
//     }

//     // once you have all the timestamps, get the blocks for each timestamp in a bulk query
//     let blocks

//     blocks = await getBlocksFromTimestamps(timestamps, 100)

//     // catch failing case
//     if (!blocks || blocks?.length === 0) {
//       return []
//     }

//     if (latestBlock) {
//       blocks = blocks.filter((b) => {
//         return parseFloat(b.number) <= parseFloat(latestBlock)
//       })
//     }

//     const result = await splitQuery(HOURLY_PAIR_RATES, client, [pairAddress], blocks, 100)

//     // format token ETH price results
//     let values = []
//     for (var row in result) {
//       let timestamp = row.split('t')[1]
//       if (timestamp) {
//         values.push({
//           timestamp,
//           rate0: parseFloat(result[row]?.token0Price),
//           rate1: parseFloat(result[row]?.token1Price),
//         })
//       }
//     }

//     let formattedHistoryRate0 = []
//     let formattedHistoryRate1 = []

//     // for each hour, construct the open and close price
//     for (let i = 0; i < values.length - 1; i++) {
//       formattedHistoryRate0.push({
//         timestamp: values[i].timestamp,
//         open: parseFloat(values[i].rate0),
//         close: parseFloat(values[i + 1].rate0),
//       })
//       formattedHistoryRate1.push({
//         timestamp: values[i].timestamp,
//         open: parseFloat(values[i].rate1),
//         close: parseFloat(values[i + 1].rate1),
//       })
//     }

//     return [formattedHistoryRate0, formattedHistoryRate1]
//   } catch (e) {
//     console.log(e)
//     return [[], []]
//   }
// }

// export function Updater() {
//   const [, { updateTopPairs }] = usePairDataContext()
//   const _allPairs = useAllPairsInSaucerswap ()
//   useEffect(() => {
//     async function getData() {
//       // format as array of addresses
//       const formattedPairs = _allPairs.map((pair) => {
//         return pair.id
//       })

//       // get data for every pair in list
//       let topPairs = await getBulkPairData(formattedPairs)
//       topPairs && updateTopPairs(topPairs)
//     }
//     getData()
//   }, [updateTopPairs])
//   return null
// }

// export function useHourlyRateData(pairAddress, timeWindow) {
//   const [state, { updateHourlyData }] = usePairDataContext()
//   const chartData = state?.[pairAddress]?.hourlyData?.[timeWindow]
//   const [latestBlock] = useLatestBlocks()

//   useEffect(() => {
//     const currentTime = dayjs.utc()
//     const windowSize = timeWindow === timeframeOptions.MONTH ? 'month' : 'week'
//     const startTime =
//       timeWindow === timeframeOptions.ALL_TIME ? 1589760000 : currentTime.subtract(1, windowSize).startOf('hour').unix()

//     async function fetch() {
//       let data = await getHourlyRateData(pairAddress, startTime, latestBlock)
//       updateHourlyData(pairAddress, data, timeWindow)
//     }
//     if (!chartData) {
//       fetch()
//     }
//   }, [chartData, timeWindow, pairAddress, updateHourlyData, latestBlock])

//   return chartData
// }

/**
 * @todo
 * store these updates to reduce future redundant calls
 */
// export function useDataForList(pairList) {
//   const [state] = usePairDataContext()
//   const [ethPrice] = useEthPrice()

//   const [stale, setStale] = useState(false)
//   const [fetched, setFetched] = useState([])

//   // reset
//   useEffect(() => {
//     if (pairList) {
//       setStale(false)
//       setFetched()
//     }
//   }, [pairList])

//   useEffect(() => {
//     async function fetchNewPairData() {
//       let newFetched = []
//       let unfetched = []

//       pairList.map(async (pair) => {
//         let currentData = state?.[pair.id]
//         if (!currentData) {
//           unfetched.push(pair.id)
//         } else {
//           newFetched.push(currentData)
//         }
//       })

//       let newPairData = await getBulkPairData(
//         unfetched.map((pair) => {
//           return pair
//         }),
//         ethPrice
//       )
//       setFetched(newFetched.concat(newPairData))
//     }
//     if (ethPrice && pairList && pairList.length > 0 && !fetched && !stale) {
//       setStale(true)
//       fetchNewPairData()
//     }
//   }, [ethPrice, state, pairList, stale, fetched])

//   let formattedFetch =
//     fetched &&
//     fetched.reduce((obj, cur) => {
//       return { ...obj, [cur?.id]: cur }
//     }, {})

//   return formattedFetch
// }

/**
 * Get all the current and 24hr changes for a pair
 */
export function usePairData(pairAddress) {
  const [state, { updatePairData }] = usePairDataContext()
  const pairData = state?.[pairAddress]?.pairData
  const _allPairs = useAllPairsInSaucerswap()
  let pairId = -1
  let _pair = {}

  useEffect(() => {
    async function fetchData() {
      for (let pair of _allPairs) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (pair.contractId === pairAddress) { pairId = pair.id; _pair = pair; break }
      }
      if (Number(pairId) > -1) {
        let data = await getPairData(pairId, _pair)
        data && updatePairData(pairAddress, data)
      }
    }
    if ((!pairData || pairData.length > 0) && pairAddress && _allPairs) {
      fetchData()
    }
  }, [pairAddress, pairData, updatePairData, _allPairs])

  return pairData || {}
}
async function getPairData(pairId, pair) {
  let res = await fetch(`https://api.saucerswap.finance/pools/conversionRates/latest/${pairId}?interval=DAY`)
  if (res.status === 200) {
    let jsonData = await res.json()
    for (let key of Object.keys(pair)) {
      jsonData[key] = pair[key]
    }
  return jsonData
  }
  return []
}
/**
 * Get most recent txns for a pair
 */
// export function usePairTransactions(pairAddress) {
//   const [state, { updatePairTxns }] = usePairDataContext()
//   const pairTxns = state?.[pairAddress]?.txns
//   useEffect(() => {
//     async function checkForTxns() {
//       if (!pairTxns) {
//         let transactions = await getPairTransactions(pairAddress)
//         updatePairTxns(pairAddress, transactions)
//       }
//     }
//     checkForTxns()
//   }, [pairTxns, pairAddress, updatePairTxns])
//   return pairTxns
// }

export function usePairChartData(poolId) {
  const _allPairs = useAllPairsInSaucerswap()
  const pairAddress = _allPairs[poolId]?.contractId
  const [state, { updateChartData }] = usePairDataContext()
  const dailyChartData = state?.[pairAddress]?.dailyChartData
  const hourlyChartData = state?.[pairAddress]?.hourlyChartData

  useEffect(() => {
    async function checkForChartData() {
      if (!dailyChartData || !hourlyChartData) {
        const [hourlyData, dailyData] = await getPairChartData(pairAddress, poolId)
        updateChartData(pairAddress, hourlyData, dailyData)
      }
    }
    checkForChartData()
  }, [hourlyChartData, dailyChartData, pairAddress, poolId, updateChartData])

  return [hourlyChartData, dailyChartData]
}

/**
 * Get list of all pairs in Uniswap
 */
export function useAllPairData() {
  const [state] = usePairDataContext()
  return state || {}
}
