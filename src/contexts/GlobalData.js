import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import { client } from '../apollo/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import fetch from 'cross-fetch'
import { useTimeframe } from './Application'
import weekOfYear from 'dayjs/plugin/weekOfYear'
const UPDATE = 'UPDATE'
const UPDATE_TXNS = 'UPDATE_TXNS'
const UPDATE_CHART = 'UPDATE_CHART'
const UPDATE_ETH_PRICE = 'UPDATE_ETH_PRICE'
const ETH_PRICE_KEY = 'ETH_PRICE_KEY'
const UPDATE_ALL_PAIRS_IN_SAUCERSWAP = 'UPDAUPDATE_ALL_PAIRS_IN_SAUCERSWAPTE_TOP_PAIRS'
const UPDATE_ALL_TOKENS_IN_SAUCERSWAP = 'UPDATE_ALL_TOKENS_IN_SAUCERSWAP'
const UPDATE_TOP_LPS = 'UPDATE_TOP_LPS'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

const GlobalDataContext = createContext()

function useGlobalDataContext() {
  return useContext(GlobalDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {

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

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export function useGlobalData() {
  const [state, { update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap }] = useGlobalDataContext()

  const data = state?.globalData

  useEffect(() => {
    async function fetchData() {
      let allPairs = await getAllPairsOnSaucerswap()
      updateAllPairsInSaucerswap(allPairs)

      let allTokens = await getAllTokensOnSaucerswap()
      updateAllTokensInSaucerswap(allTokens)
    }
    fetchData()
  }, [data, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap])

  return data || {}
}

async function getAllPairsOnSaucerswap() {
  try {
    let pairs = []
    let response = await fetch ("https://api.saucerswap.finance/pools")
    if ( response.status === 200 ) {
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
    
    let response = await fetch ("https://api.saucerswap.finance/tokens")
    if ( response.status === 200 ) {
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

  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateAllPairsInSaucerswap,
            updateAllTokensInSaucerswap
          },
        ],
        [
          state,
          updateAllPairsInSaucerswap,
          updateAllTokensInSaucerswap
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