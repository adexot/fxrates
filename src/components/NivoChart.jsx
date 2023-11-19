import { ResponsiveLineCanvas } from '@nivo/line';
import { getKVRates } from "../services/kv";
import { generateNivoChartData, generateYAxis } from "../utils/helpers";
import { useEffect, useState } from 'react';

export default function NivoChart({ data: initialData }) {
    const [data, setData] = useState(initialData);
    const [currency, setCurrency] = useState('eur');

    useEffect(() => {
        getKVRates().then(res => {
            setData(generateNivoChartData(res, currency))
        });
    }, [currency]);

    // FIXME: make this a loader
    if (!data.length) return 'loading';

    const xTicks = data[0].data.map((d) => d.x);
    const yAxis = generateYAxis(data);

    return (
        <div
            className='w-full h-96'
        >
            <ResponsiveLineCanvas
                data={data}
                margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
                // xScale={{ type: 'linear' }}
                yScale={{
                    type: 'linear',
                    min: yAxis.min,
                    max: yAxis.max,
                    nice: true
                }}
                // yFormat=" >-.2f"
                curve="linear"
                axisTop={null}
                axisBottom={{
                    tickValues: xTicks,
                    tickSize: 0,
                    tickPadding: 5,
                    // tickRotation: 0,
                    // format: '.2f',
                    // legend: 'Time',
                    // legendOffset: 36,
                    // legendPosition: 'middle'
                }}
                axisLeft={{
                    tickValues: yAxis.ticks,
                    tickSize: 5,
                    // tickPadding: 50,
                    tickRotation: 0,
                    // format: '.2s',
                    // legend: 'Rate',
                    // legendOffset: -40,
                    // legendPosition: 'middle',
                }}
                enableGridX={false}
                colors={d => d.color}
                lineWidth={3}
                enablePoints={false}
                useMesh={true}
                isInteractive={false}
                // gridXValues={[0, 20, 40, 60, 80, 100, 120]}
                gridYValues={yAxis.ticks}
            />
            <Legends data={data} />
        </div>
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