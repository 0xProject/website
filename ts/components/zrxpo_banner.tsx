import React from 'react';
import styled from 'styled-components';

interface ZeroexpoBannerProps {
    isMobile: boolean;
}

interface ZrxpoLogoProps {
    isAbsolute?: boolean;
    isMobile?: boolean;
}

interface BannerMainProps {
    padding?: number;
}

const onClickHandler = () => {
    window.location.assign('https://www.0xpo.com/?utm_source=0x&utm_medium=Banner&utm_campaign=Crossroads');
};

const DesktopBanner: React.FC = () => {
    return (
        <BannerMain>
            <ImageBg />
            {/* <SfbwTag>
                <img
                    src="/images/0xpo/sfbw.svg"
                    alt="SFBW 2022 Logo"
                    height={17}
                    style={{ marginLeft: 8, marginRight: 8 }}
                />
                <span style={{ marginRight: 8 }}>Official Event</span>
            </SfbwTag> */}
            <CopyContainer>
                <Description>
                    Crossroads is a free-flowing day of learning, networking, and fun where your future-focused ideas
                    can flow freely.
                </Description>
                <CtaText onClick={onClickHandler}>Register for your free ticket at 0xpo.com</CtaText>
            </CopyContainer>
            <ZrxpoLogo />
        </BannerMain>
    );
};

const MobileBanner: React.FC = () => {
    return (
        <BannerMain onClick={onClickHandler} padding={8}>
            <ImageBg />
            {/* <SfbwTag>
                <img
                    src="/images/0xpo/sfbw.svg"
                    alt="SFBW 2022 Logo"
                    height={17}
                    style={{ marginLeft: 4, marginRight: 4 }}
                />
                <span style={{ marginRight: 4 }}>Official Event</span>
            </SfbwTag> */}
            <Container>
                <p>San Francisco, CA</p>
                <span>November 3, 2022</span>
                <ZrxpoLogo isAbsolute={false} isMobile={true} />
            </Container>
            <CtaText>Register for your free ticket at 0xpo.com</CtaText>
            {/* <CopyContainer>
                <Description>
                    <b style={{ fontWeight: 'bold' }}>Register for your free ticket at 0xpo.com</b>
                    Crossroads is a free-flowing day of learning, networking, and fun where your future-focused ideas
                    can flow freely between industry leaders, projects, and communities. <br />
                    See you at the Crossroads!
                </Description>
            </CopyContainer> */}
        </BannerMain>
    );
};

export const ZeroexpoBanner: React.FC<ZeroexpoBannerProps> = ({ isMobile }) => {
    return isMobile ? <MobileBanner /> : <DesktopBanner />;
};

const BannerMain = styled.div<BannerMainProps>`
    min-height: 80px;
    width: 100%;
    // max-width: 1280px;
    margin: auto;
    padding: ${({ padding = 0 }) => padding}px;
    background-image: url('/images/0xpo/crossroads.svg');
    background-size: contain;
    background-repeat-y: no-repeat;
    background-color: #00ae99;
    color: white;
    position: relative;
    animation: animateBg 240s linear infinite normal;
    @keyframes animateBg {
        from {
            background-position: 0 50%;
        }
        to {
            background-position: 1991px 50%;
        }
    }
`;
const ImageBg = styled('div')`
    // background: linear-gradient(
    //     90deg,
    //     rgba(0, 0, 0, 1) 0%,
    //     rgba(0, 0, 0, 1) 25%,
    //     rgba(0, 0, 0, 0) 50%,
    //     rgba(0, 0, 0, 1) 75%,
    //     rgba(0, 0, 0, 1) 100%
    // );
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;
// const SfbwTag = styled('div')`
//     position: absolute;
//     top: 0;
//     right: 0;
//     width: auto;
//     height: 44px;
//     display: flex;
//     background-color: #0d6efd;
//     justify-content: space-around;
//     align-items: center;
// `;
const CopyContainer = styled('div')`
    color: white;
    height: 100%;
    width: 100%;
    // max-width: 816px;
    z-index: 15;
    text-align: center;
    position: relative;
    display: inline-block;
    width: 100%;
    // margin-top: 52px;
    margin-top: 16px;
`;

const Description = styled('span')`
    line-height: 2;
`;

// const Cta = styled('button')`
//     background-color: #0d6efd;
//     padding: 8px 24px;
//     color: white;
//     display: block;
//     font-size: 20px;
//     border: none;
//     margin-top: 16px;
//     margin-bottom: 32px;
//     cursor: pointer;
// `;

const ZrxpoLogo = styled.div<ZrxpoLogoProps>`
    background-image: url('/images/0xpo/0xpo.svg');
    position: absolute;
    bottom: ${({ isMobile = false }) => (isMobile ? 'initial' : '16px')};
    left: ${({ isMobile = false }) => (isMobile ? 'initial' : '16px')};
    top: ${({ isMobile = false }) => (isMobile ? '8px' : 'initial')};
    right: ${({ isMobile = false }) => (isMobile ? '8px' : 'initial')};
    height: 24px;
    width: 56px;
    fill: black;
    background-size: contain;
    background-repeat: no-repeat;
`;

const Container = styled('div')`
    display: inline-block;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
`;

const CtaText = styled.div`
    font-weight: bold;
    // display: block;
    z-index: 10;
    position: relative;
    margin-top: 16px;
    margin-bottom: 16px;
    text-align: center;
    cursor: pointer;
`;
