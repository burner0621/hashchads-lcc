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
  getPercentChange,
  getBlockFromTimestamp
} from '../utils'
import {
  GLOBAL_DATA,
  GLOBAL_TXNS,
  GLOBAL_CHART,
  ETH_PRICE,
  ALL_PAIRS,
  ALL_TOKENS,
  TOP_LPS_PER_PAIRS,
} from '../apollo/queries'
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
const UPDATE_TOKEN_DATA = 'UPDATE_TOKEN_DATA'
const UPDATE_PAIR_WEEKLY_VOLUME = 'UPDATE_PAIR_WEEKLY_VOLUME'
const UPDATE_PAIR_DAILY_VOLUME = 'UPDATE_PAIR_DAILY_VOLUME'

const socket = socketIO.connect(env.BASE_URL);
// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

const GlobalDataContext = createContext()

export function useGlobalDataContext() {
  return useContext(GlobalDataContext)
}

// const interval = setInterval (async() => {
//   await getHbarAndSaucePrice ()
// }, 5000)

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

    case UPDATE_PAIR_DAILY_VOLUME: {
      const { pairDailyVolume } = payload
      return {
        ...state,
        pairDailyVolume,
      }
    }

    case UPDATE_PAIR_WEEKLY_VOLUME: {
      const { pairWeeklyVolume } = payload
      return {
        ...state,
        pairWeeklyVolume,
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

    case UPDATE_TOKEN_DATA: {
      const { tokenData } = payload
      return {
        ...state,
        tokenData
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

let isFetching = false;
export function useGlobalData() {
  const [state, { update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarAndSaucePrice, updatePrices }] = useGlobalDataContext()
  const [tmpPrices, setTmpPrices] = useState([])
  const [hbarPrice, saucePrice] = useHbarAndSaucePrice()
  const tokenDailyVolume = useTokenDailyVolume()
  const priceChanges = usePriceChanges()

  const data = state?.globalData

  useEffect(() => {
    socket.on('getPricesResponse', (p) => {

      setTmpPrices(p)
      updatePrices(p);
      if (p && p.length > 0) socket.disconnect()
    });
  }, [updatePrices]);

  useEffect(() => {
    async function fetchData() {

      let globalData = await getGlobalData(tmpPrices, hbarPrice)

      globalData && update(globalData)

      let allPairs = await getAllPairsOnSaucerswap()
      updateAllPairsInSaucerswap(allPairs)
      let allTokens = await getAllTokensOnSaucerswap(allPairs, tokenDailyVolume, priceChanges, hbarPrice)
      updateAllTokensInSaucerswap(allTokens)

      let [hbarP, sauceP] = await getHbarAndSaucePrice()
      updateHbarAndSaucePrice(hbarP, sauceP)
      isFetching = false;
    }
    if (data === undefined && hbarPrice && tmpPrices && tmpPrices.length > 0) {
      if (!isFetching) {
        fetchData()
        isFetching = true
      }
    }
  }, [data, hbarPrice, priceChanges, tokenDailyVolume, update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarAndSaucePrice, tmpPrices])

  return data || {}
}

let isFetchingGetHbarAndSaucePrice = false
export async function getHbarAndSaucePrice() {
  if(!isFetchingGetHbarAndSaucePrice) {
    try {
      isFetchingGetHbarAndSaucePrice = true
      let response = await fetch("https://api.saucerswap.finance/tokens")
      if (response.status === 200) {
        const jsonData = await response.json();
        try {
          isFetchingGetHbarAndSaucePrice = false
          return [Number(jsonData[0]['priceUsd']), Number(jsonData[2]['priceUsd'])];
        } catch (error) {
          isFetchingGetHbarAndSaucePrice = false
          return [0, 0]
        }
      }
      isFetchingGetHbarAndSaucePrice = false
      return [0, 0]
    } catch (e) {
      isFetchingGetHbarAndSaucePrice = false
      return [0, 0]
    }
  }
  return [0, 0]
}

export async function getAllPairsOnSaucerswap() {
  try {
    let pairs = []
    let response = await fetch("https://api.saucerswap.finance/pools")
    if (response.status === 200) {
      const jsonData = await response.json();
      pairs = jsonData;
    }
    return pairs
  } catch (e) {
    return []
  }
}

export async function getAllTokensOnSaucerswap(_allPairs, tokenDailyVolume, priceChanges, hbarPrice) {
  try {
    let tokens = [], tmpTokens = []
    let rlt = []
    let response = await fetch("https://api.saucerswap.finance/tokens")
    if (response.status === 200) {
      const jsonData = await response.json();
      tokens = jsonData;
    } 
    for (let token of tokens) {
      if (tokenDailyVolume && Object.keys(tokenDailyVolume).length > 0) {
        token['oneDayVolumeUSD'] = Number(tokenDailyVolume[token['id']]) * (hbarPrice !== undefined ? hbarPrice.toFixed(4) : 0)
        token['priceChangeUSD'] = Number(priceChanges[token['id']])
      } 
      else {
        token['oneDayVolumeUSD'] = 0
        token['priceChangeUSD'] = 0
        // break;
      }

      tmpTokens.push(token)
    }

    let _tokenData = {}
    if (_allPairs)
      for (let pair of _allPairs) {
        if (_tokenData[pair.tokenA.id]) {
          _tokenData[pair.tokenA.id]['liquidity'] += Number(pair.tokenReserveA) / Math.pow(10, Number(pair.tokenA.decimals)) * Number(pair.tokenA.priceUsd)
        } else {
          _tokenData[pair.tokenA.id] = {}
          _tokenData[pair.tokenA.id]['liquidity'] = Number(pair.tokenReserveA) / Math.pow(10, Number(pair.tokenA.decimals)) * Number(pair.tokenA.priceUsd)
        }
        if (_tokenData[pair.tokenB.id]) {
          _tokenData[pair.tokenB.id]['liquidity'] += Number(pair.tokenReserveB) / Math.pow(10, Number(pair.tokenB.decimals)) * Number(pair.tokenB.priceUsd)
        } else {
          _tokenData[pair.tokenB.id] = {}
          _tokenData[pair.tokenB.id]['liquidity'] = Number(pair.tokenReserveB) / Math.pow(10, Number(pair.tokenB.decimals)) * Number(pair.tokenB.priceUsd)
        }
      }

    for (let token of tmpTokens) {
      if (_tokenData[token['id']]) {
        token['liquidity'] = Number(_tokenData[token['id']]['liquidity'])
        rlt.push(token)
      }
    }
    return rlt
  } catch (e) {
    console.error('getAllTokensOnSaucerswap error', e)
    return []
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

  const updatePairDailyVolume = useCallback((data) => {
    dispatch({
      type: UPDATE_PAIR_DAILY_VOLUME,
      payload: {
        pairDailyVolume: data,
      },
    })
  }, [])

  const updatePairWeeklyVolume = useCallback((data) => {
    dispatch({
      type: UPDATE_PAIR_WEEKLY_VOLUME,
      payload: {
        pairWeeklyVolume: data,
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
        saucePrice: saucePrice
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
            updatePairDailyVolume,
            updatePairWeeklyVolume,
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
          updatePairDailyVolume,
          updatePairWeeklyVolume,
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
  // useEffect(() => {
  //   async function checkForHbarPrice() {
  //     if (!hBarPrice) {
  //       let [hbarP, sauceP] = await getHbarAndSaucePrice()
  //       updateHbarAndSaucePrice(hbarP, sauceP)
  //     }
  //   }
  //   if (!hBarPrice) checkForHbarPrice()
  // }, [hBarPrice, saucePrice, updateHbarAndSaucePrice])

  // return [hBarPrice, saucePrice]
  if (!hBarPrice) {
    getHbarAndSaucePrice().then((value) => {
      updateHbarAndSaucePrice(value[0], value[1])
    })
  }
  return [hBarPrice, saucePrice]
}

export function usePrices() {
  const [state] = useGlobalDataContext()
  let prices = state?.prices
  return prices
}

export function useEthPrice() {
  const [state, { updateEthPrice }] = useGlobalDataContext()
  const ethPrice = state?.[ETH_PRICE_KEY]
  const ethPriceOld = state?.['oneDayPrice']
  useEffect(() => {
    async function checkForEthPrice() {
      if (!ethPrice) {
        let [newPrice, oneDayPrice, priceChange] = await getEthPrice()
        updateEthPrice(newPrice, oneDayPrice, priceChange)
      }
    }
    checkForEthPrice()
  }, [ethPrice, updateEthPrice])

  return [ethPrice, ethPriceOld]
}

let isGettingPairs = false;
export function useAllPairsInSaucerswap() {
  const [state, { updateAllPairsInSaucerswap }] = useGlobalDataContext()
  let allPairs = state?.allPairs
  // useEffect(() => {
    async function fetchData() {
      let allPairData = await getAllPairsOnSaucerswap()
      updateAllPairsInSaucerswap(allPairData)
      isGettingPairs = false
    }
    if (!allPairs || allPairs?.length === 0) {
      if (!isGettingPairs) {
        fetchData()
        isGettingPairs = true
      }
    }
  // }, [allPairs])
  return allPairs || []
}

let isFetchingUsePriceChanges = false;
export function usePriceChanges() {
  const [state, { updatePriceChange }] = useGlobalDataContext()
  let priceChange = state?.priceChange
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       let response = await fetch("https://api.saucerswap.finance/tokens/price-change")
  //       if (response.status === 200) {
  //         const priceChangeData = await response.json();
  //         updatePriceChange(priceChangeData)
  //       }
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   if (!priceChange || priceChange?.length === {}) {
  //     fetchData()
  //   }
  // }, [updatePriceChange, priceChange])
  // return priceChange || {}
  if (!priceChange || priceChange?.length === {}) {
    if(!isFetchingUsePriceChanges) {
      try {
        isFetchingUsePriceChanges = true
        fetch("https://api.saucerswap.finance/tokens/price-change").then((response) => {
          if (response.status === 200) {
            response.json().then(priceChangeData => {
              updatePriceChange(priceChangeData)
              isFetchingUsePriceChanges = false
            });
          } else {
            isFetchingUsePriceChanges = false
          }
        })
      } catch (e) {
        console.log(e)
        isFetchingUsePriceChanges = false
      }
    }
  }
  return priceChange;
}

let isFetchingUseTokenDailyVolume = false
export function useTokenDailyVolume() {
  
  const [state, { updateTokenDailyVolume }] = useGlobalDataContext()
  let tokenDailyVolume = state?.tokenDailyVolume
  
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       let response = await fetch("https://api.saucerswap.finance/tokens/daily-volumes")

  //       if (response.status === 200) {
  //         const dailyVolData = await response.json();
  //         updateTokenDailyVolume(dailyVolData)
  //       }
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   if (tokenDailyVolume === undefined || tokenDailyVolume === {}) {
  //     fetchData()
  //   }
  // }, [updateTokenDailyVolume, tokenDailyVolume])
  // return tokenDailyVolume || {}
  if (tokenDailyVolume === undefined || tokenDailyVolume === {}) {
    if (!isFetchingUseTokenDailyVolume) {
      try {
        isFetchingUseTokenDailyVolume = true
        fetch("https://api.saucerswap.finance/tokens/daily-volumes").then((response) => {
          if (response.status === 200) {
            response.json().then((dailyVolData) => {
              updateTokenDailyVolume(dailyVolData)
              isFetchingUseTokenDailyVolume = false
            })
          } else {
            isFetchingUseTokenDailyVolume = false
          }
        })
      } catch (e) {
        console.log(e)
        isFetchingUseTokenDailyVolume = false
      }
    }
  }
}

// export function dispatchTokenDailyVolume (dailyVolData) {
//   updateTokenDailyVolume(dailyVolData)
// }

export function usePairDailyVolume() {
  const [state, { updatePairDailyVolume }] = useGlobalDataContext()
  let pairDailyVolume = state?.pairDailyVolume
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetch("https://api.saucerswap.finance/pools/daily-volumes")

        if (response.status === 200) {
          const dailyVolData = await response.json();
          updatePairDailyVolume(dailyVolData)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (pairDailyVolume === undefined || pairDailyVolume.length === 0) {
      fetchData()
    }
  }, [updatePairDailyVolume, pairDailyVolume])
  return pairDailyVolume || {}
}

export function usePairWeeklyVolume() {
  const [state, { updatePairWeeklyVolume }] = useGlobalDataContext()
  let pairWeeklyVolume = state?.pairWeeklyVolume
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetch("https://api.saucerswap.finance/pools/weekly-volumes")

        if (response.status === 200) {
          const dailyVolData = await response.json();
          updatePairWeeklyVolume(dailyVolData)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (pairWeeklyVolume === undefined || pairWeeklyVolume.length === 0) {
      fetchData()
    }
  }, [updatePairWeeklyVolume, pairWeeklyVolume])
  return pairWeeklyVolume || {}
}

export function useAllTokensInSaucerswap() {
  const [state, { updateAllTokensInSaucerswap }] = useGlobalDataContext()
  const tokenDailyVolume = useTokenDailyVolume()
  const priceChanges = usePriceChanges()
  const [hbarPrice, saucePrice] = useHbarAndSaucePrice()
  const _allPairs = useAllPairsInSaucerswap()

  // let tokenDailyVolume = state?.tokenDailyVolume;
  // let priceChanges = state?.priceChange;
  // const hbarPrice = state?.hBarPrice;

  let allTokens = state?.allTokens || []
  
  // useEffect(() => {
  //   async function fetchData() {
  //     let data = await getAllTokensOnSaucerswap(_allPairs, tokenDailyVolume, priceChanges, hbarPrice)
  //     updateAllTokensInSaucerswap(data)
  //   }
  //   if (allTokens === undefined || allTokens?.length === 0) fetchData()
  // }, [allTokens, _allPairs, priceChanges, tokenDailyVolume, hbarPrice])
  // return allTokens || []
  useEffect(() => {
    async function fetchData() {
      let data = await getAllTokensOnSaucerswap(_allPairs, state?.tokenDailyVolume, priceChanges, hbarPrice)
      updateAllTokensInSaucerswap(data)
    }
    if ((allTokens === undefined || allTokens?.length === 0) && state?.tokenDailyVolume && priceChanges && _allPairs && hbarPrice > 0) {
      fetchData()
    }
  }, [priceChanges, tokenDailyVolume, allTokens, hbarPrice, _allPairs])
  return allTokens;
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
      const [newChartData, newWeeklyData] = await getChartData(oldestDateFetch, tmpPrices)
      updateChart(newChartData, newWeeklyData)
    }
    if (oldestDateFetch && !(chartDataDaily && chartDataWeekly) && tmpPrices && tmpPrices.length > 0) {
      fetchData()
    }
  }, [chartDataDaily, tmpPrices, chartDataWeekly, oldestDateFetch, updateChart])

  return [chartDataDaily, chartDataWeekly]
}

export async function getGlobalData(prices, hbarPrice) {
  let data = {}
  try {
    let now_date = Date.now()
    data.totalVolumeUSD = 0
    data.totalVolumeHBAR = 0
    data.totalLiquidityUSD = 0
    data.totalLiquidityHbar = 0
    data.todayVolumeUSD = 0
    let nowData_totalVolumeUSD = 0
    let nowWeekData_totalVolumeUSD = 0
    let oneDayData_totalVolumeUSD = 0
    let oneWeekData_totalVolumeUSD = 0
    let totalLiquidityUSD = 0
    let oneDay_totalLiquidityUSD = 0
    let liquidityChangeUSD = 0
    try {
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
    } catch (e) {
      console.log(e)
    }

    try {
      let response = await fetch("https://api.saucerswap.finance/stats/volume/daily")
      if (response.status === 200) {
        let jsonData = await response.json();
        data.todayVolumeUSD = Number(jsonData[0]['dailyVolume'] / 100000000).toFixed(4)
      }
    } catch (e) {
      console.log(e)
    }

    try {
      let response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=DAY&from=${now_date / 1000 - 86400 * 4}&to=${now_date / 1000}`)
      if (response.status === 200) {
        let jsonData = await response.json();
        nowData_totalVolumeUSD = (Number(jsonData[jsonData.length - 1]['valueHbar']) / 100000000 * prices[prices.length - 2][1]).toFixed(4)
        oneDayData_totalVolumeUSD = (Number(jsonData[jsonData.length - 2]['valueHbar']) / 100000000 * prices[prices.length - 3][1]).toFixed(4)
      }
    } catch (e) {
      console.log(e)
    }

    try {
      let response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=WEEK&from=${now_date / 1000 - 86400 * 30}&to=${now_date / 1000}`)
      if (response.status === 200) {
        let jsonData = await response.json();
        nowWeekData_totalVolumeUSD = (Number(jsonData[jsonData.length - 1]['valueHbar']) / 100000000 * prices[prices.length - 2][1]).toFixed(4)
        oneWeekData_totalVolumeUSD = (Number(jsonData[jsonData.length - 2]['valueHbar']) / 100000000 * prices[prices.length - 3][1]).toFixed(4)
      }
    } catch (e) {
      console.log(e)
    }

    try {
      let response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=LIQUIDITY&interval=DAY&from=${now_date / 1000 - 86400 * 3}&to=${now_date / 1000}`)
      if (response.status === 200) {
        let jsonData = await response.json();
        totalLiquidityUSD = (Number(jsonData[jsonData.length - 1]['valueHbar']) / 100000000 * prices[prices.length - 2][1]).toFixed(4)
        oneDay_totalLiquidityUSD = (Number(jsonData[jsonData.length - 2]['valueHbar']) / 100000000 * prices[prices.length - 3][1]).toFixed(4)
        liquidityChangeUSD = getPercentChange(
          totalLiquidityUSD,
          oneDay_totalLiquidityUSD
        )
      }
    } catch (e) {
      console.log (e)
    }

    if (nowData_totalVolumeUSD && oneDayData_totalVolumeUSD) {
      const volumeChangeUSD = getPercentChange(
        nowData_totalVolumeUSD,
        oneDayData_totalVolumeUSD,
      )

      const weeklyVolumeChange = getPercentChange(
        nowWeekData_totalVolumeUSD,
        oneWeekData_totalVolumeUSD,
      )

      data.totalLiquidityUSD = totalLiquidityUSD
      data.liquidityChangeUSD = liquidityChangeUSD
      data.oneDayVolumeUSD = nowData_totalVolumeUSD
      data.oneWeekVolume = nowWeekData_totalVolumeUSD
      data.weeklyVolumeChange = weeklyVolumeChange
      data.volumeChangeUSD = volumeChangeUSD
    }

  } catch (e) {
    console.log(e)
  }
  return data;
}

/**
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
const getEthPrice = async () => {
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()

  let ethPrice = 0
  let ethPriceOneDay = 0
  let priceChangeETH = 0

  try {
    let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
    let result = await client.query({
      query: ETH_PRICE(),
      fetchPolicy: 'cache-first',
    })
    let resultOneDay = await client.query({
      query: ETH_PRICE(oneDayBlock),
      fetchPolicy: 'cache-first',
    })
    const currentPrice = result?.data?.bundles[0]?.ethPrice
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice)
    ethPrice = currentPrice
    ethPriceOneDay = oneDayBackPrice
  } catch (e) {
    console.log(e)
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH]
}

export const getChartData = async (oldestDateToFetch, prices) => {
  try {
    let data = []
    let weekelyData = []
    const now_date = Date.now()
    let response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=LIQUIDITY&interval=DAY&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      if (prices.length > 0) {
        let jsonData = await response.json();
        jsonData.pop()
        let diff = prices.length - jsonData.length
        for (var i = 0; i < jsonData.length; i++) {
          data.push({ "liquidity": Number(jsonData[i]['valueHbar']) / 100000000 * prices[diff + i - 1][1], "date": jsonData[i]['timestampSeconds'] })
        }
      }

    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=DAY&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      if (prices.length > 0) {
        let jsonData = await response.json();
        jsonData.pop()
        let diff = prices.length - jsonData.length
        for (var i = 0; i < jsonData.length; i++) {
          data[i]["dailyVolumeUSD"] = Number(jsonData[i]['valueHbar']) / 100000000 * prices[diff + i - 1][1]
        }
      }
    }

    response = await fetch(`https://api.saucerswap.finance/stats/platformData?field=VOLUME&interval=WEEK&from=${oldestDateToFetch}&to=${now_date}`)
    if (response.status === 200) {
      if (prices.length > 0) {
        let jsonData = await response.json();
        let diff = prices.length - jsonData.length
        for (var i = 0; i < jsonData.length; i++) {
          weekelyData.push({ "weeklyVolumeUSD": Number(jsonData[i]['valueHbar']) / 100000000 * prices[diff + i - 1][1], "date": jsonData[i]['timestampSeconds'] })
        }
      }
    }

    return [data, weekelyData]
  } catch (e) {
    console.log(e)
  }
}