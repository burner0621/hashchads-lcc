import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { Box, Flex, Text } from 'rebass'
import TokenLogo from '../TokenLogo'
import { CustomLink } from '../Link'
import Row from '../Row'

import { formattedNum, formattedPercent } from '../../utils'
import { useMedia } from 'react-use'
import withRouter from '../Common/withRouter';

const Divider = styled(Box)`
  height: 1px;
  background-color: white;
`

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 2em;
`

const Arrow = styled.div`
  color: grey;
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 0 0rem;

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 180px 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol ';

    > * {
      justify-content: flex-end;
      width: 100%;

      &:first-child {
        justify-content: flex-start;
      }
    }
  }
@media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol price change';
  }
`

const ListWrapper = styled.div`
  padding: 0 16px;
`

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: #ced4da !important;
  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: #ced4da !important;

  & > * {
    font-size: 14px;
  }
  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const SORT_FIELD = {
    LIQ: 'liquidity',
    VOL: 'oneDayVolumeUSD',
    // VOL_UT: 'oneDayVolumeUT',
    SYMBOL: 'symbol',
    NAME: 'name',
    PRICE: 'priceUsd',
    CHANGE: 'priceChangeUSD',
}

const TopTokenList = ({ tokens = [], itemMax = 10, useTracked = false }) => {

    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    const [sortDirection, setSortDirection] = useState(true)
    const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VOL)

    const below1080 = useMedia('(max-width: 1080px)')
    const below680 = useMedia('(max-width: 680px)')
    const below600 = useMedia('(max-width: 600px)')

    useEffect(() => {
        if (tokens && itemMax) {
            let extraPages = 1
            if (tokens.length % itemMax === 0) {
                extraPages = 0
            }
            setMaxPage(Math.floor(tokens.length / itemMax) + extraPages)
        }
    }, [tokens, itemMax])

    const filteredList = useMemo(() => {
        return (
            tokens &&
            tokens
                .sort((a, b) => {
                    if (sortedColumn === SORT_FIELD.SYMBOL || sortedColumn === SORT_FIELD.NAME) {
                        return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
                    }
                    return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
                        ? (sortDirection ? -1 : 1) * 1
                        : (sortDirection ? -1 : 1) * -1
                })
                .slice(itemMax * (page - 1), page * itemMax)
        )
    }, [tokens, itemMax, page, sortDirection, sortedColumn])

    const ListItem = ({ item, index }) => {
        return (
            <DashGrid style={{ height: '48px', display: "flex", paddingRight: 4, color: "#ced4da"}} focus={true}>
                <DataText area="name" fontWeight="500" style={{minWidth: 100}}>
                    <Row>
                        {!below680 && 
                            <div style={{ marginRight: '1rem', width: '10px' }}>{index}</div>
                        }
                        <TokenLogo path={item.icon} />
                        <CustomLink style={{ marginLeft: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 140, display: 'flex' }} to={'/tokens/' + item.id}>
                            {below680 ? item.symbol : item.name}
                            <TokenLogo diligence={item.dueDiligenceComplete} logoType={"warning"} />
                        </CustomLink>
                    </Row>
                </DataText>
                {/* {!below680 && ( */}
                    <DataText area="symbol" color="text" fontWeight="500" style={{ justifyContent: 'flex-end', minWidth: 60 }}>
                        {item.symbol}
                    </DataText>
                {/* )} */}
                <DataText area="liq" color="text" fontWeight="500" style={{minWidth: 110}}>{formattedNum(item.liquidity, true)}</DataText>
                <DataText area="vol" color="text" fontWeight="500" style={{minWidth: 90}}>{formattedNum(item.oneDayVolumeUSD, true)}</DataText>
                {/* {!below1080 && ( */}
                    <DataText area="price" color="text" fontWeight="500" style={{minWidth: 110}}>
                        {formattedNum(item.priceUsd, true)}
                    </DataText>
                {/* )} */}
                {/* {!below1080 &&  */}
                    <DataText area="change" color="text" fontWeight="500" style={{minWidth: 70, paddingRight: 4}}>{formattedPercent(item.priceChangeUSD)}</DataText>
                {/* } */}
            </DashGrid>
        )
    }

    return (
        <ListWrapper>
            <div style={{overflowX: "auto"}}>
            <DashGrid center={true} style={{ height: 'fit-content', padding: '0 8px 1rem 8px', display: "flex" }}>
                <Flex alignItems="center" justifyContent="flexStart" style={{minWidth: 100}}>
                    <ClickableText
                        color="text"
                        area="name"
                        fontWeight="500"
                        onClick={(e) => {
                            setSortedColumn(SORT_FIELD.NAME)
                            setSortDirection(sortedColumn !== SORT_FIELD.NAME ? true : !sortDirection)
                        }}
                    >
                        {'Name'} {sortedColumn === SORT_FIELD.NAME ? (!sortDirection ? '↑' : '↓') : ''}
                    </ClickableText>
                </Flex>
                {/* {!below680 && ( */}
                    <Flex alignItems="center" style={{ justifyContent: 'flex-end', minWidth: 60 }}>
                        <ClickableText
                            area="symbol"
                            onClick={() => {
                                setSortedColumn(SORT_FIELD.SYMBOL)
                                setSortDirection(sortedColumn !== SORT_FIELD.SYMBOL ? true : !sortDirection)
                            }}
                        >
                            Symbol {sortedColumn === SORT_FIELD.SYMBOL ? (!sortDirection ? '↑' : '↓') : ''}
                        </ClickableText>
                    </Flex>
                {/* )} */}

                <Flex alignItems="center" style={{minWidth: 100}}>
                    <ClickableText
                        area="liq"
                        onClick={(e) => {
                            setSortedColumn(SORT_FIELD.LIQ)
                            setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
                        }}
                    >
                        Liquidity {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? '↑' : '↓') : ''}
                    </ClickableText>
                </Flex>
                <Flex alignItems="center" style={{minWidth: 90}}>
                    <ClickableText
                        area="vol"
                        onClick={() => {
                            setSortedColumn(useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL)
                            setSortDirection(
                                sortedColumn !== (useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL) ? true : !sortDirection
                            )
                        }}
                    >
                        Volume (24hrs)
                        {sortedColumn === (useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL) ? (!sortDirection ? '↑' : '↓') : ''}
                    </ClickableText>
                </Flex>
                {/* {!below1080 && ( */}
                    <Flex alignItems="center" style={{minWidth: 110}}>
                        <ClickableText
                            area="price"
                            onClick={(e) => {
                                setSortedColumn(SORT_FIELD.PRICE)
                                setSortDirection(sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection)
                            }}
                        >
                            Price {sortedColumn === SORT_FIELD.PRICE ? (!sortDirection ? '↑' : '↓') : ''}
                        </ClickableText>
                    </Flex>
                {/* )} */}
                {/* {!below1080 && ( */}
                    <Flex alignItems="center" style={{minWidth: 70}}>
                        <ClickableText
                            area="change"
                            onClick={(e) => {
                                setSortedColumn(SORT_FIELD.CHANGE)
                                setSortDirection(sortedColumn !== SORT_FIELD.CHANGE ? true : !sortDirection)
                            }}
                        >
                            Price Change (24hrs)
                            {sortedColumn === SORT_FIELD.CHANGE ? (!sortDirection ? '↑' : '↓') : ''}
                        </ClickableText>
                    </Flex>
                {/* )} */}
            </DashGrid>
            {/* <Divider /> */}
            <List p={0}>
                {filteredList &&
                    filteredList.map((item, index) => {
                        return (
                            <div key={index}>
                                <ListItem key={index} index={(page - 1) * itemMax + index + 1} item={item} />
                                {/* <Divider /> */}
                            </div>
                        )
                    })}
            </List>
            </div>
            <PageButtons>
                <div onClick={() => setPage(page === 1 ? page : page - 1)}>
                    <Arrow faded={page === 1 ? true : false}>←</Arrow>
                </div>
                <div>{'Page ' + page + ' of ' + maxPage}</div>
                <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
                    <Arrow faded={page === maxPage ? true : false}>→</Arrow>
                </div>
            </PageButtons>
        </ListWrapper>
    )
}

export default TopTokenList