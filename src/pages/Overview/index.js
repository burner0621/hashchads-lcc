import React, { useState } from "react";
import { Col, Container, Row, Spinner } from "reactstrap";
import { Box } from 'rebass'
import styled from 'styled-components'

import { useMedia } from 'react-use'

import Panel from '../../Components/Panel'
import { AutoRow, RowBetween } from '../../Components/Row'
import { AutoColumn } from '../../Components/Column'
import Search from '../../Components/Search'
import GlobalChart from '../../Components/GlobalChart'
import { formattedNum, formattedPercent } from '../../utils'
import GlobalStats from '../../Components/GlobalStats'

import { useGlobalData } from '../../contexts/GlobalData'

const Text = styled.div`
    font-size: 0.8125rem !important;
    margin: 14px;
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
`

const Overview = () => {
  document.title = "Overview";

  const [rightColumn, setRightColumn] = useState(true);

  const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD } = useGlobalData()

  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  const below800 = useMedia('(max-width: 800px)')

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Search />
                <GlobalStats />
              </div>
            </Col>
          </Row>
          {below800 && ( // mobile card
            <Box mb={20}>
              <Panel>
                <Box>
                  <AutoColumn gap="36px">
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <Text>Volume (24hrs)</Text>
                        <div />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        <Text fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                          {oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD, true) : '-'}
                        </Text>
                        <Text fontSize={12}>
                          {volumeChangeUSD ? formattedPercent(volumeChangeUSD) : '-'}
                        </Text>
                      </RowBetween>
                    </AutoColumn>
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <Text>Total Liquidity</Text>
                        <div />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        <Text fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                          {totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : '-'}
                        </Text>
                        <Text fontSize={12}>
                          {liquidityChangeUSD ? formattedPercent(liquidityChangeUSD) : '-'}
                        </Text>
                      </RowBetween>
                    </AutoColumn>
                  </AutoColumn>
                </Box>
              </Panel>
            </Box>
          )}
          {!below800 && (
            <GridRow>
              <Panel style={{ height: '100%', minHeight: '300px', maxHeight: '5vh' }} className="panel-shadow hsla-bg">
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
                <GlobalChart display="liquidity" />
              </Panel>
              <Panel style={{ height: '100%', minHeight: '300px', maxHeight: '5vh' }} className="panel-shadow hsla-bg">
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
                <GlobalChart display="volume" />
              </Panel>
            </GridRow>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Overview;
