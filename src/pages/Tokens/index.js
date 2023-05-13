import React, { useEffect } from "react";
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Col, Container, Row } from "reactstrap";
import { useMedia } from 'react-use'

import Panel from '../../Components/Panel'
import TopTokenList from '../../Components/TokenList'
import { RowBetween } from '../../Components/Row'
import Search from '../../Components/Search'
import { useAllTokensInSaucerswap } from '../../contexts/GlobalData'
import TokenPage from './TokenPage'

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
    const { tokenAddress } = useParams()
    const allTokens = useAllTokensInSaucerswap()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const below600 = useMedia('(max-width: 800px)')
    if (tokenAddress === undefined)
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <PageWrapper>
                            <FullWrapper>
                                <RowBetween>
                                    <div style={{ fontWeight: 500, color: 'white', fontSize: 24 }}>All Tokens</div>
                                    {!below600 && <Search small={true} />}
                                </RowBetween>
                                <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
                                    <TopTokenList tokens={allTokens} />
                                </Panel>
                            </FullWrapper>
                        </PageWrapper>
                    </Container>
                </div>
            </React.Fragment>
        )
    else
        return (
            <TokenPage address={tokenAddress} />
        )
}

export default Tokens;