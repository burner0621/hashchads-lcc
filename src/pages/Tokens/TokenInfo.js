import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, Modal } from 'reactstrap';
import DataTable from 'react-data-table-component';
import classnames from 'classnames';
import fetch from 'cross-fetch'
import { useAllPairsInSaucerswap } from '../../contexts/GlobalData'
import * as env from "../../env"
import { formattedNum } from '../../utils'

const TokenInfo = ({ address, tokenPrice }) => {
    //Tab 
    const [activeTab, setActiveTab] = useState('1');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const allPairs = useAllPairsInSaucerswap()

    const [tokenInfo, setTokenInfo] = useState();
    const [createdAt, setCreatedAt] = useState('')
    const [feeCreatedAt, setFeeCreatedAt] = useState('')
    const [supplyKey, setSupplyKey] = useState('')
    const [freezeKey, setFreezeKey] = useState('')
    const [pauseKey, setPauseKey] = useState('')
    const [wipeKey, setWipeKey] = useState('')
    const [adminKey, setAdminKey] = useState('')
    const [decimals, setDecimals] = useState(undefined)
    const [holders, setHolders] = useState([])
    const [totalSupply, setTotalSupply] = useState(undefined)
    const [holderInfo, setHolderInfo] = useState([])
    const [pairs, setPairs] = useState([])

    let totalBalance = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let tmpPairs = []

    useEffect(() => {
        if (allPairs) {
            for (let i = 0; i < allPairs.length; i++) {
                let pair = allPairs[i];
                if (address && address === pair.tokenA.id) tmpPairs.push(pair)
                if (address && address === pair.tokenB.id) tmpPairs.push(pair)
            }
            if (tmpPairs.length > 0) setPairs(tmpPairs)
        }
    }, [allPairs, address])

    const [modal_xlarge, setmodal_xlarge] = useState(false);
    const [detail_modal_xlarge, setdetailmodal] = useState(false)

    const [hoderData, setHolderData] = useState([])

    function tog_xlarge() {
        setmodal_xlarge(!modal_xlarge);
    }

    function detail_tog_xlarge() {
        setdetailmodal(!detail_modal_xlarge)
    }
    useEffect(() => {
        async function fetchData() {
            let response = await fetch(env.MIRROR_NODE_URL + "/api/v1/tokens/" + address);
            if (response.status === 200) {
                let jsonData = await response.json()
                setTokenInfo(jsonData)
                setTotalSupply(jsonData?.total_supply)
            }
        }
        if (address && (tokenInfo === undefined || totalSupply === undefined))
            fetchData()
    }, [address, tokenInfo, totalSupply])

    const formatString = (str) => {
        if (str === undefined) return ''
        if (str.length === 0) return ''
        return str.slice(0, 5) + "..." + str.slice(-5);
    }

    useEffect(() => {
        if (tokenInfo && Object.keys(tokenInfo).length > 0) {
            var theDate = new Date(Number(tokenInfo?.created_timestamp) * 1000)
            setCreatedAt(theDate.toGMTString())
            setSupplyKey(formatString(tokenInfo?.supply_key?.key))
            setFreezeKey(formatString(tokenInfo?.freeze_key?.key))
            setPauseKey(formatString(tokenInfo?.pause_key?.key))
            setWipeKey(formatString(tokenInfo?.wipe_key?.key))
            setAdminKey(formatString(tokenInfo?.admin_key?.key))
            setDecimals(tokenInfo?.decimals)
            if (tokenInfo?.custom_fees && tokenInfo?.custom_fees?.created_timestamp) {
                theDate = new Date(Number(tokenInfo?.custom_fees?.created_timestamp) * 1000)
                setFeeCreatedAt(theDate.toGMTString())
            }
        }
    }, [tokenInfo])

    useEffect(() => {
        async function fetchData() {
            let t = parseInt(totalSupply / 30 * Math.pow(10, Number(decimals))), limit = 30, e = totalSupply * Math.pow(10, Number(decimals)), s = 0
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
        if (address && totalSupply && decimals)
            fetchData()
    }, [address, totalSupply, decimals])

    const calculateSwapImpactUsd = (amount) => {
        let maxSwapImpactUsd = 0
        for (let pair of pairs) {
            let deltaYUsd = 0
            let reserveA = Number(pair.tokenReserveA) / Math.pow(10, Number(pair.tokenA.decimals))
            let reserveB = Number(pair.tokenReserveB) / Math.pow(10, Number(pair.tokenB.decimals))

            if (address === pair.tokenA.id) {
                deltaYUsd = reserveB * (1 - reserveA / (reserveA + amount)) * pair.tokenB.priceUsd
            }
            if (address === pair.tokenB.id) {
                deltaYUsd = reserveA * (1 - reserveB / (reserveB + amount)) * pair.tokenA.priceUsd
            }
            if (maxSwapImpactUsd < deltaYUsd) maxSwapImpactUsd = deltaYUsd
        }

        return maxSwapImpactUsd
    }

    useEffect(() => {
        if (holders && pairs.length > 0) {
            totalBalance = totalSupply / Math.pow(10, Number(decimals))
            let rlt = []
            for (let holder of holders) {
                let tmp = {}
                tmp['accountId'] = holder.account
                tmp['balance'] = holder.balance / Math.pow(10, Number(decimals))
                tmp['percent'] = (tmp['balance'] / totalBalance * 100).toFixed(2)
                tmp['usd'] = (tmp['balance'] * tokenPrice).toFixed(decimals)
                tmp['impactUsd'] = calculateSwapImpactUsd(tmp['balance'])
                if (tmp['impactUsd'] > 0) {
                    tmp['impactPercent'] = (tmp['impactUsd'] / tmp['usd'] * 100).toFixed(2)
                    if (tmp['impactPercent'] > 100) tmp['impactPercent'] = 100
                }
                else tmp['impactPercent'] = "0"
                tmp['actualUsd'] = tmp['usd'] - tmp['impactUsd']
                if (tmp['actualUsd'] < 0) tmp['actualUsd'] = 0
                rlt.push(tmp)
            }
            rlt.sort((a, b) => {
                return a.balance > b.balance ? -1 : 1
            })
            setHolderInfo(rlt)
        }
    }, [decimals, holders, pairs])
    const columns = [

        {
            name: <span className='font-weight-bold fs-13'>Fractional Fee</span>,
            selector: row => ((row.amount.numerator / row.amount.denominator * 100) + '%') || '',
            sortable: true
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
        },
        {
            name: <span className='font-weight-bold fs-13'>Collector Account</span>,
            selector: row => row.collector_account_id,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Min</span>,
            selector: row => row.minimum,
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Max</span>,
            selector: row => row.max ? row.max : 'none',
            sortable: true
        },
        {
            name: <span className='font-weight-bold fs-13'>Net</span>,
            sortable: true,
            selector: row => row.denominating_token_id
        },
    ];
    /**
     * custom_fees: 
     * created_timestamp: "1680559955.840739003"
        fixed_fees: []
        fractional_fees: Array(1)
            0: 
                all_collectors_are_exempt: false
                amount: 
                    denominator: 10
                    numerator: 1
                collector_account_id: "0.0.888481"
                denominating_token_id: "0.0.2127409"
                minimum: 0
                net_of_transfers: false
     */
    return (
        <React.Fragment>

            {tokenInfo && <Modal
                size="xl"
                isOpen={modal_xlarge}
                toggle={() => {
                    tog_xlarge();
                }}
                style={{ background: '#0b1217' }}
            >
                <DataTable
                    style={{ textAlign: 'center' }}
                    columns={columns}
                    data={tokenInfo && tokenInfo.custom_fees && tokenInfo.custom_fees.fractional_fees || []}
                    pagination
                />
            </Modal>}

            {tokenInfo && <Modal
                size="xl"
                isOpen={detail_modal_xlarge}
                toggle={() => {
                    detail_tog_xlarge();
                }}
            >
                <div className="card-body">
                    <div className="table-responsive table-card">
                        <table className="table table-hover table-borderless table-centered align-middle table-nowrap mb-0" style={{ background: "#0b1217" }}>
                            <thead className="text-muted bg-soft-light">
                                <tr>
                                    <th style={{ textAlign: "center" }}>RANK</th>
                                    <th>ACCOUNT ID</th>
                                    <th>BALANCE</th>
                                    <th>PERCENT</th>
                                    <th>USD</th>
                                    <th>SWAP IMPACT</th>
                                    <th>ACTUAL USD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(holderInfo || []).map((item, key) => (
                                    <tr key={key}>
                                        <td style={{ textAlign: "center" }}>{`${key + 1}`}</td>
                                        <td>{item.accountId}</td>
                                        <td>{formattedNum(item.balance, false)}</td>
                                        <td>{item.percent + '%'}</td>
                                        <td>{formattedNum(item.usd, true)}</td>
                                        <td>{item.impactPercent + '%'}</td>
                                        <td>{formattedNum(item.actualUsd, true)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>}
            <Col xxl={12}>
                <Card className="card-height-100">
                    <CardHeader>
                        <Nav className="nav-tabs-custom rounded card-header-tabs nav-justified border-bottom-0 mx-n3" role="tablist">
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => { toggleTab('1'); }}
                                >
                                    Basic Info</NavLink>
                            </NavItem>
                            {/* <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggleTab('2'); }}
                                >
                                    Keys & Holders</NavLink>
                            </NavItem> */}
                        </Nav>
                    </CardHeader>
                    <CardBody className="p-0">
                        <TabContent activeTab={activeTab} className="text-muted">
                            <TabPane tabId="1">
                                <div className="p-3 bg-soft-success">
                                    <div className="float-end ms-2">
                                        <h6 className="text-warning mb-0"><span className="text-dark" style={{ width: 180, wordWrap: 'break-word' }}>{createdAt}</span></h6>
                                    </div>
                                    <h6 className="mb-0 text-warning">Created</h6>
                                </div>
                                <div className="p-3">
                                    <div className="mt-3 pt-2">
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Treasury<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{tokenInfo?.treasury_account_id}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Max Supply<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{tokenInfo?.max_supply === '0' ? (tokenInfo?.total_supply/Math.pow(10, decimals)).toFixed(4): '0'}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Total Supply<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{(tokenInfo?.total_supply/Math.pow(10, decimals)).toFixed(4)}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Supply Type<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{tokenInfo?.supply_type}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="mt-2">
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Supply Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{supplyKey}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Freeze Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{freezeKey}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Pause Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{pauseKey}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Wipe Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{wipeKey}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Admin Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{adminKey}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    tokenInfo?.custom_fees && tokenInfo?.custom_fees?.fractional_fees?.length > 0 &&
                                    <>
                                        <div className="p-3 bg-soft-success d-flex justify-between items-center">
                                            <h6 className="mb-0 text-warning">Custome Fees</h6>
                                            <div
                                                style={{ marginleft: 5, marginRight: 5 }}
                                                className='cursor'
                                                onClick={() => tog_xlarge()}
                                            >
                                                <span className="fs-24 animate-ping lg:animate-ping md:animate-ping animate-none rounded-md blink"><i className='mdi mdi-hand-pointing-right'></i></span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="pt-1">
                                                <div className="d-flex mb-1">
                                                    <div className="flex-grow-1">
                                                        <p className="fs-13 mb-0 mr-1">{"Created at   "}<span className="text-muted ms-1 fs-11"></span></p>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <h6 className="mb-0" style={{ width: 140, wordWrap: 'break-word' }}>{feeCreatedAt}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <div className="d-flex mb-1">
                                                    <div className="flex-grow-1">
                                                        <p className="fs-13 mb-0">Fixed Fees<span className="text-muted ms-1 fs-11"></span></p>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <h6 className="mb-0">{tokenInfo?.custom_fees?.fixed_fees?.length > 0 ? tokenInfo?.custom_fees?.fixed_fees[0] : 'None'}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </TabPane>

                            <TabPane tabId="2">
                                <div className="p-3 bg-soft-warning">
                                    <div className="float-end ms-2">
                                        <h6 className="text-danger mb-0"><span className="text-dark"></span></h6>
                                    </div>
                                    <h6 className="mb-0 text-danger">Keys</h6>
                                </div>
                                <div className="p-3">
                                    <div className="mt-2">
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Supply Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{supplyKey}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Freeze Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{freezeKey}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Pause Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{pauseKey}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Wipe Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{wipeKey}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Admin Key<span className="text-muted ms-1 fs-11"></span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{adminKey}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-soft-warning d-flex justify-between items-center">
                                    {/* <div className="float-end ms-2">
                                        <h6 className="text-warning mb-0"><span className="text-dark"></span></h6>
                                    </div> */}
                                    <h6 className="mb-0 text-warning">Holders</h6>

                                    <div
                                        style={{ marginleft: 5, marginRight: 5 }}
                                        className='cursor'
                                        onClick={() => detail_tog_xlarge()}
                                    >
                                        <span className="fs-24 animate-ping lg:animate-ping md:animate-ping animate-none rounded-md blink"><i className='mdi mdi-hand-pointing-right'></i></span>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="mt-2" style={{ height: 300, overflowY: 'auto' }}>
                                        {
                                            holders.map((item, idx) => {
                                                return (
                                                    <div className="d-flex mb-2" key={idx} style={{ marginRight: 10 }}>
                                                        <div className="flex-grow-1">
                                                            <p className="fs-13 mb-0">{item.account}<span className="text-muted ms-1 fs-11"></span></p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <h6 className="mb-0">{Number(item.balance / Math.pow(10, decimals)).toFixed(decimals)}</h6>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default TokenInfo;