import marked from 'marked';
import React from 'react';

import { Heading, Paragraph } from 'ts/components/text';

const renderToken = (token: any, index: number) => {
  switch (token.type) {
    case 'heading':
      if (token.depth === 1) {
        return <Heading key={index} marginBottom="20px">{token.text}</Heading>;
      } else if (token.depth === 2) {
        return <Paragraph key={index}>{token.text}</Paragraph>;
      }
      return null;
    default:
      return null;
      break;
  }
};

export const TreasurySummary: React.FC<{description: string}> = ({ description }) => {
  const tokens = marked.lexer(`# Add UNI Support
  ## This proposal adds [Uniswap](https://etherscan.io/token/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984) as a supported asset, and implements an updated [Open Price Feed](https://compound.finance/docs/prices) view contract that supports cUNI.
  ### Market Parameters Uniswap is a widely distributed token, with significant on-chain and off-chain liquidity. However, as a new market, it is being introduced with conservative parameters; a *Collateral Factor* equal to ZRX and BAT (which are both less liquid, smaller market cap tokens), a lower *Reserve Factor* of 20%, and a *Borrowing Cap* of 2,000,000 UNI. The UNI market uses the same interest rate model as USDT, with an upper bound of 30% APY at 100% utilization. ### Contracts cUNI is an upgradable cToken contract that has been modified with a single new function; the ability to *Delegate* the UNI held inside the contract to an address specified by Governance. This will allow Compound Governance to participate in Uniswap Governance. Initially, UNI will be undelegated. The cUNI contract has been peer-reviewed by Compound Labs and community developers, but given the limited scope of the modifications, has not been audited by third-party professional auditors. A new Open Price Feed view contract has been deployed, which adds support for cUNI. No changes were otherwise made to the view contract. The contracts were [developed in the open](https://www.comp.xyz/t/adding-new-markets-to-compound/392), and can serve as a template for the community to launch additional markets.`);

  return <>{tokens.map(renderToken)}</>;
};
