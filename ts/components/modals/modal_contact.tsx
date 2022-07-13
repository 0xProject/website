import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { ButtonClose } from 'ts/components/modals/button_close';
import { CheckBoxInput, GenericDropdown, Input, InputWidth } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';
import { GlobalStyle } from 'ts/constants/globalStyle';
import { colors } from 'ts/style/colors';
import { utils } from 'ts/utils/utils';

// const products = ['0x Swap API'] as const;

const timelineForIntegrationOptions = [
    'I’ve already integrated!',
    '0-3 months',
    '3-6 months',
    '6-12 months',
    '12+ months',
    'I’m just getting started and browsing for more information',
] as const;

const chains = ['Avalanche', 'BNB', 'Celo', 'Ethereum', 'Fantom', 'Optimism', 'Polygon', 'Other'] as const;

const roles = ['Product Manager', 'Founder', 'Engineer', 'CTO', 'other'] as const;

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

export class ModalContact extends React.Component<Props> {
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
        typeOfBusiness: businessTypes[0] as string,
        timelineForIntegration: timelineForIntegrationOptions[0],
        role: roles[0] as string,
        isApplicationLive: false,
        currentTradingVolume: '0',
        link: '',
        productOfInterest: '0x Swap API',
        chainOfInterest: chains[0] as string,
        chainOfInterestOther: '',
        usageDescription: '',
        referral: '',
        isApiKeyRequired: false,
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
                                Contact Sales
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
        const newErrors = utils.validateContactForm((this.state as unknown) as { [s: string]: string });

        this.setState({ errors: newErrors });
    }

    private _renderGeneralFormContent(errors: ErrorProps): React.ReactNode {
        return (
            <>
                <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                    Hey there, Thanks for reaching out! 0x API is a professional grade liquidity aggregator for
                    developers and enterprises. You can get started for free directly by accessing the endpoint from the
                    documentation. For developers and enterprises who require higher rate limits or custom solutions,
                    please provide us with information about your business.
                </Paragraph>
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
                        name="companyName"
                        label="Name of Company"
                        type="text"
                        value={this.state.companyName}
                        required={true}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('companyName')}
                    />
                </InputRow>
                <InputRow>
                    <GenericDropdown
                        label="Type of Business"
                        name="typeOfBusiness"
                        items={businessTypes}
                        defaultValue={this.state.typeOfBusiness}
                        onItemSelected={(selectedBusiness) => {
                            this.setState({ typeOfBusiness: selectedBusiness });
                        }}
                    />
                </InputRow>
                <InputRow>
                    <GenericDropdown
                        label="Your Role"
                        name="role"
                        items={roles}
                        defaultValue={this.state.role}
                        onItemSelected={(selectedRole) => {
                            this.setState({ role: selectedRole });
                        }}
                    />
                </InputRow>
                <InputRow>
                    <CheckBoxInput
                        label="Check here if your application is live"
                        isSelected={this.state.isApplicationLive}
                        onClick={() => {
                            this.setState({ isApplicationLive: !this.state.isApplicationLive });
                        }}
                    />
                </InputRow>
                <InputRow>
                    <GenericDropdown
                        label="Timeline for integration"
                        name="timelineForIntegration"
                        items={timelineForIntegrationOptions}
                        defaultValue={this.state.chainOfInterest}
                        onItemSelected={(selectedOption) => {
                            this.setState({ timelineForIntegration: selectedOption });
                        }}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="currentTradingVolume"
                        label="What is the current trading volume or TVL for your application? (if applicable)"
                        type="number"
                        value={this.state.currentTradingVolume}
                        required={true}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('currentTradingVolume')}
                    />
                </InputRow>
                <InputRow>
                    <Input
                        name="linkToProductOrWebsite"
                        label="Link to Product or Website"
                        type="text"
                        value={this.state.linkToProductOrWebsite}
                        required={false}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('linkToProductOrWebsite')}
                    />
                </InputRow>
                {/* <InputRow>
                    <GenericDropdown
                        label="Which Products are you interested in?"
                        name="productOfInterest"
                        items={products}
                        defaultValue={this.state.productOfInterest}
                        onItemSelected={(selectedProducts) => {
                            this.setState({ productOfInterest: selectedProducts });
                        }}
                    />
                </InputRow> */}
                <InputRow>
                    <Input
                        name="usageDescription"
                        label="How do you plan to use our products?"
                        type="textarea"
                        value={this.state.usageDescription}
                        required={false}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('usageDescription')}
                    />
                </InputRow>
                <InputRow>
                    <GenericDropdown
                        label="Chain of Interest"
                        name="chainOfInterest"
                        items={chains}
                        defaultValue={this.state.chainOfInterest}
                        onItemSelected={(selectedChain) => {
                            this.setState({ chainOfInterest: selectedChain });
                        }}
                    />
                </InputRow>
                {this.state.chainOfInterest === 'Other' && (
                    <InputRow
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <Input
                            name="chainOfInterestOther"
                            label="Please enter the name of your chain of interest"
                            type="text"
                            value={this.state.chainOfInterestOther}
                            required={false}
                            errors={errors}
                            onChange={this._makeOnChangeHandler('chainOfInterestOther')}
                        />
                    </InputRow>
                )}
                <InputRow>
                    <Input
                        name="referral"
                        label="How did you find out about 0x API? If via referral, please indicate the name of the team or person that referred you here."
                        type="textarea"
                        value={this.state.referral}
                        required={false}
                        errors={errors}
                        onChange={this._makeOnChangeHandler('referral')}
                    />
                </InputRow>
                <InputRow>
                    <StyledSpan>
                        The API is intended for public use. The current limit is approximately 3 Requests Per Second
                        (RPS)/40 Requests Per Minute (RPM).
                    </StyledSpan>
                </InputRow>
                <InputRow>
                    <CheckBoxInput
                        label="If you require higher rate limits, check here to request an API key."
                        isSelected={this.state.isApiKeyRequired}
                        onClick={() => {
                            this.setState({ isApiKeyRequired: !this.state.isApiKeyRequired });
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
            isApplicationLive,
            currentTradingVolume,
            linkToProductOrWebsite,
            timelineForIntegration,
            chainOfInterest,
            chainOfInterestOther,
            usageDescription,
            referral,
            isApiKeyRequired,
        } = this.state;

        const body = {
            firstName,
            lastName,
            email,
            companyName,
            typeOfBusiness,
            role,
            isApplicationLive: `${isApplicationLive}`,
            currentTradingVolume,
            linkToProductOrWebsite,
            timelineForIntegration,
            chainOfInterest,
            chainOfInterestOther,
            usageDescription,
            referral,
            isApiKeyRequired: `${isApiKeyRequired}`,
        };

        await fetch('/api/contact', {
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

const StyledSpan = styled.span`
    color: #000;
    line-height: 1.4em;
    font-size: 1.111111111rem;
`;
// tslint:disable:max-file-line-count
