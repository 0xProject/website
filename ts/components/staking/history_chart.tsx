import * as React from 'react';
import { Line } from 'react-chartjs-2';

import { colors } from 'ts/style/colors';

export interface HistoryChartProps {}

const data = {
    labels: ['1 July', '5 July', '10 July', '15 July', '20 July', '25 July', '30 July'],
    datasets: [
        {
            label: 'Fees collected',
            fill: false,
            lineTension: 0,
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: colors.brandLight,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0,
            borderJoinStyle: 'miter',
            pointBorderColor: colors.brandLight,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: colors.brandLight,
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [41, 40, 41, 40, 41, 40, 41, 40, 41, 40, 41, 40],
        },
    ],
};

const options = {
    defaultFontSize: 14,
    maintainAspectRatio: false,
    scales: {
        yAxes: [
            {
                gridLines: {
                    color: 'transparent',
                },
                ticks: {
                    suggestedMin: 20,
                    suggestedMax: 50,
                    stepSize: 10,
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

export const HistoryChart: React.FC<HistoryChartProps> = props => {
    return <Line data={data} options={options} />;
};
