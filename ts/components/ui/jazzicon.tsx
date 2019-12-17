import Color from 'color';
import MersenneTwister from 'mersenne-twister';
import React from 'react';

export function jsNumberForAddress(address: string): number {
    const addr = address.slice(2, 10);
    const seed = parseInt(addr, 16);
    return seed;
}

// TODO(johnrjj) - We can tune these to fit the 0x brand colors
const COLORS = [
    '#01888c', // teal
    '#fc7500', // bright orange
    '#034f5d', // dark teal
    '#f73f01', // orangered
    '#fc1960', // magenta
    '#c7144c', // raspberry
    '#f3c100', // goldenrod
    '#1598f2', // lightning blue
    '#2465e1', // sail blue
    '#f19e02', // gold
];

const DEFAULT_PAPER_STYLES = {
    borderRadius: '50px',
    display: 'inline-block',
    margin: 0,
    overflow: 'hidden',
    padding: 0,
};

export interface PaperProps {
    color: string;
    diameter: number;
    style: any;
}

const Paper: React.FC<PaperProps> = ({ children, color, diameter, style: styleOverrides }) => (
    <div
        className="paper"
        style={{
            ...DEFAULT_PAPER_STYLES,
            backgroundColor: color,
            height: diameter,
            width: diameter,
            ...styleOverrides,
        }}
    >
        {children}
    </div>
);

const SHAPE_COUNT = 4;
const SVGNS = 'http://www.w3.org/2000/svg';
const WOBBLE = 30;

export interface JazziconProps {
    diameter: number;
    paperStyles?: object;
    seed: number;
    svgStyles?: object;
}

// NOTE: this component will never update after initial render due to forced memo identity
export const Jazzicon: React.FC<JazziconProps> = React.memo(props => {
    const { diameter, paperStyles, seed, svgStyles } = props;

    const generator = React.useRef(new MersenneTwister(seed));

    const genColor = (colors: string[]) => {
        const rand = generator.current.random();
        const idx = Math.floor(colors.length * generator.current.random());
        const color = colors.splice(idx, 1)[0];
        return color;
    };

    // tslint:disable-next-line: no-shadowed-variable
    const hueShift = (colors: string[]) => {
        const amount = generator.current.random() * 30 - WOBBLE / 2;
        return colors.map(hex => {
            const color = Color(hex);
            color.rotate(amount);
            return color.hex();
        });
    };

    // tslint:disable-next-line: no-shadowed-variable
    const genShape = (remainingColors: string[], diameter: number, i: number, total: number) => {
        const center = diameter / 2;
        const firstRot = generator.current.random();
        const angle = Math.PI * 2 * firstRot;
        const velocity = (diameter / total) * generator.current.random() + (i * diameter) / total;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const translate = `translate(${tx} ${ty})`;

        // Third random is a shape rotation on top of all of that.
        const secondRot = generator.current.random();
        const rot = firstRot * 360 + secondRot * 180;
        const rotate = `rotate(${rot.toFixed(1)} ${center} ${center})`;
        const transform = `${translate} ${rotate}`;
        const fill = genColor(remainingColors);

        return (
            <rect
                key={i}
                x="0"
                y="0"
                rx="0"
                ry="0"
                height={diameter}
                width={diameter}
                transform={transform}
                fill={fill}
            />
        );
    };

    const remainingColors = hueShift(COLORS.slice());
    const shapesArr = Array(SHAPE_COUNT).fill(null);

    return (
        <Paper color={genColor(remainingColors)} diameter={diameter} style={paperStyles}>
            <svg xmlns={SVGNS} x="0" y="0" height={diameter} width={diameter} style={svgStyles}>
                {shapesArr.map((_s, i) => genShape(remainingColors, diameter, i, SHAPE_COUNT - 1))}
            </svg>
        </Paper>
    );
}, () => true);
