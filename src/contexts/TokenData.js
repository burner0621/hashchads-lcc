import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import { client } from '../apollo/client'
import {
  TOKEN_DATA,
  FILTERED_TRANSACTIONS,
  TOKEN_CHART,
  TOKEN_TOP_DAY_DATAS,
  PRICES_BY_BLOCK,
  PAIR_DATA,
  TOKENS_HISTORICAL_BULK,
} from '../apollo/queries'

import { getPercentChange } from "../utils"

import { useHbarAndSaucePrice } from './GlobalData'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { timeframeOptions } from '../constants'
import fetch from 'cross-fetch'

const UPDATE = 'UPDATE'
const UPDATE_TOKEN_TXNS = 'UPDATE_TOKEN_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_PRICE_DATA = 'UPDATE_PRICE_DATA'
const UPDATE_TOP_TOKENS = ' UPDATE_TOP_TOKENS'
const UPDATE_ALL_PAIRS = 'UPDATE_ALL_PAIRS'
const UPDATE_COMBINED = 'UPDATE_COMBINED'

const TOKEN_PAIRS_KEY = 'TOKEN_PAIRS_KEY'

dayjs.extend(utc)

const TokenDataContext = createContext()

export function useTokenDataContext() {
  return useContext(TokenDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { tokenAddress, data } = payload
      return {
        ...state,
        [tokenAddress]: {
          ...state?.[tokenAddress],
          ...data,
        },
      }
    }
    // case UPDATE_TOP_TOKENS: {
    //   const { topTokens } = payload
    //   let added = {}
    //   topTokens &&
    //     topTokens.map((token) => {
    //       return (added[token.id] = token)
    //     })
    //   return {
    //     ...state,
    //     ...added,
    //   }
    // }

    // case UPDATE_COMBINED: {
    //   const { combinedVol } = payload
    //   return {
    //     ...state,
    //     combinedVol,
    //   }
    // }

    // case UPDATE_TOKEN_TXNS: {
    //   const { address, transactions } = payload
    //   return {
    //     ...state,
    //     [address]: {
    //       ...state?.[address],
    //       txns: transactions,
    //     },
    //   }
    // }
    case UPDATE_CHART_DATA: {
      const { address, chartData } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          chartData,
        },
      }
    }

    case UPDATE_PRICE_DATA: {
      const { address, data, timeWindow, interval } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          [timeWindow]: {
            ...state?.[address]?.[timeWindow],
            [interval]: data,
          },
        },
      }
    }

    // case UPDATE_ALL_PAIRS: {
    //   const { address, allPairs } = payload
    //   return {
    //     ...state,
    //     [address]: {
    //       ...state?.[address],
    //       [TOKEN_PAIRS_KEY]: allPairs,
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
  const update = useCallback((tokenAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        tokenAddress,
        data,
      },
    })
  }, [])

  // const updateTopTokens = useCallback((topTokens) => {
  //   dispatch({
  //     type: UPDATE_TOP_TOKENS,
  //     payload: {
  //       topTokens,
  //     },
  //   })
  // }, [])

  // const updateCombinedVolume = useCallback((combinedVol) => {
  //   dispatch({
  //     type: UPDATE_COMBINED,
  //     payload: {
  //       combinedVol,
  //     },
  //   })
  // }, [])

  // const updateTokenTxns = useCallback((address, transactions) => {
  //   dispatch({
  //     type: UPDATE_TOKEN_TXNS,
  //     payload: { address, transactions },
  //   })
  // }, [])

  const updateChartData = useCallback((address, chartData) => {
    dispatch({
      type: UPDATE_CHART_DATA,
      payload: { address, chartData },
    })
  }, [])

  // const updateAllPairs = useCallback((address, allPairs) => {
  //   dispatch({
  //     type: UPDATE_ALL_PAIRS,
  //     payload: { address, allPairs },
  //   })
  // }, [])

  const updatePriceData = useCallback((address, data, timeWindow, interval) => {
    dispatch({
      type: UPDATE_PRICE_DATA,
      payload: { address, data, timeWindow, interval },
    })
  }, [])

  return (
    <TokenDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            // updateTokenTxns,
            updateChartData,
            // updateTopTokens,
            // updateAllPairs,
            updatePriceData,
            // updateCombinedVolume,
          },
        ],
        [
          state,
          update,
          // updateTokenTxns,
          // updateCombinedVolume,
          updateChartData,
          // updateTopTokens,
          // updateAllPairs,
          updatePriceData,
        ]
      )}
    >
      {children}
    </TokenDataContext.Provider>
  )
}

const getTokenData = async (tokenId) => {
  let data = {}
  const utcCurrentTime = dayjs()
  try {
    let response = await fetch(`https://api.saucerswap.finance/tokens/prices/latest/${tokenId}?interval=DAY`)
    if (response.status === 200) {
      let jsonData = await response.json()
      data.tvlHbar = jsonData.liquidity
      data.tvlUsd = jsonData.liquidityUsd
      data.volumeHbar = jsonData.volume
      data.volumeUsd = jsonData.volumeUsd
      data.priceUsd = jsonData.closeUsd

      let nowData = Date.now()
      let response1 = await fetch(`https://api.saucerswap.finance/tokens/prices/${tokenId}?interval=DAY&from=${jsonData.timestampSeconds - 86400 * 2}&to=${jsonData.timestampSeconds}`)
      if (response1.status === 200) {
        let jsonData1 = await response1.json()
        data.oneDayTvlHbar = jsonData1[0]['liquidity']
        data.oneDayTvlUsd = jsonData1[0]['liquidityUsd']
        data.oneDayVolumeHbar = jsonData1[0]['volume']
        data.oneDayVolumeUsd = jsonData1[0]['volumeUsd']
        data.oneDayPriceUsd = jsonData1[0]['closeUsd']

        data.priceChangeUsd = getPercentChange(data.priceUsd ?? 0, data.oneDayPriceUsd ?? 0)
        data.liquidityChangeUsd = getPercentChange(data.tvlUsd ?? 0, data.oneDayTvlUsd ?? 0)
        data.volumeChangeUsd = getPercentChange(data.volumeUsd ?? 0, data.oneDayVolumeUsd ?? 0)
      }
    }
  } catch (e) {
    console.log(e)
  }
  return data
}

// const getTokenTransactions = async (allPairsFormatted) => {
//   const transactions = {}
//   try {
//     let result = await client.query({
//       query: FILTERED_TRANSACTIONS,
//       variables: {
//         allPairs: allPairsFormatted,
//       },
//       fetchPolicy: 'cache-first',
//     })
//     transactions.mints = result.data.mints
//     transactions.burns = result.data.burns
//     transactions.swaps = result.data.swaps
//   } catch (e) {
//     console.log(e)
//   }
//   return transactions
// }

// const getTokenPairs = async (tokenAddress) => {
//   try {
//     // fetch all current and historical data
//     let result = await client.query({
//       query: TOKEN_DATA(tokenAddress),
//       fetchPolicy: 'cache-first',
//     })
//     return result.data?.['pairs0'].concat(result.data?.['pairs1'])
//   } catch (e) {
//     console.log(e)
//   }
// }

const getTokenChartData = async (tokenId) => {
  const utcEndTime = dayjs.utc()
  let utcStartTime = utcEndTime.subtract(1, 'year')
  let startTime = utcStartTime.startOf('minute').unix() - 1

  try {
    let response = await fetch(`https://api.saucerswap.finance/tokens/prices/${tokenId}?interval=DAY&from=${startTime}&to=${Date.now() / 1000}`)
    if (response.status === 200) {
      let jsonData = await response.json()
      console.log(jsonData, "<<<<<<<<<<<<<<")
      return jsonData
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}

export function Updater() {
  const [, { updateTopTokens }] = useTokenDataContext()
  const [hbarPrice, saucePrice] = useHbarAndSaucePrice()
  // useEffect(() => {
  //   async function getData() {
  //     // get top pairs for overview list
  //     let topTokens = await getTopTokens(ethPrice, ethPriceOld)
  //     topTokens && updateTopTokens(topTokens)
  //   }
  //   hbarPrice && getData()
  // }, [hbarPrice, updateTopTokens])
  return null
}

export function useTokenData(tokenAddress) {
  const [state, { update }] = useTokenDataContext()
  const tokenData = state?.[tokenAddress]

  useEffect(() => {
    if (!tokenData) {
      getTokenData(tokenAddress).then((data) => {
        if (data.length > 0) update(tokenAddress, data)
      })
    }
  }, [tokenAddress, tokenData, update])

  return tokenData || {}
}

// export function useTokenTransactions(tokenAddress) {
//   const [state, { updateTokenTxns }] = useTokenDataContext()
//   const tokenTxns = state?.[tokenAddress]?.txns

//   const allPairsFormatted =
//     state[tokenAddress] &&
//     state[tokenAddress].TOKEN_PAIRS_KEY &&
//     state[tokenAddress].TOKEN_PAIRS_KEY.map((pair) => {
//       return pair.id
//     })

//   useEffect(() => {
//     async function checkForTxns() {
//       if (!tokenTxns && allPairsFormatted) {
//         let transactions = await getTokenTransactions(allPairsFormatted)
//         updateTokenTxns(tokenAddress, transactions)
//       }
//     }
//     checkForTxns()
//   }, [tokenTxns, tokenAddress, updateTokenTxns, allPairsFormatted])

//   return tokenTxns || []
// }

// export function useTokenPairs(tokenAddress) {
//   const [state, { updateAllPairs }] = useTokenDataContext()
//   const tokenPairs = state?.[tokenAddress]?.[TOKEN_PAIRS_KEY]

//   useEffect(() => {
//     async function fetchData() {
//       let allPairs = await getTokenPairs(tokenAddress)
//       updateAllPairs(tokenAddress, allPairs)
//     }
//     if (!tokenPairs && isAddress(tokenAddress)) {
//       fetchData()
//     }
//   }, [tokenAddress, tokenPairs, updateAllPairs])

//   return tokenPairs || []
// }

// export function useTokenDataCombined(tokenAddresses) {
//   const [state, { updateCombinedVolume }] = useTokenDataContext()
//   const [ethPrice, ethPriceOld] = useEthPrice()

//   const volume = state?.combinedVol

//   useEffect(() => {
//     async function fetchDatas() {
//       Promise.all(
//         tokenAddresses.map(async (address) => {
//           return await getTokenData(address, ethPrice, ethPriceOld)
//         })
//       )
//         .then((res) => {
//           if (res) {
//             const newVolume = res
//               ? res?.reduce(function (acc, entry) {
//                 acc = acc + parseFloat(entry.oneDayVolumeUSD)
//                 return acc
//               }, 0)
//               : 0
//             updateCombinedVolume(newVolume)
//           }
//         })
//         .catch(() => {
//           console.log('error fetching combined data')
//         })
//     }
//     if (!volume && ethPrice && ethPriceOld) {
//       fetchDatas()
//     }
//   }, [tokenAddresses, ethPrice, ethPriceOld, volume, updateCombinedVolume])

//   return volume
// }

// export function useTokenChartDataCombined(tokenAddresses) {
//   const [state, { updateChartData }] = useTokenDataContext()

//   const datas = useMemo(() => {
//     return (
//       tokenAddresses &&
//       tokenAddresses.reduce(function (acc, address) {
//         acc[address] = state?.[address]?.chartData
//         return acc
//       }, {})
//     )
//   }, [state, tokenAddresses])

//   const isMissingData = useMemo(() => Object.values(datas).filter((val) => !val).length > 0, [datas])

//   const formattedByDate = useMemo(() => {
//     return (
//       datas &&
//       !isMissingData &&
//       Object.keys(datas).map(function (address) {
//         const dayDatas = datas[address]
//         return dayDatas?.reduce(function (acc, dayData) {
//           acc[dayData.date] = dayData
//           return acc
//         }, {})
//       }, {})
//     )
//   }, [datas, isMissingData])

//   useEffect(() => {
//     async function fetchDatas() {
//       Promise.all(
//         tokenAddresses.map(async (address) => {
//           return await getTokenChartData(address)
//         })
//       )
//         .then((res) => {
//           res &&
//             res.map((result, i) => {
//               const tokenAddress = tokenAddresses[i]
//               updateChartData(tokenAddress, result)
//               return true
//             })
//         })
//         .catch(() => {
//           console.log('error fetching combined data')
//         })
//     }
//     if (isMissingData) {
//       fetchDatas()
//     }
//   }, [isMissingData, tokenAddresses, updateChartData])

//   return formattedByDate
// }

export function useTokenChartData(tokenAddress) {
  const [state, { updateChartData }] = useTokenDataContext()
  const chartData = state?.[tokenAddress]?.chartData
  console.log(chartData, "BBBBBBBBBBBB")
  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        let data = await getTokenChartData(tokenAddress)
        updateChartData(tokenAddress, data)
      }
    }
    if (!chartData || chartData.length === 0) checkForChartData()
  }, [chartData, tokenAddress, updateChartData])
  return chartData
}

/**
 * get candlestick data for a token - saves in context based on the window and the
 * interval size
 * @param {*} tokenAddress
 * @param {*} timeWindow // a preset time window from constant - how far back to look
 * @param {*} interval  // the chunk size in seconds - default is 1 hour of 3600s
 */
export function useTokenPriceData(tokenAddress, timeWindow, interval = 3600) {
  const [state, { updatePriceData }] = useTokenDataContext()
  const chartData = state?.[tokenAddress]?.[timeWindow]?.[interval]

  useEffect(() => {
    const currentTime = dayjs.utc()
    const windowSize = timeWindow === timeframeOptions.MONTH ? 'month' : 'week'
    const startTime =
      timeWindow === timeframeOptions.ALL_TIME ? 1589760000 : currentTime.subtract(1, windowSize).startOf('hour').unix()

    async function fetchData() {
      let res = await fetch(`https://api.saucerswap.finance/tokens/prices/${tokenAddress}?interval=DAY&from=${startTime}&to=${Date.now() / 1000}`)
      if (res.status === 200) {
        let data = await res.json()
        updatePriceData(tokenAddress, data, timeWindow, interval)
      }
    }
    if (!chartData) {
      fetchData()
    }
  }, [chartData, interval, timeWindow, tokenAddress, updatePriceData])

  return chartData
}

// export function useAllTokenData() {
//   const [state] = useTokenDataContext()

//   // filter out for only addresses
//   return Object.keys(state)
//     .filter((key) => key !== 'combinedVol')
//     .reduce((res, key) => {
//       res[key] = state[key]
//       return res
//     }, {})
// }
