import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const BAD_IMAGES = {}

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

const StyledEthereumLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
  }
`

export default function TokenLogo({ path, header = false, size = '24px', ...rest }) {
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(false)
    }, [path])

    const path1 = `https://saucerswap.finance${path}`

    if (error) {
      return (
        <Inline>
          <span {...rest} alt={''} style={{ fontSize: size }} role="img" aria-label="face">
            🤔
          </span>
        </Inline>
      )
    }

    return (
        <Inline>
            <Image
                {...rest}
                alt={''}
                src={path1}
                size={size}
                onError={(event) => {
                    setError(true)
                    event.preventDefault()
                }}
            />
        </Inline>
    )
}
