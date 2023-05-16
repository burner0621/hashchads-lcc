import { Button } from 'reactstrap';
import { TableContainer } from '../Common/TableContainer'
import TokenLogo from '../TokenLogo';
import { useState } from 'react';

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

    const columns = useMemo(
        () => {
            displayType == TRENDING_TYPE.pool ? [
                {
                    Header: "",
                    accessor: "no",
                    filterable: false,
                },
                {
                    Header: "Trading Pair",
                    accessor: "pair",
                    filterable: false,
                },
                {
                    Header: "24h Volume",
                    accessor: "volume",
                    filterable: false,
                },
                {
                    Header: "LP Reward APR",
                    accessor: "reward",
                    filterable: false,
                },
                {
                    Header: "",
                    Cell: (item) => (
                        <Button color="success" size='sm'></Button>
                    ),
                }
            ] : [
                {
                    Header: "Name",
                    accessor: "name",
                    filterable: false,
                    Cell: (leads) => (
                        <>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    {leads.row.original.image_src ? <img
                                        src={process.env.REACT_APP_API_URL + "/images/users/" + leads.row.original.image_src}
                                        alt=""
                                        className="avatar-xxs rounded-circle"
                                    /> :
                                        <div className="flex-shrink-0 avatar-xs me-2">
                                            <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                                                {leads.row.original.name.charAt(0)}
                                            </div>
                                        </div>
                                        // <img src={dummyImg} alt="" className="avatar-xxs rounded-circle" />
                                    }
                                </div>
                                <div className="flex-grow-1 ms-2 name">
                                    {leads.row.original.name}
                                </div>
                            </div>
                        </>
                    ),
                },
                {
                    Header: "",
                    accessor: "no",
                    filterable: false,
                },
                {
                    Header: "Token Name",
                    accessor: "name",
                    filterable: false,
                    Cell: (item) => (
                        <div className='d-flex items-center'>
                            <TokenLogo path={item.icon} />
                            <span>{item.name}</span>
                        </div>
                    )
                },
                {
                    Header: "Price",
                    accessor: "price",
                    filterable: false,
                    Cell: (item) => (
                        <span>`\$${item.price}`</span>
                    )
                },
                {
                    Header: "Change",
                    accessor: "change",
                    filterable: false,
                    Cell: (item) => (
                        <span>{item.change}</span>
                    )
                },
                {
                    Header: "",
                    Cell: (item) => (
                        <Button color="success" size='sm'></Button>
                    ),
                }
            ]
        },
        [trendingType]
    );

    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            no: 1, decimals: 8,
            description: "Hedera is a public, open source, proof-of-stake network, with native cryptocurrency HBAR.  HBAR is used to pay application transaction fees and protect the network from attack through proof-of-stake. When HBAR is staked to network nodes, it has a weighted influence on consensus for validating transactions.  Developers use HBAR to pay for network services, such as transferring tokens, minting fungible and non-fungible tokens, calling smart contracts, and logging data. For every transaction submitted to the network, HBAR is used to pay fees that compensate validator nodes for bandwidth, compute, and storage.",
            dueDiligenceComplete: true,
            icon: "/images/tokens/hbar.svg",
            id: "0.0.1456986",
            isFeeOnTransferToken: false,
            name: "WHBAR [new]",
            oneDayVolumeUSD: 1075398.84313685,
            price: "100000000",
            priceChangeUSD: 0.9644535638080494,
            priceUsd: 0.05249532,
            sentinelReport: null,
            symbol: "HBAR",
            timestampSecondsLastListingChange: 0,
            twitterHandle: "hedera",
            website: "https://hedera.com/",
        })
    }


    return (

        <div>
            <Row className="d-flex justify-center">
                <span>Trending</span>
            </Row>
            <TableContainer
                columns={columns}
                data={data}
                isGlobalFilter={false}
                isAddUserList={false}
                customPageSize={10}
                className="custom-header-css"
                divClass="table-responsive table-card mb-0"
                tableClass="align-middle table-nowrap"
                theadClass="table-light"
                isLeadsFilter={false}
            />
        </div>

    )
}

export default Trending;