import { Button } from 'reactstrap';
import { TableContainer } from '../Common/TableContainer'
import TokenLogo from '../TokenLogo';
import { useState, useEffect, useMemo } from 'react';

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import fetch from 'cross-fetch'
import {useAllTokensInSaucerswap} from "../../contexts/GlobalData"

const TRENDING_TYPE = {
    hot: 'hot',
    new: 'new',
    pool: 'pool'
}

const HOT_TOKENS = [
    '0.0.1190803',
    '0.0.127877',
    '0.0.786931',
    '0.0.1109951',
    '0.0.1055483',
]

const Trending = () => {
    const [trendingType, setTrendingType] = useState(TRENDING_TYPE.hot)
    const [currencies, setCurrencies] = useState ([])
    const [newTokens, setNewTokens] = useState ([])
    const [hotTokens, setHotTokens] = useState ([])
    
    const allTokens = useAllTokensInSaucerswap ()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        let tmpCUr = []
        for (let token of allTokens) {
            if (HOT_TOKENS.includes(token.id)) {
                let tmp = {}
                tmp.price = token.priceUsd.toFixed (6) || 0.0
                tmp.img = `https://saucerswap.finance${token.icon}`
                tmp.change = token.priceChangeUSD.toFixed (6)
                tmp.coinName = token.name
                if (Number(token.priceChangeUSD) > 0) {
                    tmp.iconClass = "success"
                    tmp.icon = "mdi mdi-trending-up"
                } else {
                    tmp.iconClass = "danger"
                    tmp.icon = "mdi mdi-trending-down"
                }
                tmpCUr.push (tmp)
            }
        }
        setHotTokens (tmpCUr)
    }, [])

    const sortedList = useMemo(() => {
        return (
            allTokens &&
            allTokens
                .sort((a, b) => {
                    return a['timestampSecondsLastListingChange'] > b['timestampSecondsLastListingChange'] ? -1 : 1
                })
        )
    }, [allTokens])

    useEffect (() => {
        let tmpCUr = []
        for (var i = 0 ; i < 5 && sortedList.length > 4; i ++) {
            let token = sortedList[i]
            let tmp = {}
            tmp.price = token.priceUsd.toFixed (6)
            tmp.img = `https://saucerswap.finance${token.icon}`
            tmp.change = token.priceChangeUSD.toFixed (6)
            tmp.coinName = token.name
            if (Number(token.priceChangeUSD) > 0) {
                tmp.iconClass = "success"
                tmp.icon = "mdi mdi-trending-up"
            } else {
                tmp.iconClass = "danger"
                tmp.icon = "mdi mdi-trending-down"
            }
            tmpCUr.push (tmp)
        }
        setNewTokens (tmpCUr)
    }, [])

    useEffect (() => {
        if (trendingType === TRENDING_TYPE.hot) {
            setCurrencies (hotTokens)
        }
        else if (trendingType === TRENDING_TYPE.new) {
            setCurrencies (newTokens)
        }
        else setCurrencies ([])
    }, [hotTokens, newTokens, trendingType])
    
    const handleTrendingType = (type) => {
        if(type !== trendingType) setTrendingType(type)
    }

    return (
        <React.Fragment>
            <Col xl={9}>
                <Card>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Trending</h4>
                        <div className="flex-shrink-0">
                            <button className= {trendingType == TRENDING_TYPE.hot ? "btn btn-md button-border" : "btn btn-md"} style={{color: 'red'}} onClick={() => handleTrendingType(TRENDING_TYPE.hot)}>HOT</button>
                            <button className= {trendingType == TRENDING_TYPE.new ? "btn btn-md button-border" : "btn btn-md"} style={{color: 'red'}} onClick={() => handleTrendingType(TRENDING_TYPE.new)}>NEW</button>
                            <button className= {trendingType == TRENDING_TYPE.pool ? "btn btn-md button-border" : "btn btn-md"} style={{color: 'red'}} onClick={() => handleTrendingType(TRENDING_TYPE.pool)}>TOP POOLS</button>
                        </div>
                    </CardHeader>
                    <div className="card-body">
                        <div className="table-responsive table-card">
                            <table className="table table-hover table-borderless table-centered align-middle table-nowrap mb-0">
                                <thead className="text-muted bg-soft-light">
                                    {trendingType == TRENDING_TYPE.pool ? (
                                        <tr>
                                            <th>Trading Pair</th>
                                            <th>24h Change</th>
                                            <th>LP Rewoard APR</th>
                                            {/* <th>Actions</th> */}
                                        </tr>    
                                    ) : (
                                        <tr>
                                            <th>Token Name</th>
                                            <th>Price</th>
                                            <th>Change</th>
                                            {/* <th>Actions</th> */}
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {(currencies || []).map((item, key) => (
                                        <tr key={key}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="me-2">
                                                        <img src={item.img} alt="" className="avatar-xxs" />
                                                    </div>
                                                    <div>
                                                        <h6 className="fs-14 mb-0">{item.coinName}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>${item.price}</td>
                                            <td><h6 className={"fs-13 mb-0 text-" + item.iconClass}><i className={"align-middle me-1 " + item.icon}></i>{item.change}</h6></td>
                                            {/* <td>${item.balance}</td>
                                            <td>{item.totalCoin}</td> */}
                                            {/* <td><Link to="/apps-crypto-buy-sell" className="btn btn-md btn-success">Trade</Link></td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default Trending;
// const Trending = () => {

    

//     const columns = useMemo(
//         () => {
//             displayType == TRENDING_TYPE.pool ? [
//                 {
//                     Header: "",
//                     accessor: "no",
//                     filterable: false,
//                 },
//                 {
//                     Header: "Trading Pair",
//                     accessor: "pair",
//                     filterable: false,
//                 },
//                 {
//                     Header: "24h Volume",
//                     accessor: "volume",
//                     filterable: false,
//                 },
//                 {
//                     Header: "LP Reward APR",
//                     accessor: "reward",
//                     filterable: false,
//                 },
//                 {
//                     Header: "",
//                     Cell: (item) => (
//                         <Button color="success" size='sm'></Button>
//                     ),
//                 }
//             ] : [
//                 {
//                     Header: "Name",
//                     accessor: "name",
//                     filterable: false,
//                     Cell: (leads) => (
//                         <>
//                             <div className="d-flex align-items-center">
//                                 <div className="flex-shrink-0">
//                                     {leads.row.original.image_src ? <img
//                                         src={process.env.REACT_APP_API_URL + "/images/users/" + leads.row.original.image_src}
//                                         alt=""
//                                         className="avatar-xxs rounded-circle"
//                                     /> :
//                                         <div className="flex-shrink-0 avatar-xs me-2">
//                                             <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
//                                                 {leads.row.original.name.charAt(0)}
//                                             </div>
//                                         </div>
//                                         // <img src={dummyImg} alt="" className="avatar-xxs rounded-circle" />
//                                     }
//                                 </div>
//                                 <div className="flex-grow-1 ms-2 name">
//                                     {leads.row.original.name}
//                                 </div>
//                             </div>
//                         </>
//                     ),
//                 },
//                 {
//                     Header: "",
//                     accessor: "no",
//                     filterable: false,
//                 },
//                 {
//                     Header: "Token Name",
//                     accessor: "name",
//                     filterable: false,
//                     Cell: (item) => (
//                         <div className='d-flex items-center'>
//                             <TokenLogo path={item.icon} />
//                             <span>{item.name}</span>
//                         </div>
//                     )
//                 },
//                 {
//                     Header: "Price",
//                     accessor: "price",
//                     filterable: false,
//                     Cell: (item) => (
//                         <span>`\$${item.price}`</span>
//                     )
//                 },
//                 {
//                     Header: "Change",
//                     accessor: "change",
//                     filterable: false,
//                     Cell: (item) => (
//                         <span>{item.change}</span>
//                     )
//                 },
//                 {
//                     Header: "",
//                     Cell: (item) => (
//                         <Button color="success" size='sm'></Button>
//                     ),
//                 }
//             ]
//         },
//         [trendingType]
//     );

//     const data = [];
//     for (let i = 0; i < 10; i++) {
//         data.push({
//             no: 1, decimals: 8,
//             description: "Hedera is a public, open source, proof-of-stake network, with native cryptocurrency HBAR.  HBAR is used to pay application transaction fees and protect the network from attack through proof-of-stake. When HBAR is staked to network nodes, it has a weighted influence on consensus for validating transactions.  Developers use HBAR to pay for network services, such as transferring tokens, minting fungible and non-fungible tokens, calling smart contracts, and logging data. For every transaction submitted to the network, HBAR is used to pay fees that compensate validator nodes for bandwidth, compute, and storage.",
//             dueDiligenceComplete: true,
//             icon: "/images/tokens/hbar.svg",
//             id: "0.0.1456986",
//             isFeeOnTransferToken: false,
//             name: "WHBAR [new]",
//             oneDayVolumeUSD: 1075398.84313685,
//             price: "100000000",
//             priceChangeUSD: 0.9644535638080494,
//             priceUsd: 0.05249532,
//             sentinelReport: null,
//             symbol: "HBAR",
//             timestampSecondsLastListingChange: 0,
//             twitterHandle: "hedera",
//             website: "https://hedera.com/",
//         })
//     }


//     return (

//         <div>
//             <Row className="d-flex justify-center">
//                 <span>Trending</span>
//             </Row>
//             <TableContainer
//                 columns={columns}
//                 data={data}
//                 isGlobalFilter={false}
//                 isAddUserList={false}
//                 customPageSize={10}
//                 className="custom-header-css"
//                 divClass="table-responsive table-card mb-0"
//                 tableClass="align-middle table-nowrap"
//                 theadClass="table-light"
//                 isLeadsFilter={false}
//             />
//         </div>

//     )
// }