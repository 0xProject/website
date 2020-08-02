import * as React from 'react';
import styled from 'styled-components';

interface LiquidityMarketSelectProps {
    items: Array<{
        title: string;
        subtitle?: string;
    }>;
    selectedItem: number;
    onSelectItem: (index: number) => void;
}

export const LiquidityMarketSelect: React.FC<LiquidityMarketSelectProps> = ({ items, selectedItem, onSelectItem }) => {
    const [isOpen, setOpen] = React.useState(false);

    const handleItemClick = (index: number) => {
        onSelectItem(index);
        setOpen(false);
    };

    return (
        <Wrapper>
            <Toggle isOpen={isOpen} onClick={() => setOpen(!isOpen)}>
                <MarketBlock title={items[selectedItem].title} subtitle={items[selectedItem].subtitle} />
            </Toggle>
            {isOpen && (
                <Menu>
                    {items.map((item, index) =>
                        index === selectedItem ? null : (
                            <MenuItem key={`${index}_${item.title}`} onClick={() => handleItemClick(index)}>
                                <MarketBlock title={item.title} subtitle={item.subtitle} />
                            </MenuItem>
                        ),
                    )}
                </Menu>
            )}
        </Wrapper>
    );
};

interface ToggleProps {
    isOpen: boolean;
    onClick: (e: any) => any;
}

const Toggle: React.FC<ToggleProps> = ({ isOpen, onClick, children }) => (
    <ToggleWrapper onClick={onClick}>
        {isOpen ? <Label isMuted={true}>Select a market</Label> : children}
        <span>
            {!isOpen && (
                <Label isMuted={true} size="small">
                    Change
                </Label>
            )}
            <Arrow isExpanded={isOpen} />
        </span>
    </ToggleWrapper>
);

interface ArrowProps {
    isExpanded: boolean;
}

const Arrow: React.FC<ArrowProps> = ({ isExpanded }) => (
    <svg
        style={{ transform: isExpanded ? 'rotate(180deg)' : null }}
        width="20"
        height="10"
        viewBox="0 0 20 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M1.04797 1L9.91784 8.63636L18.7877 1" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface MarketBlockProps {
    title: string;
    subtitle?: string;
}

const MarketBlock: React.FC<MarketBlockProps> = ({ title, subtitle }) => (
    <span>
        <Label>{title}</Label>
        {subtitle && <Label size="small"> ({subtitle})</Label>}
    </span>
);

const Wrapper = styled.div`
    position: relative;
`;

const ToggleWrapper = styled.button`
    width: 100%;
    padding: 18px 25px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
    color: #ffffff;
    background: none;
    border: 1px solid #263937;

    & svg {
        margin-left: 12px;
    }
`;

const Menu = styled.div`
    position: absolute;
    background: #000;
    width: 100%;
    z-index: 10;
`;

const MenuItem = styled.div`
    padding: 18px 25px;
    border: 1px solid #263937;
    cursor: pointer;
`;

interface LabelProps {
    isMuted?: boolean;
    size?: 'default' | 'small';
}

const Label = styled.span<LabelProps>`
    font-size: ${props => (props.size === 'default' ? '26px' : '18px')};
    line-height: ${props => (props.size === 'default' ? '32px' : '25px')};
    opacity: ${props => (props.isMuted ? 0.7 : 1)};

    @media (min-width: 768px) {
        font-size: ${props => (props.size === 'default' ? '28px' : '20px')};
        line-height: ${props => (props.size === 'default' ? '38px' : '27px')};
    }
`;

Label.defaultProps = {
    size: 'default',
};
