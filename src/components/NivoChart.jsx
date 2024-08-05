import { ResponsiveLineCanvas } from '@nivo/line';
import { getKVRates } from "../services/kv";
import { generateNivoChartData, generateYAxis } from "../utils/helpers";
import { useEffect, useState } from 'react';

const currencyOptions = [
    { title: 'EUR (€)', value: 'eur' },
    { title: 'GBP(£)', value: 'gbp' },
    { title: 'USD($)', value: 'usd' },
]

const xAxis = {
    // 1D
    86400000: {
        ms: 86400000,
        legend: 'time',
        format: '%H:%M',
        tickValues: 'every 3 hour',
    },
    // 1W
    604800000: {
        ms: 604800000,
        legend: 'time',
        format: '%d %b',
        tickValues: 'every 1 day',
    },
    // 1M
    2628000000: {
        ms: 2628000000,
        legend: 'time',
        format: '%d %b',
        tickValues: 'every 3 day',
    }
}

// value is in ms
const dateRangeOptions = [
    { title: '1D', value: 86400000 },
    { title: '1W', value: 604800000 },
    { title: '1M', value: 2628000000 },
]

export default function NivoChart({ data: initialData }) {
    const [data, setData] = useState(initialData);
    const [textColor, setTextColor] = useState('#213B54')
    const [currency, setCurrency] = useState('eur');
    const [dateRange, setDateRange] = useState(86400000);
    const activeDR = xAxis[dateRange];
    const nivoData = generateNivoChartData(data, currency);

    useEffect(() => {
        const from = Date.now() - activeDR.ms;
        getKVRates({ from }).then(res => {
            setData(res)
        });
    }, [dateRange]);

    useEffect(() => {
        // check to update theme on first load
        if (document.documentElement.classList.contains('dark')) {
            setTextColor('#FFF');
        }

        // handle change in theme
        new MutationObserver(function (mutations) {
            if (mutations[0].target.classList.contains('dark')) {
                setTextColor('#FFF')
            } else {
                setTextColor('#213B54')
            }
        }).observe(
            document.documentElement,
            { attributes: true }
        );
    }, [])

    // FIXME: make this a skeleton loader
    if (!data.length) return 'loading';

    const yAxis = generateYAxis(nivoData);
    return (
        <>
            <div className='flex items-center justify-between w-full'>
                <Switcher
                    option={currency}
                    options={currencyOptions}
                    onChange={value => {
                        setCurrency(value)
                    }}
                />
                <Switcher
                    option={dateRange}
                    options={dateRangeOptions}
                    onChange={setDateRange}
                />
            </div>

            <div className='w-full h-96 mb-8'>
                <p className='text-sm translate-y-10 ml-4 font-normal'>NGN (₦)</p>
                <ResponsiveLineCanvas
                    data={nivoData}
                    margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
                    yScale={{
                        type: 'linear',
                        min: yAxis.min,
                        max: yAxis.max,
                        nice: true
                    }}
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%d %H:%M',
                        useUTC: false,
                        precision: 'minute'
                    }}
                    curve="linear"
                    axisBottom={{
                        orient: 'bottom',
                        format: activeDR.format,
                        tickValues: activeDR.tickValues,
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: activeDR.legend,
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickValues: yAxis.ticks,
                        tickSize: 5,
                        tickPadding: 0,
                        tickRotation: 0,
                    }}
                    enableGridX={false}
                    colors={d => d.color}
                    lineWidth={3}
                    enablePoints={false}
                    useMesh={true}
                    isInteractive={true}
                    gridYValues={yAxis.ticks}
                    theme={{
                        axis: {
                            ticks: {
                                text: {
                                    fill: textColor,
                                    fontSize: 12,
                                    fontWeight: 400,
                                    letterSpacing: '0.01em',
                                }
                            }
                        },
                    }}
                    xFormat={"time:%H:%M"} // works for the toolltip
                    yFormat=">-.2f" // works for the toolltip
                />
            </div>
            <Legends data={nivoData} />
        </>
    )
}

const colorMap = {
    '#219653': 'bg-fx-chart-one',
    '#F2994A': "bg-fx-chart-two",
    '#EB5757': "bg-fx-chart-three",
}
function Legends({ data }) {
    return (
        <ul className='text-center'>
            {data.map(d => {
                const str = `h-2 w-2 rounded-full ${colorMap[d.color]} inline-block`;

                return (
                    <li className='inline-flex items-center px-3' key={`${d.id}-${d.color}`}>
                        <div className={str}></div>
                        <span className='text-xs pl-1'>{d.id}</span>
                    </li>
                )
            })}
        </ul>
    )
}

// FIXME: the name is too generic
function Switcher({ options, onChange, option }) {
    return (
        <ul className='inline-flex text-sm mt-20 text-slate-400'>
            {options.map(o => {
                return (
                    <li className={`cursor-pointer px-3 ${o.value === option ? 'text-fx-blue-light' : ''}`} key={o.value} onClick={() => onChange(o.value)}>
                        {o.title}
                    </li>
                )
            })}
        </ul>
    )
}