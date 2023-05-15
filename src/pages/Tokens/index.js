import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Container, FormGroup, Input, Label, ButtonGroup } from "reactstrap";
import { useMedia } from 'react-use'

import Panel from '../../Components/Panel'
import TopTokenList from '../../Components/TokenList'
import { RowBetween } from '../../Components/Row'
import Search from '../../Components/Search'
import TokenPage from './TokenPage'
import { TOKEN_TYPE, TOKEN_TYPE_NAME } from "../../constants";
import Select from "react-select";
import { TokenType } from "@hashgraph/sdk";
import { useAllTokensInSaucerswap } from "../../contexts/GlobalData";

export const PageWrapper = styled.div`
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
export const FullWrapper = styled.div`
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
const Tokens = () => {
    document.title = "Tokens";
    const { tokenAddress } = useParams()
    const allTokens = useAllTokensInSaucerswap()
    const [tokenType, setTokenType] = useState(TOKEN_TYPE.all)

    const [gainerTokens, setGainers] = useState([]);
    const [loserTokens, setLosers] = useState([]);

    const downloadFile = ({ data, fileName, fileType }) => {
        const blob = new Blob([data], { type: fileType })

        const a = document.createElement('a')
        a.download = tokenType == TOKEN_TYPE.all ? 'hashchads-all-tokens.csv'
            : tokenType == TOKEN_TYPE.gainer ? 'hashchads-gainer-tokens.csv'
                : 'hashchads-loser-tokens.csv'
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    const exportToCsv = e => {
        e.preventDefault()

        // Headers for each column
        let headers = ['No, Name, Symbol, Liquidity, Volume, Price, PriceChange']
        let tokens = [];
        let no = 1;
        for (let i = 0; i < allTokens.length; i++) {
            /**
             * tokenData format
             * decimals: 8
             * description: "Hedera is a public, open source, proof-of-stake network, with native cryptocurrency HBAR.  HBAR is used to pay application transaction fees and protect the network from attack through proof-of-stake. When HBAR is staked to network nodes, it has a weighted influence on consensus for validating transactions.  Developers use HBAR to pay for network services, such as transferring tokens, minting fungible and non-fungible tokens, calling smart contracts, and logging data. For every transaction submitted to the network, HBAR is used to pay fees that compensate validator nodes for bandwidth, compute, and storage."
             * dueDiligenceComplete: true
             * icon: "/images/tokens/hbar.svg"
             * id: "0.0.1456986"\
             * isFeeOnTransferToken: false
             * name: "WHBAR [new]"
             * oneDayVolumeUSD: 1075398.84313685
             * price: "100000000"
             * priceChangeUSD: 0.9644535638080494
             * priceUsd: 0.05249532
             * sentinelReport: null
             * symbol: "HBAR"
             * timestampSecondsLastListingChange: 0
             * twitterHandle: "hedera"
             * website: "https://hedera.com/"
             */
            let tokenData = allTokens[i];

            // if(tokenType == TOKEN_TYPE.gainer) {
            // no ++
            //     continue;
            // }
            // if(tokenType == TOKEN_TYPE.loser) {
            // no ++
            //     continue;
            // }

            tokens.push({
                no: no,
                name: tokenData.name,
                symbol: tokenData.symbol,
                liquidity: tokenData.totalLiquidityUSD || 0,
                volume: tokenData.oneDayVolumeUSD,
                price: tokenData.priceUsd,
                price_change: tokenData.priceChangeUSD
            });
            no++
        }
        // Convert users data to a csv
        let usersCsv = tokens.reduce((acc, token) => {
            const { no, name, symbol, liquidity, volume, price, price_change } = token
            acc.push([no, name, symbol, liquidity, volume, price, price_change].join(','))
            return acc
        }, [])


        downloadFile({
            data: [...headers, ...usersCsv].join('\n'),
            fileName: 'hashchads.csv',
            fileType: 'text/csv',
        })
    }

    const renderTokenTypes = () => {
        let options = [];
        for (let i = 0; i < Object.keys(TOKEN_TYPE).length; i++) {
            let key = Object.keys(TOKEN_TYPE)[i];
            options.push({
                label: TOKEN_TYPE_NAME[key],
                value: key
            })
        }
        return options;
    }

    const handleTokenType = (type) => {
        if(type === TOKEN_TYPE.gainer) {
            if (tokenType === TOKEN_TYPE.loser) {
                setTokenType(TOKEN_TYPE.all)
            } else if (tokenType === TOKEN_TYPE.all) {
                setTokenType(TOKEN_TYPE.loser)
            }
        } else {
            if (tokenType === TOKEN_TYPE.gainer) {
                setTokenType(TOKEN_TYPE.all)
            } else if (tokenType === TOKEN_TYPE.all) {
                setTokenType(TOKEN_TYPE.gainer)
            }
        }
        
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        let gainers = [];
        let losers = [];
        for (let i = 0; i < allTokens.length; i++) {
            if (allTokens[i].priceChangeUSD >= 0) {
                gainers.push(allTokens[i]);
            } else {
                losers.push(allTokens[i]);
            }
        }
        setGainers(gainers);
        setLosers(losers)
    }, [allTokens, tokenType]);

    const below600 = useMedia('(max-width: 600px)')
    const below900 = useMedia('(max-width: 900px)')
    if (tokenAddress === undefined)
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <PageWrapper>
                            <FullWrapper>
                                <RowBetween>
                                    <div style={{ display: "flex", width: '100%', justifyContent: 'space-between', marginRight: '10px' }}>
                                        <div style={{ fontWeight: 500, color: 'white', fontSize: 24 }}>{TOKEN_TYPE_NAME[tokenType]}</div>
                                        {!below600 &&
                                            <div className="d-flex items-center" style={{ alignItems: "center" }}>

                                                <ButtonGroup style={{ marginRight: 5 }}>
                                                    {tokenType == TOKEN_TYPE.gainer || tokenType == TOKEN_TYPE.all ? (
                                                        <Button
                                                            className="btn-force"
                                                            color="primary"
                                                            onClick={() => {handleTokenType(TOKEN_TYPE.gainer)}}>
                                                            <i className="mdi mdi-elevation-rise"></i>Gainers
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            color="dark"
                                                            outline
                                                            onClick={() => {handleTokenType(TOKEN_TYPE.gainer)}}>
                                                            <i className="mdi mdi-elevation-rise"></i>Gainers
                                                        </Button>
                                                    )}
                                                    {tokenType == TOKEN_TYPE.loser || tokenType == TOKEN_TYPE.all ? (
                                                        <Button
                                                            color="primary"
                                                            className="btn-force"
                                                            onClick={() => {handleTokenType(TOKEN_TYPE.loser)}}>
                                                            <i className="mdi mdi-elevation-decline"></i>Losers
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            color="dark"
                                                            outline
                                                            onClick={() => {handleTokenType(TOKEN_TYPE.loser)}}>
                                                            <i className="mdi mdi-elevation-decline"></i>Losers
                                                        </Button>
                                                    )}
                                                </ButtonGroup>
                                                {/* <FormGroup switch style={{ marginRight: 5 }}>
                                                    <Input
                                                        id="gainersSwitch"
                                                        type="switch"
                                                        style={{ height: "1.5rem", width: '3rem', marginRight: 5 }}
                                                        checked={tokenType == TOKEN_TYPE.gainer || tokenType == TOKEN_TYPE.all}
                                                        onClick={() => {
                                                            if (tokenType != TOKEN_TYPE.gainer) {
                                                                setTokenType(tokenType == TOKEN_TYPE.loser ?
                                                                    TOKEN_TYPE.all : (tokenType == TOKEN_TYPE.all ?
                                                                        TOKEN_TYPE.loser : TOKEN_TYPE.gainer));
                                                            }
                                                        }}
                                                    />
                                                    <Label check style={{ fontSize: 18, fontWeight: 450 }}>Gainers</Label>
                                                </FormGroup>
                                                <FormGroup switch>
                                                    <Input
                                                        id="losersSwitch"
                                                        type="switch"
                                                        style={{ height: "1.5rem", width: '3rem', marginRight: 5 }}
                                                        checked={tokenType == TOKEN_TYPE.loser || tokenType == TOKEN_TYPE.all}
                                                        onClick={() => {
                                                            if (tokenType != TOKEN_TYPE.loser) {
                                                                setTokenType(tokenType == TOKEN_TYPE.gainer ?
                                                                    TOKEN_TYPE.all : (tokenType == TOKEN_TYPE.all ?
                                                                        TOKEN_TYPE.gainer : TOKEN_TYPE.loser));
                                                            }
                                                        }}
                                                    />
                                                    <Label check style={{ fontSize: 18, fontWeight: 450 }}>Losers</Label>
                                                </FormGroup> */}
                                            </div>
                                        }
                                    </div>
                                    {!below900 && <Search small={true} />}
                                    {!below600 && <Button onClick={exportToCsv} className="btn-download" size="sm" color="light" style={{ marginLeft: '5px' }}>Download CSV</Button>}
                                </RowBetween>
                                {/* TABLE ALL TOKENS */}
                                {(tokenType == TOKEN_TYPE.all) &&
                                    <Panel className="hsla-bg" style={{ marginTop: '6px', padding: '1.125rem 0 ', border: 'none' }}>
                                        <TopTokenList tokens={allTokens} />
                                    </Panel>
                                }
                                {/* TEXT GAINERS */}
                                {/* {tokenType == TOKEN_TYPE.all &&
                                    <RowBetween>
                                        <span style={{fontSize: 18, fontWeight: 450}}>Gainers</span>
                                    </RowBetween>
                                } */}
                                {/* TABLE GAINERS */}
                                {(tokenType == TOKEN_TYPE.gainer) &&
                                    <Panel className="hsla-bg" style={{ marginTop: '6px', padding: '1.125rem 0 ', border: 'none' }}>
                                        <TopTokenList tokens={gainerTokens} />
                                    </Panel>
                                }
                                {/* TEXT LOSERS */}
                                {/* {tokenType == TOKEN_TYPE.all &&
                                    <RowBetween>
                                        <span style={{fontSize: 18, fontWeight: 450}}>Losers</span>
                                    </RowBetween>
                                } */}
                                {/* TABLE LOSERS */}
                                {(tokenType == TOKEN_TYPE.loser) &&
                                    <Panel className="hsla-bg" style={{ marginTop: '6px', padding: '1.125rem 0 ', border: 'none' }}>
                                        <TopTokenList tokens={loserTokens} />
                                    </Panel>
                                }
                            </FullWrapper>
                        </PageWrapper>
                    </Container>
                </div>
            </React.Fragment >
        )
    else
        return (
            <TokenPage address={tokenAddress} />
        )
}

export default Tokens;