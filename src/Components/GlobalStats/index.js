import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RowFixed, RowBetween } from '../Row'
import { useMedia } from 'react-use'
import { formattedNum } from '../../utils'
import { useGlobalDataContext, useHbarAndSaucePrice } from '../../contexts/GlobalData'
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
    const below600 = useMedia('(max-width: 600px)')
    const below816 = useMedia('(max-width: 816px)')

    const [tvlUsd, setTvlUsd] = useState(0)
    const [tvlHbar, setTvlHbar] = useState(0)
    const [dailyVolHbar, setDailyVolHbar] = useState(0)

    // const { totalVolumeUSD, totalVolumeHBAR, todayVolumeUSD } = useGlobalData()
    // const {  totalVolumeUSD, totalVolumeHBAR, todayVolumeUSD, state  } = useGlobalDataContext() 
    const [state]= useGlobalDataContext()
    const totalVolumeUSD = state?.globalData?.totalVolumeUSD;
    const totalVolumeHBAR = state?.globalData?.totalVolumeHBAR;
    const todayVolumeUSD = state?.globalData?.todayVolumeUSD;
    const hBarPrice = state?.hBarPrice;
    const saucePrice = state?.saucePrice;
    // const [hBarPrice, saucePrice] = useHbarAndSaucePrice()

    const formattedHbarPrice = hBarPrice ? formattedNum(hBarPrice, true) : undefined
    const formattedSaucePrice = saucePrice ? formattedNum(saucePrice, true) : undefined
    const formattedTvlUSD = totalVolumeUSD ? formattedNum(totalVolumeUSD, true) : undefined
    const formattedTvlHBAR = totalVolumeHBAR ? formattedNum(totalVolumeHBAR, false) : undefined
    const formattedTodayVolume = todayVolumeUSD ? formattedNum(todayVolumeUSD, false) : undefined
    const formattedTodayFees = todayVolumeUSD ? formattedNum(todayVolumeUSD/400, true) : undefined

    // useHbarAndSaucePrice()
    return (
        <Header id="globalStats">
            <RowBetween style={{ padding: below816 ? '0.5rem' : '.5rem' }}>
                {!below600 && (
                    <RowFixed>
                    
                        <Text className='fs-6'>{"HBAR Price: "}
                            {
                                formattedHbarPrice === undefined && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedHbarPrice !== undefined && <span className='badge rounded-pill badge-outline-light' style={{ fontSize: 13 }}>{formattedHbarPrice}</span>
                            }
                        </Text>
                    
                    
                        <Text className='fs-6'>{"SAUCE Price: "}
                            {
                                formattedSaucePrice === undefined && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedSaucePrice !== undefined && <span className='badge rounded-pill badge-outline-light' style={{ fontSize: 13 }}>{formattedSaucePrice}</span>
                            }
                        </Text>

                        <Text className='fs-6'>{`TVL: `}
                            {
                                (formattedTvlUSD === undefined || formattedTvlHBAR === undefined) && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedTvlUSD !== undefined && formattedTvlHBAR !== undefined && <span className='badge badge-outline-light' style={{ fontSize: 13 }}>{`${formattedTvlUSD} (${formattedTvlHBAR} HBAR)`}</span>
                            }
                        </Text>

                        <Text className='fs-6'>{`24hr Volume: `}
                            {
                                (todayVolumeUSD === undefined || formattedTodayVolume === undefined) && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                todayVolumeUSD !== undefined && formattedTodayVolume !== undefined && <span className='badge badge-outline-light' style={{ fontSize: 13 }}>{`${formattedNum(todayVolumeUSD * hBarPrice, true)} (${formattedTodayVolume} HBAR)`}</span>
                            }
                        </Text>

                        <Text className='fs-6'>{'24hr Fees: '}
                            {
                                (todayVolumeUSD === undefined || formattedTodayFees === undefined) && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                todayVolumeUSD !== undefined && formattedTodayFees !== undefined && <span className='badge badge-outline-light' style={{ fontSize: 13 }}>{'$' + formattedNum(todayVolumeUSD * hBarPrice / 400)}</span>
                            }
                        </Text>
                    </RowFixed>
                )}
                {below600 && (
                <div>
                    <RowFixed>
                        <Text className='fs-6'>{"HBAR Price: "}
                            {
                                formattedHbarPrice === undefined && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedHbarPrice !== undefined && <span className='badge rounded-pill badge-outline-light' style={{ fontSize: 13 }}>{formattedHbarPrice}</span>
                            }
                        </Text>
                        <Text className='fs-6'>{"SAUCE Price: "}
                            {
                                formattedSaucePrice === undefined && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedSaucePrice !== undefined && <span className='badge rounded-pill badge-outline-light' style={{ fontSize: 13 }}>{formattedSaucePrice}</span>
                            }
                        </Text>
                    </RowFixed>
                    <RowFixed>
                        <Text className='fs-6'>{`TVL: `}
                            {
                                (formattedTvlUSD === undefined || formattedTvlHBAR === undefined) && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                formattedTvlUSD !== undefined && formattedTvlHBAR !== undefined && <span className='badge badge-outline-light' style={{ fontSize: 13 }}>{`${formattedTvlUSD} (${formattedTvlHBAR} HBAR)`}</span>
                            }
                        </Text>
                    </RowFixed>
                    <RowFixed>
                        <Text className='fs-6'>{`24hr Volume: `}
                            {
                                (todayVolumeUSD === undefined || formattedTodayVolume === undefined) && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                todayVolumeUSD !== undefined && formattedTodayVolume !== undefined && <span className='badge badge-outline-light' style={{ fontSize: 13 }}>{`${formattedNum(todayVolumeUSD * hBarPrice, true)} (${formattedTodayVolume} HBAR)`}</span>
                            }
                        </Text>
                    </RowFixed>
                    <RowFixed>
                        <Text className='fs-6'>{'24hr Fees: '}
                            {
                                (todayVolumeUSD === undefined || formattedTodayFees === undefined) && <Spinner color="light" type="grow" style={{ verticalAlign: 'middle' }}></Spinner>
                            }
                            {
                                todayVolumeUSD !== undefined && formattedTodayFees !== undefined && <span className='badge badge-outline-light' style={{ fontSize: 13 }}>{'$' + formattedNum(todayVolumeUSD * hBarPrice / 400)}</span>
                            }
                        </Text>
                    </RowFixed>
                </div>
                )}
            </RowBetween>
        </Header>
    )
}
