import * as React from 'react';

import { merge } from 'lodash';
import { defaults, Line } from 'react-chartjs-2';

import { colors } from 'ts/style/colors';

export interface HistoryChartProps {}

const getDefaultDataset = (color: string) => {
    return {
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
            label: 'Fees collected',
        },
        {
            ...getDefaultDataset('#A2F5EB'),
            data: [31, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30],
            label: 'Rewards shared',
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
                    display: true,
                    fontColor: colors.textDarkSecondary,
                    fontSize: 16,
                },
                gridLines: {
                    color: 'transparent',
                },
                ticks: {
                    padding: 30,
                    suggestedMin: 20,
                    suggestedMax: 50,
                    stepSize: 10,
                    precision: 4,
                    userCallback: (value: string, _index: number, _values: string[]) => {
                        return `${value}.00`;
                    },
                },
            },
        ],
        xAxes: [
            {
                ticks: {
                    padding: 20,
                },
                gridLines: {
                    color: 'transparent',
                },
            },
        ],
    },
    legend: {
        position: 'right',
        fullWidth: true,
        labels: {
            boxWidth: 16,
            fontSize: 14,
        },
        onClick: () => {
            return false;
        },
    },
    layout: {
        padding: {
            left: 0,
        },
    },
    tooltips: {
        cornerRadius: 0,
        backgroundColor: colors.white,
        titleFontColor: colors.textDarkSecondary,
        bodyFontColor: colors.black,
        footerFontColor: colors.black,
        titleMarginBottom: 30,
        titleFontSize: 14,
        titleFontStyle: '300',
        bodyFontStyle: 'normal',
        mode: 'index',
        bodyFontSize: 18,
        xPadding: 20,
        yPadding: 20,
        borderColor: '#D5D5D5',
        borderWidth: 1,
        bodySpacing: 25,
        callbacks: {
            label: (item: any, graphData: any) => {
                const datasetLabel = graphData.datasets[item.datasetIndex].label;
                return `${datasetLabel} ${item.yLabel} ETH`;
            },
        },
    },
};

merge(defaults, {
    global: {
        defaultFontFamily: 'Formular',
        defaultFontSize: 14,
        defaultFontStyle: '300',
    },
});

export const HistoryChart: React.FC<HistoryChartProps> = props => {
    return <Line data={data} options={options} />;
};
