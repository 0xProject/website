import * as React from 'react';
// tslint:disable-next-line: no-duplicate-imports
import { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { DocumentTitle } from 'ts/components/document_title';
import { ModalContact } from 'ts/components/modals/modal_contact';
import { Section } from 'ts/components/newLayout';
import { SectionLandingAbout } from 'ts/components/sections/landing/about';
import { SectionApiQuote } from 'ts/components/sections/landing/apiQuote';
import { SectionLandingClients } from 'ts/components/sections/landing/clients';
import { SectionLandingCta } from 'ts/components/sections/landing/cta';
import { SectionLandingHero } from 'ts/components/sections/landing/hero';
import { SectionFeatures } from 'ts/components/sections/landing/matchaFeature';
import { SiteWrap } from 'ts/components/siteWrap';
// import { ZeroexpoBanner } from 'ts/components/zrxpo_banner';
import { documentConstants } from 'ts/utils/document_meta_constants';

import { OrderRoutingSection } from './api';

interface Props {
    location: Location;
    theme: {
        bgColor: string;
        textColor: string;
        linkColor: string;
    };
}

const NextLanding: React.FC<Props> = (props) => {
    const { hash } = useLocation();
    const history = useHistory();
    const [isContactModalOpen, setisContactModalOpen] = useState<boolean>(hash.includes('contact'));
    const _onOpenContactModal = useCallback((): void => {
        history.push('#contact');
        setisContactModalOpen(true);
    }, [history]);

    const _onDismissContactModal = useCallback((): void => {
        history.push('/');
        setisContactModalOpen(false);
    }, [history]);

    React.useEffect(() => {
        if (hash.includes('contact')) {
            setisContactModalOpen(true);
        }
    }, [hash]);

    const { width: windowWidth } = useWindowSize();
    const isSmallScreen = windowWidth < 700;

    return (
        <SiteWrap theme="dark">
            {/* <ZeroexpoBanner isMobile={isSmallScreen} /> */}
            <DocumentTitle {...documentConstants.LANDING} />
            <SectionLandingHero />
            {!isSmallScreen && (
                <Section bgColor="dark" isFlex={true} maxWidth="1170px" marginBottom={'8px'}>
                    <OrderRoutingSection />
                </Section>
            )}
            <SectionLandingAbout />
            <SectionLandingClients />
            <SectionApiQuote />
            {!isSmallScreen && <SectionFeatures />}
            <SectionLandingCta onContactClick={_onOpenContactModal} />
            <ModalContact isOpen={isContactModalOpen} onDismiss={_onDismissContactModal} />
        </SiteWrap>
    );
};

export { NextLanding };
