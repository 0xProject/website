import { ZeroExProvider } from 'ethereum-types';
import * as _ from 'lodash';

import { BrowserType } from 'ts/types';
import { PROVIDER_TYPE_TO_ICON, PROVIDER_TYPE_TO_NAME } from 'ts/utils/providers/constants';
import { ProviderType } from 'ts/utils/providers/types';
import { utils } from 'ts/utils/utils';

export const envUtil = {
    getProviderType(provider: ZeroExProvider): ProviderType | undefined {
        const anyProvider = provider as any;
        if (provider.constructor.name === 'EthereumProvider') {
            return ProviderType.Mist;
        } else if (anyProvider.isTrust) {
            return ProviderType.TrustWallet;
        } else if (anyProvider.isParity) {
            return ProviderType.Parity;
        } else if (anyProvider.isMetaMask) {
            return ProviderType.MetaMask;
        } else if (_.get(window, 'SOFA') !== undefined) {
            return ProviderType.CoinbaseWallet;
        } else if (_.get(window, '__CIPHER__') !== undefined) {
            return ProviderType.Cipher;
        } else if (utils.getBrowserType() === BrowserType.Opera && !anyProvider.isMetaMask) {
            return ProviderType.Opera;
        }

        return undefined;
    },

    getProviderName(provider: ZeroExProvider): string {
        const providerTypeIfExists = envUtil.getProviderType(provider);
        if (providerTypeIfExists === undefined) {
            return provider.constructor.name;
        }
        return PROVIDER_TYPE_TO_NAME[providerTypeIfExists];
    },

    getProviderDisplayName(provider: ZeroExProvider): string {
        const providerTypeIfExists = envUtil.getProviderType(provider);
        if (providerTypeIfExists === undefined) {
            return 'Wallet';
        }
        return PROVIDER_TYPE_TO_NAME[providerTypeIfExists];
    },

    getProviderTypeIcon(providerType?: ProviderType): string | undefined {
        if (providerType === undefined) {
            return undefined;
        }

        return PROVIDER_TYPE_TO_ICON[providerType];
    },
};
