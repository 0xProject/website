import { assert } from '@0x/assert';
import { DevUtilsContract } from '@0x/contracts-dev-utils';
import { schemas, SchemaValidator } from '@0x/json-schemas';
import { Order } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { assign, each, update } from 'lodash-es';

// TODO(kimpers): This file is completely untested make sure to verify when bringing back Portal

// NOTE: Copied from 0x/connect
// https://github.com/0xProject/0x-monorepo/blob/development/packages/connect/src/utils/order_parsing_utils.ts
export const orderParsingUtils = {
    convertStringsFieldsToBigNumbers(obj: any, fields: string[]): any {
        const result = assign({}, obj);
        each(fields, (field) => {
            update(result, field, (value: string) => {
                if (value === undefined) {
                    throw new Error(`Could not find field '${field}' while converting string fields to BigNumber.`);
                }
                return new BigNumber(value);
            });
        });
        return result;
    },
    convertOrderStringFieldsToBigNumber(order: any): any {
        return orderParsingUtils.convertStringsFieldsToBigNumbers(order, [
            'makerAssetAmount',
            'takerAssetAmount',
            'makerFee',
            'takerFee',
            'expirationTimeSeconds',
            'salt',
        ]);
    },
};
export const orderHashUtils = {
    /**
     * Checks if the supplied hex encoded order hash is valid.
     * Copied from https://github.com/0xProject/0x-monorepo/pull/2321
     * Note: Valid means it has the expected format, not that an order with the orderHash exists.
     * Use this method when processing orderHashes submitted as user input.
     * @param   orderHash    Hex encoded orderHash.
     * @return  Whether the supplied orderHash has the expected format.
     */

    isValidOrderHash(orderHash: string): boolean {
        // Since this method can be called to check if any arbitrary string conforms to an orderHash's
        // format, we only assert that we were indeed passed a string.
        assert.isString('orderHash', orderHash);
        const schemaValidator = new SchemaValidator();
        const isValid = schemaValidator.isValid(orderHash, schemas.orderHashSchema);
        return isValid;
    },

    async getOrderHashHexAsync(order: Order): Promise<string> {
        // HACK(kimpers): This only needs to access the pure function getOrderHash and does not need on-chain data
        const devUtilsContract = new DevUtilsContract('0x0000000000000000000000000000000000000000', {
            isEIP1193: true,
        } as any);
        return devUtilsContract
            .getOrderHash(order, new BigNumber(order.chainId, 10), order.exchangeAddress)
            .callAsync();
    },
};
