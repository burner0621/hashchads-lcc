import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import { Col, Container, Row, Nav, NavItem, Card, CardBody } from "reactstrap";
import { useMedia } from 'react-use'
import { Text } from 'rebass'
import { PlusCircle, Bookmark, AlertCircle, Tablet } from 'react-feather'

import Widgets from './Widgets';
// import TokenChart from './TokenChart';
import TokenChart from '../../Components/TokenChart';
import TokenInfo from './TokenInfo';

import Panel from '../../Components/Panel'
import { RowBetween, RowFixed, AutoRow } from '../../Components/Row'
import Link, { BasicLink } from '../../Components/Link'
import Column, { AutoColumn } from '../../Components/Column'
import Search from '../../Components/Search'
import TokenLogo from '../../Components/TokenLogo'
// import { ButtonLight, ButtonDark } from '../../Components/ButtonStyled'

import { localNumber } from '../../utils'

import { useAllTokensInSaucerswap, usePriceChanges, useTokenDailyVolume } from '../../contexts/GlobalData'
import { useTokenPriceData } from '../../contexts/TokenData'
import fetch from 'cross-fetch'

import * as env from "../../env"
import DataTable from 'react-data-table-component';
import { timeframeOptions } from "../../constants";
import DropdownSelect from '../../Components/DropdownSelect'
import { OptionButton } from '../../Components/ButtonStyled'
import { Activity } from 'react-feather'
import { usePrevious } from 'react-use'
const PriceOption = styled(OptionButton)`
  border-radius: 2px;
`
const DashboardWrapper = styled.div`
  width: 100%;
`
const ContentWrapper = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 0;
  padding: 0 0;
  box-sizing: border-box;
  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  padding-bottom: 80px;

  @media screen and (max-width: 600px) {
    & > * {
      padding: 0 12px;
    }
  }
`
const WarningGrouping = styled.div`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`
const Hover = styled.div`
  :hover {
    cursor: pointer;
    opacity: ${({ fade }) => fade && '0.7'};
  }
`
const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text1};
`
const WarningIcon = styled(AlertCircle)`
  stroke: darkgreen;
  height: 16px;
  width: 16px;
  opacity: 0.6;
`
const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      /* grid-column: 1 / 4; */
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

const UNTRACKED_COPY = 'Derived USD values may be inaccurate without liquid stablecoin or ETH pairings.'

const TIME_RANGE_TYPE = {
    five: 'five',
    hour: 'hour',
    six: 'six',
    day: 'day',
    week: 'week',
}

const TABLE_TYPE = {
    trade: 'trade',
    holder: 'holder'
}

const TIME_RANGE_TYPE_NAME = {
    five: '5m',
    hour: '1h',
    six: '6h',
    day: '24h',
    week: '1W',
}

const CHART_VIEW = {
    VOLUME: 'Volume',
    LIQUIDITY: 'Liquidity',
    PRICE: 'Price',
    LINE_PRICE: 'Price (Line)',
}

const DATA_FREQUENCY = {
    DAY: 'DAY',
    HOUR: 'HOUR',
    LINE: 'LINE',
}

const TokenPage = ({ address }) => {
    const allTokens = useAllTokensInSaucerswap()
    const priceChanges = usePriceChanges()
    const tokenDailyVolume = useTokenDailyVolume()
    const below1080 = useMedia('(max-width: 1080px)')
    const below600 = useMedia('(max-width: 600px)')

    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [priceUSD, setPriceUSD] = useState()
    const [priceChange, setPriceChange] = useState('')
    const [priceChangeColor, setPriceChangeColor] = useState('green')
    const [iconPath, setIconPath] = useState('')
    const [data, setData] = useState([])
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [timeRangeType, setTimeRangeType] = useState(TIME_RANGE_TYPE.week)
    const [tableType, setTableType] = useState(TABLE_TYPE.trade)
    const [holders, setHolder] = useState([])

    const [totalLiquidity, setTotalLiquidity] = useState(0)
    const [circulatingSupply, setCirculatingSupply] = useState(0)
    const [dilutedSupply, setDilutedSupply] = useState(0)

    const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE)
    const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR)
    const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)
    const prevWindow = usePrevious(timeWindow)

    const dailyVolume = tokenDailyVolume !== undefined ? (tokenDailyVolume[address] !== undefined ? tokenDailyVolume[address] : 0) : 0

    // hourly and daily price data based on the current time window
    const hourlyWeek = useTokenPriceData(address, timeframeOptions.WEEK, 3600)
    const hourlyMonth = useTokenPriceData(address, timeframeOptions.MONTH, 3600)
    const hourlyAll = useTokenPriceData(address, timeframeOptions.ALL_TIME, 3600)
    const dailyWeek = useTokenPriceData(address, timeframeOptions.WEEK, 86400)
    const dailyMonth = useTokenPriceData(address, timeframeOptions.MONTH, 86400)
    const dailyAll = useTokenPriceData(address, timeframeOptions.ALL_TIME, 86400)

    const priceData =
        timeWindow === timeframeOptions.MONTH
            ? // monthly selected
            frequency === DATA_FREQUENCY.DAY
                ? dailyMonth
                : hourlyMonth
            : // weekly selected
            timeWindow === timeframeOptions.WEEK
                ? frequency === DATA_FREQUENCY.DAY
                    ? dailyWeek
                    : hourlyWeek
                : // all time selected
                frequency === DATA_FREQUENCY.DAY
                    ? dailyAll
                    : hourlyAll

    async function fetchNameAndSymbolData() {
        let response = await fetch(env.MIRROR_NODE_URL + "/api/v1/tokens/" + address);
        if (response.status === 200) {
            let jsonData = await response.json()
            setName(jsonData?.name)
            setSymbol(jsonData?.symbol)
        }
    }

    useEffect(() => {
        fetchNameAndSymbolData()
    }, [address])

    useEffect(() => {
        fetchData(1, perPage);
    }, [perPage])

    const fetchData = async (page, per_page) => {
        fetch(`https://www.mecallapi.com/api/attractions?page=${page}&per_page=${per_page}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setData(result.data);
                    setTotalRows(result.total);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const handlePageChange = page => {
        fetchData(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    }

    useEffect(() => {
        let price = 0;
        let setPrice = false
        for (let token of allTokens) {
            if (token.id === address) {
                setPriceUSD(Number(token?.priceUsd))
                setIconPath(token?.icon)
                price = token?.priceUSD
                setPrice = true
            }
        }
        let liquidity = 0
        // for (let pair of allTokens) {
        //     if (address === pair.tokenA.id) {
        //         liquidity += pair.tokenA.priceUsd * pair.tokenReserveA / Math.pow(10, pair.tokenA.decimals)
        //     }
        //     if (address === pair.tokenB.id) {
        //         liquidity += pair.tokenB.priceUsd * pair.tokenReserveB / Math.pow(10, pair.tokenB.decimals)
        //     }
        // }

        // async function fetchData() {

        //     if (Number(price) === 0) return
        //     let response = await fetch(env.MIRROR_NODE_URL + "/api/v1/tokens/" + address);
        //     if (response.status === 200) {
        //       let jsonData = await response.json()
        //       let response1 = await fetch(env.MIRROR_NODE_URL + `/api/v1/tokens/${address}/balances?account.id=${jsonData?.treasury_account_id}`);
        //       if (response1.status === 200) {
        //         let jsonData1 = await response1.json()
        //         let balances = jsonData1?.balances
        //         let p = (Number(jsonData?.total_supply) - Number(balances[0]['balance'])) / Math.pow(10, Number(jsonData?.decimals)) * price
        //         setCirculatingSupply(p)
        //         p = (Number(jsonData?.total_supply)) / Math.pow(10, Number(jsonData?.decimals)) * price
        //         setDilutedSupply(p)
        //       }
        //     }
        //   }
        //   if(setPrice)
        //     fetchData()
    }, [address, allTokens])

    useEffect(() => {
        try {
            if (Number(priceChanges[address]) > 0) { setPriceChange('+' + Number(priceChanges[address]).toFixed(4) + '%'); setPriceChangeColor('green') }
            else { setPriceChange(Number(priceChanges[address]) + '%'); setPriceChangeColor('red') }
        } catch (e) {
            console.log(e)
        }
    }, [address, priceChanges])

    // switch to hourly data when switched to week window
    useEffect(() => {
        if (timeWindow === timeframeOptions.WEEK && prevWindow && prevWindow !== timeframeOptions.WEEK) {
            setFrequency(DATA_FREQUENCY.HOUR)
        }
    }, [prevWindow, timeWindow])

    // switch to daily data if switche to month or all time view
    useEffect(() => {
        if (timeWindow === timeframeOptions.MONTH && prevWindow && prevWindow !== timeframeOptions.MONTH) {
            setFrequency(DATA_FREQUENCY.DAY)
        }
        if (timeWindow === timeframeOptions.ALL_TIME && prevWindow && prevWindow !== timeframeOptions.ALL_TIME) {
            setFrequency(DATA_FREQUENCY.DAY)
        }
    }, [prevWindow, timeWindow])

    const LENGTH = below1080 ? 10 : 16
    const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

    const handleTimeRangeType = (type) => {
        if (timeRangeType !== type) setTimeRangeType(type)
    }

    const handleTableType = (type) => {
        if (tableType !== type) setTableType(type)
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
            width: 180
        },
        {
            name: <span className='font-weight-bold fs-16'>Price</span>,
            sortable: true,
            selector: (row) => {
                return (
                    <Link to={'/pairs/' + row.pair_address}>
                        <span className="text-white">{row.price ? '$' + row.price.toFixed(4) : ''}</span>
                    </Link>
                );
            },
            width: 120
        },
        {
            name: <span className='font-weight-bold fs-16'>{'% ' + TIME_RANGE_TYPE_NAME[timeRangeType]}</span>,
            sortable: true,
            selector: (row) => {
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
            width: 120
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
            selector: row => row.volume ? '$' + (row.volume / 400).toFixed(2) : '',
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'>Liquidity</span>,
            sortable: true,
            selector: row => row.liquidity ? '$' + calcUnit(parseInt(row.liquidity)) : '',
            width: 150
        },
        {
            name: <span className='font-weight-bold fs-16'>T.M.Cap.</span>,
            sortable: true,
            selector: row => row.cap ? ' $' + calcUnit(parseInt(row.cap)) : '-',
            width: 60
        },
        {
            name: <span className='font-weight-bold fs-16'>Actions</span>,
            sortable: true,
            selector: row => {
                return (
                    <div>
                        <i className="mdi mdi-binoculars fs-20"></i>
                        <i className="bx bxs-bar-chart-square fs-20" style={{ marginRight: 5, marginLeft: 5 }}></i>
                        <i className="bx bx-star fs-20"></i>
                    </div>
                )
            }
        },
    ];

    const holder_columns = [
        {
            name: <span className='font-weight-bold fs-16'>Address</span>,
            sortable: true,
            selector: (row) => {
                return (
                    <span>{row.address}</span>
                );
            },
            width: 120
        },
        {
            name: <span className='font-weight-bold fs-16'>Supply</span>,
            sortable: true,
            selector: (row) => {
                return (
                    <span>{row.supply}</span>
                );
            },
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'></span>,
            sortable: true,
            selector: (row) => {
                return (
                    <div style={{width: '100%', height:'2px', background:'white'}}></div>
                );
            },
            width: 250
        },
        {
            name: <span className='font-weight-bold fs-16'>Amount</span>,
            sortable: true,
            selector: (row) => {
                return (
                    <span>{row.amount}</span>
                );
            },
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'>Value</span>,
            sortable: true,
            selector: (row) => {
                return (
                    <span>{row.value}</span>
                );
            },
            width: 100
        },        
    ]

    // useEffect(() => {
    //     fetchData && fetchData({ pageIndex, pageSize });
    // }, [fetchData, pageIndex, pageSize]);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <ContentWrapper>
                        <RowBetween style={{ flexWrap: 'wrap', alingItems: 'start' }}>
                            <AutoRow align="flex-end" style={{ width: 'fit-content' }}>
                                <div style={{ fontWeight: 400, fontSize: 14, color: 'white' }}>
                                    <BasicLink to="/tokens">{'Tokens '}</BasicLink>→ {symbol}
                                </div>
                                <Link
                                    style={{ width: 'fit-content' }}
                                    color={'red'}
                                    external
                                    href={'https://hashscan.io/mainnet/token/' + address}
                                >
                                    <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                                        ({address.slice(0, 8) + '...' + address.slice(36, 42)})
                                    </Text>
                                </Link>
                            </AutoRow>
                            {!below600 && <Search display={"all"} small={true} />}
                        </RowBetween>
                        <WarningGrouping disabled={false}>
                            <DashboardWrapper style={{ marginTop: below1080 ? '0' : '0' }}>
                                <Row >
                                    <Col sm={12} md={6} style={{ alignItems: 'baseline' }}>
                                        <div className="d-flex">
                                            <TokenLogo path={iconPath} size="32px" style={{ alignSelf: 'center' }} />
                                            <div fontSize={below1080 ? '1.5rem' : '2rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                                                <RowFixed gap="6px">
                                                    <div style={{ marginRight: '6px', fontSize: 32, color: 'white' }} >{name}</div>{' '}
                                                    <span style={{ fontSize: 32, color: 'grey' }}>{formattedSymbol ? `(${formattedSymbol})` : ''}</span>
                                                </RowFixed>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <div className="d-flex flex-column items-end">
                                            <div className="d-flex items-center">
                                                <span style={{ marginRight: '1rem', fontSize: '32px', fontWeight: '500' }}>
                                                    {`$` + priceUSD}
                                                </span>
                                                <div className="d-flex flex-column justify-around">
                                                    <span style={{ color: priceChangeColor }}>{priceChange}</span>
                                                    <span style={{ color: priceChangeColor }}>{priceChange}</span>
                                                </div>

                                            </div>
                                            <Nav pills className="badge-bg">
                                                <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                    <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.five ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.five) }} >
                                                        <span className={timeRangeType == TIME_RANGE_TYPE.five ? "text-white badge" : "text-badge badge"}>5m</span>
                                                    </div>
                                                </NavItem>
                                                <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                    <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.hour ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.hour) }} >
                                                        <span className={timeRangeType == TIME_RANGE_TYPE.hour ? "text-white badge" : "text-badge badge"}>1h</span>
                                                    </div>
                                                </NavItem>
                                                <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                    <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.six ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.six) }} >
                                                        <span className={timeRangeType == TIME_RANGE_TYPE.six ? "text-white badge" : "text-badge badge"}>6h</span>
                                                    </div>
                                                </NavItem>
                                                <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                    <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.day ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.day) }} >
                                                        <span className={timeRangeType == TIME_RANGE_TYPE.day ? "text-white badge" : "text-badge badge"}>24h</span>
                                                    </div>
                                                </NavItem>
                                                <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                    <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.week ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.week) }} >
                                                        <span className={timeRangeType == TIME_RANGE_TYPE.week ? "text-white badge" : "text-badge badge"}>1W</span>
                                                    </div>
                                                </NavItem>
                                            </Nav>
                                            <div className="d-flex space-around">
                                                <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                    <span className="text-badge text-center">Txs</span>
                                                    <span className="text-white text-center">64</span>
                                                </div>
                                                <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                    <span className="text-badge text-center">Buys</span>
                                                    <span className="text-white text-center">64</span>
                                                </div>
                                                <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                    <span className="text-badge text-center">Sells</span>
                                                    <span className="text-white text-center">64</span>
                                                </div>
                                                <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                    <span className="text-badge text-center">Vol.</span>
                                                    <span className="text-white text-center">64</span>
                                                </div>
                                                <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                    <span className="text-badge text-center">% Var.</span>
                                                    <span className="text-red text-center">64</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                            </DashboardWrapper>
                        </WarningGrouping>
                        {/* <Row>
                            <Widgets address={address} price={priceUSD} />
                        </Row> */}
                        <Row>
                            {/* <TokenChart dataColors='["--vz-success", "--vz-danger"]' tokenId={address} /> */}
                            <Col sm={12} md={3}>
                                <div className="d-flex flex-column">
                                    <Card className="card-animate" style={{ border: '1px solid' }}>
                                        <CardBody>
                                            <div className="d-flex flex-column">
                                                <Row className="d-flex justify-between" >
                                                    <span className="w-auto">Total Liquidity:</span>
                                                    <span className="w-auto">{dailyVolume ? parseFloat(dailyVolume).toFixed(2) : 0}</span>
                                                </Row>
                                                <Row className="d-flex justify-between">
                                                    <span className="w-auto">24hr Volume:</span>
                                                    <span className="w-auto">{dailyVolume ? parseFloat(dailyVolume).toFixed(2) : 0}</span>
                                                </Row>
                                                <Row className="d-flex justify-between">
                                                    <span className="w-auto">Market Cap(Circulating):</span>
                                                    <span className="w-auto">{dailyVolume ? parseFloat(dailyVolume).toFixed(2) : 0}</span>
                                                </Row>
                                                <Row className="d-flex justify-between">
                                                    <span className="w-auto">Market Cap(Diluted):</span>
                                                    <span className="w-auto">{dailyVolume ? parseFloat(dailyVolume).toFixed(2) : 0}</span>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <TokenInfo address={address} tokenPrice={priceUSD} />
                                </div>

                            </Col>
                            <Col sm={12} md={9} style={{ marginBottom: '20px' }}>
                                <div className="d-flex flex-column">
                                    {below600 ? (
                                        <RowBetween mb={40}>
                                            <DropdownSelect options={CHART_VIEW} active={chartFilter} setActive={setChartFilter} color={'#ff007a'} />
                                            <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={'#ff007a'} />
                                        </RowBetween>
                                    ) : (
                                        <RowBetween
                                            // mb={
                                            //     chartFilter === CHART_VIEW.LIQUIDITY ||
                                            //         chartFilter === CHART_VIEW.VOLUME ||
                                            //         (chartFilter === CHART_VIEW.PRICE && frequency === DATA_FREQUENCY.LINE)
                                            //         ? 40
                                            //         : 0
                                            // }
                                            mb={20}
                                            align="flex-start"
                                        >
                                            <AutoRow justify="flex-start" gap="6px" align="flex-start">
                                                {/* <RowFixed> */}
                                                <OptionButton
                                                    active={chartFilter === CHART_VIEW.LIQUIDITY}
                                                    onClick={() => setChartFilter(CHART_VIEW.LIQUIDITY)}
                                                    style={{ marginRight: '6px' }}
                                                    className={chartFilter === CHART_VIEW.LIQUIDITY ? "green-bg" : ""}
                                                >
                                                    Liquidity
                                                </OptionButton>
                                                <OptionButton
                                                    active={chartFilter === CHART_VIEW.VOLUME}
                                                    onClick={() => setChartFilter(CHART_VIEW.VOLUME)}
                                                    style={{ marginRight: '6px' }}
                                                    className={chartFilter === CHART_VIEW.VOLUME ? "green-bg" : ""}
                                                >
                                                    Volume
                                                </OptionButton>
                                                <OptionButton
                                                    style={{ cursor: 'pointer' }}
                                                    active={chartFilter === CHART_VIEW.PRICE}
                                                    onClick={() => {
                                                        setChartFilter(CHART_VIEW.PRICE)
                                                    }}
                                                    className={chartFilter === CHART_VIEW.PRICE ? "green-bg" : ""}
                                                >
                                                    Price
                                                </OptionButton>
                                                {/* </RowFixed> */}
                                                {chartFilter === CHART_VIEW.PRICE && (
                                                    <>
                                                        <PriceOption
                                                            active={frequency === DATA_FREQUENCY.DAY}
                                                            onClick={() => {
                                                                setTimeWindow(timeframeOptions.MONTH)
                                                                setFrequency(DATA_FREQUENCY.DAY)
                                                            }}
                                                            style={frequency === DATA_FREQUENCY.DAY ? { background: "green" } : {}}
                                                        >
                                                            D
                                                        </PriceOption>
                                                        <PriceOption
                                                            active={frequency === DATA_FREQUENCY.HOUR}
                                                            onClick={() => setFrequency(DATA_FREQUENCY.HOUR)}
                                                            style={frequency === DATA_FREQUENCY.HOUR ? { background: "green" } : {}}
                                                        >
                                                            H
                                                        </PriceOption>
                                                        <PriceOption
                                                            active={frequency === DATA_FREQUENCY.LINE}
                                                            onClick={() => setFrequency(DATA_FREQUENCY.LINE)}
                                                            style={frequency === DATA_FREQUENCY.LINE ? { background: "green" } : {}}
                                                        >
                                                            <Activity size={18} />
                                                        </PriceOption>
                                                    </>
                                                )}
                                            </AutoRow>
                                            <AutoRow justify="flex-end" gap="6px" align="flex-start">
                                                <OptionButton
                                                    active={timeWindow === timeframeOptions.WEEK}
                                                    onClick={() => setTimeWindow(timeframeOptions.WEEK)}
                                                    className={timeWindow === timeframeOptions.WEEK ? "green-bg" : ""}
                                                >
                                                    1W
                                                </OptionButton>
                                                <OptionButton
                                                    active={timeWindow === timeframeOptions.MONTH}
                                                    onClick={() => setTimeWindow(timeframeOptions.MONTH)}
                                                    className={timeWindow === timeframeOptions.MONTH ? "green-bg" : ""}
                                                >
                                                    1M
                                                </OptionButton>
                                                <OptionButton
                                                    active={timeWindow === timeframeOptions.ALL_TIME}
                                                    onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
                                                    className={timeWindow === timeframeOptions.ALL_TIME ? "green-bg" : ""}
                                                >
                                                    All
                                                </OptionButton>
                                            </AutoRow>
                                        </RowBetween>
                                    )}
                                    <TokenChart address={address} color={'#ff007a'} base={priceUSD} priceData={priceData} chartFilter={chartFilter} timeWindow={timeWindow} frequency={frequency} />
                                    <div className="d-flex justify-start">
                                        <Nav pills className="badge-bg">
                                            <NavItem className="d-flex items-center justify-center" style={{ width: "6rem" }}>
                                                <div style={{ cursor: "pointer" }} className={tableType == TABLE_TYPE.trade ? "active badge-active-bg" : ""} onClick={() => { handleTableType(TABLE_TYPE.trade) }} >
                                                    <span className={tableType == TABLE_TYPE.trade ? "text-white badge" : "text-badge badge"}>Trade History</span>
                                                </div>
                                            </NavItem>
                                            <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                <div style={{ cursor: "pointer" }} className={tableType == TABLE_TYPE.holder ? "active badge-active-bg" : ""} onClick={() => { handleTableType(TABLE_TYPE.holder) }} >
                                                    <span className={tableType == TABLE_TYPE.holder ? "text-white badge" : "text-badge badge"}>Holders</span>
                                                </div>
                                            </NavItem>
                                        </Nav>
                                    </div>
                                    {tableType == TABLE_TYPE.trade && (error ? (<div>Error:{error.message}</div>) : (
                                        isLoaded ? (<div>Loading...</div>) : (

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
                                                paginationServer
                                                paginationTotalRows={totalRows}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                            />
                                        )
                                    ))}
                                    {tableType == TABLE_TYPE.holder && (
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
                                            columns={holder_columns}
                                            data={holders || []}
                                            pagination>

                                        </DataTable>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </ContentWrapper>
                </Container>
            </div>
        </React.Fragment>
    )
}


export default TokenPage;