import * as _ from 'lodash';
import * as React from 'react';

import { DocumentTitle } from 'ts/components/document_title';
import { Column, Section } from 'ts/components/newLayout';
import { SiteWrap } from 'ts/components/siteWrap';
import { Heading, Paragraph } from 'ts/components/text';
import { ListItem, OrderedList, UnorderedList } from 'ts/components/textList';
import { documentConstants } from 'ts/utils/document_meta_constants';

export const PrivacyPolicy = () => (
    <SiteWrap theme="light">
        <DocumentTitle {...documentConstants.PRIVACY_POLICY} />
        <Section id="privacy-notice">
            <Column>
                <Heading size="medium" isCentered={true}>
                    Privacy Notice
                </Heading>
                <Heading asElement="h4" size="small" marginBottom="50px" isMuted={true} isCentered={true}>
                    Last Updated: March 6, 2023
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Welcome! This Privacy Notice explains how ZeroEx Inc. (
                    <strong>“ZeroEx”, “Company”, “we”, “us”, or “our”</strong>) collects, uses, discloses, and otherwise
                    processes personal information in connection with our websites, including https://www.0x.org/ ,
                    https://matcha.xyz/ and other websites we own and operate that link to this Privacy Notice
                    (collectively, the <strong>“Sites”</strong>) and the related content, platform, services, products,
                    and other functionality offered on or through our online services (collectively, the{' '}
                    <strong>“Services”</strong>). It does not address our privacy practices relating to ZeroEx employees
                    and other personnel.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    <strong>Blockchain participants</strong>: Please note that by virtue of the public nature of the
                    blockchain, the holdings and transactions associated with your cryptocurrency wallet address will be
                    publicly available and accessible to third parties. This includes, but is not limited to, your
                    public sending address (including, but not limited to, cryptographically secure non-fungible tokens,
                    and other blockchain based tokens), the public address of the receiver, the amount sent or received,
                    and any other data a user has chosen to include in a given transaction. Information stored on the
                    blockchain may not be able to be modified or deleted due to the immutable nature of the blockchain.
                    Transactions and addresses may reveal information about the user’s identity and information can
                    potentially be correlated now or in the future by any party who chooses to do so. Please consider
                    how privacy and transparency on the blockchain works.
                </Paragraph>

                <Heading asElement="h3" size="small" textAlign="left">
                    1. OUR COLLECTION OF PERSONAL INFORMATION
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We collect personal information in connection with your visits to and use of the Service. This
                    collection includes information that you provide in connection with the Service, information from
                    third parties, and information that is collected automatically such as through the use of cookies
                    and other technologies.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    <strong>
                        <u>Personal Information Collected from Individuals</u>
                    </strong>
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We may collect the following personal information submitted to us by individuals through the
                    Services:
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        <strong>Account Information.</strong> To use certain our developer platform or governance portal
                        Services, you may be required to establish an account for the Services. This may involve
                        collecting your email address, social media handle and when applicable, public blockchain
                        address associated with your crypto wallet (see Crypto Wallets section below for more
                        information). We may also collect your usernames and password for using our developer platform
                        Services. We use this information to administer your account, provide you with the relevant
                        services and information, communicate with you regarding your account, the Service, and for
                        customer support purposes.
                    </ListItem>
                    <ListItem>
                        <strong>Token Information.</strong> If you choose to trade using our Services, we may receive
                        certain token transaction and event-related information, including your public blockchain
                        address associated with your self-hosted crypto wallet, crypto wallet types, amounts of digital
                        assets and token balances, token ownership information, and other transaction and event-related
                        information (e.g., transfers of digital tokens between wallets, the corresponding smart
                        contracts, amounts paid, and metadata describing the transaction, and/or properties of a digital
                        asset).
                    </ListItem>
                    <ListItem>
                        <strong>Communications.</strong> If you communicate with us through any paper or electronic form
                        (i.e., a “contact us” form, email), we may collect your name, email address, phone number, or
                        any other personal information you choose to provide to us. We use this information to
                        investigate and respond to your inquiries, and to communicate with you, to enhance the services
                        we offer to our users and to manage and grow our business.
                    </ListItem>
                    <ListItem>
                        <strong>Marketing Emails.</strong> If you sign up for our newsletter, we collect your email
                        address in order to send you regular updates about the Service, such as information about new
                        bounties available. We use this information to manage our communications with you and send you
                        information about products and services we think may be of interest to you. If you wish to stop
                        receiving email messages from us, simply click the “unsubscribe link” provided at the bottom of
                        the email communication. Note that you cannot unsubscribe from certain services-related email
                        communications (e.g., account verification, confirmations of transactions, technical or legal
                        notices).
                    </ListItem>
                    <ListItem>
                        <strong>Event and Webcast Information</strong>, including registration information, call-in
                        details, attendee badge information, company information and contact information. We use this
                        information to administer and facilitate the Services and improve and grow our business.
                    </ListItem>
                    <ListItem>
                        <strong>User Content.</strong> You may upload, or transmit audio, videos, images, data, or
                        information through your communications with us, your posts in the forum, and when you otherwise
                        use the Services (collectively, "<strong>User Content</strong>"). We may collect this
                        information, and information about this content, such as the date and time you created this
                        content, along with other information about you, including your social media handle and crypto
                        wallet information. Please remember that ZeroEx may, but has no obligation to, monitor, record,
                        and store User Content in order to protect your safety or the safety of other users, to assist
                        with regulatory or law enforcement efforts, or to protect and defend our rights and property.
                        For more information, please see our Terms of Service.
                    </ListItem>
                    <ListItem>
                        <strong>Employment Application Information</strong>, including your contact and demographic
                        information, educational and work history, employment interests, information obtained during
                        interviews and any other information you choose to provide, if you apply for employment.
                    </ListItem>
                </UnorderedList>

                <Heading asElement="h3" size="small" textAlign="left">
                    <strong>
                        <u>Personal Information Automatically Collected</u>
                    </strong>
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    As is true of most digital platforms, we and our third-party providers may also collect personal
                    information from an individual’s device, browsing actions and website usage patterns automatically
                    when visiting or interacting with our Services, which may include <strong>log data</strong> (such as
                    internet protocol (IP) address, operating system, browser type, browser id, the URL entered and the
                    referring page/campaign, date/time of visit, the time spent on our Services and any errors that may
                    occur during the visit to our Services), <strong>analytics data</strong> (such as the electronic
                    path taken to our Service, through our Services and when exiting our Service, as well as usage and
                    activity on our Service) and
                    <strong>location data</strong> (such as general geographic location based on the log data we or our
                    third-party providers collect).
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    To manage cookies, an individual may change their browser settings to: (i) notify them when they
                    receive a cookie, so the individual can choose whether or not to accept it; (ii) disable existing
                    cookies; or (iii) automatically reject cookies. Please note that doing so may negatively impact an
                    individual’s experience using our Services, as some features and offerings may not work properly or
                    at all. Depending on an individual’s device and operating system, the individual may not be able to
                    delete or block all cookies. In addition, if an individual wants to reject cookies across all
                    browsers and devices, the individual will need to do so on each browser on each device they actively
                    use. An individual may also set their email options to prevent the automatic downloading of images
                    that may contain technologies that would allow us to know whether they have accessed our email and
                    performed certain functions with it.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    For more information about these practices and your choices regarding cookies, please see our Cookie
                    Notice.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    <strong>
                        <u>Personal Information from Third Parties</u>
                    </strong>
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We also obtain personal information from third parties which we often combine with personal
                    information we collect either automatically or directly from an individual
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We may receive the same categories of personal information as described above from the following
                    third parties:
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        <strong>Other Users or Individuals who Interact with our Services</strong>: We may receive your
                        information from other users or other individuals who interact with our Services. For example,
                        if you engage in one of our communities hosted on third-party platforms, such as Discord, we
                        will be able to see any public communications made within that platform.
                    </ListItem>
                    <ListItem>
                        <strong>Business Partners</strong>: We may receive your information from our business partners,
                        such as companies that offer their products and/or services on our Service.
                    </ListItem>
                    <ListItem>
                        <strong>Social Media or Third-party Platforms</strong>: When an individual interacts with our
                        Services through various social media networks, such as when someone follows us on Twitter, or
                        other social networks, we may receive some information about individuals that they permit the
                        social network to share with third parties. The data we receive is dependent upon an
                        individual’s privacy settings with the social network, and may include your profile information,
                        profile picture, gender, username, user ID associated with your social media account, age range,
                        language, country, and any other information you permit the social network to share with third
                        parties. Individuals should always review and, if necessary, adjust their privacy settings on
                        third-party websites and social media networks and services before sharing information and/or
                        linking or connecting them to other services.
                    </ListItem>
                    <ListItem>
                        <strong>Crypto Wallets</strong>: When you connect your crypto wallets such as MetaMask or
                        Coinbase Wallet, we receive information such as your wallet address, crypto wallet types
                        (including amounts and balances), and any related transaction and technical information
                        associated with your crypto wallet address, including network information regarding
                        transactions. We use this information to administer your account and provide you with the
                        relevant Service.
                    </ListItem>
                    <ListItem>
                        <strong>Service Providers</strong>: Our service providers that perform services solely on our
                        behalf, such as marketing providers, collect personal information and often share some or all of
                        this information with us.
                    </ListItem>
                    <ListItem>
                        <strong>Information from Other Sources</strong>: We may also collect personal information about
                        individuals that we do not otherwise have from, for example, publicly available sources such as
                        permissionless blockchains, third-party data providers, blockchain analytics providers,
                        customers, third-party digital wallet providers, or through transactions such as mergers and
                        acquisitions. Such information may include contact information, social media account
                        information, general location, domains, crypto wallet address and related information, token
                        ownership information (e.g., transfers of tokens between wallets), the corresponding smart
                        contracts transactions paid and metadata describing each transaction and its properties as a
                        digital asset, transaction recipient information, interest-in- services information and
                        employment-related information. We may combine this information with the information we collect
                        from an individual directly. We use this information to: provide the Services, contact
                        individuals, process employment applications and screen job applicants, send advertising or
                        promotional materials or personalize our Services, and better understand the demographics of the
                        individuals with whom we interact.
                    </ListItem>
                </UnorderedList>
                <Heading asElement="h3" size="small" textAlign="left" id="use-of-information">
                    2. OUR USE OF PERSONAL INFORMATION
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We may use personal information we collect to:
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        Fulfill or meet the reason the information was provided, such as to fulfill our contractual
                        obligations, to deliver the Services;
                    </ListItem>
                    <ListItem>Manage our business and its day-to-day operations;</ListItem>
                    <ListItem>
                        Authenticate your account credentials and identify you, as necessary to log you in and/or ensure
                        the security of your account; Communicate with individuals, including via email and social
                        media;
                    </ListItem>
                    <ListItem>Request individuals to complete surveys about our company and the Services; </ListItem>
                    <ListItem>
                        For marketing and advertising purposes, including to market to you or offer you through email
                        and updates on products or services we think that you may be interested in;
                    </ListItem>
                    <ListItem>Enable you to communicate and share files with users you designate;</ListItem>
                    <ListItem>
                        Test, enhance, update and monitor the Services, or diagnose or fix technology problems;
                    </ListItem>
                    <ListItem>
                        Facilitate customer benefits and services, including customer support through our command center
                        services;
                    </ListItem>
                    <ListItem>Identify and analyze how individuals use our Services;</ListItem>
                    <ListItem>Conduct research and analytics on our customer and user base and our Services;</ListItem>
                    <ListItem>
                        Improve and customize our Services to address the needs and interests of our user base and other
                        individuals we interact with;
                    </ListItem>
                    <ListItem>
                        Help maintain the safety, security and integrity of our property and Services, technology assets
                        and business;
                    </ListItem>
                    <ListItem>
                        Evaluate your candidacy for employment, to communicate with you during the application process
                        and to facilitate the onboarding process, if you are applying for employment;
                    </ListItem>
                    <ListItem>
                        Fulfill or enforce our legal or contractual obligations and requirements (including in relation
                        to our Terms of Service), to resolve disputes, to carry out our obligations and enforce our
                        rights, and to protect our business interests and the interests and rights of third parties;
                    </ListItem>
                    <ListItem>Audit transactions conducted in connection with our services;</ListItem>
                    <ListItem>Provide notice of fraud or unlawful or criminal activity; or</ListItem>
                    <ListItem>
                        For any other lawful purpose, or other purpose that you consent to or for which you provide your
                        information.
                    </ListItem>
                </UnorderedList>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Where you choose to contact us, we may need additional information to fulfill the request or respond
                    to inquiries. We may provide you with additional privacy-related information where the scope of the
                    inquiry/request and/or personal information we require fall outside the scope of this Privacy
                    Notice. In that case, the additional privacy notice will govern how we may process the information
                    provided at that time.
                </Paragraph>

                <Heading asElement="h3" size="small" textAlign="left">
                    3. OUR DISCLOSURE OF PERSONAL INFORMATION
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We disclose personal information in the following ways:
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        <strong>Affiliates</strong>: We may share personal information with other companies owned or
                        controlled by ZeroEx, and other companies owned by or under common ownership as ZeroEx, which
                        also includes our subsidiaries (i.e., any business we own or control) or our ultimate holding
                        company (i.e., any business that owns or controls us) and any subsidiaries it owns, particularly
                        when we collaborate in providing the Services.
                    </ListItem>
                    <ListItem>
                        <strong>Blockchain Participants</strong>: If you participate in our Services, by virtue of the
                        public nature of the blockchain, the holdings and transactions associated with your crypto
                        wallet address will be publicly available and accessible to blockchain participants and other
                        third parties, as well as any other information you choose to provide or make public.
                    </ListItem>
                    <ListItem>
                        <strong>Contests, Sweepstakes, and Survey Providers</strong>: We share personal information with
                        third parties who assist us in delivering our contests, sweepstakes, or survey offerings and
                        processing the responses.
                    </ListItem>
                    <ListItem>
                        <strong>Ad Networks and Advertising Partners</strong>: We work with third-party ad networks and
                        advertising partners to deliver advertising and personalized content on our Services, on other
                        websites and services, and across other devices. These parties may collect information directly
                        from a browser or device when an individual visits our Services through cookies or other data
                        collection technologies. This information is used to provide and inform targeted advertising, as
                        well as to provide advertising- related services such as reporting, attribution, analytics and
                        market research. Please see our Cookie Notice for more information.
                    </ListItem>
                    <ListItem>
                        <strong>Marketing Providers</strong>: We coordinate and share personal information with our
                        marketing providers in order to communicate with individuals about the Services we make
                        available.
                    </ListItem>
                    <ListItem>
                        <strong>Customer Service and Communication Providers</strong>: We share personal information
                        with third parties who assist us in providing our customer services and facilitating our
                        communications with individuals that submit inquiries.
                    </ListItem>
                    <ListItem>
                        <strong>Other Service Providers</strong>: In addition to the third parties identified above, we
                        engage other third- party service providers that perform business or operational services for us
                        or on our behalf, such as website hosting, infrastructure provisioning, IT services, analytics
                        services, conducting cryptocurrency transactions, employment application-related services,
                        payment processing services, and administrative services.
                    </ListItem>
                    <ListItem>
                        <strong>Business Transaction or Reorganization</strong>: We may take part in or be involved with
                        a corporate business transaction, such as a merger, acquisition, joint venture, or financing or
                        sale of company assets. We may disclose personal information to a third party during negotiation
                        of, in connection with or as an asset in such a corporate business transaction. Personal
                        information may also be disclosed in the event of insolvency, bankruptcy or receivership.
                    </ListItem>
                    <ListItem>
                        <strong>Legal Obligations and Rights</strong>: We may disclose personal information to third
                        parties, such as legal advisors and law enforcement:
                        <br />
                        <UnorderedList style={{ listStyle: 'circle', marginTop: 12 }}>
                            <ListItem muted={false}>
                                in connection with the establishment, exercise, or defense of legal claims;
                            </ListItem>
                            <ListItem muted={false}>
                                to comply with laws or to respond to lawful requests and legal process;
                            </ListItem>
                            <ListItem muted={false}>
                                to protect our rights and property and the rights and property of others, including to
                                enforce our agreements and policies;
                            </ListItem>
                            <ListItem muted={false}>to detect, suppress, or prevent fraud;</ListItem>
                            <ListItem muted={false}>to protect the health and safety of us and others; or</ListItem>
                            <ListItem muted={false}>as otherwise required by applicable law.</ListItem>
                        </UnorderedList>
                    </ListItem>
                    <ListItem>
                        <strong>With Your Consent</strong>: We may disclose personal information about an individual to
                        certain other third parties or publicly with their consent or direction. For example, with an
                        individual’s consent or direction we may post their testimonial on our Sites or service-related
                        publications.
                    </ListItem>
                </UnorderedList>
                <Heading asElement="h3" size="small" textAlign="left">
                    4. CONTROL OVER YOUR INFORMATION
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    You may control your information in the following ways:
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        <strong>Email Communications Preferences</strong>: You can stop receiving promotional email
                        communications from us by clicking on the “unsubscribe” link provided in such communications.
                        You may not opt-out of service-related communications (e.g., account verification, transactional
                        communications, changes/updates to features of the Services, technical and security notices).
                    </ListItem>
                    <ListItem>
                        <strong>Modifying or Deleting Your Information</strong>: If you have any questions about
                        reviewing, modifying, or deleting your information, you can contact us directly at legal@0x.org.
                        We may not be able to modify or delete your information in all circumstances, especially in
                        relation to information on the blockchain.
                    </ListItem>
                </UnorderedList>

                <Heading asElement="h3" size="small" textAlign="left">
                    5. CHILDREN’S PERSONAL INFORMATION
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Our Services are not directed to, and we do not intend to, or knowingly, collect or solicit personal
                    information from children under the age of 16. If an individual is under the age of 16, they should
                    not use our Services or otherwise provide us with any personal information either directly or by
                    other means. If a child under the age of 16 has provided personal information to us, we encourage
                    the child’s parent or guardian to contact us to request that we remove the personal information from
                    our systems. If we learn that any personal information we collect has been provided by a child under
                    the age of 16, we will promptly delete that personal information.
                </Paragraph>

                <Heading asElement="h3" size="small" textAlign="left">
                    6. LINKS TO THIRD-PARTY WEBSITES OR SERVICES
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Our Services may include links to third-party websites, plug-ins and applications. Except where we
                    post, link to or expressly adopt or refer to this Privacy Notice, this Privacy Notice does not apply
                    to, and we are not responsible for, any personal information practices of third-party websites and
                    online services or the practices of other third parties. To learn about the personal information
                    practices of third parties, please visit their respective privacy notices.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    7. REGION-SPECIFIC DISCLOSURES
                </Heading>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        <strong>Nevada</strong>: If you are a resident of the State of Nevada, Chapter 603A of the
                        Nevada Revised Statutes permits a Nevada resident to opt out of future sales of certain covered
                        information that a website operator has collected or will collect about the resident. Although
                        we do not currently sell covered information, please contact us at legal@0x.org with the subject
                        line “Nevada Opt Out Request” to submit such a request.
                    </ListItem>
                    <ListItem>
                        <strong>European Economic Area</strong>, United Kingdom or Switzerland: If you are located in
                        European Economic Area (Member States of the European Union together with Iceland, Norway, and
                        Liechtenstein), United Kingdom, or Switzerland, please see the Additional European Economic
                        Area, United Kingdom, and Switzerland Privacy Disclosures section for additional European-
                        specific privacy disclosures.
                    </ListItem>
                </UnorderedList>
                <Heading asElement="h3" size="small" textAlign="left">
                    8. UPDATES TO THIS PRIVACY NOTICE
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We will update this Privacy Notice from time to time. When we make changes to this Privacy Notice,
                    we will change the date at the beginning of this Privacy Notice. If we make material changes to this
                    Privacy Notice, we will notify individuals by email to their registered email address, by prominent
                    posting on our Services, or through other appropriate communication channels. All changes shall be
                    effective from the date of publication unless otherwise provided.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    9. CONTACT US
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    If you have any questions or requests in connection with this Privacy Notice or other
                    privacy-related matters, please send an email to <a href="mailto:legal@0x.org">legal@0x.org</a>.
                </Paragraph>
                <hr />
                {
                    //################################################
                    //###########  EEA + UK + SWITZERLAND  ###########
                    //################################################
                }
                <Heading asElement="h2" size="small" textAlign="left">
                    ADDITIONAL EUROPEAN ECONOMIC AREA, UNITED KINGDOM, AND SWITZERLAND PRIVACY DISCLOSURES
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    These Additional Disclosures set out information about how we use your personal data when you access
                    our Service from the European Economic Area (“EEA”), United Kingdom ("UK"), and Switzerland. Please
                    ensure that you have read and understood these Privacy Disclosures before you access or use the
                    Services.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    <strong>Personal Data</strong>: When we use the term “personal data” in these Privacy Disclosures,
                    we mean information relating to an identified or identifiable natural person.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    <strong>Controller</strong>: ZeroEx, Inc., a company duly incorporated and organised under the laws
                    of United States of America, having its registered address at 575 Market St, San Francisco, CA
                    94105, is the “controller” responsible for the processing of personal data in connection with our
                    Services. This means that we determine and are responsible for how your personal data is used.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Legal Bases for Processing
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We only process and retain your personal information as permitted under applicable law. For example,
                    we will only process your information where we have established a lawful basis to do, as follows:{' '}
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        When it is necessary for the performance of a <strong>contract</strong> to which you are party,
                        or to take steps at your request prior to agreeing a contract: This applies to any processing
                        where you sign a contract with us, for example when you become our customer, participate in our
                        affiliate or premium partner program, or deliver services to us as a vendor or contractor. This
                        may also include our Terms of Service.
                    </ListItem>
                    <ListItem>
                        We have a <strong>legitimate interest</strong> which we believe outweighs your interests or
                        fundamental rights and freedoms. This applies to the following processing activities:
                        <UnorderedList style={{ listStyle: 'circle', marginTop: 12 }}>
                            <ListItem muted={false}>
                                <strong>When we communicate with you</strong>: To respond to your inquiries and, on some
                                occasions, keep records in case of complaints or legal claims.
                            </ListItem>
                            <ListItem muted={false}>
                                <strong>When you use our Services</strong>: When you access and use our Services, we
                                process technical and analytics data to see if and how our Services can be improved, so
                                that we can offer you a better user experiences in the future.
                            </ListItem>
                            <ListItem muted={false}>
                                <strong>Global Suppression List</strong>: Avoid contacting you again if you have
                                withdrawn your consent to marketing-related activities.
                            </ListItem>
                            <ListItem muted={false}>
                                <strong>Marketing to existing customers</strong> (unless you have consented to such
                                marketing): To find, customize and offer products and services we hope you find useful
                                and relevant, i.e., provide you with excellent customer service.
                            </ListItem>
                            <ListItem muted={false}>
                                <strong>Sharing personal information with other parties</strong>: To run our business
                                efficiently and securely.
                            </ListItem>
                        </UnorderedList>
                    </ListItem>
                    <ListItem>
                        Your <strong>consent</strong>: Wherever you clearly consent to the processing, for example when
                        you sign up for our newsletters or events. Here, your consent is implied, meaning that you
                        consent by submitting a particular form. We also rely on your consent for using cookies and
                        other technologies on our website and here you explicitly agree to these. Note that your default
                        setting depends on your location (country), as the rules for using such technologies vary across
                        jurisdictions
                    </ListItem>
                </UnorderedList>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We are subject to a legal obligation: For any processing where we need to comply with laws and
                    regulations related to bookkeeping, accounting, taxation and employment, for example for keeping
                    records.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Data Retention
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We will usually store the personal information we collect about you for no longer than necessary for
                    the purposes set out in this Privacy Notice, and in accordance with our legitimate business
                    interests and applicable law. For example, if your personal information is subject to the EU GDPR or
                    UK GDPR, the criteria used to determine the period for which personal data about you will be
                    retained varies depending on the legal basis under which we process the personal data:
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        <strong>Contract</strong>. Where we are processing personal data is based on contract, we
                        generally will retain your personal data for the duration of the contract plus some additional
                        limited period of time that is necessary to comply with law or that represents the statute of
                        limitations for legal claims that could arise from our contractual relationship.
                    </ListItem>
                    <ListItem>
                        <strong>Legitimate Interests</strong>. Where we are processing personal data based on our
                        legitimate interests, we generally will retain such information for a reasonable period of time
                        based on the particular interest, taking into account your fundamental interests and your rights
                        and freedoms.
                    </ListItem>
                    <ListItem>
                        <strong>Consent</strong>. Where we are processing personal data based on your consent, we
                        generally will retain your personal data until you withdraw your consent, or otherwise for the
                        period of time necessary to fulfil the underlying agreement with you or provide you with the
                        applicable service for which we process that personal data.
                    </ListItem>
                    <ListItem>
                        <strong>Legal Obligation</strong>. Where we are processing personal data based on a legal
                        obligation, we generally will retain your personal data for the period of time necessary to
                        fulfil the legal obligation.
                    </ListItem>
                    <ListItem>
                        <strong>Legal Claim</strong>. We may need to apply a “legal hold” that retains information
                        beyond our typical retention period where we face threat of legal claim or intent to establish a
                        claim. In that case, we will retain the information until the hold is removed, which typically
                        means the claim or threat of claim has been resolved.
                    </ListItem>
                </UnorderedList>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    In all cases, in addition to the purposes and legal bases, we consider the amount, nature and
                    sensitivity of the personal data, as well as the potential risk of harm from unauthorized use or
                    disclosure of your personal data.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Storing and Transferring Your Personal Information
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    <strong>
                        <u>Security</u>
                    </strong>
                    . We implement appropriate technical and organisational measures to protect your personal
                    information against accidental or unlawful destruction, loss, change or damage. We will never send
                    you unsolicited emails or contact you by phone requesting your account ID, password, credit or debit
                    card information or national identification numbers.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    <strong>
                        <u>International Transfers of Your Personal Information</u>
                    </strong>
                    . The personal information we collect may be transferred to and stored in countries outside of the
                    jurisdiction you are in where we and our third-party service providers have operations, including in
                    the United States. If you are accessing our Services from the EEA, UK or Switzerland, your personal
                    information will be processed outside of the EEA, the UK and Switzerland.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    In the event of such a transfer, we ensure that: (i) the personal information is transferred to
                    countries recognised as offering an equivalent level of protection; or (ii) the transfer is made
                    pursuant to appropriate safeguards, such as standard contractual clauses adopted by the European
                    Commission. If you wish to enquire further about these safeguards used, please contact us using the
                    details set out at the end of this Privacy Notice.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Marketing and Advertising
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    From time to time we may contact you with information about our services, including sending you
                    marketing messages and asking for your feedback on our services. Most marketing messages we send
                    will be by email. For some marketing messages, we may use personal data we collect about you to help
                    us determine the most relevant marketing information to share with you.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We will only send you such messages if you have given us your consent to do so. You can withdraw
                    your consent at a later date by clicking on the unsubscribe link at the bottom of our marketing
                    emails or by contacting us at <a href="mailto:legal@0x.org">legal@0x.org</a>.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Profiling
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We may analyze personal data we have collected about you to create a profile of your interests and
                    preferences to help us better understand and improve your use of the services, and so that we can
                    contact you with information that is relevant to you. We may make use of additional information
                    about you when it is available from external sources to help us do this effectively send product
                    updates. We may also use personal data about you to detect and reduce fraud. The entering of
                    personal data in our systems is optional and occurs only if consent is given to one of the purposes
                    detailed in the Our Collection and Use of Personal Information section of the Privacy Notice; it
                    automatically implies that ZeroEx personnel across the world, tasked with data processing, will be
                    able to view the data, as well as to change and to update it
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Your Rights in Respect of Your Personal Information
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    In accordance with applicable privacy law, you have the following rights in respect of your personal
                    information that we hold:
                </Paragraph>
                <OrderedList marginBottom="30px" listStyle="lower-alpha">
                    <ListItem>
                        <strong>Right of access</strong>. You have the right to obtain:
                        <OrderedList style={{ marginTop: 12 }} listStyle="lower-roman">
                            <ListItem muted={false}>
                                confirmation of whether, and where, we are processing your personal information;
                            </ListItem>
                            <ListItem muted={false}>
                                information about the categories of personal information we are processing, the purposes
                                for which we process your personal information and information as to how we determine
                                applicable retention periods;
                            </ListItem>
                            <ListItem muted={false}>
                                information about the categories of recipients with whom we may share your personal
                                information; and
                            </ListItem>
                            <ListItem muted={false}>a copy of the personal information we hold about you.</ListItem>
                        </OrderedList>
                    </ListItem>
                    <ListItem>
                        <strong>Right of portability</strong>. You have the right, in certain circumstances, to receive
                        a copy of the personal information you have provided to us in a structured, commonly used,
                        machine- readable format that supports re-use, or to request the transfer of your personal data
                        to another person.
                    </ListItem>
                    <ListItem>
                        <strong>Right to rectification</strong>. You have the right to obtain rectification of any
                        inaccurate or incomplete personal information we hold about you without undue delay.
                    </ListItem>
                    <ListItem>
                        <strong>Right to erasure</strong>. You have the right, in some circumstances, to require us to
                        erase your personal information without undue delay if the continued processing of that personal
                        information is not justified.
                    </ListItem>
                    <ListItem>
                        <strong>Right to restriction</strong>. You have the right, in some circumstances, to require us
                        to limit the purposes for which we process your personal information if the continued processing
                        of the personal information in this way is not justified, such as where the accuracy of the
                        personal information is contested by you.
                    </ListItem>
                    <ListItem>
                        <strong>Right to withdraw consent</strong>. There are certain circumstances where we require
                        your consent to process your personal information. In these instances, and if you have provided
                        consent, you have the right to withdraw your consent. If you withdraw your consent, this will
                        not affect the lawfulness of our use of your personal information before your withdrawal.
                    </ListItem>
                </OrderedList>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    You have the right to provide instructions regarding the retention, deletion and disclosure of your
                    personal information after your death. In the absence of instructions from you, it is possible for
                    your heirs to request the disclosure or deletion of your personal information.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left" fontWeight="bold">
                    You also have the right to object to any processing based on our legitimate interests where there
                    are grounds relating to your particular situation. There may be compelling reasons for continuing to
                    process your personal information, and we will assess and inform you if that is the case. You can
                    object to marketing activities for any reason.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    You also have the right to lodge a complaint to your local data protection authority. If you are
                    based in the European Union, information about how to contact your local data protection authority
                    is available here. If you are based in the UK or Switzerland, your local data protection authorities
                    are the UK Information Commissioner's Office (
                    <a href="https://ico.org.uk/global/contact-us/">https://ico.org.uk/global/contact-us/</a>) and the
                    Swiss Federal Data Protection and Information Commissioner (
                    <a href="https://www.edoeb.admin.ch/edoeb/en/home/the-fdpic/contact/address.html">
                        https://www.edoeb.admin.ch/edoeb/en/home/the-fdpic/contact/address.html
                    </a>
                    ).
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    If you wish to exercise one of these rights, we kindly ask you to contact us at{' '}
                    <a href="mailto:legal@0x.org">legal@0x.org</a>.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Due to the confidential nature of data processing we may ask you to provide proof of identity when
                    exercising the above rights. This can be done by providing a scanned copy of a valid identity
                    document or a signed photocopy of a valid identity document.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Cookies and Similar Technologies Used on Our Services
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Our Services use cookies and similar technologies such as pixels and Local Storage Objects (LSOs)
                    like HTML5 (together <strong>“cookies”</strong>) to distinguish you from other users of our
                    Services. This helps us to provide you with a good experience when you browse our Services and also
                    allows us to monitor and analyse how you use and interact with our Services so that we can continue
                    to improve our Services. It also helps us and our partners to determine products and services that
                    may be of interest to you. Please see our Cookie Notice for more information about these practices
                    and your choices regarding cookies.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Tracking Technologies Used in Our Emails
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Our emails may contain tracking pixels that identify if and when you have opened an email that we
                    have sent you, how many times you have read it and whether you have clicked on any links in that
                    email. This helps us measure the effectiveness of our marketing email campaigns, make the emails we
                    send to you more relevant to your interests and to understand if you have opened and read any
                    important administrative emails we might send you.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Most popular email clients will allow you to block these pixels by disabling certain external images
                    in emails. You can do this through the settings on your email client – these generally give you the
                    option of choosing whether emails will display "remote images", "remote content" or "images" by
                    default.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Some browsers also give you the option of downloading and installing extensions that block pixels
                    and other tracking technologies.
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    Processing Method
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Personal data will be processed with IT-based tools and/or processed manually for the length of time
                    needed to achieve the purpose for which it was collected. In particular, personal data collected for
                    the purposes outline in the Our Collection and Use of Personal Information section of the Privacy
                    Notice will be also processed with the usage of automated mechanisms based on procedures and logics
                    that are strictly related to the purposes specified.
                </Paragraph>
            </Column>
        </Section>
        <Section>
            <Column>
                <Heading size="medium" isCentered={true}>
                    Cookie Notice
                </Heading>
                <Heading asElement="h4" size="small" marginBottom="50px" isMuted={true} isCentered={true}>
                    Last Updated: March 6, 2023
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    Unless otherwise expressly stated, terms in this notice have the same meaning as defined in the{' '}
                    <a href="#privacy-notice">
                        <strong>Privacy Notice</strong>
                    </a>
                    .
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    1. SCOPE OF NOTICE
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    This Cookie Notice supplements the information contained in the{' '}
                    <a href="#privacy-notice">
                        <strong>Privacy Notice</strong>
                    </a>{' '}
                    and explains how we and our business partners and service providers use cookies and related
                    technologies in the course of managing and providing our online services and our electronic
                    communication to you. It explains what these technologies are and why we use them, as well as your
                    rights to control our use of them.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    In some cases, we may use cookies and related technologies described in this Cookie Notice to
                    collect personal information, or to collect information that becomes personal information if we
                    combine it with other information. For more details about how we process your personal information,
                    please review the{' '}
                    <a href="#privacy-notice">
                        <strong>Privacy Notice</strong>
                    </a>
                    .
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    2. WHAT ARE COOKIES AND RELATED TECHNOLOGIES
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    As is common practice among websites, our Services use cookies, which are tiny files downloaded to
                    your device that allow us and our third-party partners to collect certain information about your
                    interactions with our email communications, websites and other online services, and that improve
                    your experience. We and our third-party partners and providers may also use other, related
                    technologies to collect this information, such as web beacons, pixels, embedded scripts,
                    location-identifying technologies and logging technologies (collectively, <strong>“cookies”</strong>
                    ).
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We use the following types of cookies:
                </Paragraph>
                <OrderedList marginBottom="30px" listStyle="lower-alpha">
                    <ListItem>
                        <strong>Strictly necessary cookies</strong>. These cookies enable core functionality such as
                        security, network management and accessibility. You may disable these by changing your browser
                        settings, but this may affect how the Services function. The legal basis for our use of strictly
                        necessary cookies is our legitimate interests, namely being able to provide and maintain our
                        Services.
                    </ListItem>
                    <ListItem>
                        <strong>Functional cookies</strong>. These enable a website to remember information that changes
                        the way the website behaves or looks, like your preferred language or the region that you are
                        in. The legal basis for our use of functionality cookies is our legitimate interests, namely
                        being able to provide and maintain our Services.
                    </ListItem>
                    <ListItem>
                        <strong>Analytical/performance cookies</strong>. These cookies allow us to recognize and count
                        the number of visitors to our Services, and to see how visitors move around our Services when
                        they are using them. This helps us to improve the way our Services work, for example, by
                        ensuring that users are finding what they are looking for easily. If you are accessing our
                        Services with a European IP address, you have been asked to consent to the use of these cookies.
                        You are free to deny your consent.
                    </ListItem>
                    <ListItem>
                        <strong>Targeting cookies</strong>. These cookies record your visit to our Services, the pages
                        you have visited and the links you have followed. They are used to track visitors across our
                        Services. If you are accessing our Services with a European IP address, you have been asked to
                        consent to the use of these cookies. You are free to deny your consent.
                    </ListItem>
                </OrderedList>
                <Heading asElement="h3" size="small" textAlign="left">
                    3. WHAT WE COLLECT WHEN USING COOKIES
                </Heading>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We and our third-party partners and providers may use cookies to automatically collect certain types
                    of usage information when you visit or interact with our email communications and Services. For
                    example, we may collect log data about your device and its software, such as your IP address,
                    operating system, browser type, date/time of your visit, and other similar information. Our emails
                    may also contain tracking pixels that identify if and when you have opened an email that we have
                    sent you, how many times you have read it and whether you have clicked on any links in that email.
                    We may also collect analytics data or use third-party analytics tools to help us measure usage and
                    activity trends for our online services and better understand our customer base. We also may collect
                    location data, including general geographic location based on IP address or more precise location
                    data when a user accesses our online services through a mobile device.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    When you access our Services from a mobile device, we may collect unique identification numbers
                    associated with your device or our mobile application (including, for example, a UDID, Unique ID for
                    Advertisers (“IDFA”), Google AdID, or Windows Advertising ID), mobile carrier, device type, model
                    and manufacturer, mobile device operating system brand and model, phone number, and depending on
                    your mobile device settings, your geographical location data, including GPS coordinates (e.g.,
                    latitude and/or longitude) or similar information regarding the location of your mobile device, or
                    we may be able to approximate a device’s location by analyzing other information, like an IP
                    address.
                </Paragraph>
                <Paragraph size="default" isMuted={true} textAlign="left">
                    We may also include or engage in the following as part of our Services:
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        <strong>Social Media Widgets and Advertising</strong>. Our Services may include social media
                        features, such as the Facebook “Like” button, Reddit, LinkedIn, Twitter or other widgets. These
                        social media companies may recognize you and collect information about your visit to our
                        Services, and they may set a cookie or employ other tracking technologies. Your interactions
                        with those features are governed by the privacy policies of those companies.
                    </ListItem>
                    <ListItem>
                        <strong>Social Media Platforms</strong>. We may display targeted advertising to you through
                        social media platforms, such as Facebook, Twitter, LinkedIn and other social media forums. These
                        companies have interest-based advertising programs that allow us to direct advertisements to
                        users who have shown interest in our services while those users are on the social media
                        platform, or to groups of other users who share similar traits, such as likely commercial
                        interests and demographics. We may share a unique identifier, such as a user ID or hashed email
                        address, with these platform providers or they may collect information from our website visitors
                        through a first-party pixel, in order to direct targeted advertising to you or to a custom
                        audience on the social media platform. These advertisements are governed by the privacy policies
                        of those social media companies that provide them. If you do not want to receive targeted ads on
                        your social networks, you may be able to adjust your advertising preferences through your
                        settings on those networks.
                    </ListItem>
                    <ListItem>
                        <Paragraph size="default" isMuted={1} textAlign="left" color="black">
                            <strong>Third Party Partners</strong>. We work with a variety of third-party partners to
                            provide advertising services. For example, we use Google Analytics to recognize you and link
                            the devices you use when you visit our Services on your browser or mobile device, log in to
                            your account on our Services, or otherwise engage with us. We share a unique identifier,
                            like a user ID or hashed email address, with Google to facilitate the service. Google
                            Analytics allows us to better understand how our users interact with our Services and to
                            tailor our advertisements and content to you. For information on how Google Analytics
                            collects and processes data, as well as how you can control information sent to Google,
                            review Google's website, “How 14 Privileged & Confidential For Discussion Purposes Only
                            Google uses data when you use our partners’ sites or apps” located at{' '}
                            <a href="https://www.google.com/policies/privacy/partners/">
                                <strong>https://www.google.com/policies/privacy/partners/</strong>
                            </a>
                            . You can learn about Google Analytics’ currently available opt- outs, including the Google
                            Analytics Browser Ad-On here:{' '}
                            <a href="https://tools.google.com/dlpage/gaoptout/">
                                <strong>https://tools.google.com/dlpage/gaoptout/</strong>
                            </a>
                            .
                        </Paragraph>
                        <Paragraph size="default" isMuted={1} textAlign="left" color="black">
                            We may also utilize certain forms of display advertising and other advanced features through
                            Google Analytics. These features enable us to use first-party cookies (such as the Google
                            Analytics cookie) and third-party cookies (such as the DoubleClick advertising cookie) or
                            other third-party cookies together to inform, optimize, and display ads based on your past
                            visits to the Services. You may control your advertising preferences or opt-out of certain
                            Google advertising products by visiting the Google Ads Preferences Manager, currently
                            available at{' '}
                            <a href="https://google.com/ads/preferences">
                                <strong>https://google.com/ads/preferences</strong>
                            </a>
                            , or by visiting NAI’s online resources at{' '}
                            <a href="http://www.networkadvertising.org/choices">
                                <strong>http://www.networkadvertising.org/choices</strong>
                            </a>
                            .
                        </Paragraph>
                        <Paragraph size="default" isMuted={1} textAlign="left" color="black">
                            You can learn more about our analytics providers’ practices at the following URLs:
                        </Paragraph>
                        <UnorderedList style={{ listStyle: 'circle', marginTop: 12 }}>
                            <ListItem muted={false}>
                                Google Analytics:{' '}
                                <strong>
                                    <a href="https://policies.google.com/technologies/partner-sites">
                                        https://policies.google.com/technologies/partner-sites
                                    </a>
                                </strong>
                            </ListItem>
                            <ListItem muted={false}>
                                Chainalysis:{' '}
                                <strong>
                                    <a href="https://www.chainalysis.com/privacy-policy/">
                                        https://www.chainalysis.com/privacy-policy/
                                    </a>
                                </strong>
                            </ListItem>
                            <ListItem muted={false}>
                                Amplitude:{' '}
                                <strong>
                                    <a href="https://amplitude.com/privacy">https://amplitude.com/privacy</a>
                                </strong>
                            </ListItem>
                            <ListItem muted={false}>
                                Metabase:{' '}
                                <strong>
                                    <a href="https://www.metabase.com/privacy">https://www.metabase.com/privacy</a>
                                </strong>
                            </ListItem>
                            <ListItem muted={false}>
                                Dune Analytics:{' '}
                                <strong>
                                    <a href="https://dune.com/privacy">https://dune.com/privacy</a>
                                </strong>
                            </ListItem>
                            <ListItem muted={false}>
                                Prodsight:{' '}
                                <strong>
                                    <a href="https://www.playvox.com/privacy-policy/">
                                        https://www.playvox.com/privacy-policy/
                                    </a>
                                </strong>
                            </ListItem>
                        </UnorderedList>
                    </ListItem>
                </UnorderedList>
                <Heading asElement="h3" size="small" textAlign="left">
                    4. HOW WE USE INFORMATION COLLECTED VIA COOKIES
                </Heading>
                <Paragraph size="default" textAlign="left" color="black">
                    We use cookies for a variety of reasons outlined below:
                </Paragraph>
                <UnorderedList marginBottom="30px">
                    <ListItem>
                        If you create an account with us, we will use cookies for the management of the signup process
                        and general administration. These cookies will usually be deleted when you log out; however, in
                        some cases, they may remain in order to remember your site preferences when logged out.
                    </ListItem>
                    <ListItem>
                        We use cookies when you are logged in so that we can remember you. These cookies are typically
                        removed or cleared when you log out to ensure you can only access restricted features and areas
                        when logged in.
                    </ListItem>
                    <ListItem>
                        The Services offer newsletter or email subscription services and cookies may be used to remember
                        if you are already registered and whether to show certain notifications which might only be
                        valid to subscribed/unsubscribed users.
                    </ListItem>
                    <ListItem>
                        The Services may offer payment capabilities and some cookies are essential to ensure that your
                        order is remembered between pages so that we can process it properly.
                    </ListItem>
                    <ListItem>
                        When you submit data through a form, such as those found on the contact pages or comment forms,
                        cookies may be set to remember your user details for future correspondence.
                    </ListItem>
                    <ListItem>
                        In order to provide you with a great experience on the Services, we provide the functionality to
                        set your preferences for how the Services run when you use it. In order to remember your
                        preferences, we need to set cookies so that this information can be called whenever you interact
                        with a website page.
                    </ListItem>
                    <ListItem>
                        We use cookies to provide and monitor the effectiveness of our Services, monitor online usage
                        and activities of our Services, and facilitate the purposes identified in the{' '}
                        <strong>
                            <a href="#use-of-information">How We Use Your Personal Information</a>
                        </strong>{' '}
                        section of our Privacy Notice.
                    </ListItem>
                    <ListItem>
                        We may also use the information we collect through cookies to understand your browsing
                        activities, including across unaffiliated third-party sites, so that we can deliver information
                        about products and services that may be of interest to you.
                    </ListItem>
                    <ListItem>
                        Tracking technology used in emails helps us measure the effectiveness of our marketing email
                        campaigns, make the emails we send to you more relevant to your interests and help us understand
                        if you have opened and how you interacted with our email.
                    </ListItem>
                </UnorderedList>
                <Paragraph size="default" textAlign="left" color="black">
                    Please note that we link some of the personal information we collect through cookies with the other
                    personal information that we collect about you and for the purposes described in our{' '}
                    <strong>
                        <a href="#privacy-notice">Privacy Notice</a>
                    </strong>
                    .
                </Paragraph>
                <Heading asElement="h3" size="small" textAlign="left">
                    4. HOW WE USE INFORMATION COLLECTED VIA COOKIES
                </Heading>
                <Paragraph size="default" textAlign="left" color="black">
                    If you would prefer not to accept cookies, most browsers will allow you to change the setting of
                    cookies by adjusting the settings on your browser to: (i) notify you when you receive a cookie,
                    which lets you choose whether or not to accept it; (ii) disable existing cookies; or (iii) set your
                    browser to automatically reject cookies. Be aware that disabling cookies may negatively affect the
                    functionality of this and many other websites that you visit. Disabling cookies will usually result
                    in also disabling certain functionalities and features of the Services.
                </Paragraph>
                <Paragraph size="default" textAlign="left" color="black">
                    Depending on your device and operating system, you may not be able to delete or block all cookies.
                    In addition, if you want to reject cookies across all your browsers and devices, you will need to do
                    so on each browser on each device you actively use. You may also set your email options to prevent
                    the automatic downloading of images that may contain technologies that would allow us to know
                    whether you have accessed our email and performed certain functions with it.
                </Paragraph>
                <Paragraph size="default" textAlign="left" color="black">
                    <strong>Online Ads</strong>: To learn more about interest-based advertising and how you may be able
                    to opt-out of some of this advertising, you may wish to visit the Digital Advertising Alliance’s
                    (DAA) resources and/or the Network Advertising Initiative’s (NAI) online resources, at
                    www.aboutads.info/choices or
                    <strong>
                        <a href="http://www.networkadvertising.org/choices/">
                            http://www.networkadvertising.org/choices/
                        </a>
                    </strong>
                    , or if you are in the European Economic Area, United Kingdom or Switzerland:{' '}
                    <strong>
                        <a href="https://youronlinechoices.eu/">https://youronlinechoices.eu/</a>
                    </strong>
                    . You may also be able to limit interest-based advertising through the settings menu on your mobile
                    device by selecting “limit ad tracking” (iOS) or “opt-out of interest-based ads” (Android). You may
                    also be able to opt-out of some — but not all — interest-based advertising served by mobile ad
                    networks by visiting
                    <strong>
                        <a href="http://youradchoices.com/appchoices">http://youradchoices.com/appchoices</a>
                    </strong>{' '}
                    and downloading the mobile AppChoices app.
                </Paragraph>
                <Paragraph size="default" textAlign="left" color="black">
                    Please note that when you opt out of receiving interest-based advertisements, this does not mean you
                    will no longer see advertisements from us or on our online services. It means that the online ads
                    that you do see from DAA program participants should not be based on your interests. We are not
                    responsible for the effectiveness of, or compliance with, any third-parties’ opt-out options or
                    programs or the accuracy of their statements regarding their programs. In addition, third parties
                    may still use cookies to collect information about your use of our online services, including for
                    analytics and fraud prevention as well as any other purpose permitted under the DAA’s Principles.
                </Paragraph>
                <Paragraph size="default" textAlign="left" color="black">
                    If you are located in the EEA, UK, or Switzerland, you may take advantage of{' '}
                    <strong>
                        <a href="https://youronlinechoices.eu/">Your Online Choices</a>
                    </strong>
                    . This service allows you to select tracking preferences for most of the advertising tools. As such,
                    it is recommended that you make use of this resource in addition to the information provided in this
                    document.
                </Paragraph>
            </Column>
        </Section>
    </SiteWrap>
);
