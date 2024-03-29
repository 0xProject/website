/* tslint:disable */

import * as React from 'react';

const colors = require('nice-color-palettes');
import { PoolWithStats } from 'ts/types';

import styled from 'styled-components';

const PercentageSliderWrapper = styled.div`
    .tag:last-of-type > .slider-button {
        display: none !important;
    }
`;

const randPalette = colors
    .sort(function () {
        return 0.5 - Math.random();
    })
    .pop();

const _tags = [
    {
        name: 'Action',
        color: 'red',
    },
    {
        name: 'Romance',
        color: 'purple',
    },
    {
        name: 'Comedy',
        color: 'orange',
    },
    {
        name: 'Horror',
        color: 'black',
    },
];

const getPercentage = (containerWidth: number, distanceMoved: number) => {
    return (distanceMoved / containerWidth) * 100;
};

const limitNumberWithinRange = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

const nearestN = (N: number, number: number) => Math.ceil(number / N) * N;
interface TagSectionProps {
    name: string;
    color: string;
    width: number;
    onSliderSelect: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const TagSection = ({ name, color, width, onSliderSelect }: TagSectionProps) => {
    return (
        <div
            className="tag"
            style={{
                ...styles.tag,
                background: color,
                width: width + '%',
            }}
        >
            <span style={{ ...styles.tagText, fontSize: 14 }}>{Math.round(width) + '%'}</span>

            <div style={styles.sliderButton} onPointerDown={onSliderSelect} className="slider-button"></div>
        </div>
    );
};

interface PoolDataElement {
    pool: PoolWithStats;
    zrxStaked: number;
}

interface PercentageSliderProps {
    pools: PoolDataElement[];
    tags: Tag[];
    widths: number[];
    setWidths: (widths: number[]) => void;
}

interface Tag {
    name: string;
    color: string;
}

export const PercentageSlider: React.FC<PercentageSliderProps> = ({ pools, tags, widths, setWidths }) => {
    // const [widths, setWidths] = React.useState<number[]>(new Array(poolTags.length).fill(100 / poolTags.length));
    // const [tags, setTags] = React.useState(poolTags);
    const TagSliderRef = React.useRef<HTMLDivElement>(null);
    return (
        <PercentageSliderWrapper>
            <div
                ref={TagSliderRef}
                style={{
                    width: '100%',
                    display: 'flex',
                    backgroundColor: 'transparent',
                }}
            >
                {tags.map((tag, index) => (
                    <TagSection
                        width={widths[index]}
                        key={index}
                        name={tag.name}
                        onSliderSelect={(e) => {
                            e.preventDefault();
                            document.body.style.cursor = 'ew-resize';

                            const startDragX = e.pageX;
                            const sliderWidth = TagSliderRef.current.offsetWidth;

                            const resize = (ev: PointerEvent) => {
                                ev.preventDefault();
                                const eTouch = (ev as unknown) as TouchEvent;
                                const endDragX = eTouch.touches ? eTouch.touches[0].pageX : ev.pageX;
                                const distanceMoved = endDragX - startDragX;
                                const maxPercent = widths[index] + widths[index + 1];

                                const percentageMoved = nearestN(1, getPercentage(sliderWidth, distanceMoved));
                                // const percentageMoved = getPercentage(sliderWidth, distanceMoved);

                                const _widths = widths.slice();

                                const prevPercentage = _widths[index];

                                const newPercentage = prevPercentage + percentageMoved;
                                const currentSectionWidth = limitNumberWithinRange(newPercentage, 0, maxPercent);
                                _widths[index] = currentSectionWidth;

                                const nextSectionIndex = index + 1;

                                const nextSectionNewPercentage = _widths[nextSectionIndex] - percentageMoved;
                                const nextSectionWidth = limitNumberWithinRange(
                                    nextSectionNewPercentage,
                                    0,
                                    maxPercent,
                                );
                                _widths[nextSectionIndex] = nextSectionWidth;

                                setWidths(_widths);
                            };
                            const resizeTouch = (ev: TouchEvent) => {
                                ev.preventDefault();
                                const endDragX = ev.touches[0].pageX;
                                const distanceMoved = endDragX - startDragX;
                                const maxPercent = widths[index] + widths[index + 1];

                                const percentageMoved = nearestN(1, getPercentage(sliderWidth, distanceMoved));
                                // const percentageMoved = getPercentage(sliderWidth, distanceMoved);

                                const _widths = widths.slice();

                                const prevPercentage = _widths[index];

                                const newPercentage = prevPercentage + percentageMoved;
                                const currentSectionWidth = limitNumberWithinRange(newPercentage, 0, maxPercent);
                                _widths[index] = currentSectionWidth;

                                const nextSectionIndex = index + 1;

                                const nextSectionNewPercentage = _widths[nextSectionIndex] - percentageMoved;
                                const nextSectionWidth = limitNumberWithinRange(
                                    nextSectionNewPercentage,
                                    0,
                                    maxPercent,
                                );
                                _widths[nextSectionIndex] = nextSectionWidth;

                                setWidths(_widths);
                            };
                            // tslint:disable-next-line
                            window.addEventListener('pointermove', resize);
                            // tslint:disable-next-line
                            window.addEventListener('touchmove', resizeTouch);

                            const removeEventListener = () => {
                                // tslint:disable-next-line
                                window.removeEventListener('pointermove', resize);
                                // tslint:disable-next-line
                                window.removeEventListener('touchmove', resizeTouch);
                            };

                            const handleEventUp = (e: Event) => {
                                e.preventDefault();
                                document.body.style.cursor = 'initial';
                                removeEventListener();
                            };

                            window.addEventListener('touchend', handleEventUp);
                            window.addEventListener('pointerup', handleEventUp);
                        }}
                        color={tag.color}
                    />
                ))}
            </div>
        </PercentageSliderWrapper>
    );
};

type StylesType = { [key: string]: React.CSSProperties };

const styles: StylesType = {
    tag: {
        padding: 10,
        textAlign: 'center',
        position: 'relative',
        borderRightWidth: '.1em',
        borderRightStyle: 'solid',
        borderRightColor: 'white',
        boxSizing: 'border-box',
        borderLeftWidth: '.1em',
        borderLeftStyle: 'solid',
        borderLeftColor: 'white',
    },
    tagText: {
        color: 'white',
        fontWeight: 700,
        userSelect: 'none',
        display: 'block',
        overflow: 'hidden',
    },
    sliderButton: {
        width: '1em',
        height: '1em',
        backgroundColor: 'white',
        position: 'absolute',
        borderRadius: '2em',
        right: 'calc(-.6em)',
        top: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        margin: 'auto',
        zIndex: 10,
        cursor: 'ew-resize',
        userSelect: 'none',
    },
};
