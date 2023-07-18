import React, { useEffect, useState, useMemo } from "react";
import { Container, NavItem, Nav, NavLink, FormGroup, Input, Label } from "reactstrap";
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { useMedia } from 'react-use'
import { RowBetween } from '../../Components/Row'
import classnames from "classnames";
import Search from '../../Components/Search'
import DataTable from 'react-data-table-component';

import { useAllPairsInSaucerswap, usePriceChanges, usePairDailyVolume, usePairWeeklyVolume } from "../../contexts/GlobalData";

import TokenLogo from "../../Components/TokenLogo";
import { FullWrapper, PageWrapper } from "../Tokens";

import hashfrensGif from "../../assets/ads/Unbenannt.gif"
import SauceinuGif from "../../assets/ads/Sauceinu.gif"
import Grelf_Hashchads from "../../assets/ads/Grelf-Hashchads.gif"

const PAIRS_TYPE = {
    pairs: 'pairs',
    gainers: 'gainers',
    losers: 'losers'
}

const PAIRS_TYPE_NAME = {
    pairs: 'Pairs',
    gainers: 'Gainers',
    losers: 'Losers'
}

const TIME_RANGE_TYPE = {
    day: 'day',
    week: 'week',
}

const TIME_RANGE_TYPE_NAME = {
    day: '24h',
    week: '1W',
}

export const AdsBannerWrapper = styled.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0px 0px;
  @media screen and (max-width: 1180px) {
    padding: 0px 1rem;
  }
`

const Pairs = () => {
    document.title = "Pairs";

    const [pairsType, setPairsType] = useState(PAIRS_TYPE.pairs)
    const [timeRangeType, setTimeRangeType] = useState(TIME_RANGE_TYPE.day)
    const [data, setData] = useState([])
    const [allPairs, setAllPairs] = useState([])
    const [gainers, setGainers] = useState([])
    const [losers, setLosers] = useState([])
    const [showLiquidity, setShowLiquidity] = useState(true)

    const _allPairs = useAllPairsInSaucerswap()
    const _dailyPairVolume = usePairDailyVolume()
    const _weeklyPairVolume = usePairWeeklyVolume()
    const _priceChanges = usePriceChanges()
    // const _allPairs = []
    // const _dailyPairVolume = []
    // const _weeklyPairVolume = []
    // const _priceChanges = []

    useEffect(() => {
        if (_priceChanges && (Object.keys(_priceChanges)).length > 0) {
            let _data = [], tmpGainers = [], tmpLosers = []
            for (let pair of _allPairs) {
                /**
                 * pair info
                 * contractId: "0.0.1062795"
                 * id: 0
                 * lpToken: 
                    decimals: 8
                    id: "0.0.1062796"
                    name: "SS-LP SAUCE - HBAR"
                    priceUsd: "0.59602128698449251874"
                    symbol: "SAUCE - HBAR"
                    lpTokenReserve: "5360501802534"
                  * tokenA: 
                    decimals: 6
                    description: "SaucerSwap is an open source and non-custodial AMM protocol native to Hedera. Users can swap tokens, provide liquidity, farm, and stake in a fully permissionless environment.\n\nSAUCE is a transferable representation of attributed utility functions; namely, liquidity, staking, and governance, specified in the code. It is therefore designed to be a utility token essential to the SaucerSwap protocol. \n\n200 million SAUCE tokens were minted at genesis, while the remaining 800 million are brought into circulation according to the release schedule. The total supply of SAUCE is hard-capped and will not exceed 1 billion tokens. There are no lockup periods or private sales of the SAUCE token.\n\nSAUCE has the following essential utilities:\n\nGovernance - SaucerSwap will phase in a DAO, where SAUCE holders can create and vote on proposals to steer protocol development and management. Votes will be proportional to the amount of SAUCE in a user's account.\n\nStaking - the token plays an integral role in single-sided staking and Community Pools. Users can stake SAUCE to receive a percentage of swap fees, HBAR native staking rewards, and emissions. By staking SAUCE, a user immediately receives xSAUCE tokens as receipt of the liquidity they provided, which they can then add to liquidity pools or stake in Community Pools to stack their rewards. \n\nLiquidity - newly minted SAUCE serves as a liquidity mining incentive to offset impermanent loss and bootstrap liquidity on the protocol. \n\nPayments - SAUCE will serve as the exclusive method of payment for several SaucerSwap ecosystem integrations, including a subscription-based model that offers real-time notifications, insights, advanced analytics, and UX customization."
                    dueDiligenceComplete: true
                    icon: "/images/tokens/sauce.svg"
                    id: "0.0.731861"
                    isFeeOnTransferToken: false
                    name: "SAUCE"
                    price: "30199302"
                    priceUsd: 0.01610206
                    sentinelReport: "https://sentinel.headstarter.org/details/saucerswap"
                    symbol: "SAUCE"
                    timestampSecondsLastListingChange: 0
                    twitterHandle: "SaucerSwapLabs"
                    website: "https://www.saucerswap.finance/"
                  * tokenB: 
                    decimals: 8
                    description: "Hedera is a public, open source, proof-of-stake network, with native cryptocurrency HBAR.  HBAR is used to pay application transaction fees and protect the network from attack through proof-of-stake. When HBAR is staked to network nodes, it has a weighted influence on consensus for validating transactions.  Developers use HBAR to pay for network services, such as transferring tokens, minting fungible and non-fungible tokens, calling smart contracts, and logging data. For every transaction submitted to the network, HBAR is used to pay fees that compensate validator nodes for bandwidth, compute, and storage."
                    dueDiligenceComplete: true
                    icon: "/images/tokens/hbar.svg"
                    id: "0.0.1062664"
                    isFeeOnTransferToken: false
                    name: "WHBAR [old]"
                    price: "100000000"
                    priceUsd: 0.05331931
                    sentinelReport: null
                    symbol: "HBAR"
                    timestampSecondsLastListingChange: 0
                    twitterHandle: "hedera"
                    website: "https://hedera.com/"
                  * tokenReserveA: "992100757055"
                  * tokenReserveB: "30035046231642"
                 */
                let tmp = {}
                tmp.icon = pair.tokenA.icon
                tmp.first = pair.tokenA.symbol
                tmp.second = pair.tokenB.symbol
                tmp.pair_address = pair.contractId
                tmp.price = pair.tokenA.priceUsd
                tmp.percent = _priceChanges[pair.tokenA.id]
                tmp.createdAt = ''
                if (timeRangeType === TIME_RANGE_TYPE.day) tmp.volume = _dailyPairVolume[pair.id]
                if (timeRangeType === TIME_RANGE_TYPE.week) tmp.volume = _weeklyPairVolume[pair.id]
                tmp.liquidity = 2 * pair.tokenA.priceUsd * pair.tokenReserveA / Math.pow(10, pair.tokenA.decimals)
                if (showLiquidity) {
                    if (tmp.liquidity >= 500) {
                        _data.push(tmp)
                        if (tmp.percent <= 0) tmpLosers.push(tmp)
                        else tmpGainers.push(tmp)
                    }
                } else {
                    _data.push(tmp)
                    if (tmp.percent <= 0) tmpLosers.push(tmp)
                    else tmpGainers.push(tmp)
                }

            }
            setAllPairs(_data)
            setGainers(tmpGainers)
            setLosers(tmpLosers)
        }
    }, [_allPairs, _priceChanges, _dailyPairVolume, _weeklyPairVolume, timeRangeType, showLiquidity])

    const below600 = useMedia('(max-width: 600px)')

    useEffect(() => {
        if (pairsType === PAIRS_TYPE.pairs) setData(allPairs)
        else if (pairsType === PAIRS_TYPE.gainers) setData(gainers)
        else setData(losers)
    }, [pairsType, allPairs, gainers, losers])

    const handlePairsType = (type) => {
        if (pairsType !== type) setPairsType(type)
    }

    const handleTimeRangeType = (type) => {
        if (timeRangeType !== type) setTimeRangeType(type)
    }

    const handleCopyAddress = () => {

    }

    const calcUnit = (value) => {
        if (value < 1000) return value;
        else if (value < 1000000) return value / 1000 + 'K';
        else if (value < 1000000000) return value / 1000000 + 'M';
        else return value / 1000000000 + 'B'
    }

    const columns = [

        {
            name: <span className='font-weight-bold fs-16'>Pair</span>,
            cell: row => {
                return (
                    <Link to={'/pairs/' + row.pair_address}>
                        <div className="d-flex">
                            <TokenLogo path={row.icon} />
                            <div className="d-flex flex-column" style={{ marginLeft: 4 }}>
                                <div className="d-flex">
                                    <span className="text-pair-first text-white text-hover">{row.first}</span>
                                    <span className="text-pair-second text-grey">{'/' + row.second}</span>
                                </div>
                                <span className="text-white" style={{ textOverflow: "clip" }} onClick={() => handleCopyAddress()}>{row.pair_address}<i className="mdi mdi-content-copy"></i></span>
                            </div>
                        </div>
                    </Link>

                )
            },
            sortable: true,
            width: 210
            // width: 180
        },
        {
            name: <span className='font-weight-bold fs-16'>Price</span>,
            sortable: true,
            cell: (row) => {
                return (
                    <Link to={'/pairs/' + row.pair_address}>
                        <span className="text-white">{row.price ? '$' + row.price.toFixed(4) : ''}</span>
                    </Link>
                );
            },
            width: 150,
            // width: 120
        },
        {
            name: <span className='font-weight-bold fs-16'>{'% ' + TIME_RANGE_TYPE_NAME[timeRangeType]}</span>,
            sortable: true,
            cell: (row) => {
                if (row.percent >= 0) {
                    return <Link to={'/pairs/' + row.pair_address}>
                        <span className="text-green"><i className="mdi mdi-arrow-top-right-thin"></i>{row.percent ? row.percent.toFixed(4) + '%' : ''}</span>
                    </Link>

                } else {
                    return <Link to={'/pairs/' + row.pair_address}>
                        <span className="text-red"><i className="mdi mdi-arrow-bottom-right-thin"></i>{row.percent ? row.percent.toFixed(4) + '%' : ''}</span>
                    </Link>
                }
            },
            width: 210,
            // width: 150
        },
        // {
        //     name: <span className='font-weight-bold fs-16'>Created</span>,
        //     cell: row => row.createdAt,
        //     sortable: true,
        //     selector: 'createdAt',
        //     width: 100
        // },
        {
            name: <span className='font-weight-bold fs-16'>Volume</span>,
            // selector: row => row.volume ? calcUnit(row.volume) : '-',
            cell: row => row.volume ? ' $' + calcUnit(parseInt(row.volume)) : '-',
            sortable: true,
            width: 180,
            // width: 120
        },
        // {
        //     name: <span className='font-weight-bold fs-16'>Swaps</span>,
        //     sortable: true,
        //     selector: 'swaps',
        //     cell: row => row.swaps ? ' $' + calcUnit(parseInt(row.swaps)) : '-',
        //     width: 100
        // },
        {
            name: <span className='font-weight-bold fs-13'>Daily Fees</span>,
            sortable: true,
            cell: row => row.volume ? '$' + (row.volume / 400).toFixed(2) : '',
            width: 180,
            // width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'>Liquidity</span>,
            sortable: true,
            cell: row => row.liquidity ? '$' + calcUnit(parseInt(row.liquidity)) : '',
            width: 200
            // width: 150
        },
        // {
        //     name: <span className='font-weight-bold fs-16'>T.M.Cap.</span>,
        //     sortable: true,
        //     selector: 'cap',
        //     cell: row => row.cap ? ' $' + calcUnit(parseInt(row.cap)) : '-',
        //     width: 60
        // },
        // {
        //     name: <span className='font-weight-bold fs-16'>Actions</span>,
        //     sortable: true,
        //     cell: row => {
        //         return (
        //             <div>
        //                 <i className="mdi mdi-binoculars fs-20"></i>
        //                 <i className="bx bxs-bar-chart-square fs-20" style={{ marginRight: 5, marginLeft: 5 }}></i>
        //                 <i className="bx bx-star fs-20"></i>
        //             </div>
        //         )
        //     }
        // },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <PageWrapper>
                            <AdsBannerWrapper>
                                <marquee width="100%" direction="right">
                                    <a>
                                        <img className="ads-banner" src={hashfrensGif} />
                                    </a>
                                    <a href="https://www.saucerswap.finance/swap/HBAR/0.0.1159074" target="_blank">
                                        <img className="ads-banner" src={Grelf_Hashchads} />
                                    </a>
                                </marquee>
                            </AdsBannerWrapper>
                        <FullWrapper>
                            <RowBetween style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Search display={"all"} small={true} />
                            </RowBetween>
                            <RowBetween>
                                <Nav tabs className="nav nav-tabs nav-border-top nav-border-top-success">
                                    <NavItem>
                                        <NavLink style={{ cursor: "pointer" }} className={classnames({ active: pairsType == PAIRS_TYPE.pairs, })} onClick={() => { handlePairsType(PAIRS_TYPE.pairs) }} >
                                            <i className="mdi mdi-checkbox-multiple-blank-circle align-middle me-1"></i> Pairs
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink style={{ cursor: "pointer" }} className={classnames({ active: pairsType == PAIRS_TYPE.gainers })} onClick={() => { handlePairsType(PAIRS_TYPE.gainers) }} >
                                            <i className="mdi mdi-elevation-rise align-middle me-1"></i> Gainers
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink style={{ cursor: "pointer" }} className={classnames({ active: pairsType == PAIRS_TYPE.losers })} onClick={() => { handlePairsType(PAIRS_TYPE.losers) }} >
                                            <i className="mdi mdi-elevation-decline me-1 align-middle"></i> Losers
                                        </NavLink>
                                    </NavItem>
                                </Nav>

                                <div className="d-flex items-center">
                                    <FormGroup switch style={{ marginRight: '5px', display:"flex" }}>
                                        <Input
                                            type="switch"
                                            style={{ height: "1.5rem", width: '3rem', marginRight: 5 }}
                                            defaultChecked={showLiquidity}
                                            onClick={() => {
                                                setShowLiquidity(!showLiquidity)
                                            }}
                                        />
                                        <Label check style={{ fontSize: 18, fontWeight: 450 }}>$500+ Liquidity</Label>
                                    </FormGroup>
                                    <Nav pills className="badge-bg">
                                        <NavItem className="d-flex items-center justify-center" style={{width:"4rem"}}>
                                            <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.day ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.day) }} >
                                                <span className={timeRangeType == TIME_RANGE_TYPE.day ? "text-white badge" : "text-badge badge"}>24h</span>
                                            </div>
                                        </NavItem>
                                        <NavItem className="d-flex items-center justify-center" style={{width:"4rem"}}>
                                            <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.week ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.week) }} >
                                                <span className={timeRangeType == TIME_RANGE_TYPE.week ? "text-white badge" : "text-badge badge"}>1W</span>
                                            </div>
                                        </NavItem>
                                    </Nav>
                                </div>
                            </RowBetween>
                            {/* PAIRS DATA TABLE */}
                            <DataTable
                                customStyles={{
                                    headRow: {
                                        style: {
                                            background: "#142028",
                                            color: "white"
                                        }
                                    },
                                    table: {
                                        style: {
                                            background: "#142028",
                                            color: "white"
                                        }
                                    },
                                    rows: {
                                        style: {
                                            background: "#142028",
                                            color: "white"
                                        }
                                    },
                                    pagination: {
                                        style: {
                                            background: "#142028",
                                            color: "white"
                                        },
                                        pageButtonsStyle: {
                                            color: "white",
                                            fill: "white"
                                        }
                                    },
                                    noData: {
                                        style: {
                                            background: "#142028",
                                            color: "white"
                                        }
                                    },
                                    cells: {
                                        style: {
                                            paddingRight: "0px",
                                            color: "white"
                                        }
                                    }
                                }}
                                columns={columns}
                                data={data || []}
                                pagination
                            />
                        </FullWrapper>
                    </PageWrapper>
                </Container>
            </div>
        </React.Fragment >
    )

}

export default Pairs;