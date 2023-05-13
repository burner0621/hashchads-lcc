import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import { client } from '../apollo/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import fetch from 'cross-fetch'
import { useTimeframe } from './Application'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import socketIO from 'socket.io-client';
import * as env from "../env";
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
const UPDATE_PRICES = 'UPDATE_PRICES'
const UPDATE_TOKEN_DAILY_VOLUME = 'UPDATE_TOKEN_DAILY_VOLUME'
const UPDATE_PRICE_CHANGE = 'UPDATE_PRICE_CHANGE'

const socket = socketIO.connect(env.BASE_URL);
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

    case UPDATE_PRICES: {
      const { prices } = payload
      return {
        ...state,
        prices,
      }
    }

    case UPDATE_TOKEN_DAILY_VOLUME: {
      const { tokenDailyVolume } = payload
      return {
        ...state,
        tokenDailyVolume,
      }
    }

    case UPDATE_PRICE_CHANGE: {
      const { priceChange } = payload
      return {
        ...state,
        priceChange,
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
  const [state, { update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarAndSaucePrice, updatePrices }] = useGlobalDataContext()
  const [tmpPrices, setTmpPrices] = useState([])
  const [hbarPrice, saucePrice] = useHbarAndSaucePrice()
  const tokenDailyVolume = useTokenDailyVolume ()
  const priceChanges = usePriceChanges ()

  const data = state?.globalData

  useEffect(() => {
    socket.on('getPricesResponse', (p) => {

      setTmpPrices(p)
      updatePrices(p);
    });
  }, [updatePrices]);

  useEffect(() => {
    async function fetchData() {

      let globalData = await getGlobalData(tmpPrices, hbarPrice)

      globalData && update(globalData)

      let allPairs = await getAllPairsOnSaucerswap()
      updateAllPairsInSaucerswap(allPairs)

      let allTokens = await getAllTokensOnSaucerswap(tokenDailyVolume, priceChanges)
      updateAllTokensInSaucerswap(allTokens)

      let [hbarP, sauceP] = await getHbarAndSaucePrice()
      updateHbarAndSaucePrice(hbarP, sauceP)
    }
    if (data === undefined && hbarPrice && tmpPrices && tmpPrices.length > 0) {
      fetchData()
    }
  }, [data, hbarPrice, priceChanges, tokenDailyVolume, update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarAndSaucePrice, tmpPrices])

  return data || {}
}

async function getPrices(oldestDateFetch) {
  // const now_date = Date.now()
  // var myHeaders = new Headers();
  // myHeaders.append("Cookie", "__cf_bm=YNlckYdSka0TdMLFUjID5IkJdOChqO0nbvnwTWxEXSA-1683711491-0-AdwF1R49qpBFsd6fPsCEEDIpzBD6W4LqBfwjwCfrRd+BUYaj/k9+38xZrodAK6IIa1UTWP23gyXbYm+QJIiE2dw=");

  // var requestOptions = {
  //   method: 'GET',
  //   headers: myHeaders,
  //   redirect: 'follow'
  // };
  // let response = await fetch(`https://api.coingecko.com/api/v3/coins/hedera-hashgraph/market_chart/range?vs_currency=USD&from=${oldestDateFetch}&to=${now_date}`, requestOptions)
  // if (response.status === 200) {
  //   let jsonData = await response.json();
  //   return jsonData['prices'];
  // }
  // return []
}

async function getHbarAndSaucePrice() {
  let response = await fetch("https://api.saucerswap.finance/tokens")
  if (response.status === 200) {
    const jsonData = await response.json();
    try {
      return [Number(jsonData[0]['priceUsd']), Number(jsonData[2]['priceUsd'])];
    } catch (error) {
      return [0,0]
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

async function getAllTokensOnSaucerswap(tokenDailyVolume, priceChanges) {
  try {
    let tokens = []
    let rlt = []

    let response = await fetch("https://api.saucerswap.finance/tokens")
    if (response.status === 200) {
      const jsonData = await response.json();
      tokens = jsonData;
    }
    for (let token of tokens) {
      token['oneDayVolumeUSD'] = Number(tokenDailyVolume[token['id']])
      token['priceChangeUSD'] = Number(priceChanges[token['id']])
      rlt.push (token)
    }

    return rlt
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

  const updatePrices = useCallback((data) => {
    dispatch({
      type: UPDATE_PRICES,
      payload: {
        prices: data,
      },
    })
  }, [])

  const updateTokenDailyVolume = useCallback((data) => {
    dispatch({
      type: UPDATE_TOKEN_DAILY_VOLUME,
      payload: {
        tokenDailyVolume: data,
      },
    })
  }, [])

  const updatePriceChange = useCallback((data) => {
    dispatch({
      type: UPDATE_PRICE_CHANGE,
      payload: {
        priceChange: data,
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
            updatePrices,
            updatePriceChange,
            updateTokenDailyVolume,
            updateAllPairsInSaucerswap,
            updateAllTokensInSaucerswap,
            updateHbarAndSaucePrice,
            updateChart
          }
        ],
        [
          state,
          update,
          updatePrices,
          updatePriceChange,
          updateTokenDailyVolume,
          updateAllPairsInSaucerswap,
          updateAllTokensInSaucerswap,
          updateHbarAndSaucePrice,
          updateChart
        ])}
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
    if (!hBarPrice) checkForHbarPrice()
  }, [hBarPrice, saucePrice, updateHbarAndSaucePrice])

  return [hBarPrice, saucePrice]
}

export function usePrices() {
  const [state] = useGlobalDataContext()
  let prices = state?.prices
  return prices
}

export function useAllPairsInSaucerswap() {
  const [state, {updateAllPairsInSaucerswap}] = useGlobalDataContext()
  let allPairs = state?.allPairs
  useEffect(() => {
    async function fetchData() {
      let allPairData = await getAllPairsOnSaucerswap ()
      updateAllPairsInSaucerswap (allPairData)
    }
    if (!allPairs || allPairs?.length === {}) {
      fetchData ()
    }
  }, [allPairs, updateAllPairsInSaucerswap])
  return allPairs || []
}

export function usePriceChanges() {
  const [state, {updatePriceChange}] = useGlobalDataContext ()
  let priceChange = state?.priceChange
  useEffect(() => {
    async function fetchData() {
      let response = await fetch("https://api.saucerswap.finance/tokens/price-change")
      if (response.status === 200) {
        const priceChangeData = await response.json();
        updatePriceChange (priceChangeData)
      }
    }
    if (!priceChange || priceChange?.length === {}) {
      fetchData ()
    }
  }, [updatePriceChange, priceChange])
  return priceChange || {}
}

export function useTokenDailyVolume() {
  const [state, { updateTokenDailyVolume }] = useGlobalDataContext()
  let tokenDailyVolume = state?.tokenDailyVolume
  useEffect(() => {
    async function fetchData() {
      let response = await fetch("https://api.saucerswap.finance/tokens/daily-volumes")
      
      if (response.status === 200) {
        const dailyVolData = await response.json();
        updateTokenDailyVolume (dailyVolData)
      }
    }
    if (tokenDailyVolume === undefined || tokenDailyVolume === {}) {
      fetchData ()
    }
  }, [updateTokenDailyVolume, tokenDailyVolume])
  return tokenDailyVolume || {}
}

export function useAllTokensInSaucerswap() {
  const [state, { updateAllTokensInSaucerswap }] = useGlobalDataContext()
  const tokenDailyVolume = useTokenDailyVolume ()
  const priceChanges = usePriceChanges ()

  let allTokens = state?.allTokens
  useEffect(() => {
    async function fetchData() {
      let data = await getAllTokensOnSaucerswap(tokenDailyVolume, priceChanges)
      updateAllTokensInSaucerswap (data)
    }
    if (!allTokens && allTokens?.length > 0) fetchData ()
  }, [allTokens, priceChanges, updateAllTokensInSaucerswap, tokenDailyVolume])
  return allTokens || []
}

export function useGlobalChartData() {
  const [state, { updateChart, updatePrices }] = useGlobalDataContext()
  const [oldestDateFetch, setOldestDateFetched] = useState()
  const [activeWindow] = useTimeframe()
  const [tmpPrices, setTmpPrices] = useState([])

  const chartDataDaily = state?.chartData?.daily
  const chartDataWeekly = state?.chartData?.weekly

  useEffect(() => {
    socket.on('getPricesResponse', (p) => {
      setTmpPrices(p)
      updatePrices(p);
    });
  }, [updatePrices]);

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
      let [newChartData, newWeeklyData] = await getChartData(oldestDateFetch, tmpPrices)
      updateChart(newChartData, newWeeklyData)
    }
    if (oldestDateFetch && !(chartDataDaily && chartDataWeekly) && tmpPrices && tmpPrices.length > 0) {
      fetchData()
    }
  }, [chartDataDaily, tmpPrices, chartDataWeekly, oldestDateFetch, updateChart])

  return [chartDataDaily, chartDataWeekly]
}

async function getGlobalData(prices, hbarPrice) {
  let data = {}
  try {
    let now_date = Date.now()
    data.totalVolumeUSD = 0
    data.totalVolumeHBAR = 0
    data.totalLiquidityUSD = 0
    data.totalLiquidityHbar = 0
    data.todayVolumeUSD = 0
    let nowData_totalVolumeUSD = 0
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
      nowData_totalVolumeUSD = (Number(jsonData[jsonData.length - 1]['valueHbar']) / 100000000 * prices[prices.length - 1][1]).toFixed(4)
      oneDayData_totalVolumeUSD = (Number(jsonData[jsonData.length - 2]['valueHbar']) / 100000000 * prices[prices.length - 2][1]).toFixed(4)
      twoDayData_totalVolumeUSD = (Number(jsonData[jsonData.length - 3]['valueHbar']) / 100000000 * prices[prices.length - 3][1]).toFixed(4)
    }
    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=WEEK&from=${now_date / 1000 - 86400 * 30}&to=${now_date / 1000}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      oneWeekData_totalVolumeUSD = (Number(jsonData[jsonData.length - 2]['valueHbar']) / 100000000 * prices[prices.length - 2][1]).toFixed(4)
      twoWeekData_totalVolumeUSD = (Number(jsonData[jsonData.length - 3]['valueHbar']) / 100000000 * prices[prices.length - 3][1]).toFixed(4)
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=LIQUIDITY&interval=DAY&from=${now_date / 1000 - 86400 * 3}&to=${now_date / 1000}`)
    if (response.status === 200) {
      let jsonData = await response.json();
      totalLiquidityUSD = (Number(jsonData[jsonData.length - 1]['valueHbar']) / 100000000 * hbarPrice).toFixed(4)
      oneDay_totalLiquidityUSD = (Number(jsonData[jsonData.length - 2]['valueHbar']) / 100000000 * prices[prices.length - 2][1]).toFixed(4)
      liquidityChangeUSD = getPercentChange(
        totalLiquidityUSD,
        oneDay_totalLiquidityUSD
      )
    }

    if (nowData_totalVolumeUSD && oneDayData_totalVolumeUSD && twoDayData_totalVolumeUSD) {
      let [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
        nowData_totalVolumeUSD,
        oneDayData_totalVolumeUSD,
        twoDayData_totalVolumeUSD
      )

      const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
        nowData_totalVolumeUSD,
        oneWeekData_totalVolumeUSD,
        twoWeekData_totalVolumeUSD
      )
      console.log (nowData_totalVolumeUSD, oneDayData_totalVolumeUSD, twoDayData_totalVolumeUSD, volumeChangeUSD, "<<<<<<<<<<<<<<<<<")

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

const getChartData = async (oldestDateToFetch, prices) => {
  const [price, saucePrice] = await getHbarAndSaucePrice()
  try {
    let data = []
    let weekelyData = []
    const now_date = Date.now()
    let response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=LIQUIDITY&interval=DAY&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      if (prices.length > 0) {
        let jsonData = await response.json();
        let diff = prices.length - jsonData.length
        for (var i = 0; i < jsonData.length; i++) {
          data.push({ "liquidity": Number(jsonData[i]['valueHbar']) / 100000000 * prices[diff + i][1], "date": jsonData[i]['timestampSeconds'] })
        }
      }

    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=DAY&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      if (prices.length > 0) {
        let jsonData = await response.json();
        let diff = prices.length - jsonData.length
        for (var i = 0; i < jsonData.length; i++) {
          data[i]["dailyVolumeUSD"] = Number(jsonData[i]['valueHbar']) / 100000000 * prices[diff + i][1]
        }
      }
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=WEEK&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      if (prices.length > 0) {
        let jsonData = await response.json();
        let diff = prices.length - jsonData.length
        for (var i = 0; i < jsonData.length; i++) {
          weekelyData.push({ "weeklyVolumeUSD": Number(jsonData[i]['valueHbar']) / 100000000 * prices[diff + i][1], "date": jsonData[i]['timestampSeconds'] })
        }
      }
    }

    return [data, weekelyData]
  } catch (e) {
    console.log(e)
  }
}