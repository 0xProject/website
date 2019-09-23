import * as React from 'react';

import { merge } from 'lodash';
import { defaults, Line } from 'react-chartjs-2';

import { colors } from 'ts/style/colors';

export interface HistoryChartProps {}

const getDefaultDataset = (color: string) => {
    return {
        label: 'Fees collected',
        fill: false,
        lineTension: 0,
        backgroundColor: color,
        borderColor: color,
        borderDashOffset: 0,
        borderWidth: 2,
        pointBorderColor: color,
        pointBackgroundColor: color,
        pointBorderWidth: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
    };
};

const data = {
    labels: ['1 July', '5 July', '10 July', '15 July', '20 July', '25 July', '30 July'],
    datasets: [
        {
            ...getDefaultDataset(colors.brandLight),
            data: [41, 40, 41, 40, 41, 40, 41, 40, 41, 40, 41, 40],
        },
        {
            ...getDefaultDataset('#A2F5EB'),
            data: [31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30],
        },
    ],
};

const options = {

    maintainAspectRatio: false,
    scales: {
        yAxes: [
            {
                scaleLabel: {
                    labelString: 'Fees/rewards (ETH)',

                },
                gridLines: {
                    color: 'transparent',
                },
                ticks: {
                    suggestedMin: 20,
                    suggestedMax: 50,
                    stepSize: 10,
                    callBack: (value: string, _index: number, _values: string[]) => {
                        return 'hoi';
                    },
                },
            },
        ],
        xAxes: [
            {
                gridLines: {
                    color: 'transparent',
                },
            },
        ],
    },
    legend: {
        labels: {
            boxWidth: 16,
            fontSize: 14,
        },
    },
};

merge(defaults, {
    global: {
        defaultFontFamily: 'Formular',
        defaultFontSize: 14,
    },
});

export const HistoryChart: React.FC<HistoryChartProps> = props => {
    return <Line data={data} options={options} />;
};
