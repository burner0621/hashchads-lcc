import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RowFixed, RowBetween } from '../Row'
import { useMedia } from 'react-use'
import fetch from "cross-fetch"

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
`

const Medium = styled.span`
  font-weight: 500;
`

const Text = styled.div`
    font-size: 0.8125rem !important;
    margin: 14px;
`

export default function GlobalStats() {
    const below1295 = useMedia('(max-width: 1295px)')
    const below1180 = useMedia('(max-width: 1180px)')
    const below1024 = useMedia('(max-width: 1024px)')
    const below400 = useMedia('(max-width: 400px)')
    const below816 = useMedia('(max-width: 816px)')

    const [hbarPrice, setHbarPrice] = useState(0)
    const [saucePrice, setSaucePrice] = useState(0)
    const [tvlUsd, setTvlUsd] = useState(0)
    const [tvlHbar, setTvlHbar] = useState(0)
    const [dailyVolHbar, setDailyVolHbar] = useState(0)

    useEffect(() => {
        const timeout = setTimeout(async () => {
            await getHbarAndSaucerPrice ()
            await getTVL ()
            await getDailyVolume ()
            await getDailyFees ()
        }, 1000);
        return () => clearTimeout(timeout);
    }, [])

    const getHbarAndSaucerPrice = async () => {
        let response = await fetch("https://api.saucerswap.finance/tokens")
        if (response.status === 200) {
            const jsonData = await response.json();
            try {
                setHbarPrice(Number(jsonData[0]['priceUsd']));
                setSaucePrice(Number(jsonData[2]['priceUsd']));
            } catch (error) {
                setHbarPrice(0)
                setSaucePrice(0)
            }
        }
    }

    const getTVL = async () => {
        let response = await fetch("https://api.saucerswap.finance/stats")
        if (response.status === 200) {
            const jsonData = await response.json();
            try {
                setTvlHbar((Number(jsonData['tvl'])/100000000).toFixed(2));
                setTvlUsd(Number(jsonData['tvlUsd']).toFixed(2));
            } catch (error) {
                setTvlHbar(0)
                setTvlUsd(0)
            }
        }
    }

    const getDailyVolume = async () => {
        let response = await fetch("https://api.saucerswap.finance/stats/volume/daily")
        if (response.status === 200) {
            const jsonData = await response.json();
            try {
                setDailyVolHbar(Number(jsonData[0]['dailyVolume'])/100000000);
            } catch (error) {
                setDailyVolHbar(0)
            }
        }
    }

    const getDailyFees = async () => {
        let response = await fetch("https://api.saucerswap.finance/pools/daily-volumes")
        if (response.status === 200) {
            const jsonData = await response.json();
            let dailyVol = 0;
            try {
                let i = 0
                for (let v in jsonData) {
                    if (i % 2 === 0) dailyVol += Number (jsonData[v])
                    else dailyVol -= Number (jsonData[v])
                    i ++
                    if (i === 232) break
                }
            } catch (error) {
                setDailyVolHbar(0)
            }
        }
    }

    return (
        <Header id="globalStats">
            <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
                <RowFixed>
                    {!below400 && (
                        <Text className='fs-6'>{"HBAR Price: $" + hbarPrice.toFixed(3)}</Text>
                    )}

                    {!below816 && (
                        <Text className='fs-6'>{"SAUCE Price: $" + saucePrice.toFixed(3)}</Text>
                    )}
                    {!below1024 && (
                        <Text className='fs-6'>{`TVL: $${tvlUsd} (${tvlHbar} HBAR)`}</Text>
                    )}
                    {!below1180 && (
                        <Text className='fs-6'>{`24hr Volume: ${(dailyVolHbar * hbarPrice).toFixed (2)} (${dailyVolHbar.toFixed(2)} HBAR)`}</Text>
                    )}
                    {!below1295 && (
                        <Text className='fs-6'>24hr Fees: $920.88</Text>
                    )}
                </RowFixed>
            </RowBetween>
        </Header>
    )
}
