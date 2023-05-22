import React, { useState, useEffect, useRef } from 'react'
import { createChart, CrosshairMode } from 'lightweight-charts'
import dayjs from 'dayjs'
import { formattedNum } from '../../utils'
import { usePrevious } from 'react-use'
import styled from 'styled-components'
import { Play } from 'react-feather'
// import { useDarkModeManager } from '../../contexts/LocalStorage'

const IconWrapper = styled.div`
  // position: absolute;
  // right: 10px;
  color: green;
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0px;
  // bottom: 10px;
  display: flex;
  align-items: center;
  margin-right: 30px;
  justify-content: center;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const CandleStickChart = ({
  data,
  width,
  height = 300,
  base,
  margin = true,
  valueFormatter = (val) => formattedNum(val, true),
}) => {
  // reference for DOM element to create with chart
  const ref = useRef()
  const formattedData = data?.map((entry) => {
    return {
      time: parseFloat(entry.timestampSeconds),
      open: parseFloat(entry.openUsd),
      low: parseFloat(entry.lowUsd),
      close: parseFloat(entry.closeUsd),
      high: parseFloat(entry.highUsd),
    }
  })

  if (formattedData && formattedData.length > 0) {
    formattedData.push({
      time: dayjs().unix(),
      open: parseFloat(formattedData[formattedData.length - 1].close),
      close: parseFloat(base),
      low: Math.min(parseFloat(base), parseFloat(formattedData[formattedData.length - 1].close)),
      high: Math.max(parseFloat(base), parseFloat(formattedData[formattedData.length - 1].close)),
    })
  }

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(null)
  const dataPrev = usePrevious(data)

  const darkMode = true
  const textColor = 'white'
  const previousTheme = usePrevious(darkMode)

  // reset the chart if theme switches
  // useEffect(() => {
  //   if (chartCreated && previousTheme !== darkMode) {
  //     // remove the tooltip element
  //     let tooltip = document.getElementById('tooltip-id')
  //     let node = document.getElementById('test-id')
  //     node.removeChild(tooltip)
  //     chartCreated.resize(0, 0)
  //     setChartCreated(null)
  //   }
  // }, [chartCreated, darkMode, previousTheme])

  useEffect(() => {
    if (data !== dataPrev && chartCreated) {
      // remove the tooltip element
      let tooltip = document.getElementById('tooltip-id')
      let node = document.getElementById('test-id')
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated(null)
    }
  }, [chartCreated, data, dataPrev])

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated) {
      const chart = createChart(ref.current, {
        width: width,
        height: height,
        layout: {
          backgroundColor: 'transparent',
          textColor: textColor,
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
          visible: true,
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        localization: {
          priceFormatter: (val) => formattedNum(val),
        },
      })

      var candleSeries = chart.addCandlestickSeries({
        upColor: 'green',
        downColor: 'red',
        borderDownColor: 'red',
        borderUpColor: 'green',
        wickDownColor: 'red',
        wickUpColor: 'green',
      })

      candleSeries.setData(formattedData)
      while (ref.current.childElementCount > 2) {
        ref.current.removeChild(ref.current.firstElementChild);
      }
      var toolTip = document.createElement('div')
      toolTip.setAttribute('id', 'tooltip-id')
      toolTip.className = 'three-line-legend'
      ref.current.appendChild(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.left = (margin ? 116 : 10) + 'px'
      toolTip.style.top = 50 + 'px'
      toolTip.style.backgroundColor = 'transparent'

      // get the title of the chart
      // eslint-disable-next-line no-inner-declarations
      function setLastBarText() {
        toolTip.innerHTML = base
          ? `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` + valueFormatter(base) + '</div>'
          : ''
      }
      setLastBarText()

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function (param) {
        if (
          param === undefined ||
          param.timestampSeconds === undefined ||
          param.point.x < 0 ||
          param.point.x > width ||
          param.point.y < 0 ||
          param.point.y > height
        ) {
          setLastBarText()
        } else {
          var price = param.seriesPrices.get(candleSeries).close
          const time = dayjs.unix(param.timestampSeconds).format('MM/DD h:mm A')
          toolTip.innerHTML =
            `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
            valueFormatter(price) +
            `<span style="font-size: 12px; margin: 4px 6px; color: ${textColor}">` +
            time +
            ' UTC' +
            '</span>' +
            '</div>'
        }
      })

      chart.timeScale().fitContent()

      setChartCreated(chart)
    }
  }, [chartCreated, formattedData, width, height, valueFormatter, base, margin, textColor])

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, height)
      chartCreated && chartCreated.timeScale().scrollToPosition(0)
    }
  }, [chartCreated, height, width])

  return (
    <div className='d-flex flex-column'>
      <div ref={ref} id="test-id" />
      <div className='d-flex justify-end' style={{marginTop: "20px"}}>
        <IconWrapper>
          <Play
            onClick={() => {
              chartCreated && chartCreated.timeScale().fitContent()
            }}
          />
        </IconWrapper>
      </div>

    </div>
  )
}

export default CandleStickChart
