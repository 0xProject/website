import { logUtils } from '@0x/utils';

import { find, get } from 'lodash-es';
import { orderParsingUtils } from 'ts/utils/order_utils';

import { portalOrderSchema } from 'ts/schemas/portal_order_schema';
import { validator } from 'ts/schemas/validator';
import { PortalOrder } from 'ts/types';

export const orderParser = {
    parseQueryString(queryString: string): PortalOrder | undefined {
        if (queryString.length === 0) {
            return undefined;
        }
        const queryParams = queryString.substring(1).split('&');
        const orderQueryParam = find(queryParams, (queryParam) => {
            const queryPair = queryParam.split('=');
            return queryPair[0] === 'order';
        });
        if (orderQueryParam === undefined) {
            return undefined;
        }
        const orderPair = orderQueryParam.split('=');
        if (orderPair.length !== 2) {
            return undefined;
        }
        const order = JSON.parse(decodeURIComponent(orderPair[1]));
        const validationResult = validator.validate(order, portalOrderSchema);
        if (validationResult.errors.length > 0) {
            logUtils.log(`Invalid shared order: ${validationResult.errors}`);
            return undefined;
        }
        const signedOrder = get(order, 'signedOrder');
        const convertedSignedOrder = orderParsingUtils.convertOrderStringFieldsToBigNumber(signedOrder);
        const result = {
            ...order,
            signedOrder: convertedSignedOrder,
        };
        return result;
    },
    parseJsonString(orderJson: string): PortalOrder {
        const order = JSON.parse(orderJson);
        const signedOrder = get(order, 'signedOrder');
        const convertedSignedOrder = orderParsingUtils.convertOrderStringFieldsToBigNumber(signedOrder);
        const result = {
            ...order,
            signedOrder: convertedSignedOrder,
        };
        return result;
    },
};
