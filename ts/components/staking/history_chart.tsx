import { extent } from 'd3-array';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { merge } from 'lodash';
import { defaults, Line } from 'react-chartjs-2';

import { colors } from 'ts/style/colors';
import { formatEther } from 'ts/utils/format_number';

interface HistoryChartProps {
    totalRewards: number[];
    memberRewards: number[];
    labels: string[];
    epochs: number[];
}

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

const getOptions = (epochs: number[], fees: number[], rewards: number[]) => {
    const [min, max] = extent([...fees, ...rewards]);
    return {
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
                        suggestedMin: min,
                        suggestedMax: max,
                        maxTicksLimit: 8,
                        precision: 5,
                        beginAtZero: true,
                        userCallback: (value: string, _index: number, _values: string[]) => {
                            return `${formatEther(value, {
                                decimals: 2,
                                decimalsRounded: 2,
                            }).formatted}`;
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
                    return `${datasetLabel} — ${formatEther(item.yLabel).formatted} ETH`;
                },
                labelColor: (tooltipItem: any, chart: any) => {
                    const datasetIndex = tooltipItem.datasetIndex;
                    const { backgroundColor } = chart.config.data.datasets[datasetIndex];
                    return {
                        borderColor: 'transparent',
                        backgroundColor,
                    };
                },
                title: (item: any, graphData: any) => {
                    const firstItem = item[0];
                    const index = firstItem.index;
                    const epoch = epochs[index];
                    return `Epoch ${epoch}  /  ${firstItem.label}`;
                },
            },
        },
    };
};

merge(defaults, {
    global: {
        defaultFontFamily: 'Formular',
        defaultFontSize: 14,
        defaultFontStyle: '300',
    },
});

const Container = styled.div`
    /* height: 290px; */
    position: relative;
    margin-bottom: 90px;
    display: none;
    width: 100%;
    @media (min-width: 768px) {
        display: block;
    }
`;

export const HistoryChart: React.FC<HistoryChartProps> = props => {
    const { totalRewards, memberRewards, labels, epochs } = props;

    const container = React.useRef(null);

    // const [_width, setWidth] = React.useState(0);

    // React.useLayoutEffect(() => {
    //     const c = container.current;

    //     setWidth(c.offsetWidth);
    // }, []);

    const data = useMemo(() =>  ({
        labels,
        datasets: [
            {
                ...getDefaultDataset(colors.brandLight),
                data: totalRewards,
                label: 'Total rewards ',
            },
            {
                ...getDefaultDataset('#A2F5EB'),
                data: memberRewards,
                label: 'Rewards shared ',
            },
        ],
    }), [totalRewards, labels, memberRewards]);

    const options = useMemo(() => getOptions(epochs, totalRewards, memberRewards), [epochs, totalRewards, memberRewards]);

    return (
        <Container ref={container}>
            <Line data={data} options={options} height={290} />
        </Container>
    );
};
