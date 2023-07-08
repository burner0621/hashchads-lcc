import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { Box } from 'rebass'
import styled from 'styled-components'

import { useMedia } from 'react-use'

import Panel from '../../Components/Panel'
import { AutoRow, RowBetween } from '../../Components/Row'
import { AutoColumn } from '../../Components/Column'
// import Search from '../../Components/Search'
import GlobalChart from '../../Components/GlobalChart'
import Trending from '../../Components/Trending'
import { formattedNum, formattedPercent } from '../../utils'
import GlobalStats from '../../Components/GlobalStats'
import fetch from 'cross-fetch'

import Provider, { getAllPairsOnSaucerswap, getAllTokensOnSaucerswap, getGlobalData, getHbarAndSaucePrice, useGlobalDataContext, useHbarAndSaucePrice, usePriceChanges, useTokenDailyVolume } from '../../contexts/GlobalData'

import socketIO from 'socket.io-client';
import * as env from "../../env";

const socket = socketIO.connect(env.BASE_URL);

const Text = styled.div`
    font-size: 0.8125rem !important;
    margin: 14px;
`

const GridRowMobile = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
`
let isFetchingUseTokenDailyVolume = false
let isFetchingUsePriceChanges = false;
let isGettingData = false;
const Overview = () => {
  document.title = "Overview";

  const [rightColumn, setRightColumn] = useState(true);

  // const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD } = useGlobalData()

  const [state, { update, updateAllPairsInSaucerswap, updateAllTokensInSaucerswap, updateHbarAndSaucePrice, updatePrices, updateTokenDailyVolume, updatePriceChange }] = useGlobalDataContext();

  const totalLiquidityUSD = state?.globalData?.totalLiquidityUSD;
  const oneDayVolumeUSD = state?.globalData?.oneDayVolumeUSD;
  const volumeChangeUSD = state?.globalData?.volumeChangeUSD;
  const liquidityChangeUSD = state?.globalData?.liquidityChangeUSD;

  const [tmpPrices, setTmpPrices] = useState([])
  // console.log('newstar totalLiquidityUSD', totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD);
  // const toggleRightColumn = () => {
  //   setRightColumn(!rightColumn);
  // };
  const hbarPrice = state?.hBarPrice;

  const priceChanges = state?.priceChange
  const data = state?.globalData
  const tokenDailyVolume = state?.tokenDailyVolume

  useEffect(() => {

    if (!hbarPrice) {
      getHbarAndSaucePrice().then((hbarP, sauceP) => {
        updateHbarAndSaucePrice(hbarP, sauceP)
      })
    }

    if (tokenDailyVolume === undefined || tokenDailyVolume === {}) {
      if (!isFetchingUseTokenDailyVolume) {
        try {
          isFetchingUseTokenDailyVolume = true
          fetch("https://api.saucerswap.finance/tokens/daily-volumes").then((response) => {
            if (response.status === 200) {
              response.json().then((dailyVolData) => {
                updateTokenDailyVolume(dailyVolData)

                isFetchingUseTokenDailyVolume = false
              })
            } else {
              isFetchingUseTokenDailyVolume = false
            }
          })
        } catch (e) {
          console.log(e)
          isFetchingUseTokenDailyVolume = false
        }
      }
    }

    if (!priceChanges || priceChanges?.length === {}) {
      if (!isFetchingUsePriceChanges) {
        try {
          isFetchingUsePriceChanges = true
          fetch("https://api.saucerswap.finance/tokens/price-change").then((response) => {
            if (response.status === 200) {
              response.json().then(priceChangeData => {
                updatePriceChange(priceChangeData)
                isFetchingUsePriceChanges = false
              });
            } else {
              isFetchingUsePriceChanges = false
            }
          })
        } catch (e) {
          console.log(e)
          isFetchingUsePriceChanges = false
        }
      }
    }
  }, [])

  useEffect(() => {
    socket.on('getPricesResponse', (p) => {

      setTmpPrices(p)
      updatePrices(p);
      if (p && p.length > 0) socket.disconnect()
    });
  }, [updatePrices]);

  useEffect(() => {

    async function getAllData() {

      let globalData = await getGlobalData(tmpPrices, hbarPrice)
      globalData && update(globalData)

      let allPairs = await getAllPairsOnSaucerswap()
      updateAllPairsInSaucerswap(allPairs)

      let allTokens = await getAllTokensOnSaucerswap(allPairs, tokenDailyVolume, priceChanges, hbarPrice)
      updateAllTokensInSaucerswap(allTokens)

      let [hbarP, sauceP] = await getHbarAndSaucePrice()
      updateHbarAndSaucePrice(hbarP, sauceP)
      isGettingData = false
    }

    if (data === undefined && hbarPrice && tmpPrices && tmpPrices.length > 0) {
      if (!isGettingData) {
        getAllData()
        isGettingData = true
      }
    }

  }, [hbarPrice, tmpPrices])

  const below600 = useMedia('(max-width: 600px)')

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                {/* <Search display={"all"} /> */}
                <GlobalStats />
              </div>
            </Col>
          </Row>
          {below600 && ( // mobile card
            // <Box mb={20}>
            //   <Panel>
            //     <Box>
            //       <AutoColumn gap="36px">
            //         <AutoColumn gap="20px">
            //           <RowBetween>
            //             <Text>Volume (24hrs)</Text>
            //             <div />
            //           </RowBetween>
            //           <RowBetween align="flex-end">
            //             <Text fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
            //               {oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD, true) : '-'}
            //             </Text>
            //             <Text fontSize={12}>
            //               {volumeChangeUSD ? formattedPercent(volumeChangeUSD) : '-'}
            //             </Text>
            //           </RowBetween>
            //         </AutoColumn>
            //         <AutoColumn gap="20px">
            //           <RowBetween>
            //             <Text>Total Liquidity</Text>
            //             <div />
            //           </RowBetween>
            //           <RowBetween align="flex-end">
            //             <Text fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
            //               {totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : '-'}
            //             </Text>
            //             <Text fontSize={12}>
            //               {liquidityChangeUSD ? formattedPercent(liquidityChangeUSD) : '-'}
            //             </Text>
            //           </RowBetween>
            //         </AutoColumn>
            //       </AutoColumn>
            //     </Box>
            //   </Panel>
            // </Box>
            <GridRowMobile>
              <Panel style={{ height: '100%', minHeight: '300px', maxHeight: '500px' }} className="panel-shadow hsla-bg" >
                <div className="animate-x-slide"
                  style={{ position: 'absolute', top: '0', left: '0.2rem', height: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#ff007a)', filter: 'blur(1px)' }}
                />
                <div className="animate-y-slide"
                  style={{ position: 'absolute', top: '0.1rem', left: '0', width: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#ff007a)', filter: 'blur(1px)' }}
                />
                <div className="animate-y-slide"
                  style={{ position: 'absolute', bottom: '0.125rem', right: '0', width: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#00e9b1)', filter: 'blur(1px)' }}
                />
                <div className="animate-x-slide"
                  style={{ position: 'absolute', bottom: '0', right: '0.125rem', height: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#00e9b1)', filter: 'blur(1px)' }}
                />
                <GlobalChart display="liquidity" id="liquidity" />
              </Panel>
              <br></br>
              <Panel style={{ height: '100%', minHeight: '300px', maxHeight: '500px' }} className="panel-shadow hsla-bg">
                <div className="animate-x-slide"
                  style={{ position: 'absolute', top: '0', left: '0.2rem', height: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#ff007a)', filter: 'blur(1px)' }}
                />
                <div className="animate-y-slide"
                  style={{ position: 'absolute', top: '0.1rem', left: '0', width: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#ff007a)', filter: 'blur(1px)' }}
                />
                <div className="animate-y-slide"
                  style={{ position: 'absolute', bottom: '0.125rem', right: '0', width: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#00e9b1)', filter: 'blur(1px)' }}
                />
                <div className="animate-x-slide"
                  style={{ position: 'absolute', bottom: '0', right: '0.125rem', height: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#00e9b1)', filter: 'blur(1px)' }}
                />
                <GlobalChart display="volume" id="volume" />
              </Panel>
            </GridRowMobile>
          )}
          {!below600 && (
            <GridRow>
              <Panel style={{ height: '100%', minHeight: '300px', maxHeight: '500px' }} className="panel-shadow hsla-bg" >
                <div className="animate-x-slide"
                  style={{ position: 'absolute', top: '0', left: '0.2rem', height: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#ff007a)', filter: 'blur(1px)' }}
                />
                <div className="animate-y-slide"
                  style={{ position: 'absolute', top: '0.1rem', left: '0', width: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#ff007a)', filter: 'blur(1px)' }}
                />
                <div className="animate-y-slide"
                  style={{ position: 'absolute', bottom: '0.125rem', right: '0', width: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#00e9b1)', filter: 'blur(1px)' }}
                />
                <div className="animate-x-slide"
                  style={{ position: 'absolute', bottom: '0', right: '0.125rem', height: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#00e9b1)', filter: 'blur(1px)' }}
                />
                <GlobalChart display="liquidity" id="liquidity" />
              </Panel>
              <Panel style={{ height: '100%', minHeight: '300px', maxHeight: '500px' }} className="panel-shadow hsla-bg">
                <div className="animate-x-slide"
                  style={{ position: 'absolute', top: '0', left: '0.2rem', height: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#ff007a)', filter: 'blur(1px)' }}
                />
                <div className="animate-y-slide"
                  style={{ position: 'absolute', top: '0.1rem', left: '0', width: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#ff007a)', filter: 'blur(1px)' }}
                />
                <div className="animate-y-slide"
                  style={{ position: 'absolute', bottom: '0.125rem', right: '0', width: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#00e9b1)', filter: 'blur(1px)' }}
                />
                <div className="animate-x-slide"
                  style={{ position: 'absolute', bottom: '0', right: '0.125rem', height: '0.25rem', borderRadius: '0.25rem', backgroundImage: 'linear-gradient(to right,hsla(0,0%,100%,.15),#00e9b1)', filter: 'blur(1px)' }}
                />
                <GlobalChart display="volume" id="volume" />
              </Panel>
            </GridRow>
          )}
          {!below600 && (
            <div className="d-flex justify-center mt-30">
              <Trending />
            </div>
          )}

        </Container>
      </div>
    </React.Fragment>
  );
};

export default Overview;
