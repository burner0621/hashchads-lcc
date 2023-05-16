import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, Modal } from 'reactstrap';
import DataTable from 'react-data-table-component';
import classnames from 'classnames';
import fetch from 'cross-fetch'
import {useAllPairsInSaucerswap} from '../../contexts/GlobalData'
import * as env from "../../env"

const TokenInfo = ({ address, tokenPrice }) => {
    //Tab 
    const [activeTab, setActiveTab] = useState('1');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const allPairs = useAllPairsInSaucerswap ()

    const [tokenInfo, setTokenInfo] = useState();
    const [createdAt, setCreatedAt] = useState('')
    const [feeCreatedAt, setFeeCreatedAt] = useState('')
    const [supplyKey, setSupplyKey] = useState('')
    const [freezeKey, setFreezeKey] = useState('')
    const [pauseKey, setPauseKey] = useState('')
    const [wipeKey, setWipeKey] = useState('')
    const [adminKey, setAdminKey] = useState('')
    const [decimals, setDecimals] = useState(0)
    const [holders, setHolders] = useState([])
    const [circulatingSupply, setCirculatingSupply] = useState(0)
    const [dilutedSupply, setDilutedSupply] = useState(0)
    const [holderInfo, setHolderInfo] = useState ({})
    const [pairs, setPairs] = useState ([])

    let totalBalance = 0
    let tmpPairs = []

    if (allPairs) {
        for (let pair of allPairs) {
            if (address && address === pair.tokenA.id) tmpPairs.push(pair)
            if (address && address === pair.tokenB.id) tmpPairs.push(pair)
        }
        setPairs (tmpPairs)
    }

    const [modal_xlarge, setmodal_xlarge] = useState(false);

    function tog_xlarge() {
        setmodal_xlarge(!modal_xlarge);
    }

    useEffect(() => {
        async function fetchData() {
            let response = await fetch(env.MIRROR_NODE_URL + "/api/v1/tokens/" + address);
            if (response.status === 200) {
                let jsonData = await response.json()
                setTokenInfo(jsonData)
                let response1 = await fetch(env.MIRROR_NODE_URL + `/api/v1/tokens/${address}/balances?account.id=${jsonData?.treasury_account_id}`);
                if (response1.status === 200) {
                    let jsonData1 = await response1.json()
                    let balances = jsonData1?.balances
                    let p = (Number(jsonData?.total_supply) - Number(balances[0]['balance'])) / Math.pow(10, Number(jsonData?.decimals)) * tokenPrice
                    setCirculatingSupply(p)
                    p = (Number(jsonData?.total_supply)) / Math.pow(10, Number(jsonData?.decimals)) * tokenPrice
                    setDilutedSupply(p)
                }
            }
        }
        fetchData()
    }, [address, tokenPrice])

    const formatString = (str) => {
        if (str === undefined) return ''
        if (str.length === 0) return ''
        return str.slice(0, 5) + "..." + str.slice(-5);
    }

    useEffect(() => {
        if (tokenInfo) {
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
            let response = await fetch(env.MIRROR_NODE_URL + `/api/v1/tokens/${address}/balances`);
            if (response.status === 200) {
                let jsonData = await response.json()
                setHolders(jsonData['balances'])
            }
        }
        fetchData()
    }, [address])

    const calculateSwapImpactUsd = (amount) => {
        let maxSwapImpactUsd = 0
        for (let pair of pairs) {
            let deltaYUsd = 0
            let reserveA = Number(pair.tokenA.tokenReserveB)/Number(pair.tokenA.decimals)
            let reserveB = Number(pair.tokenB.tokenReserveB)/Number(pair.tokenB.decimals)
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

    // useEffect (() => {
    //     if (holders) {
    //         for (let holder of holders) {
    //             // eslint-disable-next-line react-hooks/exhaustive-deps
    //             totalBalance += holder.balance / Math.pow (10, Number(decimals))
    //         }
    //         let tmp = {}
    //         for (let holder of holders) {
    //             tmp[holder.account]['balance'] = holder.balance / Math.pow (10, Number(decimals))
    //             tmp[holder.account]['percent'] = (tmp[holder.account]['balance'] / totalBalance * 100).toFixed(2)
    //             tmp[holder.account]['usd'] = (tmp[holder.account]['balance'] * tokenPrice).toFixed(decimals)
    //             tmp[holder.account]['impactUsd'] = calculateSwapImpactUsd (tmp[holder.account]['balance'])
    //             tmp[holder.account]['impactPercent'] = (tmp[holder.account]['impactUsd'] / tmp[holder.account]['usd'] * 100).toFixed (2)
    //             tmp[holder.account]['actualUsd'] = tmp[holder.account]['usd'] - tmp[holder.account]['impactUsd']
    //         }
    //         setHolderInfo (tmp)
    //         console.log (tmp, ">>>>>>>>>>>>>>")
    //     }
    // }, [decimals, holders, pairs])

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
                style={{ background: '#1a1d21' }}
            >
                <DataTable
                    style={{textAlign: 'center'}}
                    columns={columns}
                    data={tokenInfo && tokenInfo.custom_fees && tokenInfo.custom_fees.fractional_fees || []}
                    pagination
                />
            </Modal>}
            <Col xxl={3}>
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
                            <NavItem>
                                <NavLink
                                    href="#"
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggleTab('2'); }}
                                >
                                    Keys & Holders</NavLink>
                            </NavItem>
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
                                                <h6 className="mb-0">{tokenInfo?.max_supply}</h6>
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
                                        <div className="d-flex">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Market Cap<span className="text-muted ms-1 fs-11">(Circulating)</span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{'$' + circulatingSupply.toFixed(decimals)}</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="flex-grow-1">
                                                <p className="fs-13 mb-0">Market Cap<span className="text-muted ms-1 fs-11">(Diluted)</span></p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <h6 className="mb-0">{'$' + dilutedSupply.toFixed(decimals)}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    tokenInfo?.custom_fees && tokenInfo?.custom_fees?.fractional_fees?.length > 0 &&
                                    <>
                                        <div className="p-3 bg-soft-success d-flex justify-between">
                                            <h6 className="mb-0 text-warning">Custome Fees</h6>
                                            <div
                                                style={{ marginleft: 5, marginRight: 5 }}
                                                className='cursor'
                                                onClick={() => tog_xlarge()}
                                            >
                                                <i className='mdi mdi-file-table-box-multiple'></i>
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
                                <div className="p-3 bg-soft-warning">
                                    <div className="float-end ms-2">
                                        <h6 className="text-warning mb-0"><span className="text-dark"></span></h6>
                                    </div>
                                    <h6 className="mb-0 text-warning">Holders</h6>
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