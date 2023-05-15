import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RowFixed, RowBetween } from '../Row'
import { useMedia } from 'react-use'
import { formattedNum } from '../../utils'
import { useGlobalData, useHbarAndSaucePrice } from '../../contexts/GlobalData'
import { Spinner } from "reactstrap";
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

    const [tvlUsd, setTvlUsd] = useState(0)
    const [tvlHbar, setTvlHbar] = useState(0)
    const [dailyVolHbar, setDailyVolHbar] = useState(0)

    const { totalVolumeUSD, totalVolumeHBAR, todayVolumeUSD } = useGlobalData()
    const [hBarPrice, saucePrice] = useHbarAndSaucePrice()

    const formattedHbarPrice = hBarPrice ? formattedNum(hBarPrice, true) : undefined
    const formattedSaucePrice = saucePrice ? formattedNum(saucePrice, true) : undefined
    const formattedTvlUSD = totalVolumeUSD ? formattedNum(totalVolumeUSD, true) : undefined
    const formattedTvlHBAR = totalVolumeHBAR ? formattedNum(totalVolumeHBAR, true) : undefined
    const formattedTodayVolume = todayVolumeUSD ? formattedNum(todayVolumeUSD, true) : undefined

    // const getHbarAndSaucerPrice = async () => {
    //     let response = await fetch("https://api.saucerswap.finance/tokens")
    //     if (response.status === 200) {
    //         const jsonData = await response.json();
    //         try {
    //             setHbarPrice(Number(jsonData[0]['priceUsd']));
    //             setSaucePrice(Number(jsonData[2]['priceUsd']));
    //         } catch (error) {
    //             setHbarPrice(0)
    //             setSaucePrice(0)
    //         }
    //     }
    // }

    // const getTVL = async () => {
    //     let response = await fetch("https://api.saucerswap.finance/stats")
    //     if (response.status === 200) {
    //         const jsonData = await response.json();
    //         try {
    //             setTvlHbar((Number(jsonData['tvl'])/100000000).toFixed(2));
    //             setTvlUsd(Number(jsonData['tvlUsd']).toFixed(2));
    //         } catch (error) {
    //             setTvlHbar(0)
    //             setTvlUsd(0)
    //         }
    //     }
    // }

    // const getDailyVolume = async () => {
    //     let response = await fetch("https://api.saucerswap.finance/stats/volume/daily")
    //     if (response.status === 200) {
    //         const jsonData = await response.json();
    //         try {
    //             setDailyVolHbar(Number(jsonData[0]['dailyVolume'])/100000000);
    //         } catch (error) {
    //             setDailyVolHbar(0)
    //         }
    //     }
    // }

    // const getDailyFees = async () => {
    //     let response = await fetch("https://api.saucerswap.finance/pools/daily-volumes")
    //     if (response.status === 200) {
    //         const jsonData = await response.json();
    //         let dailyVol = 0;
    //         try {
    //             let i = 0
    //             for (let v in jsonData) {
    //                 if (i % 2 === 0) dailyVol += Number (jsonData[v])
    //                 else dailyVol -= Number (jsonData[v])
    //                 i ++
    //                 if (i === 232) break
    //             }
    //         } catch (error) {
    //             setDailyVolHbar(0)
    //         }
    //     }
    // }

    return (
        <Header id="globalStats">
            <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
                <RowFixed>
                    {!below400 && (
                        <Text className='fs-6'>{"HBAR Price: "}
                            {
                                formattedHbarPrice === undefined && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedHbarPrice !== undefined && <span className='badge rounded-pill badge-outline-light' style={{ fontSize: 13 }}>{formattedHbarPrice}</span>
                            }

                        </Text>
                    )}

                    {!below816 && (
                        <Text className='fs-6'>{"SAUCE Price: "}
                            {
                                formattedSaucePrice === undefined && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedSaucePrice !== undefined && <span className='badge rounded-pill badge-outline-light' style={{ fontSize: 13 }}>{formattedSaucePrice}</span>
                            }
                        </Text>
                    )}
                    {!below1024 && (
                        <Text className='fs-6'>{`TVL: `}
                            {
                                (formattedTvlUSD === undefined || formattedTvlHBAR === undefined) && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedTvlUSD !== undefined && formattedTvlHBAR !== undefined && <span className='badge badge-outline-light' style={{ fontSize: 13 }}>{`${formattedTvlUSD} (${formattedTvlHBAR} HBAR)`}</span>
                            }
                        </Text>
                    )}
                    {!below1180 && (
                        <Text className='fs-6'>{`24hr Volume: `}
                            {
                                (todayVolumeUSD === undefined || formattedTodayVolume === undefined) && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                todayVolumeUSD !== undefined && formattedTodayVolume !== undefined && <span className='badge badge-outline-light' style={{ fontSize: 13 }}>{`${formattedNum(todayVolumeUSD * hBarPrice)} (${formattedTodayVolume} HBAR)`}</span>
                            }
                        </Text>
                    )}
                    {!below1295 && (
                        <Text className='fs-6'>{'24hr Fees: '}
                            <span className='badge rounded-pill badge-outline-light' style={{ fontSize: 13 }}>{' $1,340.63'}</span>
                        </Text>
                    )}
                </RowFixed>
            </RowBetween>
        </Header>
    )
}
