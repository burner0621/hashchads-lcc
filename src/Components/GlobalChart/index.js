import React, { useState, useMemo, useEffect, useRef } from 'react'
import { ResponsiveContainer } from 'recharts'
import { timeframeOptions } from '../../constants'
import { getChartData, useGlobalDataContext } from '../../contexts/GlobalData'
import { useMedia } from 'react-use'
import { Spinner } from 'reactstrap'
import DropdownSelect from '../DropdownSelect'
import TradingViewChart, { CHART_TYPES } from '../TradingviewChart'
import { RowFixed } from '../Row'
import { OptionButton } from '../ButtonStyled'
import { getTimeframe } from '../../utils'
import { ImpulseSpinner } from '../Impulse'
import { useTimeframe } from '../../contexts/Application'
import socketIO from 'socket.io-client';
import * as env from "../../env";
const socket = socketIO.connect(env.BASE_URL);
const CHART_VIEW = {
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
}

const VOLUME_WINDOW = {
  WEEKLY: 'WEEKLY',
  DAYS: 'DAYS',
}
let isFetchingChartData = false;
const GlobalChart = ({ display }) => {
  const [loading, setLoading] = useState(true)
  // chart options
  const [chartView, setChartView] = useState(display === 'volume' ? CHART_VIEW.VOLUME : CHART_VIEW.LIQUIDITY)

  // time window and window size for chart
  const timeWindow = timeframeOptions.ALL_TIME
  const [volumeWindow, setVolumeWindow] = useState(VOLUME_WINDOW.DAYS)

  // const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD, oneWeekVolume, weeklyVolumeChange } = useGlobalData()
  const [state, {updatePrices, updateChart}] = useGlobalDataContext()
  // const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD, oneWeekVolume, weeklyVolumeChange } = useGlobalDataContext()
  const totalLiquidityUSD = state?.globalData?.totalLiquidityUSD;
  const oneDayVolumeUSD = state?.globalData?.oneDayVolumeUSD;
  const volumeChangeUSD = state?.globalData?.volumeChangeUSD;
  const liquidityChangeUSD = state?.globalData?.liquidityChangeUSD;
  const oneWeekVolume = state?.globalData?.oneWeekVolume;
  const weeklyVolumeChange = state?.globalData?.weeklyVolumeChange;

  const [stateLiquidityChangeUSD, setStateLiquidityChangeUSD] = useState(0)
  const [stateTotalLiquidityUSD, setStateTotalLiquidityUSD] = useState(0)
  const [stateVolumeChangeUSD, setStateVolumeChangeUSD] = useState(0)
  const [stateOneDayVolumeUSD, setStateOneDayVolumeUSD] = useState()
  const [stateOneWeekVolume, setStateOneWeekVolume] = useState()
  const [stateWeeklyVolumeChange, setStateWeeklyVolumeChange] = useState()

  useEffect(() => {
    setStateLiquidityChangeUSD(liquidityChangeUSD)
    setStateTotalLiquidityUSD(totalLiquidityUSD)
    setStateVolumeChangeUSD(volumeChangeUSD ? volumeChangeUSD: '--')
    setStateOneDayVolumeUSD(oneDayVolumeUSD)
    setStateOneWeekVolume(oneWeekVolume)
    setStateWeeklyVolumeChange(weeklyVolumeChange)
  }, [totalLiquidityUSD, volumeChangeUSD, liquidityChangeUSD, oneDayVolumeUSD, oneWeekVolume, weeklyVolumeChange])
  // based on window, get starttim
  let utcStartTime = getTimeframe(timeWindow)

  // global historical data
  const dailyData = state?.chartData?.daily
  const weeklyData = state?.chartData?.weekly

  const [oldestDateFetch, setOldestDateFetched] = useState()
  const [activeWindow] = useTimeframe()
  const [tmpPrices, setTmpPrices] = useState([])
  
  useEffect(() => {
    socket.on('getPricesResponse', (p) => {
      setTmpPrices(p)
      updatePrices(p);
    });
  }, [updatePrices]);

  /**
   * Keep track of oldest date fetched. Used to
   * limit data fetched until its actually needed.
   * (dont fetch year long stuff unless year option selected)
   */
  useEffect(() => {
    // based on window, get starttime
    let startTime = getTimeframe(activeWindow)

    if ((activeWindow && startTime < oldestDateFetch) || !oldestDateFetch) {
      setOldestDateFetched(startTime)
    }
  }, [activeWindow, oldestDateFetch])

  // fix for rebass tokens

  /**
   * Fetch data if none fetched or older data is needed
   */
  
  useEffect(() => {
    async function fetchData() {
      // historical stuff for chart
      const [data, weekelyData] = await getChartData(oldestDateFetch, tmpPrices)
      updateChart(data, weekelyData)
      isFetchingChartData = false
    }
    if (oldestDateFetch && !(dailyData && weeklyData) && tmpPrices && tmpPrices.length > 0) {
      if(!isFetchingChartData) {
        isFetchingChartData = true
        fetchData()
      }
    }
  }, [dailyData, tmpPrices, weeklyData, oldestDateFetch, updateChart])


  const chartDataFiltered = useMemo(() => {
    let currentData = volumeWindow === VOLUME_WINDOW.DAYS ? dailyData : weeklyData
    return (
      currentData &&
      Object.keys(currentData)
        ?.map((key) => {
          let item = currentData[key]
          if (item.date > utcStartTime) {
            return item
          } else {
            return true
          }
        })
        .filter((item) => {
          return !!item
        })
    )
  }, [dailyData, utcStartTime, volumeWindow, weeklyData])

  useEffect(() => {
    if (dailyData && chartDataFiltered && loading)
      setLoading(false)
  }, [dailyData, chartDataFiltered, loading]);

  const below600 = useMedia('(max-width: 600px)')

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

  return chartDataFiltered ? (
    <div className='d-flex justify-center items-center'>
      {below600 && (
        <DropdownSelect options={CHART_VIEW} active={chartView} setActive={setChartView} color={'#ff007a'} />
      )}
      {/* {(!dailyData && chartView === CHART_VIEW.LIQUIDITY || chartView === CHART_VIEW.VOLUME) && loading &&
        <span className="d-flex align-items-center">
          <Spinner size="lg" className="flex-shrink-0"> Loading... </Spinner>
        </span>
      } */}
      {dailyData && chartView === CHART_VIEW.LIQUIDITY && (
        <ResponsiveContainer aspect={60 / 28} ref={ref}>
          <TradingViewChart
            data={dailyData}
            base={stateTotalLiquidityUSD ? stateTotalLiquidityUSD : '--'}
            baseChange={stateLiquidityChangeUSD ? stateLiquidityChangeUSD : '--'}
            title="Liquidity"
            field="liquidity"
            width={width}
            type={CHART_TYPES.AREA}
          />
        </ResponsiveContainer>
      )}
      {chartDataFiltered && chartView === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={60 / 28} ref={ref}>
          <TradingViewChart
            data={chartDataFiltered}
            base={volumeWindow === VOLUME_WINDOW.WEEKLY ? (stateOneWeekVolume ? stateOneWeekVolume : 0) : (stateOneDayVolumeUSD ? stateOneDayVolumeUSD : 0)}
            baseChange={volumeWindow === VOLUME_WINDOW.WEEKLY ? stateWeeklyVolumeChange : stateVolumeChangeUSD}
            title={volumeWindow === VOLUME_WINDOW.WEEKLY ? 'Volume (7d)' : 'Volume'}
            field={volumeWindow === VOLUME_WINDOW.WEEKLY ? 'weeklyVolumeUSD' : 'dailyVolumeUSD'}
            width={width}
            type={CHART_TYPES.BAR}
            useWeekly={volumeWindow === VOLUME_WINDOW.WEEKLY}
          />
        </ResponsiveContainer>
      )}
      {display === 'volume' && (
        <RowFixed
          style={{
            bottom: '70px',
            position: 'absolute',
            left: '20px',
            zIndex: 10,
          }}
        >
          <OptionButton
            active={volumeWindow === VOLUME_WINDOW.DAYS}
            onClick={() => setVolumeWindow(VOLUME_WINDOW.DAYS)}
          >
            <div>D</div>
          </OptionButton>
          <OptionButton
            style={{ marginLeft: '4px' }}
            active={volumeWindow === VOLUME_WINDOW.WEEKLY}
            onClick={() => setVolumeWindow(VOLUME_WINDOW.WEEKLY)}
          >
            <div>W</div>
          </OptionButton>
        </RowFixed>
      )}
    </div>
  ) : (
    <div className='d-flex justify-center items-center'>
      {loading &&
        <ImpulseSpinner></ImpulseSpinner>
        // <span className="d-flex align-items-center">
        //   <Spinner className="flex-shrink-0"> Loading... </Spinner>
        // </span>
      }
    </div>
  )
}

export default GlobalChart
