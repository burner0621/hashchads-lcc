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

import { localNumber, formattedNum } from '../../utils'

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
import { ImpulseSpinner } from "../../Components/Impulse";
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
    holder: 'holder',
    fee: 'fee'
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
    const [priceUSD, setPriceUSD] = useState(0)
    const [hbarPrice, setHbarPrice] = useState()
    const [priceChange, setPriceChange] = useState('')
    const [priceChangeColor, setPriceChangeColor] = useState('green')
    const [iconPath, setIconPath] = useState('')
    const [data, setData] = useState([])
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [timeRangeType, setTimeRangeType] = useState(TIME_RANGE_TYPE.week)
    const [tableType, setTableType] = useState(TABLE_TYPE.trade)
    const [holders, setHolders] = useState([])
    const [holderInfo, setHolderInfo] = useState([])
    const [pairs, setPairs] = useState([])

    const [totalLiquidity, setTotalLiquidity] = useState(0)
    const [dailyVolume, setDailyVolume] = useState(0)
    const [circulatingSupply, setCirculatingSupply] = useState(0)
    const [dilutedSupply, setDilutedSupply] = useState(0)
    const [tokenInfo, setTokenInfo] = useState(undefined)

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE)
    const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR)
    const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)

    const [statisticData, setStatisticData] = useState({})

    const prevWindow = usePrevious(timeWindow)

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

        fetchData(1, rowsPerPage);
    }, [rowsPerPage, address])

    const calculateSwapImpactUsd = (amount) => {
        let maxSwapImpact = 1
        for (let pair of pairs) {
            if (address !== pair.tokenA.id && address !== pair.tokenB.id) continue
            let swapImpact = 0
            let reserveA = Number(pair.tokenReserveA) / Math.pow(10, Number(pair.tokenA.decimals))
            let reserveB = Number(pair.tokenReserveB) / Math.pow(10, Number(pair.tokenB.decimals)) 

            if (address === pair.tokenA.id) {
                // deltaYUsd = reserveB * (1 - reserveA / (reserveA + amount)) * pair.tokenB.priceUsd
                swapImpact = 1 - Math.pow(reserveA / (reserveA + 0.997 * amount), 2)
            }
            if (address === pair.tokenB.id) {
                // deltaYUsd = reserveA * (1 - reserveB / (reserveB + amount)) * pair.tokenA.priceUsd
                swapImpact = 1 - Math.pow(reserveB / (reserveB + 0.997 * amount), 2)
            }
            if (maxSwapImpact > swapImpact) maxSwapImpact = swapImpact
        }

        return maxSwapImpact
    }

    useEffect(() => {
        const fetchTotalData = async () => {
            const response = await fetch(`https://api.saucerswap.finance/pools`)
            if (response.status === 200) {
                const jsonData = await response.json()
                setPairs(jsonData)
            }
        }
        if (pairs.length === 0) fetchTotalData();
    }, [pairs])

    useEffect(() => {
        async function fetchHolderData() {
            let t = parseInt(tokenInfo.total_supply / 30), limit = 30, e = tokenInfo.total_supply, s = 0
            let l = 0
            let jsonData = []
            while (l < 25 || (jsonData.links && jsonData.links?.next !== null)) {
                let response = await fetch(env.MIRROR_NODE_URL + `/api/v1/tokens/${address}/balances?account.balance=gt:${t}&order=desc&limit=${limit}`);
                if (response.status === 200) {
                    jsonData = await response.json()
                    l = jsonData.balances.length
                    if (l >= 25 && jsonData['links'].next === null) {
                        break
                    } else if (jsonData['links'].next) {
                        s = t
                        t = parseInt((s + e) / 2)
                    } else {
                        e = t
                        t = parseInt((s + e) / 2)
                    }
                }
            }
            setHolders(jsonData.balances)
        }
        if (address && tokenInfo)
            fetchHolderData()
    }, [address, tokenInfo])

    useEffect(() => {
        setIsLoaded(false)
    }, [data])

    useEffect(() => {
        if (holders.length > 0 && pairs.length > 0 && tokenInfo) {
            let totalBalance = tokenInfo.total_supply / Math.pow(10, Number(tokenInfo.decimals))
            let rlt = [], i = 1
            let pairContracts = pairs.map(item => item.contractId)
            let pairsByContract = {};
            for (let pair of pairs) {
                pairsByContract[pair.contractId] = pair
            }
            for (let holder of holders) {
                let tmp = {}
                tmp['accountId'] = holder.account
                tmp['lpToken'] = pairContracts.includes (holder.account) ? pairsByContract[holder.account]['lpToken']['symbol'] : undefined
                tmp['balance'] = holder.balance / Math.pow(10, Number(tokenInfo.decimals))
                tmp['percent'] = (tmp['balance'] / totalBalance * 100).toFixed(2)
                tmp['usd'] = (tmp['balance'] * priceUSD).toFixed(tokenInfo.decimals)
                // tmp['impactUsd'] = calculateSwapImpactUsd(tmp['balance'])
                // if (tmp['impactUsd'] > 0) {
                //     tmp['impactPercent'] = (100 - (tmp['impactUsd'] / tmp['usd'] * 100)).toFixed(2)
                //     if (tmp['impactPercent'] > 100) tmp['impactPercent'] = 100
                // }
                // else tmp['impactPercent'] = "0"
                tmp['impactPercent'] = (100 * calculateSwapImpactUsd(tmp['balance'])).toFixed (2)
                // if (holder.account === "0.0.285576") tmp['impactPercent'] = 100 * calculateSwapImpactUsd(tmp['balance'])
                // else tmp['impactPercent'] = 0
                tmp['impactUsd'] = tmp['usd'] * tmp['impactPercent'] / 100
                tmp['actualUsd'] = tmp['usd'] - tmp['impactUsd']
                if (tmp['actualUsd'] < 0) tmp['actualUsd'] = 0
                rlt.push(tmp)
            }
            rlt = rlt.sort((a, b) => {
                return a.balance > b.balance ? -1 : 1
            }).map((item, idx) => {
                item['no'] = idx + 1;
                return item
            })
            setHolderInfo(rlt)
        }
    }, [holders, pairs, tokenInfo, priceUSD])

    const fetchData = async (pageNum, per_page) => {
        setIsLoaded(true);
        fetch(`${env.BASE_URL}/api/transaction/get?tokenId=${address}&pageNum=${pageNum}&pageSize=${per_page}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setData(result.data);
                    setCurrentPage(pageNum);
                    setTotalRows(result.count);
                },
                (error) => {
                    setData([]);
                    setError(error);
                }
            )
    }

    const fetchStatisticData = async (timeRangeType) => {
        
        fetch(`${env.BASE_URL}/api/transaction/getStatistic?tokenId=${address}&timeRangeType=${timeRangeType}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setStatisticData(result);
                },
                (error) => {
                    console.log('fetchStatisticData error', error)
                }
            )
    }

    const handlePageChange = (page, totalRows) => {
        fetchData(page, rowsPerPage);
        // setCurrentPage(page)
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setRowsPerPage(newPerPage);
    }

    useEffect(() => {
        let tmpDailyVolue = tokenDailyVolume !== undefined ? (tokenDailyVolume[address] !== undefined ? tokenDailyVolume[address] : 0) : 0
        setDailyVolume(tmpDailyVolue * hbarPrice)
    }, [address, tokenDailyVolume, hbarPrice])

    useEffect(() => {
        const fetchTotalData = async () => {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd`)
                if (response.status === 200) {
                    const jsonData = await response.json()
                    setHbarPrice(jsonData["hedera-hashgraph"]["usd"])
                }
            } catch (e) {
                console.error("https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd", e);
            }
        }
        if (hbarPrice === undefined || hbarPrice === 0) fetchTotalData()
    }, [hbarPrice])

    useEffect(() => {
        const fetchTotalData = async () => {
            const response = await fetch(`https://api.saucerswap.finance/tokens/prices/latest/${address}?interval=DAY`)
            if (response.status === 200) {
                const jsonData = await response.json()
                setTotalLiquidity(jsonData.liquidityUsd)
                setPriceUSD(jsonData.closeUsd)
            }
        }
        if (totalLiquidity === undefined || totalLiquidity === 0) fetchTotalData()
        if (priceUSD === undefined || priceUSD === 0) fetchTotalData()
    }, [address, totalLiquidity, priceUSD])

    useEffect(() => {
        async function fetchTokenData() {
            let response = await fetch(env.MIRROR_NODE_URL + "/api/v1/tokens/" + address);
            if (response.status === 200) {
                let jsonData = await response.json()
                let response1 = await fetch(env.MIRROR_NODE_URL + `/api/v1/tokens/${address}/balances?account.id=${jsonData?.treasury_account_id}`);
                if (response1.status === 200) {
                    setTokenInfo(jsonData)
                    let jsonData1 = await response1.json()
                    let balances = jsonData1?.balances
                    let p = (Number(jsonData?.total_supply) - Number(balances[0]['balance'])) / Math.pow(10, Number(jsonData?.decimals)) * priceUSD
                    setCirculatingSupply(p)
                    p = (Number(jsonData?.total_supply)) / Math.pow(10, Number(jsonData?.decimals)) * priceUSD
                    setDilutedSupply(p)
                }
            }
        }
        if (priceUSD > 0 && address) fetchTokenData()
    }, [address, priceUSD])

    useEffect(() => {
        for (let token of allTokens) {
            if (token.id === address) {
                setIconPath(token?.icon)
            }
        }
        //   if(setPrice)
        //     fetchData()
    }, [address, allTokens])

    useEffect(() => {
        try {
            if (Number(priceChanges[address]) > 0) { setPriceChange('+' + Math.abs(Number(priceChanges[address])).toFixed(4) + '%'); setPriceChangeColor('green') }
            else { setPriceChange(Math.abs(Number(priceChanges[address])).toFixed(4) + '%'); setPriceChangeColor('red') }
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
            name: <span className='font-weight-bold fs-16'>Date</span>,
            sortField: 'timestamp',
            cell: row => {

                return (
                    row.state === 'buy' ? <span className="text-buy text-buy-date">{(new Date(row.timestamp * 1000)).toLocaleString("en-US")}</span> :
                        <span className="text-sell text-sell-date">{(new Date(row.timestamp * 1000)).toLocaleString("en-US")}</span>
                )
            },
            sortable: true,
            width: 180
        },
        {
            name: <span className='font-weight-bold fs-16'>Type</span>,
            sortable: true,
            cell: (row) => {
                return (
                    row.state === 'buy' ? <span className="text-green">{row.state}</span> :
                        <span className="text-red">{row.state}</span>
                );
            },
            width: 70
        },
        {
            name: <span className='font-weight-bold fs-16'>Amount</span>,
            sortable: true,
            cell: (row) => {
                return (
                    row.state === 'buy' ? <span className="text-buy">{Math.abs(row.amount)}</span> :
                        <span className="text-sell">{Math.abs(row.amount)}</span>
                )
            },
            width: 150
        },
        {
            name: <span className='font-weight-bold fs-16'>Maker</span>,
            cell: (row) => {
                return (
                    row.state === 'buy' ? <span className="text-buy">{row.accountId}</span> :
                        <span className="text-sell">{row.accountId}</span>
                )
            },
            sortable: true,
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'>Pool</span>,
            cell: (row) => {
                return (
                    row.state === 'buy' ? <span className="text-buy">{row.poolId}</span> :
                        <span className="text-sell">{row.poolId}</span>
                )
            },
            sortable: true,
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'>TXID</span>,
            sortable: true,
            cell: (row) => {
                return (
                    <Link
                        style={{ width: 'fit-content' }}
                        color={'#00b8d8'}
                        external
                        href={'https://hashscan.io/mainnet/transactionsById/' + row.transactionId}
                    >
                        <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                            ({row.transactionId})
                        </Text>
                    </Link>
                )
            },
            width: 200
        },
    ];

    const holder_columns = [
        {
            name: <span className='font-weight-bold fs-16'>RANK</span>,
            sortable: true,
            cell: (row) => {
                return (
                    <span className="text-center">{row.no}</span>
                );
            },
            width: 80
        },
        {
            name: <span className='font-weight-bold fs-16'>Account ID</span>,
            sortable: true,
            cell: (row) => {
                return (
                    <span>{row.lpToken ? ">> " + row.accountId + " <<\n[LP]" + row.lpToken : row.accountId}
                    </span>
                );
            },
            width: 170
        },
        {
            name: <span className='font-weight-bold fs-16'>BALANCE</span>,
            sortable: true,
            cell: (row) => {
                return (
                    <span>{formattedNum(row.balance, false)}</span>
                );
            },
            width: 110
        },
        {
            name: <span className='font-weight-bold fs-16'>PERCENT</span>,
            sortable: true,
            cell: (row) => {
                return (
                    // <div style={{ width: '100%', height: '2px', background: 'white' }}>{row.percent + '%'}</div>
                    <span>{row.percent + '%'}</span>
                );
            },
            width: 110
        },
        {
            name: <span className='font-weight-bold fs-16'>USD</span>,
            sortable: true,
            cell: (row) => {
                return (
                    <span>{formattedNum(row.usd, true)}</span>
                );
            },
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'>SWAP IMPACT</span>,
            sortable: true,
            cell: (row) => {
                return (
                    <span>{row.impactPercent + '%'}</span>
                );
            },
            width: 160
        },
        {
            name: <span className='font-weight-bold fs-16'>ACTUAL USD</span>,
            sortable: true,
            cell: (row) => {
                return (
                    <span>{formattedNum(row.actualUsd, true)}</span>
                );
            },
            width: 160
        },
    ]

    const fee_columns = [

        {
            name: <span className='font-weight-bold fs-13'>Fractional Fee</span>,
            selector: row => ((row.amount.numerator / row.amount.denominator * 100) + '%') || '',
            sortable: true,
            width: 150
        },
        {
            name: <span className='font-weight-bold fs-13'>Fee Currency</span>,
            sortable: true,
            selector: (cell) => {
                return (
                    <div className='d-flex'>
                        <span>{cell.denominating_token_id} </span>
                        <span className='text-symbol'>{'[' + tokenInfo.name + ']'}</span>
                    </div>
                );
            },
            width: 180,
        },
        {
            name: <span className='font-weight-bold fs-13'>Collector Account</span>,
            selector: row => row.collector_account_id,
            sortable: true,
            width: 120,
        },
        {
            name: <span className='font-weight-bold fs-13'>Min</span>,
            selector: row => row.minimum,
            sortable: true,
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-13'>Max</span>,
            selector: row => row.max ? row.max : 'none',
            sortable: true,
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-13'>Net</span>,
            sortable: true,
            selector: row => row.denominating_token_id,
            width: 100
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <ContentWrapper>
                        <div className="d-flex flex-column new-bg br-10" style={{ padding: '15px' }}>
                            <RowBetween style={{ flexWrap: 'wrap', alingItems: 'start', marginBottom: '1rem' }}>
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
                                            <div className="d-flex flex-column">
                                                <div className="d-flex">
                                                    <TokenLogo path={iconPath} size="32px" style={{ alignSelf: 'center' }} />
                                                    <div fontSize={below1080 ? '1.5rem' : '2rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                                                        <RowFixed gap="6px">
                                                            <div style={{ marginRight: '6px', fontSize: 32, color: 'white' }} >{name}</div>{' '}
                                                            <span style={{ fontSize: 32, color: 'grey' }}>{formattedSymbol ? `(${formattedSymbol})` : ''}</span>
                                                        </RowFixed>
                                                    </div>
                                                </div>
                                                <div className="d-flex items-center">
                                                    <span style={{ marginRight: '1rem', fontSize: '32px', fontWeight: '500' }}>
                                                        {`$` + priceUSD.toFixed(8)}
                                                    </span>
                                                    <div className="d-flex flex-column self-end mb-10">
                                                        {/* <span style={{ color: priceChangeColor }}>{priceChange}</span> */}
                                                        <span style={{ color: priceChangeColor }}>
                                                            {
                                                                priceChangeColor === 'green' &&
                                                                <app-icon _ngcontent-qmb-c89="" name="arrowUp" class="ng-tns-c89-8" _nghost-qmb-c2="">
                                                                    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" viewBox="0 0 20 15" width="14" transform=""><path d="M16.0312 2.49999H13.75C13.109 2.49999 12.5806 2.01745 12.5084 1.39577L12.5 1.25C12.5 0.608954 12.9826 0.0806158 13.6042 0.0084096L13.75 0H18.75L18.793 0.000692605C18.8251 0.00177866 18.8573 0.00410228 18.8894 0.00766991L18.75 0C18.8172 0 18.8832 0.0053031 18.9475 0.0155139C18.9722 0.0194401 18.9972 0.0241854 19.022 0.0297021L19.0366 0.0330132L19.0962 0.0485783C19.1212 0.0557812 19.1461 0.0637897 19.1708 0.0726061C19.3111 0.122685 19.4402 0.19745 19.5525 0.291591C19.5562 0.294733 19.5599 0.297819 19.5635 0.300929L19.5816 0.316754C19.6116 0.343469 19.6402 0.371604 19.6675 0.401055L19.5635 0.300929C19.6084 0.339449 19.65 0.380466 19.688 0.423601C19.7132 0.452273 19.7373 0.482345 19.7601 0.51351C19.7675 0.523392 19.7747 0.533435 19.7816 0.543562C19.8012 0.57242 19.8197 0.601934 19.8369 0.632241C19.8454 0.646939 19.8536 0.662048 19.8614 0.677292C19.874 0.70181 19.8859 0.726766 19.8969 0.75216C19.9053 0.77163 19.9131 0.791011 19.9204 0.810547C19.9323 0.841821 19.9429 0.873831 19.9522 0.906383C19.9554 0.918355 19.9585 0.930116 19.9615 0.941916C19.9751 0.994628 19.9852 1.04887 19.9916 1.10422L20 1.25V6.24999C20 6.94034 19.4403 7.49998 18.75 7.49998C18.1089 7.49998 17.5806 7.01743 17.5084 6.39576L17.5 6.24999L17.5 4.62749L12.1991 10.8135C11.7591 11.3268 10.9997 11.3914 10.4812 10.9858L10.3661 10.8839L7.58377 8.10248L2.2103 14.5502C1.80235 15.0397 1.09936 15.1385 0.57649 14.8031L0.4498 14.7102C-0.0397492 14.3023 -0.138462 13.5993 0.196857 13.0764L0.289754 12.9497L6.53974 5.44976C6.97669 4.92542 7.74412 4.85457 8.26767 5.26327L8.3839 5.36611L11.1788 8.15998L16.0312 2.49999Z" fill="currentColor"></path></svg>
                                                                </app-icon>
                                                            }
                                                            {
                                                                priceChangeColor === 'red' &&
                                                                <app-icon _ngcontent-qmb-c89="" name="arrowDown" class="ng-tns-c89-8" >
                                                                    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" viewBox="0 0 20 15" width="14" transform=""><path d="M16.0312 12.5H13.75C13.109 12.5 12.5806 12.9826 12.5084 13.6042L12.5 13.75C12.5 14.391 12.9826 14.9194 13.6042 14.9916L13.75 15H18.75L18.793 14.9993C18.8251 14.9982 18.8573 14.9959 18.8894 14.9923L18.75 15C18.8172 15 18.8832 14.9947 18.9475 14.9845C18.9722 14.9806 18.9972 14.9758 19.022 14.9703L19.0366 14.967L19.0962 14.9514C19.1212 14.9442 19.1461 14.9362 19.1708 14.9274C19.3111 14.8773 19.4402 14.8025 19.5525 14.7084C19.5562 14.7053 19.5599 14.7022 19.5635 14.6991L19.5816 14.6832C19.6116 14.6565 19.6402 14.6284 19.6675 14.5989L19.5635 14.6991C19.6084 14.6606 19.65 14.6195 19.688 14.5764C19.7132 14.5477 19.7373 14.5177 19.7601 14.4865C19.7675 14.4766 19.7747 14.4666 19.7816 14.4564C19.8012 14.4276 19.8197 14.3981 19.8369 14.3678C19.8454 14.3531 19.8536 14.338 19.8614 14.3227C19.874 14.2982 19.8859 14.2732 19.8969 14.2478C19.9053 14.2284 19.9131 14.209 19.9204 14.1895C19.9323 14.1582 19.9429 14.1262 19.9522 14.0936C19.9554 14.0816 19.9585 14.0699 19.9615 14.0581C19.9751 14.0054 19.9852 13.9511 19.9916 13.8958L20 13.75V8.75001C20 8.05966 19.4403 7.50002 18.75 7.50002C18.1089 7.50002 17.5806 7.98257 17.5084 8.60424L17.5 8.75001L17.5 10.3725L12.1991 4.18653C11.7591 3.67318 10.9997 3.60856 10.4812 4.01418L10.3661 4.11614L7.58377 6.89752L2.2103 0.4498C1.80235 -0.0397492 1.09936 -0.138462 0.57649 0.196858L0.4498 0.289755C-0.0397492 0.697713 -0.138462 1.4007 0.196857 1.92357L0.289754 2.05026L6.53974 9.55024C6.97669 10.0746 7.74412 10.1454 8.26767 9.73673L8.3839 9.63389L11.1788 6.84002L16.0312 12.5Z" fill="currentColor"></path></svg>
                                                                </app-icon>
                                                            }
                                                            {priceChange}
                                                        </span>
                                                    </div>

                                                </div>
                                            </div>

                                        </Col>
                                        <Col sm={12} md={6}>
                                            <div className="d-flex flex-column items-end">

                                                <Nav pills className="badge-bg">
                                                    <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                        <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.five ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.five) }} >
                                                            <span className={timeRangeType === TIME_RANGE_TYPE.five ? "text-white badge" : "text-badge badge"}>5m</span>
                                                        </div>
                                                    </NavItem>
                                                    <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                        <div style={{ cursor: "pointer" }} className={timeRangeType == TIME_RANGE_TYPE.hour ? "active badge-active-bg" : ""} onClick={() => { handleTimeRangeType(TIME_RANGE_TYPE.hour) }} >
                                                            <span className={timeRangeType === TIME_RANGE_TYPE.hour ? "text-white badge" : "text-badge badge"}>1h</span>
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
                                                        <span className="text-white text-center">{statisticData?.txs}</span>
                                                    </div>
                                                    <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                        <span className="text-badge text-center">Buys</span>
                                                        <span className="text-white text-center">{statisticData?.buys}</span>
                                                    </div>
                                                    <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                        <span className="text-badge text-center">Sells</span>
                                                        <span className="text-white text-center">{statisticData?.sells}</span>
                                                    </div>
                                                    <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                        <span className="text-badge text-center">Vol.</span>
                                                        <span className="text-white text-center">{statisticData?.vol}</span>
                                                    </div>
                                                    {/* <div className="d-flex flex-column" style={{ width: "4rem" }}>
                                                        <span className="text-badge text-center">% Var.</span>
                                                        <span className="text-red text-center">64</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                </DashboardWrapper>
                            </WarningGrouping>
                        </div>
                        {/* <Row>
                            <Widgets address={address} price={priceUSD} />
                        </Row> */}
                        <Row>
                            {/* <TokenChart dataColors='["--vz-success", "--vz-danger"]' tokenId={address} /> */}
                            <Col sm={12} md={3}>
                                <div className="d-flex flex-column">
                                    <Card className="card-animate bg-blue-black border-radius-10" style={{ maxWidth: 300 }}>
                                        <CardBody>
                                            <div className="d-flex flex-column">
                                                <Row className="d-flex justify-between mb-10" >
                                                    <span className="w-auto fw-450 fc-white">Total Liquidity:</span>
                                                    <span className="w-auto fw-450 fc-white">{formattedNum(totalLiquidity ? parseFloat(totalLiquidity).toFixed(2) : 0, true)}</span>
                                                </Row>
                                                <Row className="d-flex justify-between mb-10">
                                                    <span className="w-auto fw-450 fc-white">24hr Volume:</span>
                                                    <span className="w-auto fw-450 fc-white">{formattedNum(dailyVolume ? parseFloat(dailyVolume).toFixed(2) : 0, true)}</span>
                                                </Row>
                                                <Row className="d-flex justify-between mb-10">
                                                    <span className="w-auto fw-450 fc-white">Market Cap(Circulating):</span>
                                                    <span className="w-auto fw-450 fc-white">{formattedNum(circulatingSupply ? parseFloat(circulatingSupply).toFixed(2) : 0, true)}</span>
                                                </Row>
                                                <Row className="d-flex justify-between mb-10">
                                                    <span className="w-auto fw-450 fc-white">Market Cap(Diluted):</span>
                                                    <span className="w-auto fw-450 fc-white">{formattedNum(dilutedSupply ? parseFloat(dilutedSupply).toFixed(2) : 0, true)}</span>
                                                </Row>
                                                <Row className="d-flex justify-between mb-10">
                                                    <span className="w-auto fw-450 fc-white">Treasury:</span>
                                                    <span className="w-auto fw-450 fc-white">{tokenInfo ? tokenInfo?.treasury_account_id : ''}</span>
                                                </Row>
                                                <Row className="d-flex justify-between mb-10">
                                                    <span className="w-auto fw-450 fc-white">Max Supply:</span>
                                                    <span className="w-auto fw-450 fc-white">{formattedNum(tokenInfo ? (tokenInfo?.total_supply / Math.pow(10, tokenInfo?.decimals)).toFixed(4) : '0')}</span>
                                                </Row>
                                                <Row className="d-flex justify-between mb-10">
                                                    <span className="w-auto fw-450 fc-white">Total Supply:</span>
                                                    <span className="w-auto fw-450 fc-white">{formattedNum(tokenInfo ? (tokenInfo?.total_supply / Math.pow(10, tokenInfo?.decimals)).toFixed(4) : '0')}</span>
                                                </Row>
                                                <Row className="d-flex justify-between mb-10">
                                                    <span className="w-auto fw-450 fc-white">Supply Type:</span>
                                                    <span className="w-auto fw-450 fc-white">{tokenInfo ? tokenInfo?.supply_type : ''}</span>
                                                </Row>
                                                {
                                                    tokenInfo && tokenInfo.supply_key && tokenInfo.supply_key.key &&
                                                    <Row className="d-flex justify-between mb-10">
                                                        <span className="w-auto fw-450 fc-white">Supply Key:</span>
                                                        <span className="w-auto fw-450 fc-white">{tokenInfo?.supply_key?.key}</span>
                                                    </Row>
                                                }
                                                {
                                                    tokenInfo && tokenInfo.freeze_key && tokenInfo.freeze_key.key &&
                                                    <Row className="d-flex justify-between mb-10">
                                                        <span className="w-auto fw-450 fc-white">Freeze Key:</span>
                                                        <span className="w-auto fw-450 fc-white">{tokenInfo?.freeze_key?.key}</span>
                                                    </Row>
                                                }
                                                {
                                                    tokenInfo && tokenInfo.pause_key && tokenInfo.pause_key.key &&
                                                    <Row className="d-flex justify-between mb-10">
                                                        <span className="w-auto fw-450 fc-white">Pause Key:</span>
                                                        <span className="w-auto fw-450 fc-white">{tokenInfo?.pause_key?.key}</span>
                                                    </Row>
                                                }
                                                {
                                                    tokenInfo && tokenInfo.wipe_key && tokenInfo.wipe_key.key &&
                                                    <Row className="d-flex justify-between mb-10">
                                                        <span className="w-auto fw-450 fc-white">Wipe Key:</span>
                                                        <span className="w-auto fw-450 fc-white">{tokenInfo?.wipe_key?.key}</span>
                                                    </Row>
                                                }
                                                {
                                                    tokenInfo && tokenInfo.admin_key && tokenInfo.admin_key.key &&
                                                    <Row className="d-flex justify-between mb-10">
                                                        <span className="w-auto fw-450 fc-white">Admin Key:</span>
                                                        <span className="w-auto fw-450 fc-white">{tokenInfo?.admin_key?.key}</span>
                                                    </Row>
                                                }
                                                {
                                                    tokenInfo &&
                                                    <Row className="d-flex justify-between mb-10">
                                                        <span className="w-auto fw-450 fc-white">Created:</span>
                                                        <span className="w-auto fw-450 fc-white">{(new Date(Number(tokenInfo?.created_timestamp) * 1000)).toLocaleString("en-US")}</span>
                                                    </Row>
                                                }
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>

                            </Col>
                            <Col sm={12} md={9} style={{ marginBottom: '20px' }}>
                                <div className="d-flex flex-column new-bg br-10" style={{ padding: '15px' }}>
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
                                    <TokenChart address={address} color={'#ff007a'} base={priceUSD} priceData={priceData} chartFilter={chartFilter} timeWindow={timeWindow} frequency={frequency} symbol={symbol} />
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
                                            {tokenInfo && tokenInfo.custom_fees && tokenInfo.custom_fees.fractional_fees && tokenInfo.custom_fees.fractional_fees.length > 0 && (
                                                <NavItem className="d-flex items-center justify-center" style={{ width: "4rem" }}>
                                                    <div style={{ cursor: "pointer" }} className={tableType == TABLE_TYPE.fee ? "active badge-active-bg" : ""} onClick={() => { handleTableType(TABLE_TYPE.fee) }} >
                                                        <span className={tableType == TABLE_TYPE.fee ? "text-white badge" : "text-badge badge"}>Fees</span>
                                                    </div>
                                                </NavItem>
                                            )}
                                        </Nav>
                                    </div>
                                    {tableType === TABLE_TYPE.trade && (error ? (<div>Error:{error.message}</div>) : (
                                        // isLoaded ? (<div>Loading...</div>) : (
                                        <>
                                            <div className={isLoaded ? "visible d-flex w-full items-center justify-center" : "hidden d-flex w-full items-center justify-center"}>
                                                <ImpulseSpinner />
                                            </div>

                                            <DataTable
                                                className={isLoaded ? "height-50 hidden" : "visible"}
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
                                                currentPage={currentPage}
                                                rowsPerPage={rowsPerPage}
                                            />
                                        </>
                                        // )
                                    ))}
                                    {tableType === TABLE_TYPE.holder && (
                                        <>
                                            {
                                                holderInfo && holderInfo.length > 0 ?
                                                    (<DataTable
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
                                                        data={holderInfo || []}
                                                        pagination>

                                                    </DataTable>) :
                                                    (
                                                        <div className="visible d-flex w-full items-center justify-center">
                                                            <ImpulseSpinner />
                                                        </div>
                                                    )
                                            }
                                        </>
                                    )}
                                    {tableType == TABLE_TYPE.fee && (
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
                                            columns={fee_columns}
                                            data={tokenInfo && tokenInfo.custom_fees && tokenInfo.custom_fees.fractional_fees || []}
                                            pagination
                                        />
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