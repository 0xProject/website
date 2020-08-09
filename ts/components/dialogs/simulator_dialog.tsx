import React from 'react';
import styled from 'styled-components';
import { State } from 'ts/redux/reducer';
import { useSelector } from 'react-redux';
import { Icon } from 'ts/components/icon';
import { Select } from 'ts/components/inputs/select_input';

const transforms: any = {
    top: 'translateY(-100%)',
    right: 'translateX(100%)', // PC
    bottom: 'translateY(100%)', // Mobile
    left: 'translateX(-100%)',
};

const SimulatorDrawerWrapper: any = styled.div`
    display: block;
    width: ${(props: SimulatorDrawerProps) => (props.size ? props.size : '300px')};
    height: 100%;
    transform: ${(props: SimulatorDrawerProps) => (!props.open ? transforms['right'] : null)};
`;

//Covers entire view and is used for dismissal
const SimulatorDrawerOverlay: any = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 8;
    display: ${(props: SimulatorDrawerProps) => (props.open ? null : 'none')};
`;

const SimulatorDrawerContent: any = styled.div`
    display: block;
    box-sizing: border-box;
    position: fixed;
    right: ${(props: SimulatorDrawerProps) => (props.size ? props.size : '400px')};
    top: 0;
    height: 100%;
    z-index: 16;
    width: ${(props: SimulatorDrawerProps) => (props.size ? props.size : '300px')};
    transform: ${(props: SimulatorDrawerProps) => (!props.open ? transforms['right'] : null)};
    transition: transform 0.2s ease-out;
    overflow-x: hidden;
    overflow-y: hidden;
    color: #000;
    background-color: ${(props: SimulatorDrawerProps) => props.backgroundColor || '#fff'};
    box-shadow: -10px 0px 10px rgba(0, 0, 0, 0.19);
    transition: visibility 0s, transform 0.5s;
`;

const Body = styled.div`
    padding: 39px 56px 39px 52px;
`;

const Heading = styled.div`
    display: flex;
    justify-content: space-between;
`;

const HeadingText = styled.h1``;

const StyledButtonClose = styled.button.attrs({
    type: 'button',
})`
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 70px;
    overflow: hidden;
    width: 15px;
    height: 15px;
    border: 0;
    background-color: transparent;
    padding: 0;
    transform: translateY(-47px);

    span {
        opacity: 0;
        visibility: hidden;
        position: absolute;
    }

    path {
        fill: ${props => props.theme.textColor};
    }
`;

const Content = styled.div``;

interface SimulatorDrawerProps {
    open?: boolean;
    size?: string | number;
    onDismiss?: () => void;
    backgroundColor?: string;
    elementRef: any;
}

export const SimulatorDrawer = ({ open, size, onDismiss, backgroundColor, elementRef }: SimulatorDrawerProps) => {
    const isOpen = useSelector((state: State) => state.isSimulationDialogOpen);

    return (
        <React.Fragment>
            {isOpen && (
                <SimulatorDrawerWrapper ref={elementRef} open={isOpen} size={size}>
                    <SimulatorDrawerOverlay open={open} onClick={onDismiss} />
                    <SimulatorDrawerContent open={open} size={size} backgroundColor={backgroundColor}>
                        <Body>
                            <Heading>
                                <HeadingText>Reward Simulator</HeadingText>
                                <StyledButtonClose onClick={onDismiss}>
                                    <Icon name="close-modal" size={15} margin={[0, 0, 0, 0]} />
                                </StyledButtonClose>
                            </Heading>
                            <Content>
                                <Select />
                            </Content>
                        </Body>
                    </SimulatorDrawerContent>
                </SimulatorDrawerWrapper>
            )}
        </React.Fragment>
    );
};
