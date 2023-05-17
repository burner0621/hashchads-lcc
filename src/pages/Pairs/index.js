import React, { useEffect, useState, useMemo } from "react";
import { Container, NavItem, Nav, NavLink } from "reactstrap";
import { useMedia } from 'react-use'
import { RowBetween } from '../../Components/Row'
import classnames from "classnames";
import styled from 'styled-components'
import DataTable from 'react-data-table-component';

import { useAllPairsInSaucerswap, usePriceChanges, usePairDailyVolume, usePairWeeklyVolume } from "../../contexts/GlobalData";

import TokenLogo from "../../Components/TokenLogo";
import { FullWrapper, PageWrapper } from "../Tokens";

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

const Pairs = () => {
    document.title = "Pairs";

    const [pairsType, setPairsType] = useState(PAIRS_TYPE.pairs)
    const [timeRangeType, setTimeRangeType] = useState(TIME_RANGE_TYPE.day)
    const [data, setData] = useState([])

    const _allPairs = useAllPairsInSaucerswap()
    const _dailyPairVolume = usePairDailyVolume()
    const _weeklyPairVolume = usePairWeeklyVolume()
    const _priceChanges = usePriceChanges()


    console.log(_priceChanges, _allPairs.length, ">>>>>>>>>>>>>>>>>>>")

    useEffect(() => {
        if (_priceChanges && (Object.keys(_priceChanges)).length > 0) {
            let _data = []
            for (let pair of _allPairs) {
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
                _data.push(tmp)
            }
            setData(_data)
        }
    }, [_allPairs, _priceChanges, _dailyPairVolume, _weeklyPairVolume, timeRangeType])

    const below600 = useMedia('(max-width: 600px)')
    const below700 = useMedia('(max-width: 700px)')
    const below800 = useMedia('(max-width: 800px)')
    const below900 = useMedia('(max-width: 900px)')

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
            selector: row => {
                return (
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
                )
            },
            sortable: true,
            width: 180
        },
        {
            name: <span className='font-weight-bold fs-16'>Price</span>,
            sortable: true,
            selector: (row) => {
                return (
                    <span className="text-white">{row.price ? '$' + row.price : ''}</span>
                );
            },
            width: 120
        },
        {
            name: <span className='font-weight-bold fs-16'>{'% ' + TIME_RANGE_TYPE_NAME[timeRangeType]}</span>,
            sortable: true,
            selector: (row) => {
                if (row.percent >= 0) {
                    return <span className="text-green"><i className="mdi mdi-arrow-top-right-thin"></i>{row.percent.toFixed(4) + '%'}</span>
                } else {
                    return <span className="text-red"><i className="mdi mdi-arrow-bottom-right-thin"></i>{row.percent.toFixed(4) + '%'}</span>
                }
            },
            width: 150
        },
        {
            name: <span className='font-weight-bold fs-16'>Created</span>,
            selector: row => row.createdAt,
            sortable: true,
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'>Volume</span>,
            // selector: row => row.volume ? calcUnit(row.volume) : '-',
            selector: row => row.volume ? ' $' + calcUnit(parseInt(row.volume)) : '-',
            sortable: true,
            width: 200
        },
        {
            name: <span className='font-weight-bold fs-16'>Swaps</span>,
            sortable: true,
            selector: row => row.swaps ? ' $' + calcUnit(parseInt(row.swaps)) : '-',
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-13'>Daily Fees</span>,
            sortable: true,
            selector: row => (row.volume / 40)
        },
        {
            name: <span className='font-weight-bold fs-16'>Liquidity</span>,
            sortable: true,
            selector: row => row.liquidity ? calcUnit(parseInt(row.liquidity)) : '',
            width: 150
        },
        {
            name: <span className='font-weight-bold fs-16'>T.M.Cap.</span>,
            sortable: true,
            selector: row => row.cap ? ' $' + calcUnit(parseInt(row.cap)) : '-',
            width: 60
        },
        {
            name: <span className='font-weight-bold fs-24'>Actions</span>,
            sortable: true,
            selector: row => {
                return (
                    <div>
                        <i className="mdi mdi-binoculars fs-16"></i>
                        <i className="bx bxs-bar-chart-square fs-16" style={{ marginRight: 5, marginLeft: 5 }}></i>
                        <i className="bx bx-star fs-16"></i>
                    </div>
                )
            }
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <PageWrapper>
                        <FullWrapper>
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

                                {!below600 &&
                                    <Nav pills className="mb-3">
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: timeRangeType == TIME_RANGE_TYPE.day, })} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.day) }} >
                                                <span className="badge">24h</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: timeRangeType == TIME_RANGE_TYPE.week })} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.week) }} >
                                                <span className="badge">1W</span>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                }
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