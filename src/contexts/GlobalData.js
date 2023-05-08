import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import { client } from '../apollo/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import fetch from 'cross-fetch'
import { useTimeframe } from './Application'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import {
  getTimeframe,
  get2DayPercentChange,
  getPercentChange
} from '../utils'

const UPDATE = 'UPDATE'
const UPDATE_TXNS = 'UPDATE_TXNS'
const UPDATE_CHART = 'UPDATE_CHART'
const UPDATE_ETH_PRICE = 'UPDATE_ETH_PRICE'
const ETH_PRICE_KEY = 'ETH_PRICE_KEY'
const UPDATE_ALL_PAIRS_IN_SAUCERSWAP = 'UPDAUPDATE_ALL_PAIRS_IN_SAUCERSWAPTE_TOP_PAIRS'
const UPDATE_ALL_TOKENS_IN_SAUCERSWAP = 'UPDATE_ALL_TOKENS_IN_SAUCERSWAP'
const UPDATE_TOP_LPS = 'UPDATE_TOP_LPS'
const UPDATE_HBAR_PRICE = 'UPDATE_HBAR_PRICE'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

const GlobalDataContext = createContext()

function useGlobalDataContext() {
  return useContext(GlobalDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { data } = payload
      return {
        ...state,
        globalData: data,
      }
    }

    case UPDATE_ALL_PAIRS_IN_SAUCERSWAP: {
      const { allPairs } = payload
      return {
        ...state,
        allPairs,
      }
    }

    case UPDATE_ALL_TOKENS_IN_SAUCERSWAP: {
      const { allTokens } = payload
      return {
        ...state,
        allTokens,
      }
    }

    case UPDATE_CHART: {
      const { daily, weekly } = payload
      return {
        ...state,
        chartData: {
          daily,
          weekly,
        },
      }
    }
    case UPDATE_HBAR_PRICE: {
      const { hBarPrice } = payload
      return {
        ...state,
        hBarPrice,
      }
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export function useGlobalData() {
  const [state, { update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarPrice }] = useGlobalDataContext()

  const data = state?.globalData

  useEffect(() => {
    async function fetchData() {
      let globalData = await getGlobalData()

      globalData && update(globalData)

      let allPairs = await getAllPairsOnSaucerswap()
      updateAllPairsInSaucerswap(allPairs)

      let allTokens = await getAllTokensOnSaucerswap()
      updateAllTokensInSaucerswap(allTokens)

      let price = await getHbarPrice()
      updateHbarPrice(price)
    }
    fetchData()
  }, [data, update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarPrice])

  return data || {}
}

async function getHbarPrice() {
  let response = await fetch("https://api.saucerswap.finance/tokens")
  if (response.status === 200) {
    const jsonData = await response.json();
    try {
      return Number(jsonData[0]['priceUsd']);
    } catch (error) {
      return 0
    }
  }
}

async function getAllPairsOnSaucerswap() {
  try {
    let pairs = []
    let response = await fetch("https://api.saucerswap.finance/pools")
    if (response.status === 200) {
      const jsonData = await response.json();
      pairs = jsonData;
    }

    return pairs
  } catch (e) {
    console.log(e)
  }
}

async function getAllTokensOnSaucerswap() {
  try {
    let tokens = []

    let response = await fetch("https://api.saucerswap.finance/tokens")
    if (response.status === 200) {
      const jsonData = await response.json();
      tokens = jsonData;
    }
    return tokens
  } catch (e) {
    console.log(e)
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})
  const update = useCallback((data) => {
    dispatch({
      type: UPDATE,
      payload: {
        data,
      },
    })
  }, [])

  const updateAllPairsInSaucerswap = useCallback((allPairs) => {
    dispatch({
      type: UPDATE_ALL_PAIRS_IN_SAUCERSWAP,
      payload: {
        allPairs,
      },
    })
  }, [])

  const updateAllTokensInSaucerswap = useCallback((allTokens) => {
    dispatch({
      type: UPDATE_ALL_TOKENS_IN_SAUCERSWAP,
      payload: {
        allTokens,
      },
    })
  }, [])

  const updateHbarPrice = useCallback((price) => {
    dispatch({
      type: UPDATE_HBAR_PRICE,
      payload: {
        hBarPrice: price,
      },
    })
  }, [])

  const updateChart = useCallback((daily, weekly) => {
    dispatch({
      type: UPDATE_CHART,
      payload: {
        daily,
        weekly,
      },
    })
  }, [])

  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateAllPairsInSaucerswap,
            updateAllTokensInSaucerswap,
            updateHbarPrice,
            updateChart
          },
        ],
        [
          state,
          update,
          updateAllPairsInSaucerswap,
          updateAllTokensInSaucerswap,
          updateHbarPrice,
          updateChart
        ]
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  )
}

// export function useEthPrice() {
//   const [state, { updateEthPrice }] = useGlobalDataContext()
//   const ethPrice = state?.[ETH_PRICE_KEY]
//   const ethPriceOld = state?.['oneDayPrice']
//   useEffect(() => {
//     async function checkForEthPrice() {
//       if (!ethPrice) {
//         let [newPrice, oneDayPrice, priceChange] = await getEthPrice()
//         updateEthPrice(newPrice, oneDayPrice, priceChange)
//       }
//     }
//     checkForEthPrice()
//   }, [ethPrice, updateEthPrice])

//   return [ethPrice, ethPriceOld]
// }

export function useAllPairsInSaucerswap() {
  const [state] = useGlobalDataContext()
  let allPairs = state?.allPairs

  return allPairs || []
}

export function useAllTokensInSaucerswap() {
  const [state] = useGlobalDataContext()
  let allTokens = state?.allTokens

  return allTokens || []
}

export function useHbarPriceInSaucerswap() {
  const [state] = useGlobalDataContext()
  let price = state?.hBarPrice

  return price
}

export function useGlobalChartData() {
  const [state, { updateChart }] = useGlobalDataContext()
  const [oldestDateFetch, setOldestDateFetched] = useState()
  const [activeWindow] = useTimeframe()

  const chartDataDaily = state?.chartData?.daily
  const chartDataWeekly = state?.chartData?.weekly

  /**
   * Keep track of oldest date fetched. Used to
   * limit data fetched until its actually needed.
   * (dont fetch year long stuff unless year option selected)
   */
  useEffect(() => {
    // based on window, get starttime
    let startTime = getTimeframe(activeWindow)

    if ((activeWindow && startTime < oldestDateFetch) || !oldestDateFetch) {
      setOldestDateFetched(startTime)
    }
  }, [activeWindow, oldestDateFetch])

  // fix for rebass tokens

  /**
   * Fetch data if none fetched or older data is needed
   */
  useEffect(() => {
    async function fetchData() {
      // historical stuff for chart
      let [newChartData, newWeeklyData] = await getChartData(oldestDateFetch)
      updateChart(newChartData, newWeeklyData)
    }
    if (oldestDateFetch && !(chartDataDaily && chartDataWeekly)) {
      fetchData()
    }
  }, [chartDataDaily, chartDataWeekly, oldestDateFetch, updateChart])

  return [chartDataDaily, chartDataWeekly]
}

async function getGlobalData() {
  let data = {}
  let price = await getHbarPrice()
  try {
    let now_date = Date.now()
    data.totalVolumeUSD = 0
    data.totalLiquidityUSD = 0
    data.totalLiquidityHbar = 0
    let oneDayData_totalVolumeUSD = 0
    let twoDayData_totalVolumeUSD = 0
    let oneWeekData_totalVolumeUSD = 0
    let twoWeekData_totalVolumeUSD = 0
    let totalLiquidityUSD = 0
    let oneDay_totalLiquidityUSD = 0
    let liquidityChangeUSD = 0

    let response = await fetch("https://api.saucerswap.finance/stats")
    if (response.status === 200) {
      let jsonData = await response.json();
      data.totalVolumeUSD = Number(jsonData['tvlUsd']).toFixed(4)
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=DAY&from=${now_date / 1000 - 86400 * 4}&to=${now_date / 1000}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      oneDayData_totalVolumeUSD = (Number(jsonData[jsonData.length - 2]['valueHbar']) * price).toFixed(4)
      twoDayData_totalVolumeUSD = (Number(jsonData[jsonData.length - 3]['valueHbar']) * price).toFixed(4)
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=WEEK&from=${now_date / 1000 - 86400 * 30}&to=${now_date / 1000}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      oneWeekData_totalVolumeUSD = (Number(jsonData[jsonData.length - 2]['valueHbar'] / 100000000) * price).toFixed(4)
      twoWeekData_totalVolumeUSD = (Number(jsonData[jsonData.length - 3]['valueHbar'] / 100000000) * price).toFixed(4)
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=LIQUIDITY&interval=DAY&from=${now_date / 1000 - 86400 * 3}&to=${now_date / 1000}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      totalLiquidityUSD = (Number(jsonData[jsonData.length - 1]['valueHbar'] / 100000000) * price).toFixed(4)
      oneDay_totalLiquidityUSD = (Number(jsonData[jsonData.length - 2]['valueHbar'] / 100000000) * price).toFixed(4)
      liquidityChangeUSD = getPercentChange(
        totalLiquidityUSD,
        oneDay_totalLiquidityUSD
      )
    }

    if (data.totalVolumeUSD && oneDayData_totalVolumeUSD && twoDayData_totalVolumeUSD) {
      let [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneDayData_totalVolumeUSD,
        twoDayData_totalVolumeUSD
      )

      const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneWeekData_totalVolumeUSD,
        twoWeekData_totalVolumeUSD
      )

      data.totalLiquidityUSD = totalLiquidityUSD
      data.liquidityChangeUSD = liquidityChangeUSD
      data.oneDayVolumeUSD = oneDayData_totalVolumeUSD
      data.oneWeekVolume = oneWeekData_totalVolumeUSD
      data.weeklyVolumeChange = weeklyVolumeChange
      data.volumeChangeUSD = volumeChangeUSD
      data.liquidityChangeUSD = liquidityChangeUSD
    }

  } catch (e) {
    console.log(e)
  }
  return data;
}

const getChartData = async (oldestDateToFetch) => {
  const price = await getHbarPrice()
  try {
    let data = []
    let weekelyData = []
    const now_date = Date.now()
    let response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=LIQUIDITY&interval=DAY&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      for (let vh of jsonData) {
        data.push({ "liquidity": Number(vh['valueHbar']) * price, "date": vh['timestampSeconds'] })
      }
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=DAY&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      for (var i = 0; i < jsonData.length; i++) {
        data[i]["volume"] = Number(jsonData[i]['valueHbar']) * price
      }
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=WEEK&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      for (let wh of jsonData) {
        weekelyData.push({ "volume": Number(wh['valueHbar']) * price, "date": wh['timestampSeconds'] })
      }
    }

    return [data, weekelyData]
  } catch (e) {
    console.log(e)
  }
}