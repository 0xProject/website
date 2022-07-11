import type { VercelRequest, VercelResponse } from '@vercel/node';

import { validateContactForm } from './_utils';

// tslint:disable-next-line:no-default-export
export default async function handlerAsync(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
    const { body } = req;

    if (Object.keys(body || {}).length === 0) {
        return res.status(401).send('Body missing');
    }

    const errors = validateContactForm(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(422).send('Invalid payload');
    }

    const {
        firstName,
        lastName,
        email,
        linkToProductOrWebsite,
        companyName,
        typeOfBusiness,
        role,
        currentTradingVolume,
        isApplicationLive,
        productOfInterest,
        chainOfInterest,
        usageDescription,
        chainOfInterestOther,
        isApiKeyRequired,
        referral,
    } = body;

    const payload = {
        oid: process.env.SALESFORCE_OID,
        first_name: firstName,
        last_name: lastName,
        email,
        website: linkToProductOrWebsite,
        company: companyName,
        '00N8c00000drpGS': typeOfBusiness,
        '00N8c00000drpLI': role,
        '00N8c00000drpLS': currentTradingVolume,
        '00N8c00000drpLm': `${isApplicationLive}`,
        '00N8c00000drpLw': productOfInterest,
        '00N8c00000drr36': chainOfInterest,
        '00N8c00000drpgB': usageDescription,
        ...(chainOfInterest === 'Other' ? { '00N8c00000drr3B': chainOfInterestOther } : {}),
        '00N8c00000drpgL': `${isApiKeyRequired}`,
        '00N8c00000drvT8': referral,
        debug: '1',
        debugEmail: 'dennis@0xproject.com',
    };

    await fetch('https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(payload as { [s: string]: string }),
    });

    return res.send('Created successfully');
}
