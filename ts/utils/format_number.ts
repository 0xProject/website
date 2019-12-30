import { BigNumber } from '@0x/utils';

// tslint:disable: boolean-naming
// tslint:disable: prefer-template
// tslint:disable: prefer-const
// tslint:disable: restrict-plus-operands

// Code logic borrowed from our friends at Augur :) (v2 codebase)

/*
The formatted number object that is returned looks something like this:
  {
    value: the parsed number in numerical form, 0 if a bad input was passed in, can be used in calculations

    formattedValue: the value in numerical form, possibly rounded, can be used in calculations
    formatted: the value in string form with possibly additional formatting, like comma separator, used for display

    o.roundedValue: the value in numerical form, with extra rounding, can be used in calculations
    o.rounded: the value in string form, with extra rounding
    o.roundedFormatted: the value in string form, with formatting, like comma separator, used for display

    o.minimized: the value in string form, with trailing 0 decimals omitted, for example if the `formatted` value is 1.00, this minimized value would be 1
  }

The reason the number object has multiple states of rounding simultaneously,
is because the ui can use it for multiple purposes. For example, when showing ether,
we generally like to show it with 5 decimals, however when used in totals,
maximum precision is not necessary, and we can opt to show the `rounded` display, which is only 1 decimal.
Similar logic applies for `minimized`, sometimes we don't need to be consistent with the decimals
and just show the prettiest, smallest representation of the value.

The options object that is passed into `formatNumber` that enables all of this looks like:
  {
    decimals: the number of decimals for the precise case, can be 0-infinity
    decimalsRounded: the number of decimals for the prettier case, can be 0-infinity
    denomination: the string denomination of the number (ex. Eth, Rep, %), can be blank
    positiveSign: boolean whether to include a plus sign at the beginning of positive numbers
    zeroStyled: boolean, if true, when the value is 0, it formates it as a dash (-) instead
  }
*/

export type NumStrBigNumber = number | BigNumber | string;

export const createBigNumber = (value: NumStrBigNumber, base?: number): BigNumber => {
    let newBigNumber;
    try {
      let useValue = value;
      if (typeof value === 'object' && Object.keys(value).indexOf('_hex') > -1) {
        // tslint:disable-next-line: no-unnecessary-type-assertion
        useValue = (value as any)._hex;
      }
      newBigNumber = new BigNumber(`${useValue}`, base);
    } catch (e) {
        // tslint:disable-next-line: no-console
        console.error('Error instantiating WrappedBigNumber', e);
        throw new Error(e);
    }

    return newBigNumber;
  };

export const ZERO = createBigNumber(0);
export const ONE = createBigNumber(1, 10);
export const TWO = createBigNumber(2, 10);
export const TEN = createBigNumber(10, 10);

export const ETHER_NUMBER_OF_DECIMALS = 5;
export const ZRX_NUMBER_OF_DECIMALS = 2;

export const SMALLEST_NUMBER_DECIMAL_PLACES = 8;
export const USUAL_NUMBER_DECIMAL_PLACES = 4;

export interface FormattedNumber {
  fullPrecision: number | string;
  roundedValue: number | BigNumber;
  roundedFormatted: string;
  formatted: string;
  formattedValue: number | string;
  denomination: string;
  minimized: string;
  value: number;
  rounded: number | string;
  full: number | string;
}

export interface FormattedNumberOptions {
  decimals?: number;
  decimalsRounded?: number;
  denomination?: (value: string) => string;
  roundUp?: boolean;
  roundDown?: boolean;
  positiveSign?: boolean;
  zeroStyled?: boolean;
  minimized?: boolean;
  blankZero?: boolean;
  bigUnitPostfix?: boolean;
  removeComma?: boolean;
}

function formatNone(): FormattedNumber {
  return {
    value: 0,
    formattedValue: 0,
    formatted: '-',
    roundedValue: 0,
    rounded: '-',
    roundedFormatted: '-',
    minimized: '-',
    denomination: '',
    full: '-',
    fullPrecision: '0',
  };
}

function formatBlank(): FormattedNumber {
  return {
    value: 0,
    formattedValue: 0,
    formatted: '',
    roundedValue: 0,
    rounded: '',
    roundedFormatted: '',
    minimized: '',
    denomination: '',
    full: '',
    fullPrecision: '0',
  };
}

function optionsBlank(): FormattedNumberOptions {
  return {
    decimals: 0,
    decimalsRounded: 0,
    denomination: (v => ''),
    roundUp: false,
    roundDown: false,
    positiveSign: false,
    zeroStyled: true,
    minimized: false,
    blankZero: false,
    bigUnitPostfix: false,
  };
}

// tslint:disable-next-line: typedef
function addBigUnitPostfix(value: BigNumber, formattedValue: string | number, removeComma: boolean = false) {
  let postfixed;
  if (value.gt(createBigNumber('1000000000000', 10))) {
    postfixed = '> 1T';
  } else if (value.gt(createBigNumber('10000000000', 10))) {
    postfixed =
      value.dividedBy(createBigNumber('1000000000', 10)).toFixed(0) + 'B';
  } else if (value.gt(createBigNumber('10000000', 10))) {
    postfixed =
      // tslint:disable-next-line: prefer-template
      value.dividedBy(createBigNumber('1000000', 10)).toFixed(0) + 'M';
  } else if (value.gt(createBigNumber('10000', 10))) {
    postfixed = value.dividedBy(createBigNumber('1000', 10)).toFixed(0) + 'K';
  } else {
    postfixed = addCommas(formattedValue, removeComma);
  }
  return postfixed;
}

export function formatNumber(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = optionsBlank(),
): FormattedNumber {
  const value = num != null ? createBigNumber(num, 10) : ZERO;
  const { minimized, bigUnitPostfix } = opts;
  const o: FormattedNumber = formatBlank();
  let {
    decimals,
    decimalsRounded,
    denomination,
    roundUp,
    roundDown,
    positiveSign,
    zeroStyled,
    blankZero,
    removeComma = false,
  } = opts;

  decimals = decimals || 0;
  decimalsRounded = decimalsRounded || 0;
  denomination = denomination || (_ => '');
  positiveSign = !!positiveSign;
  roundUp = !!roundUp;
  roundDown = !!roundDown;
  zeroStyled = zeroStyled;
  blankZero = blankZero;

  if (value.eq(ZERO)) {
    if (zeroStyled) { return formatNone(); }
    if (blankZero) { return formatBlank(); }
  }

  const decimalsValue = TEN.exponentiatedBy(decimals);
  const decimalsRoundedValue = TEN.exponentiatedBy(decimalsRounded);

  let roundingMode: BigNumber.RoundingMode;
  if (roundDown) {
    roundingMode = BigNumber.ROUND_DOWN;
  } else if (roundUp) {
    roundingMode = BigNumber.ROUND_UP;
  } else {
    roundingMode = BigNumber.ROUND_HALF_EVEN;
  }
  let formatSigFig = false;
  if (typeof num === 'string' && isNaN(parseFloat(num))) {
    o.value = 0;
    o.formattedValue = 0;
    o.formatted = '0';
    o.roundedValue = 0;
    o.rounded = '0';
    o.roundedFormatted = '0';
    o.minimized = '0';
    o.fullPrecision = '0';
  } else {
    const useSignificantFiguresThreshold = TEN.exponentiatedBy(
      new BigNumber(decimals, 10)
        .minus(1)
        .negated()
        .toNumber(),
    );
    const roundToZeroThreshold = ZERO;
    o.value = value.toNumber();
    if (value.abs().lt(roundToZeroThreshold)) {
      // value is less than zero
      o.formattedValue = '0';
    } else if (value.abs().lt(useSignificantFiguresThreshold)) {
      if (!decimals) {
        o.formattedValue = '0';
      } else {
        formatSigFig = true;
        o.formattedValue = value.toPrecision(decimals, roundingMode);
      }
    } else {
      o.formattedValue = value
        .times(decimalsValue)
        .integerValue(roundingMode)
        .dividedBy(decimalsValue)
        .toFixed(decimals);
    }

    const zeroFixed = ZERO.toFixed(USUAL_NUMBER_DECIMAL_PLACES);

    if (bigUnitPostfix && !formatSigFig) {
      o.formatted = addBigUnitPostfix(value, o.formattedValue, removeComma);
    } else if (formatSigFig) {
      // for numbers smaller than the set number of decimals - ie ones with scientific notation
      let formatted = value.toFixed(decimals || USUAL_NUMBER_DECIMAL_PLACES);

      if (formatted === zeroFixed || formatted === '-' + zeroFixed) {
        // if this is equal to zero, try to show significant digits up to 8 digit places
        formatted = value.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES);
        if (
          formatted === ZERO.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES) ||
          formatted === '-' + ZERO.toFixed(SMALLEST_NUMBER_DECIMAL_PLACES)
        ) {
          formatted = zeroFixed; // if there are no significant digits in the 8 decimal places, just use zero
        } else {
          formatted = value.toFixed(
            1 - Math.floor(Math.log(value.abs().toNumber()) / Math.log(10)),
          ); // find first two significant digit
        }
      }
      o.formatted = formatted;
    } else {
      o.formatted = addCommas(o.formattedValue, removeComma);
    }
    o.fullPrecision = value.toFixed();
    o.roundedValue = value
      .times(decimalsRoundedValue)
      .integerValue(roundingMode)
      .dividedBy(decimalsRoundedValue);
    o.roundedFormatted = bigUnitPostfix
      ? addBigUnitPostfix(value, o.roundedValue.toFixed(decimalsRounded), removeComma)
      : addCommas(o.roundedValue.toFixed(decimalsRounded), removeComma);
    // o.minimized = addCommas(encodeNumberAsBase10String(o.formattedValue), removeComma);
    // o.rounded = encodeNumberAsBase10String(o.roundedValue);
    // o.formattedValue = encodeNumberAsJSNumber(o.formattedValue, false);
    o.minimized = addCommas(new BigNumber(o.formattedValue, 10).toFixed(), removeComma);
    o.rounded = o.roundedValue.toFixed();
    o.formattedValue = new BigNumber(o.formattedValue, 10).toNumber();
    o.roundedValue = o.roundedValue;
  }

  if (positiveSign && !bigUnitPostfix) {
    if (o.formattedValue || 0 >= 0) {
      o.formatted = `+${o.formatted}`;
      o.minimized = `+${o.minimized}`;
    }
    if (o.roundedValue >= 0) {
      o.rounded = `+${o.rounded}`;
    }
  }

  if (minimized) {
    o.formatted = o.minimized;
  }

  o.denomination = denomination('');
  o.full = denomination(o.formatted);

  if (
    (typeof num === 'string' && isNaN(parseFloat(num))) ||
    o.formatted === '0'
  ) {
    o.formatted = ZERO.toFixed(decimalsRounded);
  }
  return o;
}

export const addCommas = (num: number | string, removeComma: boolean = false): string => {
  let sides: string[] = [];
  sides = num.toString().split('.');
  sides[0] = removeComma ? sides[0] : sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sides.join('.');
};

export function formatPercent(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {},
): FormattedNumber {
  return formatNumber(num, {
    decimals: 2,
    decimalsRounded: 0,
    denomination: (v: string) => `${v}%`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatEther(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {},
): FormattedNumber {
  return formatNumber(num, {
    decimals: ETHER_NUMBER_OF_DECIMALS,
    decimalsRounded: ETHER_NUMBER_OF_DECIMALS,
    denomination: v => `${v} ETH`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}

export function formatZrx(
  num: NumStrBigNumber,
  opts: FormattedNumberOptions = {},
): FormattedNumber {
  return formatNumber(num, {
    decimals: ZRX_NUMBER_OF_DECIMALS,
    decimalsRounded: ZRX_NUMBER_OF_DECIMALS,
    roundDown: true, // round down to be safe and avoid ui mismatches
    denomination: v => `${v} ZRX`,
    positiveSign: false,
    zeroStyled: false,
    blankZero: false,
    bigUnitPostfix: false,
    ...opts,
  });
}
