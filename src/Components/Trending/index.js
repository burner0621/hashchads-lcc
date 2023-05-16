import { Button } from 'reactstrap';
import { TableContainer } from '../Common/TableContainer'
import TokenLogo from '../TokenLogo';
import { useState } from 'react';

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const TRENDING_TYPE = {
    hot: 'hot',
    new: 'new',
    pool: 'pool'
}

const TRENDING_TYPE_NAME = {
    hot: 'HOT',
    new: 'NEW',
    pool: 'TOP POOLS'
}

const Trending = () => {
    const [trendingType, setTrendingType] = useState(TRENDING_TYPE.hot)
    // const [currencies, setCurrency] = useState([])
    const currencies = [
        {
            id: 1,
            img: btcCoin,
            coinName: "Bitcoin",
            price: "48,568.025",
            iconClass: "success",
            icon: "mdi mdi-trending-up",
            change: "5.26",
            balance: "53,914.025",
            totalCoin: "1.25634801",
        },
        {
            id: 2,
            img: ltcCoin,
            coinName: "Litecoin",
            price: "87,142.027",
            iconClass: "danger",
            icon: "mdi mdi-trending-down",
            change: "3.07",
            balance: "75,854.127",
            totalCoin: "2.85472161",
        },
        {
            id: 3,
            img: ethCoin,
            coinName: "Eathereum",
            price: "33,847.961",
            iconClass: "success",
            icon: "mdi mdi-trending-up",
            change: "7.13",
            balance: "44,152.185",
            totalCoin: "1.45612347",
        },
        {
            id: 4,
            img: bnbCoin,
            coinName: "Binance",
            price: "73,654.421",
            iconClass: "success",
            icon: "mdi mdi-trending-up",
            change: "0.97",
            balance: "48,367.125",
            totalCoin: "0.35734601",
        },
        {
            id: 5,
            img: usdtCoin,
            coinName: "Tether",
            price: "66,742.077",
            iconClass: "danger",
            icon: "mdi mdi-trending-down",
            change: "1.08",
            balance: "53,487.083",
            totalCoin: "3.62912570",
        },
        {
            id: 6,
            img: dashCoin,
            coinName: "Dash",
            price: "34,736.209",
            iconClass: "success",
            icon: "mdi mdi-trending-up",
            change: "4.52",
            balance: "15,203.347",
            totalCoin: "1.85412740",
        },
        {
            id: 7,
            img: neoCoin,
            coinName: "Neo",
            price: "56,357.313",
            iconClass: "danger",
            icon: "mdi mdi-trending-down",
            change: "2.87",
            balance: "61,843.173",
            totalCoin: "1.87732061",
        },
        {
            id: 8,
            img: dogeCoin,
            coinName: "Dogecoin",
            price: "62,357.649",
            iconClass: "success",
            icon: "mdi mdi-trending-up",
            change: "3.45",
            balance: "54,843.173",
            totalCoin: "0.95632087",
        },
    ];
    return (
        <React.Fragment>
            <Col xl={8}>
                <Card>
                    <CardHeader className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">My Currencies</h4>
                        <div className="flex-shrink-0">
                            <button className="btn btn-soft-primary btn-sm">24H</button>
                        </div>
                        <div className="flex-shrink-0 ms-2">
                            <UncontrolledDropdown className="card-header-dropdown" direction='start'>
                                <DropdownToggle className="btn btn-soft-primary btn-sm" role="button" tag="a">
                                    Get Report<i className="mdi mdi-chevron-down align-middle ms-1"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu dropdown-menu-end">
                                    <DropdownItem>Download Report</DropdownItem>
                                    <DropdownItem>Export</DropdownItem>
                                    <DropdownItem>Import</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </CardHeader>
                    <div className="card-body">
                        <div className="table-responsive table-card">
                            <table className="table table-hover table-borderless table-centered align-middle table-nowrap mb-0">
                                <thead className="text-muted bg-soft-light">
                                    <tr>
                                        <th>Coin Name</th>
                                        <th>Price</th>
                                        <th>24h Change</th>
                                        <th>Total Balance</th>
                                        <th>Total Coin</th>
                                        <th>Actions</th>
                                    </tr>
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
                                            <td>${item.balance}</td>
                                            <td>{item.totalCoin}</td>
                                            <td><Link to="/apps-crypto-buy-sell" className="btn btn-sm btn-soft-secondary">Trade</Link></td>
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