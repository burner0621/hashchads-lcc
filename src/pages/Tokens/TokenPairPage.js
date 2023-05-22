import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components'
import { Col, Container, Row, Card, CardBody, CardHeader, Button } from "reactstrap";
// import PairChart from '../../components/PairChart'
import CountUp from "react-countup";
import { useMedia } from 'react-use'
import { Text } from 'rebass'
import { AlertCircle } from 'react-feather'
// import { useColor } from '../../hooks'
import { RowBetween, RowFixed, AutoRow } from '../../Components/Row'
import Link, { BasicLink } from '../../Components/Link'
import Search from '../../Components/Search'
import { useParams } from 'react-router-dom'
import { useAllPairsInSaucerswap, usePairWeeklyVolume, useHbarAndSaucePrice, usePairDailyVolume } from '../../contexts/GlobalData'
import fetch from 'cross-fetch'

import DoubleTokenLogo from "../../Components/DoubleLogo";
import TokenLogo from "../../Components/TokenLogo";
import PairChart from "../../Components/PairChart";
import { usePairData } from "../../contexts/PairData";
import { formattedNum } from "../../utils";
import DataTable from 'react-data-table-component';
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
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`
const WarningGrouping = styled.div`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`

const TRADING_TYPE = {
    sell: 'sell',
    buy: 'buy'
}

const TokenPair = () => {

    const { contractId } = useParams()
    const _allPairs = useAllPairsInSaucerswap()
    // const [pairData, setPairData] = useState({});
    const [totalLiquidityUsd, setTotalLiquidityUsd] = useState(0)
    const [totalLiquidityHbar, setTotalLiquidityHbar] = useState(0)
    const [dailyUsd, setDailyUsd] = useState(0)
    const [dailyHbar, setDailyHbar] = useState(0)
    const [weeklyUsd, setWeeklyUsd] = useState(0)
    const [weeklyHbar, setWeeklyHbar] = useState(0)
    const [tokenAReserve, setTokenAReserve] = useState(0)
    const [tokenBReserve, setTokenBReserve] = useState(0)
    const [symbolA, setSymbolA] = useState('')
    const [symbolB, setSymbolB] = useState('')
    const [iconA, setIconA] = useState()
    const [iconB, setIconB] = useState()
    const [lpReward, setLpReward] = useState(0)
    const [tokenIdA, setTokenIdA] = useState('')
    const [tokenIdB, setTokenIdB] = useState('')
    const _pairData = usePairData(contractId)
    const dailyVolumes = usePairDailyVolume()
    const weeklyVolumes = usePairWeeklyVolume()
    const weeklyData = usePairWeeklyVolume()
    const [hbarPrice, saucePrice] = useHbarAndSaucePrice()
    const [data, setData] = useState([])
    const [showCopyText, setShowCopyText] = useState(false)

    useEffect(() => {
        if (Object.keys(_pairData).length) {
            setTotalLiquidityUsd(_pairData.liquidityUsd)
            setTotalLiquidityHbar(_pairData.liquidity / 100000000)
            setTokenAReserve(_pairData.tokenReserveA / Math.pow(10, _pairData.tokenA.decimals))
            setTokenBReserve(_pairData.tokenReserveB / Math.pow(10, _pairData.tokenB.decimals))
            setIconA(_pairData.tokenA.icon)
            setIconB(_pairData.tokenB.icon)
            setSymbolA(_pairData.tokenA.symbol)
            setSymbolB(_pairData.tokenB.symbol)
            setTokenIdA(_pairData.tokenA.id)
            setTokenIdB(_pairData.tokenB.id)
        }
    }, [_pairData])

    useEffect(() => {
        if (dailyVolumes && Object.keys(dailyVolumes).length && Object.keys(_pairData).length) {
            setDailyHbar(dailyVolumes[_pairData.poolId])
            setDailyUsd(dailyVolumes[_pairData.poolId] * hbarPrice)
            setLpReward(dailyVolumes[_pairData.poolId] * hbarPrice * 365 / 4 / _pairData.liquidityUsd)
        }
    }, [dailyVolumes, _pairData, hbarPrice])

    useEffect(() => {
        if (weeklyVolumes && Object.keys(weeklyVolumes).length && Object.keys(_pairData).length) {
            setWeeklyHbar(weeklyVolumes[_pairData.poolId])
            setWeeklyUsd(weeklyVolumes[_pairData.poolId] * hbarPrice)
        }
    }, [weeklyVolumes, _pairData, hbarPrice])

    const below1080 = useMedia('(max-width: 1080px)')
    const below600 = useMedia('(max-width: 600px)')

    const handleCopyAddress = (e) => {
        
        document.execCommand('copy');
    }

    const name = symbolA + ' / ' + symbolB;
    const symbol = symbolA + ' / ' + symbolB;

    const calcUnit = (value) => {
        if (value < 1000) return value;
        else if (value < 1000000) return value / 1000 + 'K';
        else if (value < 1000000000) return value / 1000000 + 'M';
        else return value / 1000000000 + 'B'
    }

    const columns = [

        {
            name: <span className='font-weight-bold fs-16'>Date</span>,
            selector: row => {
                return (
                    <span className={row.type == TRADING_TYPE.buy ? "text-buy" : "text-sell"}>{row.date}</span>
                )
            },
            sortable: true,
            width: 180
        },
        {
            name: <span className='font-weight-bold fs-16'>Type</span>,
            sortable: true,
            selector: (row) => {
                return (
                    <span className={row.type == TRADING_TYPE.buy ? 'text-green' : 'text-red'}>{row.type}</span>
                );
            },
            width: 100
        },
        {
            name: <span className='font-weight-bold fs-16'>Price USD</span>,
            sortable: true,
            selector: row => row.price ? '$' + calcUnit(parseInt(row.price)) : '0',
            width: 150
        },
        {
            name: <span className='font-weight-bold fs-16'>Total</span>,
            sortable: true,
            selector: row => row.total ? '$' + calcUnit(parseInt(row.total)) : '0',
            width: 150
        },
        {
            name: <span className='font-weight-bold fs-16'>Price HBAR</span>,
            sortable: true,
            selector: row => row.hbar ? calcUnit(parseInt(row.hbar)) : '0',
            width: 150
        },
        {
            name: <span className='font-weight-bold fs-16'>Amount {_pairData?.tokenA?.symbol}</span>,
            sortable: true,
            selector: row => row.amount ? '$' + calcUnit(parseInt(row.amount)) : '0',
            width: 150
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginBottom: '20px' }}>
                <Container fluid>
                    <ContentWrapper>
                        <RowBetween style={{ flexWrap: 'wrap', alingItems: 'start' }}>
                            <AutoRow align="flex-end" style={{ width: 'fit-content' }}>
                                <div style={{ fontWeight: 400, fontSize: 14, color: 'white' }}>
                                    {/* <BasicLink to="/pairs">{'Pairs '}</BasicLink>/ <BasicLink href={"https://hashscan.io/mainnet/contract/" + pairData.contractId}>{symbol}<span style={{color: "green"}}>{"(" + pairData.contractId + ")"}</span></BasicLink> */}
                                </div>
                                <Link
                                    style={{ width: 'fit-content' }}
                                    color={'red'}
                                    external
                                    href={'https://hashscan.io/mainnet/contract/' + contractId}
                                >
                                    <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                                        {symbol}<span style={{ color: "green" }}>{"(" + contractId + ")"}</span>
                                    </Text>
                                </Link>
                            </AutoRow>
                            {!below600 && <Search display={"all"} small={true} />}
                        </RowBetween>
                        <WarningGrouping disabled={false}>
                            <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
                                <RowBetween
                                    style={{
                                        flexWrap: 'wrap',
                                        // marginBottom: '2rem',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <RowFixed style={{ flexWrap: 'wrap' }}>
                                        <RowFixed style={{ alignItems: 'baseline' }}>
                                            <   DoubleTokenLogo a0={iconA} a1={iconB} margin={true} style={{ width: 20 }} />
                                            {/* <TokenLogo path={iconPath} size="32px" style={{ alignSelf: 'center' }} /> */}
                                            <div fontSize={below1080 ? '1.5rem' : '2rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                                                <RowFixed gap="6px">
                                                    <div style={{ marginRight: '6px', fontSize: 32, color: 'white' }} >{name}</div>{' '}
                                                    <span style={{ fontSize: 32, color: 'grey' }}>{symbol ? `(${symbol})` : ''}</span>
                                                </RowFixed>
                                            </div>
                                            {/* {!below1080 && (
                                                <>
                                                    <div fontSize={'1.5rem'} fontWeight={500} style={{ marginRight: '1rem' }}>
                                                        {`$` + priceUSD}
                                                    </div>
                                                    <span style={{ color: priceChangeColor }}>{priceChange}</span>
                                                </>
                                            )} */}
                                        </RowFixed>
                                    </RowFixed>
                                </RowBetween>
                                <AutoRow align="flex-end" style={{ width: 'fit-content' }}>
                                    <Link
                                        style={{ width: 'fit-content' }}
                                        color={'grey'}
                                        external
                                    >
                                        <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                                            Token:{_pairData?.tokenA?.id}   Pair:{_pairData?.tokenB?.id}
                                        </Text>
                                    </Link>
                                </AutoRow>
                            </DashboardWrapper>
                        </WarningGrouping>
                        
                        <Row>
                            <Col xl={4} sm={12} >
                                <Card className="card-animate mb-0" style={{ border: '1px solid' }}>
                                    <CardBody>
                                        <div className="d-flex">
                                            <div className="flex-grow-1 w-full">
                                                <h6 className="text-muted mb-3 text-white">TVL</h6>
                                                <h2 className="mb-0">
                                                    $
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        <CountUp start={0} end={totalLiquidityUsd} duration={1} decimals={2} />
                                                    </span>

                                                </h2>
                                                <h2 className="mb-0">
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        (<CountUp start={0} end={totalLiquidityHbar} duration={1} decimals={2} /> HBAR)
                                                    </span>
                                                </h2>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl={4} sm={12} >
                                <Card className="card-animate mb-0" style={{ border: '1px solid', marginBottom: '0px !important' }}>
                                    <CardBody>
                                        <div className="d-flex">
                                            <div className="flex-grow-1 w-full">
                                                <h6 className="text-muted mb-3 text-white">24hr Volume</h6>
                                                <h2 className="mb-0">
                                                    $
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        <CountUp start={0} end={dailyUsd} duration={1} decimals={2} />
                                                    </span>
                                                </h2>
                                                <h2 className="mb-0">
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        (<CountUp start={0} end={dailyHbar} duration={1} decimals={2} /> HBAR)
                                                    </span>
                                                </h2>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl={4} sm={12} >
                                <Card className="card-animate mb-0" style={{ border: '1px solid', marginBottom: '0px !important' }}>
                                    <CardBody>
                                        <div className="d-flex">
                                            <div className="flex-grow-1 w-full">
                                                <h6 className="text-muted mb-3 text-white">7D Volume</h6>
                                                <h2 className="mb-0">
                                                    $
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        <CountUp start={0} end={weeklyUsd} duration={1} decimals={2} />
                                                    </span>
                                                </h2>
                                                <h2 className="mb-0">
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        (<CountUp start={0} end={weeklyHbar} duration={1} decimals={2} /> HBAR)
                                                    </span>
                                                </h2>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={4} sm={12} >
                                <Card className="card-animate mb-0" style={{ border: '1px solid', marginBottom: '0px !important' }}>
                                    <CardBody>
                                        <div className="d-flex">
                                            <div className="flex-grow-1 w-full">
                                                <h6 className="text-muted mb-3 text-white">Fees(25hrs)</h6>
                                                <h2 className="mb-0">
                                                    $
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        <CountUp start={0} end={dailyUsd / 400} duration={1} decimals={4} />
                                                    </span>
                                                </h2>
                                                <h2>
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        (<CountUp start={0} end={dailyHbar / 400} duration={1} decimals={4} /> HBAR)
                                                    </span>
                                                </h2>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl={4} sm={12} >
                                <Card className="card-animate mb-0" style={{ border: '1px solid', marginBottom: '0px !important' }}>
                                    <CardBody>
                                        <div className="d-flex">
                                            <div className="flex-grow-1 w-full">
                                                <h6 className="text-muted mb-3 text-white">LP Reward APR</h6>
                                                <h2 className="mb-0">
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        <CountUp start={0} end={lpReward} duration={1} decimals={4} />%
                                                    </span>
                                                </h2>
                                                <h2>
                                                    <span style={{ visibility: 'hidden' }}>23</span>
                                                </h2>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl={4} sm={12} >
                                <Card className="card-animate mb-0" style={{ border: '1px solid', marginBottom: '0px !important' }}>
                                    <CardBody>
                                        <div className="d-flex">
                                            <div className="flex-grow-1 w-full">
                                                <h6 className="text-muted mb-3 text-white">Pooled Tokens</h6>
                                                <h2 className="mb-0 d-flex flex-column">
                                                    <span className="counter-value d-flex" style={{ textOverflow: "ellipsis" }}>
                                                        <TokenLogo path={iconA} size="32px" style={{ alignSelf: 'center', marginRight: 5 }} ></TokenLogo>
                                                        <CountUp start={0} end={tokenAReserve} duration={3} decimals={2} /><span style={{ fontSize: 12, alignSelf: 'flex-end', marginLeft: 8 }}>{' ' + symbolA}</span>
                                                    </span>
                                                    <span className="counter-value d-flex" style={{ textOverflow: "ellipsis" }}>
                                                        <TokenLogo path={iconB} size="32px" style={{ alignSelf: 'center', marginRight: 5 }} ></TokenLogo>
                                                        <CountUp start={0} end={tokenBReserve} duration={3} decimals={2} /><span style={{ fontSize: 12, alignSelf: 'flex-end', marginLeft: 8 }}>{' ' + symbolB}</span>
                                                    </span>
                                                </h2>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={8} sm={12}>
                                {
                                    Object.keys(_pairData).length && Object.keys(weeklyData).length && hbarPrice &&
                                    <PairChart
                                        address={contractId}
                                        poolId={_pairData.poolId}
                                        pairData={_pairData}
                                        color={'#ff007a'}
                                        base0={tokenAReserve / tokenBReserve}
                                        base1={tokenBReserve / tokenAReserve}
                                    />}
                            </Col>

                            <Col xl={4} sm={12} >
                                <h1>Pool Information</h1>
                                <Card className="card-animate" style={{ border: '1px solid' }}>
                                    <CardBody>
                                        <div className="d-flex flex-column">
                                            <div className="flex-grow-1 w-full">
                                                <h4 className="text-muted mb-3 text-white">Pair Name</h4>
                                                <h2 className="mb-0">
                                                    <span className="counter-value" style={{ textOverflow: "ellipsis" }}>
                                                        {symbol}
                                                    </span>
                                                </h2>
                                            </div>
                                            <div className="flex-grow-1 w-full">
                                                <h4 className="text-muted mb-3 text-white">{symbolA} Address</h4>
                                                <h2 className="mb-0 d-flex items-center" onClick={(e) => handleCopyAddress(e)}>
                                                    {tokenIdA}<i className="mdi mdi-content-copy"></i>
                                                </h2>
                                            </div>
                                            <div className="flex-grow-1 w-full">
                                                <h4 className="text-muted mb-3 text-white">{symbolB} Address</h4>
                                                <h2 className="mb-0 d-flex items-center" onClick={(e) => handleCopyAddress(e)}>
                                                    {tokenIdB}<i className="mdi mdi-content-copy"></i>
                                                </h2>
                                            </div>
                                        </div>
                                        <Link
                                            style={{ width: 'fit-content' }}
                                            color={'green'}
                                            external
                                            href={'https://hashscan.io/mainnet/contract/' + contractId}
                                        >
                                            <Text className="text-green" style={{ marginLeft: '.15rem' }} fontSize={'24px'} fontWeight={400}>
                                                View on Hashscan<i className="mdi mdi-arrow-top-right-thin"></i>
                                            </Text>
                                        </Link>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
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
                        </Row>
                    </ContentWrapper>
                </Container>
            </div>
        </React.Fragment>
    )
}


export default TokenPair;