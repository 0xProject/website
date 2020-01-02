import { BigNumber } from '@0x/utils';

import { formatEther, formatNumber, formatPercent, formatZrx } from './format_number';

describe('formatNumber', () => {
    test('should minimize numbers', () => {
        const lotsOfZeroes = formatNumber('1.12000000', {
            decimals: 6,
            decimalsRounded: 6,
        });
        expect(lotsOfZeroes.minimized).toBe('1.12');
    });

    test('can optionally postfix big numbers', () => {
        const hundredMillion = formatNumber('100000000', {
            decimals: 6,
            decimalsRounded: 6,
            bigUnitPostfix: true,
        });
        expect(hundredMillion.formatted).toBe('100M');
    });

    test('should work with string type', () => {
        const hundredMillion = formatNumber('1.2345', {
            decimals: 2,
            decimalsRounded: 2,
        });
        expect(hundredMillion.formatted).toBe('1.23');
    });

    test('should work with number type', () => {
        const hundredMillion = formatNumber(1.2345, {
            decimals: 2,
            decimalsRounded: 2,
        });
        expect(hundredMillion.formatted).toBe('1.23');
    });

    test('should work with BigNumber type', () => {
        const hundredMillion = formatNumber(new BigNumber(1.2345), {
            decimals: 2,
            decimalsRounded: 2,
        });
        expect(hundredMillion.formatted).toBe('1.23');
    });

    test('rounded value produces a number type', () => {
        const hundredMillion = formatNumber(new BigNumber(1234.56789), {
            decimals: 2,
            decimalsRounded: 2,
            roundDown: true,
        });
        expect(hundredMillion.roundedValue).toBe(1234.56);
    });

    test('rounded value produces a number type for large numbers', () => {
        // tslint:disable-next-line: number-literal-format
        const hundredMillion = formatNumber(new BigNumber(1234567890.1234567890), {
            decimals: 2,
            decimalsRounded: 2,
            roundDown: true,
        });
        expect(hundredMillion.roundedValue).toBe(1234567890.12);
    });
});

describe('formatPercent', () => {
    // Happy path
    test('should format a basic percent', () => {
        const formattedNum = formatPercent(12.567);
        expect(formattedNum.formatted).toBe('12.57');
        expect(formattedNum.formattedValue).toBe(12.57);
        expect(formattedNum.denomination).toBe('%');
    });

    // Edge cases
    test('should round up 99.999 to 100', () => {
        // TODO(johnrjj) - verify this is ok to round up ?
        const almostOneHundredPercent = formatPercent(99.999);
        expect(almostOneHundredPercent.formattedValue).toBe(100);
        expect(almostOneHundredPercent.formatted).toBe('100.00');
        expect(almostOneHundredPercent.full).toBe('100.00%');
        expect(almostOneHundredPercent.fullPrecision).toBe('99.999');
    });

    test('should round down 0.001 to 0.00', () => {
        const almostZero = formatPercent(0.001);
        expect(almostZero.formatted).toBe('0.00');
    });

    test('should accept percents over 100', () => {
        const over100Percent = formatPercent(101.42);
        expect(over100Percent.formatted).toBe('101.42');
        expect(over100Percent.full).toBe('101.42%');
    });
});

describe('formatEther', () => {
    test('should format a basic amount (rounds down - even)', () => {
        const endsInEven = formatEther(12.123456789);
        expect(endsInEven.formatted).toBe('12.12345');
        expect(endsInEven.formattedValue).toBe(12.12345);
        expect(endsInEven.denomination).toBe(' ETH');
        expect(endsInEven.full).toBe('12.12345 ETH');
    });

    test('should format a basic amount (rounds down - odd)', () => {
        const endsInOdd = formatEther(12.123453);
        expect(endsInOdd.formatted).toBe('12.12345');
        expect(endsInOdd.formattedValue).toBe(12.12345);
        expect(endsInOdd.full).toBe('12.12345 ETH');
    });

    test('should format a basic amount (rounds up - boundary)', () => {
        const endsInFive = formatEther(12.123455);
        expect(endsInFive.formatted).toBe('12.12345');
        expect(endsInFive.formattedValue).toBe(12.12345);
        expect(endsInFive.full).toBe('12.12345 ETH');
    });

    test('should format a dust amount of ether to zero (rounds down)', () => {
        const notEnoughEtherToShow = formatEther(0.000001);
        expect(notEnoughEtherToShow.formatted).toBe('0.00000');
        expect(notEnoughEtherToShow.full).toBe('0.00000 ETH');
    });

    test('should format a small amount of ether to zero (rounds down)', () => {
        const justEnoughEtherToShow = formatEther(0.00001);
        expect(justEnoughEtherToShow.formatted).toBe('0.00001');
        expect(justEnoughEtherToShow.full).toBe('0.00001 ETH');
    });

    test('should format a integer amount', () => {
        const wholeNumber = formatEther(12);
        expect(wholeNumber.formatted).toBe('12.00000');
        expect(wholeNumber.full).toBe('12.00000 ETH');
    });

    test('should add commas', () => {
        const millionEther = formatEther(1000000);
        expect(millionEther.formatted).toBe('1,000,000.00000');
        expect(millionEther.full).toBe('1,000,000.00000 ETH');
    });
});

describe('formatZrx', () => {
    test('should format to two digits', () => {
        const shouldBeRoundedToTwoDigits = formatZrx(1.123456789);
        expect(shouldBeRoundedToTwoDigits.formattedValue).toBe(1.12);
        expect(shouldBeRoundedToTwoDigits.denomination).toBe(' ZRX');
        expect(shouldBeRoundedToTwoDigits.formatted).toBe('1.12');
        expect(shouldBeRoundedToTwoDigits.full).toBe('1.12 ZRX');
        expect(shouldBeRoundedToTwoDigits.fullPrecision).toBe('1.123456789');
    });

    test('should round down', () => {
        const shouldBeRoundedToTwoDigits = formatZrx(1.999999);
        expect(shouldBeRoundedToTwoDigits.formattedValue).toBe(1.99);
        expect(shouldBeRoundedToTwoDigits.formatted).toBe('1.99');
        expect(shouldBeRoundedToTwoDigits.full).toBe('1.99 ZRX');
        expect(shouldBeRoundedToTwoDigits.fullPrecision).toBe('1.999999');
    });

    test('should add commas', () => {
        const millionZrx = formatZrx(1000000);
        expect(millionZrx.formatted).toBe('1,000,000.00');
        expect(millionZrx.full).toBe('1,000,000.00 ZRX');
    });
});
