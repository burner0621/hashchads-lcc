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
    const [data, setData] = useState ([])

    const _allPairs = useAllPairsInSaucerswap()
    const _dailyPairVolume = usePairDailyVolume ()
    const _weeklyPairVolume = usePairWeeklyVolume ()
    const _priceChanges = usePriceChanges()

    
    console.log (_priceChanges, _allPairs.length, ">>>>>>>>>>>>>>>>>>>")

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
                _data.push (tmp)
            }
            setData (_data)
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

    const columns = [

        {
            name: <span className='font-weight-bold fs-13'>Pair</span>,
            selector: row => {
                return (
                    <div className="d-flex">
                        <TokenLogo path={row.icon} />
                        <div className="d-flex flex-column">
                            <div className="d-flex">
                                <span className="text-pair-first">{row.first}</span>
                                <span className="text-pair-second">{'/' + row.second}</span>
                            </div>
                            <span onClick={() => handleCopyAddress()}>{row.pair_address}<i className="mdi mdi-content-copy"></i></span>
                        </div>
                    </div>
                )
            },
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Price</span>,
            sortable: true,
            selector: (row) => {
                return (
                    <span>{'$' + row.price}</span>
                );
            },
        },
        {
            name: <span className='font-weight-bold fs-13'>{'% ' + TIME_RANGE_TYPE_NAME[timeRangeType]}</span>,
            sortable: true,
            selector: (row) => {
                if (row.percent >= 0) {
                    return <span className="text-green"><i className="mdi mdi-arrow-top-right-thin"></i>{row.percent + '%'}</span>
                } else {
                    return <span className="text-red"><i className="mdi mdi-arrow-bottom-right-thin"></i>{row.percent + '%'}</span>
                }
            },
        },
        {
            name: <span className='font-weight-bold fs-13'>Contact</span>,
            selector: (row) => {
                if (row.contact) {
                    return (
                        <div>
                            <i className={row.contact.mint ? "bx bx bxs-layer-plus text-yellow" : "bx bx-book-add"}></i>
                            <i className={row.contact.lock ? "bx bx bxs-lock-alt text-yellow" : "bx bx bxs-lock-alt"}></i>
                            <i className={row.contact.share ? "bx bx bxs-share-alt text-yellow" : "bx bx bxs-share-alt"}></i>
                            <i className={row.contact.fee ? "bx bx-money text-yellow" : "bx bx-money"}></i>
                        </div>
                    )
                } else {
                    return <span className="badge bg-dark">No data</span>
                }
            },
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Created</span>,
            selector: row => row.createdAt,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Volume</span>,
            selector: row => row.volume ? row.volume : '-',
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Swaps</span>,
            sortable: true,
            selector: row => row.swaps
        },
        {
            name: <span className='font-weight-bold fs-13'>Liquidity</span>,
            sortable: true,
            selector: row => row.liquidity
        },
        {
            name: <span className='font-weight-bold fs-13'>T.M.Cap.</span>,
            sortable: true,
            selector: row => row.cap ? '$' + row.cap : '-'
        },
        {
            name: <span className='font-weight-bold fs-13'>Actions</span>,
            sortable: true,
            selector: row => {
                return (
                    <div>
                        <i className="mdi mdi-binoculars"></i>
                        <i className="bx bxs-bar-chart-square"></i>
                        <i className="bx bx-star"></i>
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
                                style={{ textAlign: 'center', background: 'black' }}
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