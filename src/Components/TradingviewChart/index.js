import React, { useState, useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { formattedNum } from '../../utils'
import styled from 'styled-components'
import { usePrevious } from 'react-use'
import { Play } from 'react-feather'

export const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: grey;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
  `

dayjs.extend(utc)

export const CHART_TYPES = {
    BAR: 'BAR',
    AREA: 'AREA',
}

const Wrapper = styled.div`
  position: relative;
`

// constant height for charts
const HEIGHT = 300

const TradingViewChart = ({
    type = CHART_TYPES.BAR,
    data,
    base,
    baseChange,
    field,
    title,
    width,
    useWeekly = false,
}) => {
    // reference for DOM element to create with chart
    const ref = useRef()

    // pointer to the chart object
    const [chartCreated, setChartCreated] = useState(false)
    const dataPrev = usePrevious(data)

    useEffect(() => {
        if (data !== dataPrev && chartCreated && type === CHART_TYPES.BAR) {
            // remove the tooltip element
            let tooltip = document.getElementById('tooltip-id' + type)
            let node = document.getElementById('test-id' + type)
            node.removeChild(tooltip)
            chartCreated.resize(0, 0)
            setChartCreated(false)
        }
    }, [chartCreated, data, dataPrev, type])

    // parese the data and format for tardingview consumption
    const formattedData = data?.map((entry) => {
        return {
            time: dayjs.unix(entry.date).utc().format('YYYY-MM-DD'),
            value: parseFloat(entry[field]),
        }
    })

    // adjust the scale based on the type of chart
    const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2

    const darkMode = true
    const textColor = darkMode ? 'white' : 'black'
    const previousTheme = usePrevious(darkMode)

    // reset the chart if them switches
    useEffect(() => {
        if (chartCreated && previousTheme !== darkMode) {
            // remove the tooltip element
            let tooltip = document.getElementById('tooltip-id' + type)
            let node = document.getElementById('test-id' + type)
            node.removeChild(tooltip)
            chartCreated.resize(0, 0)
            setChartCreated(false)
        }
    }, [chartCreated, darkMode, previousTheme, type])
    // if no chart created yet, create one with options and add to DOM manually
    useEffect(() => {
        if (chartCreated && base && baseChange && formattedData) {
            let toolTip = document.getElementById('tooltip-id' + type);

            if (toolTip) {
                
                let percentChange = 0
                let color = ''
                let formattedPercentChange = '';
                try {
                    percentChange = baseChange !== undefined ? Number(baseChange).toFixed(2) : 0;
                    formattedPercentChange = (percentChange > 0 ? '+' : '') + percentChange + '%';
                    color = percentChange >= 0 ? 'green' : 'red'
                } catch (e) {
                    formattedPercentChange = '--%'
                    color = 'red'
                }

                const setLastBarText = () => {
                    toolTip.innerHTML = `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title} ${type === CHART_TYPES.BAR && !useWeekly ? '(24hr)' : ''}</div>
                    <div style="font-size: 22px; margin: 4px 0px; color:${textColor}" >
                    ${formattedNum(base ?? 0, true)}
                    <span style="margin-left: 10px; font-size: 16px; color: ${color};">${formattedPercentChange}</span>
                    </div>`
                }

                setLastBarText();

                chartCreated.subscribeCrosshairMove(function (param) {
                    if (
                        param === undefined ||
                        param.time === undefined ||
                        param.point.x < 0 ||
                        param.point.x > width ||
                        param.point.y < 0 ||
                        param.point.y > HEIGHT
                    ) {
                        setLastBarText()
                    } else {
                        let dateStr = useWeekly
                            ? dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
                                .startOf('week')
                                .format('MMMM D, YYYY') +
                            '-' +
                            dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
                                .endOf('week')
                                .format('MMMM D, YYYY')
                            : dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).format('MMMM D, YYYY')
                        var price = param.seriesPrices.get(series)

                        toolTip.innerHTML =
                            `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title}</div>` +
                            `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
                            formattedNum(price, true) +
                            '</div>' +
                            '<div>' +
                            dateStr +
                            '</div>'
                    }
                })

            }

        }
        if (!chartCreated && formattedData) {
            var chart = createChart(ref.current, {
                width: width,
                height: HEIGHT,
                layout: {
                    backgroundColor: 'transparent',
                    textColor: textColor,
                },
                rightPriceScale: {
                    scaleMargins: {
                        top: topScale,
                        bottom: 0,
                    },
                    borderVisible: false,
                },
                timeScale: {
                    borderVisible: false,
                },
                grid: {
                    horzLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                        visible: false,
                    },
                    vertLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                        visible: false,
                    },
                },
                crosshair: {
                    horzLine: {
                        visible: false,
                        labelVisible: false,
                    },
                    vertLine: {
                        visible: true,
                        style: 0,
                        width: 2,
                        color: 'rgba(32, 38, 46, 0.1)',
                        labelVisible: false,
                    },
                },
                localization: {
                    priceFormatter: (val) => formattedNum(val, true),
                },
            })

            var series =
                type === CHART_TYPES.BAR
                    ? chart.addHistogramSeries({
                        color: '#ff007a',
                        priceFormat: {
                            type: 'volume',
                        },
                        scaleMargins: {
                            top: 0.32,
                            bottom: 0,
                        },
                        lineColor: '#ff007a',
                        lineWidth: 3,
                    })
                    : chart.addAreaSeries({
                        topColor: '#ff007a',
                        bottomColor: 'rgba(255, 0, 122, 0)',
                        lineColor: '#ff007a',
                        lineWidth: 3,
                    })

            series.setData(formattedData)
            var toolTip = document.createElement('div')
            toolTip.setAttribute('id', 'tooltip-id' + type)
            toolTip.className = darkMode ? 'three-line-legend-dark' : 'three-line-legend'
            ref.current.appendChild(toolTip)
            toolTip.style.display = 'block'
            toolTip.style.fontWeight = '500'
            toolTip.style.left = -4 + 'px'
            toolTip.style.top = '-' + 8 + 'px'
            toolTip.style.backgroundColor = 'transparent'
            toolTip.style.position = 'absolute'

            // format numbers
            let percentChange = 0
            let color = ''
            let formattedPercentChange = '';
            try {
                percentChange = baseChange !== undefined ? Number(baseChange).toFixed(2) : 0;
                formattedPercentChange = (percentChange > 0 ? '+' : '') + percentChange + '%';
                console.log('=============basechange', baseChange, percentChange, ((percentChange > 0 ? '+' : '') + percentChange + '%'));
                color = percentChange >= 0 ? 'green' : 'red'
            } catch (e) {
                console.log('=================basechange', e);
                formattedPercentChange = '--%'
                color = 'red'
            }

            // get the title of the chart
            const setLastBarText = () => {
                toolTip.innerHTML = `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title} ${type === CHART_TYPES.BAR && !useWeekly ? '(24hr)' : ''}</div>
                    <div style="font-size: 22px; margin: 4px 0px; color:${textColor}" >
                    ${formattedNum(base ?? 0, true)}
                    <span style="margin-left: 10px; font-size: 16px; color: ${color};">${formattedPercentChange}</span>
                    </div>`
            }
            setLastBarText()

            // update the title when hovering on the chart
            chart.subscribeCrosshairMove(function (param) {
                if (
                    param === undefined ||
                    param.time === undefined ||
                    param.point.x < 0 ||
                    param.point.x > width ||
                    param.point.y < 0 ||
                    param.point.y > HEIGHT
                ) {
                    setLastBarText()
                } else {
                    let dateStr = useWeekly
                        ? dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
                            .startOf('week')
                            .format('MMMM D, YYYY') +
                        '-' +
                        dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
                            .endOf('week')
                            .format('MMMM D, YYYY')
                        : dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).format('MMMM D, YYYY')
                    var price = param.seriesPrices.get(series)

                    toolTip.innerHTML =
                        `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title}</div>` +
                        `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
                        formattedNum(price, true) +
                        '</div>' +
                        '<div>' +
                        dateStr +
                        '</div>'
                }
            })

            chart.timeScale().fitContent()

            setChartCreated(chart)
        }
    }, [
        base,
        baseChange,
        chartCreated,
        darkMode,
        data,
        formattedData,
        textColor,
        title,
        topScale,
        type,
        useWeekly,
        width
    ])

    // responsiveness
    useEffect(() => {
        if (width) {
            chartCreated && chartCreated.resize(width, HEIGHT)
            chartCreated && chartCreated.timeScale().scrollToPosition(0)
        }
    }, [chartCreated, width])

    return (
        <Wrapper>
            <div ref={ref} id={'test-id' + type} />
            <IconWrapper>
                <Play
                    onClick={() => {
                        chartCreated && chartCreated.timeScale().fitContent()
                    }}
                />
            </IconWrapper>
        </Wrapper>
    )
}

export default TradingViewChart
