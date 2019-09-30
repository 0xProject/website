export interface PaddingInterface {
    padding?: number | Array<'large' | 'default' | 'small' | number>;
    margin?: number | Array<'large' | 'default' | 'small' | number>;
}

interface PaddingSizes {
    [key: string]: string;
}

export const PADDING_SIZES: PaddingSizes = {
    default: '30px',
    large: '60px',
    small: '15px',
};

export const getCSSPadding = (value: number | Array<string | number> = 0): string => {
    if (Array.isArray(value)) {
        return value.map(val => PADDING_SIZES[val] || `${val}px`).join(' ');
    } else {
        return `${value}px`;
    }
};

export const truncateStringPortion = (value: string, beginCharCount: number = 3, endCharCount: number = 3, dotCount: number = 3) => {
    let result = '';

    result += value.substring(0, beginCharCount);
    result += '.'.repeat(dotCount);
    result += value.substring(value.length - endCharCount, value.length);

    return result;
};
