import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import { AutoRow, RowBetween, RowFixed } from '../Row'

import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from '../../utils'
import { OptionButton } from '../ButtonStyled'
import { darken } from 'polished'
import { useMedia, usePrevious } from 'react-use'
import { timeframeOptions } from '../../constants'
import { useTokenChartData, useTokenPriceData } from '../../contexts/TokenData'
import DropdownSelect from '../DropdownSelect'
import CandleStickChart from '../CandleChart'
import LocalLoader from '../LocalLoader'
import { ImpulseSpinner } from '../Impulse'
import { AutoColumn } from '../Column'
import { Activity } from 'react-feather'

const ChartWrapper = styled.div`
  height: 100%;
  min-height: 300px;
  margin-bottom: 20px;
  border: 1px solid white;
  padding: 10px;
  border-radius: 10px;
  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

const PriceOption = styled(OptionButton)`
  border-radius: 2px;
`

const CHART_VIEW = {
    VOLUME: 'Volume',
    LIQUIDITY: 'Liquidity',
    PRICE: 'Price',
    LINE_PRICE: 'Price (Line)',
}

const DATA_FREQUENCY = {
    DAY: 'DAY',
    HOUR: 'HOUR',
    LINE: 'LINE',
}

const TokenChart = ({ address, color, base, priceData, chartFilter, timeWindow, frequency }) => {
    // settings for the window and candle width


    const textColor = 'white'

    // reset view on new address
    // const addressPrev = usePrevious(address)
    // useEffect(() => {
    //     if (address !== addressPrev && addressPrev) {
    //         setChartFilter(CHART_VIEW.LIQUIDITY)
    //     }
    // }, [address, addressPrev])

    let chartData = useTokenChartData(address)

    const below1080 = useMedia('(max-width: 1080px)')
    const below600 = useMedia('(max-width: 600px)')

    let utcStartTime = getTimeframe(timeWindow)
    const domain = [(dataMin) => (dataMin > utcStartTime ? dataMin : utcStartTime), 'dataMax']
    const aspect = below1080 ? 60 / 32 : below600 ? 60 / 42 : 60 / 22

    chartData = chartData?.filter((entry) => entry.timestampSeconds >= utcStartTime)

    // update the width on a window resize
    const ref = useRef()
    const isClient = typeof window === 'object'
    const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
    useEffect(() => {
        if (!isClient) {
            return false
        }
        function handleResize() {
            setWidth(ref?.current?.container?.clientWidth ?? width)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isClient, width]) // Empty array ensures that effect is only run on mount and unmount
    return (
        <ChartWrapper>
            {chartFilter === CHART_VIEW.LIQUIDITY && chartData && chartData.length && (
                <ResponsiveContainer aspect={aspect}>
                    <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            tickLine={false}
                            axisLine={false}
                            interval="preserveEnd"
                            tickMargin={16}
                            minTickGap={120}
                            tickFormatter={(tick) => toNiceDate(tick)}
                            dataKey="timestampSeconds"
                            tick={{ fill: textColor }}
                            type={'number'}
                            domain={['dataMin', 'dataMax']}
                        />
                        <YAxis
                            type="number"
                            orientation="right"
                            tickFormatter={(tick) => '$' + toK(tick)}
                            axisLine={false}
                            tickLine={false}
                            interval="preserver"
                            minTickGap={80}
                            yAxisId={0}
                            tick={{ fill: textColor }}
                            // range={10}
                            // tickMargin={16}
                            domain="auto"
                        />
                        <Tooltip
                            cursor={true}
                            formatter={(val) => val ? formattedNum(val, true) : ""}
                            
                            labelFormatter={(label) => toNiceDateYear(label)}
                            labelStyle={{ paddingTop: 4 }}
                            contentStyle={{
                                padding: '10px 14px',
                                borderRadius: 10,
                                borderColor: color,
                                color: 'black',
                            }}
                            wrapperStyle={{ top: -70, left: -10 }}
                        />
                        <Area
                            key={'other'}
                            dataKey={'liquidityUsd'}
                            stackId="2"
                            strokeWidth={2}
                            dot={false}
                            type="monotone"
                            name={'Liquidity'}
                            yAxisId={0}
                            stroke={darken(0.12, color)}
                            fill="url(#colorUv)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
            {chartFilter === CHART_VIEW.PRICE &&
                (frequency === DATA_FREQUENCY.LINE ? (
                    <ResponsiveContainer aspect={below1080 ? 60 / 32 : 60 / 16}>
                        <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                tickLine={false}
                                axisLine={false}
                                interval="preserveEnd"
                                tickMargin={16}
                                minTickGap={120}
                                tickFormatter={(tick) => toNiceDate(tick)}
                                dataKey="timestampSeconds"
                                tick={{ fill: textColor }}
                                type={'number'}
                                domain={domain}
                            />
                            <YAxis
                                type="number"
                                orientation="right"
                                tickFormatter={(tick) => '$' + toK(tick)}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveEnd"
                                minTickGap={80}
                                yAxisId={0}
                                tick={{ fill: textColor }}
                            />
                            <Tooltip
                                cursor={true}
                                formatter={(val) => val ? formattedNum(val, true) : ""}
                                labelFormatter={(label) => toNiceDateYear(label)}
                                labelStyle={{ paddingTop: 4 }}
                                contentStyle={{
                                    padding: '10px 14px',
                                    borderRadius: 10,
                                    borderColor: color,
                                    color: 'black',
                                }}
                                wrapperStyle={{ top: -70, left: -10 }}
                            />
                            <Area
                                key={'other'}
                                dataKey={'avgUsd'}
                                stackId="2"
                                strokeWidth={2}
                                dot={false}
                                type="monotone"
                                name={'Price'}
                                yAxisId={0}
                                stroke={darken(0.12, color)}
                                fill="url(#colorUv)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : priceData && priceData.length ? (
                    <ResponsiveContainer aspect={aspect} ref={ref}>
                        <CandleStickChart data={priceData} width={width} base={base} />
                    </ResponsiveContainer>
                ) : (
                    // <LocalLoader />
                    <div className='d-flex items-center justify-center items-center'>
                        <ImpulseSpinner />
                    </div>
                ))}

            {chartFilter === CHART_VIEW.VOLUME && (
                <ResponsiveContainer aspect={aspect}>
                    <BarChart margin={{ top: 0, right: 10, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
                        <XAxis
                            tickLine={false}
                            axisLine={false}
                            interval="preserveEnd"
                            minTickGap={80}
                            tickMargin={14}
                            tickFormatter={(tick) => toNiceDate(tick)}
                            dataKey="timestampSeconds"
                            tick={{ fill: textColor }}
                            type={'number'}
                            domain={['dataMin', 'dataMax']}
                        />
                        <YAxis
                            type="number"
                            axisLine={false}
                            tickMargin={16}
                            tickFormatter={(tick) => '$' + toK(tick)}
                            tickLine={false}
                            orientation="right"
                            interval="preserveEnd"
                            minTickGap={80}
                            yAxisId={0}
                            tick={{ fill: textColor }}
                        />
                        <Tooltip
                            cursor={{ fill: color, opacity: 0.1 }}
                            formatter={(val) => val ? formattedNum(val, true) : ""}
                            labelFormatter={(label) => toNiceDateYear(label)}
                            labelStyle={{ paddingTop: 4 }}
                            contentStyle={{
                                padding: '10px 14px',
                                borderRadius: 10,
                                borderColor: color,
                                color: 'black',
                            }}
                            wrapperStyle={{ top: -70, left: -10 }}
                        />
                        <Bar
                            type="monotone"
                            name={'Volume'}
                            dataKey={'volumeUsd'}
                            fill={color}
                            opacity={'0.4'}
                            yAxisId={0}
                            stroke={color}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </ChartWrapper>
    )
}

export default TokenChart
