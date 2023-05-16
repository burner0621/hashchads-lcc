import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import fetch from 'cross-fetch'

import * as env from "../../env"

const TokenInfo = ({ address, tokenPrice }) => {
    //Tab 
    const [activeTab, setActiveTab] = useState('1');
    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

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
    }, [tokenInfo?.symbol, address])
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
                setFeeCreatedAt (theDate.toGMTString())
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

    console.log(tokenInfo, tokenInfo?.decimals, tokenPrice, Number(tokenInfo?.max_supply / Number(tokenInfo?.decimals)) * Number(tokenPrice), "<<<<<<<<<<<<<<<")
    return (
        <React.Fragment>
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
                                        <div className="p-3 bg-soft-success">
                                            <h6 className="mb-0 text-warning">Custome Fees</h6>
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
                                                        <h6 className="mb-0">{tokenInfo?.custom_fees?.fixed_fees?.length > 0? tokenInfo?.custom_fees?.fixed_fees[0]:'None'}</h6>
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