import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { ButtonClose } from 'ts/components/modals/button_close';
import { GenericDropdown, Input, InputWidth } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';
import { GlobalStyle } from 'ts/constants/globalStyle';
import { colors } from 'ts/style/colors';
import { utils } from 'ts/utils/utils';

const chains = ['Ethereum', 'Polygon'] as const;

const roles = ['Product Manager', 'Founder', 'Engineer', 'CTO', 'other'] as const;

const txRelayAPI = 'Tx Relay API' as const;

const businessTypes = [
    'CEX',
    'Developer',
    'Custodians',
    'Enterprise',
    'Fintech',
    'Financial Service - Crypto Native',
    'Wallet',
] as const;

export enum ModalContactType {
    General = 'GENERAL',
    MarketMaker = 'MARKET_MAKER',
    Credits = 'CREDITS',
    Explore = 'EXPLORE',
}

interface Props {
    theme?: GlobalStyle;
    isOpen?: boolean;
    onDismiss?: () => void;
    modalContactType: ModalContactType;
}

interface FormProps {
    isSuccessful?: boolean;
    isSubmitting?: boolean;
}

interface ErrorProps {
    [key: string]: string;
}

export class ModalEarlyAccess extends React.Component<Props> {
    public static defaultProps = {
        modalContactType: ModalContactType.General,
    };
    public state = {
        creditLeadsServices: [] as string[],
        exploreSupportInstant: false,
        isSubmitting: false,
        isSuccessful: false,
        errors: {},
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        linkToProductOrWebsite: '',
        typeOfBusiness: '',
        role: '',
        productOfInterest: [txRelayAPI] as string[],
        chainOfInterest: '',
    };
    public themeColorRef: React.RefObject<HTMLInputElement> = React.createRef();

    public constructor(props: Props) {
        super(props);
    }

    public render(): React.ReactNode {
        const { isOpen, onDismiss } = this.props;
        const { isSuccessful, errors } = this.state;
        return (
            <>
                <DialogOverlay
                    style={{ background: 'rgba(0, 0, 0, 0.75)', zIndex: 30 }}
                    isOpen={isOpen}
                    onDismiss={onDismiss}
                >
                    <StyledDialogContent>
                        <Form onSubmit={this._onSubmitAsync.bind(this)} isSuccessful={isSuccessful}>
                            <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                                Contact Us
                            </Heading>
                            {this._renderFormContent(errors)}
                            <ButtonRow>
                                <Button
                                    color="#5C5C5C"
                                    isNoBorder={true}
                                    isTransparent={true}
                                    type="button"
                                    onClick={this.props.onDismiss}
                                >
                                    Back
                                </Button>
                                <Button color={colors.white}>Submit</Button>
                            </ButtonRow>
                        </Form>
                        <Confirmation isSuccessful={isSuccessful}>
                            <Icon name="rocketship" size="large" margin={[0, 0, 'default', 0]} />
                            <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                                Thanks for contacting us.
                            </Heading>
                            <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                                We'll get back to you soon. If you need quick support in the meantime, reach out to the
                                0x team on Discord.
                            </Paragraph>
                            <Button color={colors.white} onClick={this.props.onDismiss}>
                                Done
                            </Button>
                        </Confirmation>
                        <ButtonClose onClick={this.props.onDismiss} />
                    </StyledDialogContent>
                </DialogOverlay>
            </>
        );
    }
    public _renderFormContent(errors: ErrorProps): React.ReactNode {
        return this._renderGeneralFormContent(errors);
    }

    private _makeOnChangeHandler(name: string): React.ChangeEventHandler<HTMLInputElement> {
        return (e) => {
            this.setState({ [name]: e.currentTarget.value });
        };
    }

    private _validateForm(): void {
        const entries = (this.state as unknown) as { [s: string]: string };

        const newErrors = utils.validateEarlyAccessForm(entries);

        this.setState({ errors: newErrors });
    }

    private _renderGeneralFormContent(errors: ErrorProps): React.ReactNode {
        return (
            <>
                <InputRow>
                    <Input
                        name="firstName"
                        label="First Name"
                        type="text"
                        width={InputWidth.Half}
                        value={this.state.firstName}
                        required={true}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('firstName')}
                    />
                    <Input
                        name="lastName"
                        label="Last Name"
                        type="text"
                        width={InputWidth.Half}
                        value={this.state.lastName}
                        required={true}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('lastName')}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="email"
                        label="Your email"
                        type="email"
                        value={this.state.email}
                        required={true}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('email')}
                    />
                </InputRow>
                <InputRow>
                    <GenericDropdown
                        label="Type of Business"
                        name="typeOfBusiness"
                        items={businessTypes}
                        defaultValue={this.state.typeOfBusiness}
                        errors={errors}
                        onItemSelected={(selectedBusiness) => {
                            this.setState({ typeOfBusiness: selectedBusiness });
                        }}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="companyName"
                        label="Company Name"
                        type="text"
                        value={this.state.companyName}
                        required={true}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('companyName')}
                    />
                </InputRow>
                <InputRow>
                    <GenericDropdown
                        label="Your Role"
                        name="role"
                        errors={errors}
                        items={roles}
                        defaultValue={this.state.role}
                        onItemSelected={(selectedRole) => {
                            this.setState({ role: selectedRole });
                        }}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        label="Product of interest"
                        name="productOfInterest"
                        type="text"
                        value={txRelayAPI}
                        disabled={true}
                    />
                </InputRow>
                <InputRow>
                    <GenericDropdown
                        label="Chain of Interest"
                        name="chainOfInterest"
                        items={chains}
                        defaultValue={this.state.chainOfInterest}
                        errors={errors}
                        onItemSelected={(selectedChain) => {
                            this.setState({ chainOfInterest: selectedChain });
                        }}
                    />
                </InputRow>
            </>
        );
    }

    private async _onSubmitAsync(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        this._validateForm();

        await new Promise((resolve) => setImmediate(resolve));

        if (Object.keys(this.state.errors).length > 0) {
            return;
        }

        const {
            firstName,
            lastName,
            email,
            companyName,
            typeOfBusiness,
            role,
            linkToProductOrWebsite,
            chainOfInterest,
            productOfInterest,
        } = this.state;

        const body = {
            firstName,
            lastName,
            email,
            companyName,
            typeOfBusiness,
            role,
            linkToProductOrWebsite,
            chainOfInterest,
            productOfInterest: productOfInterest.join(','),
        };

        await fetch('/api/early-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(body),
        });

        this.setState({ isSuccessful: true });
    }
}

// Handle errors: {"errors":[{"location":"body","param":"name","msg":"Invalid value"},{"location":"body","param":"email","msg":"Invalid value"}]}

const InputRow = styled.div`
    width: 100%;
    flex: 0 0 auto;

    @media (min-width: 768px) {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }
`;

const ButtonRow = styled(InputRow)`
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;

        button:nth-child(1) {
            order: 2;
        }

        button:nth-child(2) {
            order: 1;
            margin-bottom: 10px;
        }
    }
`;

const StyledDialogContent = styled(DialogContent)`
    position: relative;
    max-width: 800px;
    background-color: #f6f6f6 !important;
    padding: 60px 60px !important;

    @media (max-width: 768px) {
        width: calc(100vw - 40px) !important;
        margin: 40px auto !important;
        padding: 30px 30px !important;
    }
`;

const Form = styled.form<FormProps>`
    position: relative;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

    opacity: ${(props) => props.isSuccessful && `0`};
    visibility: ${(props) => props.isSuccessful && `hidden`};
`;

const Confirmation = styled.div<FormProps>`
    position: absolute;
    top: 50%;
    text-align: center;
    width: 100%;
    left: 0;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    transition-delay: 0.4s;
    padding: 60px 60px;
    transform: translateY(-50%);
    opacity: ${(props) => (props.isSuccessful ? `1` : `0`)};
    visibility: ${(props) => (props.isSuccessful ? 'visible' : `hidden`)};

    p {
        max-width: 492px;
        margin-left: auto;
        margin-right: auto;
    }
`;

// tslint:disable:max-file-line-count
