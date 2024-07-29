import { ResponsiveLineCanvas } from '@nivo/line';
import { getKVRates } from "../services/kv";
import { generateNivoChartData, generateYAxis } from "../utils/helpers";
import { useEffect, useState } from 'react';

const currencyOptions = [
    { title: 'EUR (€)', value: 'eur' },
    { title: 'GBP(£)', value: 'gbp' },
    { title: 'USD($)', value: 'usd' },
]

export default function NivoChart({ data: initialData }) {
    const [data, setData] = useState(initialData);
    const [textColor, setTextColor] = useState('#213B54')
    const [currency, setCurrency] = useState('eur');

    useEffect(() => {
        getKVRates().then(res => {
            setData(generateNivoChartData(res, currency))
        });
    }, [currency]);

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

    const xTicks = data[0].data.map((d) => d.x);
    const yAxis = generateYAxis(data);

    const theme = {
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
    };

    return (
        <>
            <FilterBar
                option={currency}
                options={currencyOptions}
                onChange={setCurrency}
            />

            <div className='w-full h-96'>
                <p className='text-sm translate-y-10 ml-4 font-normal'>NGN (₦)</p>
                <ResponsiveLineCanvas
                    data={data}
                    margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
                    yScale={{
                        type: 'linear',
                        min: yAxis.min,
                        max: yAxis.max,
                        nice: true
                    }}
                    curve="linear"
                    axisBottom={{
                        tickValues: xTicks,
                        tickSize: 0,
                        tickPadding: 5,
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
                    isInteractive={false}
                    gridYValues={yAxis.ticks}
                    theme={theme}
                />
            </div>
            <Legends data={data} />
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

function FilterBar({ options, onChange, option }) {
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