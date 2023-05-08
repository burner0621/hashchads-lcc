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
const UPDATE_HBAR_AND_SAUCE_PRICE = 'UPDATE_HBAR_AND_SAUCE_PRICE'

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
    case UPDATE_HBAR_AND_SAUCE_PRICE: {
      const { hBarPrice, saucePrice } = payload
      return {
        ...state,
        hBarPrice,
        saucePrice
      }
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export function useGlobalData() {
  const [state, { update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarAndSaucePrice }] = useGlobalDataContext()
  const [hbarPrice] = useHbarAndSaucePrice ()

  const data = state?.globalData

  useEffect(() => {
    async function fetchData() {
      let globalData = await getGlobalData()

      globalData && update(globalData)

      let allPairs = await getAllPairsOnSaucerswap()
      updateAllPairsInSaucerswap(allPairs)

      let allTokens = await getAllTokensOnSaucerswap()
      updateAllTokensInSaucerswap(allTokens)

      let [hbarPrice, saucePrice] = await getHbarAndSaucePrice()
      updateHbarAndSaucePrice(hbarPrice, saucePrice)
    }
    if (!data && hbarPrice) {
      fetchData()
    }
  }, [data, update, hbarPrice, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarAndSaucePrice])

  return data || {}
}

async function getHbarAndSaucePrice() {
  let response = await fetch("https://api.saucerswap.finance/tokens")
  if (response.status === 200) {
    const jsonData = await response.json();
    try {
      return [Number(jsonData[0]['priceUsd']), Number(jsonData[2]['priceUsd'])];
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

  const updateHbarAndSaucePrice = useCallback((hbarPrice, saucePrice) => {
    dispatch({
      type: UPDATE_HBAR_AND_SAUCE_PRICE,
      payload: {
        hBarPrice: hbarPrice,
        saucePrice
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
            updateHbarAndSaucePrice,
            updateChart
          },
        ],
        [
          state,
          update,
          updateAllPairsInSaucerswap,
          updateAllTokensInSaucerswap,
          updateHbarAndSaucePrice,
          updateChart
        ]
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  )
}

export function useHbarAndSaucePrice() {
  const [state, { updateHbarAndSaucePrice }] = useGlobalDataContext()
  const hBarPrice = state?.hBarPrice
  const saucePrice = state?.saucePrice;
  useEffect(() => {
    async function checkForHbarPrice() {
      if (!hBarPrice) {
        let [hbarP, sauceP] = await getHbarAndSaucePrice()
        updateHbarAndSaucePrice(hbarP, sauceP)
      }
    }
    checkForHbarPrice()
  }, [hBarPrice, saucePrice, updateHbarAndSaucePrice])

  return [hBarPrice, saucePrice]
}

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
  let [price, saucePrice] = await getHbarAndSaucePrice()
  try {
    let now_date = Date.now()
    data.totalVolumeUSD = 0
    data.totalVolumeHBAR = 0
    data.totalLiquidityUSD = 0
    data.totalLiquidityHbar = 0
    data.todayVolumeUSD = 0
    let oneDayData_totalVolumeUSD = 0
    let twoDayData_totalVolumeUSD = 0
    let oneWeekData_totalVolumeUSD = 0
    let twoWeekData_totalVolumeUSD = 0
    let totalLiquidityUSD = 0
    let oneDay_totalLiquidityUSD = 0
    let liquidityChangeUSD = 0

    let response = await fetch("https://api.saucerswap.finance/stats")
    if (response.status === 200) {
      const jsonData = await response.json();
      try {
        data.totalVolumeHBAR = (Number(jsonData['tvl']) / 100000000).toFixed(4);
        data.totalVolumeUSD = Number(jsonData['tvlUsd']).toFixed(4);
      } catch (error) {
        console.log(error)
      }
    }

    response = await fetch("https://api.saucerswap.finance/stats/volume/daily")
    if (response.status === 200) {
      let jsonData = await response.json();
      data.todayVolumeUSD = Number(jsonData[0]['dailyVolume'] / 100000000).toFixed(4)
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
  const [price, saucePrice] = await getHbarAndSaucePrice()
  try {
    let data = []
    let weekelyData = []
    const now_date = Date.now()
    let response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=LIQUIDITY&interval=DAY&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      for (let vh of jsonData) {
        data.push({ "liquidity": Number(vh['valueHbar'])/100000000 * price, "date": vh['timestampSeconds'] })
      }
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=DAY&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      for (var i = 0; i < jsonData.length; i++) {
        data[i]["volume"] = Number(jsonData[i]['valueHbar'])/100000000 * price
      }
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=WEEK&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      for (let wh of jsonData) {
        weekelyData.push({ "volume": Number(wh['valueHbar'])/100000000 * price, "date": wh['timestampSeconds'] })
      }
    }

    return [data, weekelyData]
  } catch (e) {
    console.log(e)
  }
}