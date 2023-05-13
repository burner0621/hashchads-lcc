import React, { useState, useEffect } from "react";
import styled from 'styled-components'
import { Col, Container, Row } from "reactstrap";
import { useMedia } from 'react-use'
import { Text } from 'rebass'
import { PlusCircle, Bookmark, AlertCircle } from 'react-feather'

import Widgets from './Widgets';
import TokenChart from './TokenChart';
import TokenInfo from './TokenInfo';

import Panel from '../../Components/Panel'
import { RowBetween, RowFixed, AutoRow } from '../../Components/Row'
import Link, { BasicLink } from '../../Components/Link'
import Column, { AutoColumn } from '../../Components/Column'
import Search from '../../Components/Search'
import TokenLogo from '../../Components/TokenLogo'
import { ButtonLight, ButtonDark } from '../../Components/ButtonStyled'

import { localNumber } from '../../utils'

import { useAllTokensInSaucerswap, usePriceChanges } from '../../contexts/GlobalData'
import fetch from 'cross-fetch'

import * as env from "../../env"

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
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  padding-bottom: 80px;

  @media screen and (max-width: 600px) {
    & > * {
      padding: 0 12px;
    }
  }
`
const WarningGrouping = styled.div`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`
const Hover = styled.div`
  :hover {
    cursor: pointer;
    opacity: ${({ fade }) => fade && '0.7'};
  }
`
const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text1};
`
const WarningIcon = styled(AlertCircle)`
  stroke: darkgreen;
  height: 16px;
  width: 16px;
  opacity: 0.6;
`
const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      /* grid-column: 1 / 4; */
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

const UNTRACKED_COPY = 'Derived USD values may be inaccurate without liquid stablecoin or ETH pairings.'

const TokenPage = ({ address }) => {
    const allTokens = useAllTokensInSaucerswap()
    const priceChanges = usePriceChanges()

    const below1080 = useMedia('(max-width: 1080px)')
    const below600 = useMedia('(max-width: 600px)')
    
    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [priceUSD, setPriceUSD] = useState('')
    const [priceChange, setPriceChange] = useState('')
    const [priceChangeColor, setPriceChangeColor] = useState('green')
    const [iconPath, setIconPath] = useState('')

    useEffect(() => {
        async function fetchData() {
            let response = await fetch(env.MIRROR_NODE_URL + "/api/v1/tokens/" + address);
            if (response.status === 200) {
                let jsonData = await response.json()
                setName(jsonData?.name)
                setSymbol(jsonData?.symbol)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        for (let token of allTokens) {
            if (token.id === address) {
                setPriceUSD(Number(token?.priceUsd).toFixed(4))
                setIconPath(token?.icon)
            }
        }
    }, [])
    useEffect(() => {
        try {
            if (Number(priceChanges[address]) > 0) { setPriceChange('+' + Number(priceChanges[address]).toFixed(4) + '%'); setPriceChangeColor('green') }
            else { setPriceChange(priceChange + '%'); setPriceChangeColor('red') }
        }catch(e) {
            console.log (e)
        }
    }, [])

    let oneDayVolumeUSD = 23
    let oneDayVolumeUT = 5323423

    const LENGTH = below1080 ? 10 : 16
    const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <ContentWrapper>
                        <RowBetween style={{ flexWrap: 'wrap', alingItems: 'start' }}>
                            <AutoRow align="flex-end" style={{ width: 'fit-content' }}>
                                <div style={{ fontWeight: 400, fontSize: 14, color: 'white' }}>
                                    <BasicLink to="/tokens">{'Tokens '}</BasicLink>→ {symbol}
                                </div>
                                <Link
                                    style={{ width: 'fit-content' }}
                                    color={'red'}
                                    external
                                    href={'https://hashscan.io/mainnet/token/' + address}
                                >
                                    <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                                        ({address.slice(0, 8) + '...' + address.slice(36, 42)})
                                    </Text>
                                </Link>
                            </AutoRow>
                            {!below600 && <Search small={true} />}
                        </RowBetween>
                        <WarningGrouping disabled={false}>
                            <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
                                <RowBetween
                                    style={{
                                        flexWrap: 'wrap',
                                        marginBottom: '2rem',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <RowFixed style={{ flexWrap: 'wrap' }}>
                                        <RowFixed style={{ alignItems: 'baseline' }}>
                                            <TokenLogo path={iconPath} size="32px" style={{ alignSelf: 'center' }} />
                                            <div fontSize={below1080 ? '1.5rem' : '2rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                                                <RowFixed gap="6px">
                                                    <div style={{ marginRight: '6px', fontSize: 32, color: 'white' }} >{name}</div>{' '}
                                                    <span style={{ fontSize: 32, color: 'grey' }}>{formattedSymbol ? `(${formattedSymbol})` : ''}</span>
                                                </RowFixed>
                                            </div>
                                            {!below1080 && (
                                                <>
                                                    <div fontSize={'1.5rem'} fontWeight={500} style={{ marginRight: '1rem' }}>
                                                        {`$` + priceUSD}
                                                    </div>
                                                    <span style={{ color: priceChangeColor }}>{priceChange}</span>
                                                </>
                                            )}
                                        </RowFixed>
                                    </RowFixed>
                                    {/* <span>
                                        <RowFixed ml={below500 ? '0' : '2.5rem'} mt={below500 ? '1rem' : '0'}>
                                            {!below800 ? (
                                                <Hover>
                                                    <StyledIcon>
                                                        <PlusCircle style={{ marginRight: '0.5rem' }} />
                                                    </StyledIcon>
                                                </Hover>
                                            ) : !below1080 ? (
                                                <StyledIcon>
                                                    <Bookmark style={{ marginRight: '0.5rem', opacity: 0.4 }} />
                                                </StyledIcon>
                                            ) : (
                                                <></>
                                            )}
                                            <Link target="_blank">
                                                <ButtonLight color={'green'}>+ Add Liquidity</ButtonLight>
                                            </Link>
                                            <Link target="_blank">
                                                <ButtonDark ml={'.5rem'} mr={below1080 && '.5rem'} color={'red'}>
                                                    Trade
                                                </ButtonDark>
                                            </Link>
                                        </RowFixed>
                                    </span> */}
                                </RowBetween>
                                {/* <>
                                    {!below1080 && (
                                        <RowFixed>
                                            <div style={{ fontSize: '1.125rem', marginRight: '6px' }}>
                                                Token Stats
                                            </div>
                                            {usingUtVolume && (
                                                <div>
                                                    {UNTRACKED_COPY}
                                                    <WarningIcon />
                                                </div>
                                            )}
                                        </RowFixed>
                                    )}
                                    <PanelWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
                                        {below1080 && price && (
                                            <Panel>
                                                <AutoColumn gap="20px">
                                                    <RowBetween>
                                                        <div>Price</div>
                                                        <div />
                                                    </RowBetween>
                                                    <RowBetween align="flex-end">
                                                        {' '}
                                                        <div style={{fontSize:'1.5rem', lineHeight: 1, fontWeight:500}}>
                                                            {price}
                                                        </div>
                                                        <div>{priceChange}</div>
                                                    </RowBetween>
                                                </AutoColumn>
                                            </Panel>
                                        )}
                                        <Panel>
                                            <AutoColumn gap="20px">
                                                <RowBetween>
                                                    <div>Total Liquidity</div>
                                                    <div />
                                                </RowBetween>
                                                <RowBetween align="flex-end">
                                                    <div style={{fontSize:'1.5rem', lineHeight: 1, fontWeight:500}}>
                                                        {liquidity}
                                                    </div>
                                                    <div>{liquidityChange}</div>
                                                </RowBetween>
                                            </AutoColumn>
                                        </Panel>
                                        <Panel>
                                            <AutoColumn gap="20px">
                                                <RowBetween>
                                                    <div>Volume (24hrs)</div>
                                                    <div />
                                                </RowBetween>
                                                <RowBetween align="flex-end">
                                                    <div style={{fontSize:'1.5rem', lineHeight: 1, fontWeight:500}}>
                                                        {volume}
                                                    </div>
                                                    <div>{volumeChange}</div>
                                                </RowBetween>
                                            </AutoColumn>
                                        </Panel>

                                        <Panel>
                                            <AutoColumn gap="20px">
                                                <RowBetween>
                                                    <div>Transactions (24hrs)</div>
                                                    <div />
                                                </RowBetween>
                                                <RowBetween align="flex-end">
                                                    <div style={{fontSize:'1.5rem', lineHeight: 1, fontWeight:500}}>
                                                        {oneDayTxns ? localNumber(oneDayTxns) : 0}
                                                    </div>
                                                    <div>{txnChangeFormatted}</div>
                                                </RowBetween>
                                            </AutoColumn>
                                        </Panel>
                                        <Panel
                                            style={{
                                                gridColumn: below1080 ? '1' : '2/4',
                                                gridRow: below1080 ? '' : '1/4',
                                            }}
                                        >
                                            <TokenChart address={address} color={'blue'} base={priceUSD} />
                                        </Panel>
                                    </PanelWrapper>
                                </> */}
                            </DashboardWrapper>
                        </WarningGrouping>
                        <Row>
                            <Widgets address={address} price={priceUSD} />
                        </Row>
                        <Row>
                            <TokenChart dataColors='["--vz-success", "--vz-danger"]' />
                            <TokenInfo address={address} />
                        </Row>
                    </ContentWrapper>
                </Container>
            </div>
        </React.Fragment>
    )
}


export default TokenPage;