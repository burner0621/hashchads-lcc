import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Card, CardBody, Col } from "reactstrap";

import { useTokenDailyVolume, useAllPairsInSaucerswap } from '../../contexts/GlobalData'

import * as env from "../../env"

const Widgets = ({ address, price }) => {
  const allPairs = useAllPairsInSaucerswap()
  const tokenDailyVolume = useTokenDailyVolume()
  const dailyVolume = tokenDailyVolume !== undefined ? (tokenDailyVolume[address] !== undefined ? tokenDailyVolume[address] : 0) : 0
  const [totalSupply, setTotalSupply] = useState(0)
  const [totalLiquidity, setTotalLiquidity] = useState (0)
  const [circulatingSupply, setCirculatingSupply] = useState(0)

  useEffect(() => {
    async function fetchData() {
      let response = await fetch(env.MIRROR_NODE_URL + "/api/v1/tokens/" + address);
      if (response.status === 200) {
        let jsonData = await response.json()
        setTotalSupply(Number(jsonData?.total_supply) / Math.pow(10, Number(jsonData?.decimals)) * price)
        let response1 = await fetch(env.MIRROR_NODE_URL + `/api/v1/tokens/${address}/balances?account.id=${jsonData?.treasury_account_id}`);
        if (response1.status === 200) {
          let jsonData1 = await response1.json()
          let balances = jsonData1?.balances
          let p = (Number(jsonData?.total_supply) - Number(balances[0]['balance'])) / Math.pow(10, Number(jsonData?.decimals)) * price
          setCirculatingSupply (p)
        }
      }
    }
    fetchData()
  }, [])

  useEffect (()=> {
    let liquidity = 0
    for (let pair of allPairs) {
      if (address === pair.tokenA.id) {
        liquidity += pair.tokenA.priceUsd * pair.tokenReserveA / Math.pow(10, pair.tokenA.decimals)
      }
      if (address === pair.tokenB.id) {
        liquidity += pair.tokenB.priceUsd * pair.tokenReserveB / Math.pow(10, pair.tokenB.decimals)
      }
    }
    setTotalLiquidity (liquidity)
  }, [])

  const buysellWidgets = [
    {
      id: 1,
      title: "Total Liquidity",
      counter: `${totalLiquidity}`,
      changed: "%10.3425",
      icon: "ri-shopping-bag-line",
      iconClass: "danger",
    },
    {
      id: 2,
      title: "24hr Volume",
      counter: `${dailyVolume}`,
      changed: "00",
      icon: "ri-funds-line",
      iconClass: "info",
    },
    {
      id: 3,
      title: "Total Supply",
      counter: `${totalSupply}`,
      changed: "85",
      icon: "ri-arrow-left-down-fill",
      iconClass: "warning",
    },
    {
      id: 4,
      title: "Circulating Supply",
      counter: `${circulatingSupply}`,
      changed: "35",
      icon: "ri-arrow-right-up-fill",
      iconClass: "success",
    },
  ];

  return (
    <React.Fragment>
      {buysellWidgets.map((item, key) => (
        <Col xl={3} sm={6} key={key}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-3">{item.title}</h6>
                  <h2 className="mb-0">
                    $
                    <span className="counter-value">
                      <CountUp start={0} end={item.counter} duration={3} />
                    </span>
                    {/* <small className="text-muted fs-13">.{item.decimal}k</small> */}
                  </h2>
                </div>
                {/* <div className="flex-shrink-0 avatar-sm">
                  <div
                    className={
                      "avatar-title fs-22 rounded bg-soft-" +
                      item.iconClass +
                      " text-" +
                      item.iconClass
                    }
                  >
                    <i className={item.icon}></i>
                  </div>
                </div> */}
                {/* <small className="text-muted fs-13">{item.changed}</small> */}
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default Widgets;
