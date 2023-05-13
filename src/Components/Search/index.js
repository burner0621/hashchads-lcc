import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Search as SearchIcon, X } from 'react-feather'
import styled from 'styled-components'
import { useMedia } from 'react-use'

import Row, { RowFixed } from '../Row'
import { BasicLink } from '../Link'

// import FormattedName from '../FormattedName'
import TokenLogo from '../TokenLogo'
import DoubleTokenLogo from '../DoubleLogo'
import { useAllPairsInSaucerswap, useAllTokensInSaucerswap } from '../../contexts/GlobalData'

const Container = styled.div`
  height: 48px;
  z-index: 30;
  position: relative;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`
const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 16px;
  border-radius: 12px;
  border-bottom-right-radius: ${({ open }) => (open ? '0px' : '12px')};
  border-bottom-left-radius: ${({ open }) => (open ? '0px' : '12px')};
  z-index: 9999;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  box-shadow: ${({ open, small }) =>
        !open && !small
            ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
            : 'none'};
  @media screen and (max-width: 500px) {
    box-shadow: ${({ open }) =>
        !open
            ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
            : 'none'};
  }
`
const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  font-size: ${({ large }) => (large ? '20px' : '14px')};

  ::placeholder {
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const SearchIconLarge = styled(SearchIcon)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  pointer-events: none;
`

const CloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  :hover {
    cursor: pointer;
  }
`

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  width: 100%;
  top: 50px;
  max-height: 540px;
  overflow: auto;
  left: 0;
  padding-bottom: 20px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.04);
  display: ${({ hide }) => hide && 'none'};
`

const MenuItem = styled(Row)`
  padding: 1rem;
  font-size: 0.85rem;
  & > * {
    margin-right: 6px;
  }
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const Heading = styled(Row)`
  padding: 1rem;
  display: ${({ hide = false }) => hide && 'none'};
`

const Gray = styled.span`
  color: #888d9b;
`

const Blue = styled.span`
  color: #2172e5;
  :hover {
    cursor: pointer;
  }
`

export const Search = ({ small = false }) => {

    const [showMenu, toggleMenu] = useState(false)
    const [value, setValue] = useState('')
    const [, toggleShadow] = useState(false)
    const [, toggleBottomShadow] = useState(false)
    const [searchedPairs, setSearchedPairs] = useState([])
    const [searchedTokens, setSearchedTokens] = useState([])
    const [tokensShown, setTokensShown] = useState(3)
    const [pairsShown, setPairsShown] = useState(3)

    const below700 = useMedia('(max-width: 700px)')
    const below470 = useMedia('(max-width: 470px)')
    const below410 = useMedia('(max-width: 410px)')

    let allPairs = useAllPairsInSaucerswap()
    let allTokens = useAllTokensInSaucerswap()

    useEffect(() => {
        if (value !== '') {
            toggleMenu(true)
        } else {
            toggleMenu(false)
        }
    }, [value])

    let uniquePairs = []
    let pairsFound = {}
    allPairs &&
        allPairs.map((pair) => {
            if (!pairsFound[pair.id]) {
                pairsFound[pair.id] = true
                uniquePairs.push(pair)
            }
            return true
        })

    let uniqueTokens = []
    let found = {}

    allTokens &&
        allTokens.map((token) => {
            if (!found[token.id]) {
                found[token.id] = true
                uniqueTokens.push(token)
            }
            return true
        })

    // add the searched tokens to the list if not found yet
    allTokens = allTokens.concat(
        searchedTokens.filter((searchedToken) => {
            let included = false
            allTokens.map((token) => {
                if (token.id === searchedToken.id) {
                    included = true
                }
                return true
            })
            return !included
        })
    )

    const filteredPairList = useMemo(() => {
        return uniquePairs
            ? uniquePairs
                // .sort((pairA, pairB) => {
                //     if (pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
                //         return parseFloat(pairA.trackedReserveETH) > parseFloat(pairB.trackedReserveETH) ? -1 : 1
                //     }
                //     if (pairA?.trackedReserveETH && !pairB?.trackedReserveETH) {
                //         return -1
                //     }
                //     if (!pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
                //         return 1
                //     }
                //     return 0
                // })
                .filter((pair) => {
                    if (value && value.includes(' ')) {
                        const pairA = value.split(' ')[0]?.toUpperCase()
                        const pairB = value.split(' ')[1]?.toUpperCase()
                        return (
                            (pair.tokenA?.symbol.includes(pairA) || pair.tokenA?.symbol.includes(pairB)) &&
                            (pair.tokenB?.symbol.includes(pairA) || pair.tokenB?.symbol.includes(pairB))
                        )
                    }
                    if (value && value.includes('-')) {
                        const pairA = value.split('-')[0]?.toUpperCase()
                        const pairB = value.split('-')[1]?.toUpperCase()
                        return (
                            (pair.tokenA.symbol?.includes(pairA) || pair.tokenA?.symbol.includes(pairB)) &&
                            (pair.tokenB.symbol?.includes(pairA) || pair.tokenB?.symbol.includes(pairB))
                        )
                    }
                    const regexMatches = Object.keys(pair).map((field) => {
                        const isAddress = value?.slice(0, 2) === '0x'
                        if (field === 'id' && isAddress) {
                            return pair[field]?.match(new RegExp(escapeRegExp(value), 'i'))
                        }
                        if (field === 'tokenA') {
                            return (
                                pair[field]?.symbol?.match(new RegExp(escapeRegExp(value), 'i')) ||
                                pair[field]?.name.match(new RegExp(escapeRegExp(value), 'i'))
                            )
                        }
                        if (field === 'tokenB') {
                            return (
                                pair[field]?.symbol?.match(new RegExp(escapeRegExp(value), 'i')) ||
                                pair[field]?.name.match(new RegExp(escapeRegExp(value), 'i'))
                            )
                        }
                        return false
                    })
                    return regexMatches.some((m) => m)
                })
            : []
    }, [uniquePairs, value])

    const filteredTokenList = useMemo(() => {
        return uniqueTokens
            ? uniqueTokens
                // .sort((tokenA, tokenB) => {
                //     if (tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
                //         return tokenA.oneDayVolumeUSD > tokenB.oneDayVolumeUSD ? -1 : 1
                //     }
                //     if (tokenA?.oneDayVolumeUSD && !tokenB?.oneDayVolumeUSD) {
                //         return -1
                //     }
                //     if (!tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
                //         return tokenA?.totalLiquidity > tokenB?.totalLiquidity ? -1 : 1
                //     }
                //     return 1
                // })
                .filter((token) => {
                    const regexMatches = Object.keys(token).map((tokenEntryKey) => {
                        const isAddress = value.slice(0, 4) === '0.0.'
                        if (tokenEntryKey === 'id' && isAddress) {
                            return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
                        }
                        if (tokenEntryKey === 'symbol' && !isAddress) {
                            return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
                        }
                        if (tokenEntryKey === 'name' && !isAddress) {
                            return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
                        }
                        return false
                    })
                    return regexMatches.some((m) => m)
                })
            : []
    }, [uniqueTokens, value])

    useEffect(() => {
        if (Object.keys(filteredTokenList).length > 2) {
            toggleShadow(true)
        } else {
            toggleShadow(false)
        }
    }, [filteredTokenList])

    useEffect(() => {
        if (Object.keys(filteredPairList).length > 2) {
            toggleBottomShadow(true)
        } else {
            toggleBottomShadow(false)
        }
    }, [filteredPairList])

    useEffect(() => {
        if (Object.keys(filteredTokenList).length > 2) {
            toggleShadow(true)
        } else {
            toggleShadow(false)
        }
    }, [filteredTokenList])

    allPairs = allPairs.concat(
        searchedPairs.filter((searchedPair) => {
            let included = false
            allPairs.map((pair) => {
                if (pair.id === searchedPair.id) {
                    included = true
                }
                return true
            })
            return !included
        })
    )

    allTokens = allTokens.concat(
        searchedTokens.filter((searchedToken) => {
            let included = false
            allTokens.map((token) => {
                if (token.id === searchedToken.id) {
                    included = true
                }
                return true
            })
            return !included
        })
    )

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
    }

    function onDismiss() {
        setPairsShown(3)
        setTokensShown(3)
        toggleMenu(false)
        setValue('')
    }

    // refs to detect clicks outside modal
    const wrapperRef = useRef()
    const menuRef = useRef()

    const handleClick = (e) => {
        if (
            !(menuRef.current && menuRef.current.contains(e.target)) &&
            !(wrapperRef.current && wrapperRef.current.contains(e.target))
        ) {
            setPairsShown(3)
            setTokensShown(3)
            toggleMenu(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    })
    
    return (
        <Container small={small}>
            <Wrapper open={showMenu} shadow={true} small={small} style={{border: "solid 1px #ff007a"}}>
                <Input
                    large={!small}
                    type={'text'}
                    ref={wrapperRef}
                    placeholder={
                        small
                            ? ''
                            : below410
                                ? 'Search...'
                                : below470
                                    ? 'Search Saucerswap...'
                                    : below700
                                        ? 'Search pairs and tokens...'
                                        : 'Search Saucerswap pairs and tokens...'
                    }
                    value={value}
                    style={{color: "white"}}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    onFocus={() => {
                        if (!showMenu) {
                            toggleMenu(true)
                        }
                    }}
                />
                {!showMenu ? <SearchIconLarge /> : <CloseIcon onClick={() => {toggleMenu(false);}} />}
            </Wrapper>
            <Menu hide={!showMenu} ref={menuRef} style={{zIndex: "300", background: "white"}}>
                <Heading>
                    <Gray>Pairs</Gray>
                </Heading>
                <div>
                    {filteredPairList && Object.keys(filteredPairList).length === 0 && (
                        <MenuItem>
                            <div>No results</div>
                        </MenuItem>
                    )}
                    {filteredPairList &&
                        filteredPairList.slice(0, pairsShown).map((pair) => {
                            //format incorrect names
                            // updateNameData(pair)
                            return (
                                <BasicLink to={'/pair/' + pair.contractId} key={pair.contractId} onClick={onDismiss}>
                                    <MenuItem>
                                        <DoubleTokenLogo a0={pair?.tokenA?.icon} a1={pair?.tokenB?.icon} margin={true} />
                                        <div style={{ marginLeft: '10px' }}>
                                            {pair.tokenA.symbol + '-' + pair.tokenB.symbol} Pair
                                        </div>
                                    </MenuItem>
                                </BasicLink>
                            )
                        })}
                    <Heading
                        hide={!(Object.keys(filteredPairList).length > 3 && Object.keys(filteredPairList).length >= pairsShown)}
                    >
                        <Blue
                            onClick={() => {
                                setPairsShown(pairsShown + 5)
                            }}
                        >
                            See more...
                        </Blue>
                    </Heading>
                </div>
                <Heading>
                    <Gray>Tokens</Gray>
                </Heading>
                <div>
                    {Object.keys(filteredTokenList).length === 0 && (
                        <MenuItem>
                            {/* <TYPE.body>No results</TYPE.body> */}
                            No results
                        </MenuItem>
                    )}

                    {filteredTokenList.slice(0, tokensShown).map((token) => {
                        // update displayed names
                        return (
                            <BasicLink to={'/token/' + token.id} key={token.id} onClick={onDismiss}>
                                <MenuItem>
                                    <RowFixed>
                                        <TokenLogo path={token.icon} style={{ marginRight: '10px' }} />
                                        {/* <FormattedName text={token.name} maxCharacters={20} style={{ marginRight: '6px' }} />
                                        (<FormattedName text={token.symbol} maxCharacters={6} />) */}
                                        <div style={{ marginLeft: '10px' }}>
                                            {token.name + "    (" + token.symbol + ")"}
                                        </div>
                                    </RowFixed>
                                </MenuItem>
                            </BasicLink>
                        )
                    })}

                    <Heading
                        hide={!(Object.keys(filteredTokenList).length > 3 && Object.keys(filteredTokenList).length >= tokensShown)}
                    >
                        <Blue
                            onClick={() => {
                                setTokensShown(tokensShown + 5)
                            }}
                        >
                            See more...
                        </Blue>
                    </Heading>
                </div>
            </Menu>
        </Container>
    )
}

export default Search