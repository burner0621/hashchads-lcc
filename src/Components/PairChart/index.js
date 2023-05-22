import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import { RowBetween, AutoRow } from '../Row'

import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from '../../utils'
import { OptionButton } from '../ButtonStyled'
import { darken } from 'polished'
import { usePairChartData, usePairData } from '../../contexts/PairData'

import { useMedia } from 'react-use'
import DropdownSelect from '../DropdownSelect'
import CandleStickChart from '../CandleChart'
import LocalLoader from '../LocalLoader'
import { ImpulseSpinner } from '../Impulse'
import { timeframeOptions } from '../../constants'
import { time } from 'echarts'
// import CandleStickChart from '../CandleChart'
// import LocalLoader from '../LocalLoader'
// import { useDarkModeManager } from '../../contexts/LocalStorage'

const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border-radius: 20px;
  color: red;
  height: ${({ height }) => height && height};
`

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 450px;
  padding: 10px;
  border: solid 1px white;
  border-radius: 10px;
  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`



const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
  RATE0: 'RATE0',
  RATE1: 'RATE1',
}

const PairChart = ({ address, poolId, pairData, color, base0, base1, chartFilter, timeWindow }) => {

  const textColor = 'white'

  let hourlyChartData, dailyChartData;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (poolId) [hourlyChartData, dailyChartData] = usePairChartData(poolId)

  // update the width on a window resize
  const ref = useRef()
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  const [height, setHeight] = useState(ref?.current?.container?.clientHeight)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
      setHeight(ref?.current?.container?.clientHeight ?? height)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [height, isClient, width]) // Empty array ensures that effect is only run on mount and unmount
console.log (chartData, timeWindow, timeWindow === timeframeOptions.WEEK, ">>>>>>>>>>>>><<<<<<<<<<<<<<<")
  useEffect(() => {
    if (timeWindow === timeframeOptions.WEEK) {
      let t = Date.now() / 1000 - 86400 * 7
      // eslint-disable-next-line array-callback-return
      let tmpData = hourlyChartData.map((item) => {
        console.log (item.timestampSeconds, "LLLLLLLLLLLLLL")
        if (item.timestampSeconds > t)
          return {
            openUsd: item.open,
            closeUsd: item.close,
            lowUsd: item.low,
            highUsd: item.high,
            timestampSeconds: item.timestampSeconds
          }
      })
      setChartData(tmpData)
    } else if (timeWindow === timeframeOptions.MONTH) {
      let t = Date.now() / 1000 - 86400 * 30
      // eslint-disable-next-line array-callback-return
      let tmpData = dailyChartData.map((item, idx) => {
        if (item.timestampSeconds > t)
          return ({
            openUsd: item.open,
            closeUsd: item.close,
            lowUsd: item.low,
            highUsd: item.high,
            timestampSeconds: item.timestampSeconds
          })
      })
      setChartData(tmpData)
    } else if (timeWindow === timeframeOptions.ALL_TIME) {
      let tmpData = dailyChartData.map((item, idx) => {
        return {
          openUsd: item.open,
          closeUsd: item.close,
          lowUsd: item.low,
          highUsd: item.high,
          timestampSeconds: item.timestampSeconds
        }
      })
      setChartData(tmpData)
    }
  }, [timeWindow])

  // get data for pair, and rates
  const hourlyData = hourlyChartData && hourlyChartData.length && hourlyChartData.map((item, idx) => {
    return {
      openUsd: item.open,
      closeUsd: item.close,
      lowUsd: item.low,
      highUsd: item.high,
      timestampSeconds: item.timestampSeconds
    }
  })
  const hourlyRate0 = hourlyData && hourlyData.length && hourlyData.map((item, idx) => {
    return {
      openUsd: 1 / item.openUsd,
      closeUsd: 1 / item.closeUsd,
      lowUsd: 1 / item.lowUsd,
      highUsd: 1 / item.highUsd,
      timestampSeconds: item.timestampSeconds
    }
  })
  const hourlyRate1 = hourlyData

  // formatted symbols for overflow
  const formattedSymbol0 =
    pairData?.tokenA?.symbol.length > 6 ? pairData?.tokenA?.symbol.slice(0, 5) + '...' : pairData?.tokenA?.symbol
  const formattedSymbol1 =
    pairData?.tokenB?.symbol.length > 6 ? pairData?.tokenB?.symbol.slice(0, 5) + '...' : pairData?.tokenB?.symbol

  const below1600 = useMedia('(max-width: 1600px)')
  const below1080 = useMedia('(max-width: 1080px)')
  const below600 = useMedia('(max-width: 600px)')

  let utcStartTime = getTimeframe(timeWindow)
  dailyChartData = dailyChartData?.filter((entry) => entry.timestampSeconds >= utcStartTime)

  if (dailyChartData && dailyChartData.length === 0) {
    return (
      <ChartWrapper>
        <EmptyCard height="500px">No historical data yet.</EmptyCard>{' '}
      </ChartWrapper>
    )
  }
  /**
   * Used to format values on chart on scroll
   * Needs to be raw html for chart API to parse styles
   * @param {*} val
   */
  function valueFormatter(val) {
    if (chartFilter === CHART_VIEW.RATE0) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol1}/${formattedSymbol0}<span>`
      )
    }
    if (chartFilter === CHART_VIEW.RATE1) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol0}/${formattedSymbol1}<span>`
      )
    }
  }

  const aspect = below1080 ? 60 / 20 : below1600 ? 60 / 28 : 60 / 22

  return (
    <ChartWrapper>

      {chartFilter === CHART_VIEW.LIQUIDITY && (
        <ResponsiveContainer aspect={aspect} style={{ height: '100%' }}>
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
              tickMargin={14}
              minTickGap={80}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="timestampSeconds"
              tick={{ fill: 'white' }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
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
              tickMargin={16}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={true}
              formatter={(val) => formattedNum(val, true)}
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
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={' (USD)'}
              dataKey={'liquidityUsd'}
              yAxisId={0}
              stroke={darken(0.12, color)}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {chartFilter === CHART_VIEW.RATE1 &&
        (hourlyRate1 ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart
              data={hourlyRate1}
              base={base0}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
            />
          </ResponsiveContainer>
        ) : (
          // <LocalLoader />
          <div className='d-flex items-center justify-center' style={{ width: '100%', height: '50%' }}>
            <ImpulseSpinner />
          </div>
        ))}

      {chartFilter === CHART_VIEW.RATE0 &&
        (hourlyRate0 ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart
              data={hourlyRate0}
              base={base1}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
            />
          </ResponsiveContainer>
        ) : (
          // <LocalLoader />
          <div className='d-flex items-center justify-center' style={{ width: '100%', height: '50%' }}>
            <ImpulseSpinner />
          </div>
        ))}

      {chartFilter === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={aspect}>
          <BarChart
            margin={{ top: 0, right: 0, bottom: 6, left: below1080 ? 0 : 10 }}
            barCategoryGap={1}
            data={dailyChartData}
          >
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
              interval="preserveEnd"
              orientation="right"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={{ fill: color, opacity: 0.1 }}
              formatter={(val) => formattedNum(val, true)}
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

export default PairChart
