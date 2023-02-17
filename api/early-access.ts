import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

import { validateEarlyAccessForm } from './_utils';

const DEBUG_SALESFORCE = true as const;
const DEBUG_EMAIL = 'dennis@0xproject.com' as const;

// tslint:disable-next-line:no-default-export
export default async function handlerAsync(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
    const { body } = req;

    if (Object.keys(body || {}).length === 0) {
        return res.status(401).send('Body missing');
    }

    const errors = validateEarlyAccessForm(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(422).send('Invalid payload');
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
    } = body;

    const payload = {
        oid: process.env.SALESFORCE_OID,
        first_name: firstName,
        last_name: lastName,
        email,
        URL: linkToProductOrWebsite,
        company: companyName,
        '00N8c00000drpGS': typeOfBusiness,
        '00N8c00000drpLI': role,
        '00N8c00000drr36': chainOfInterest,
    };

    const bodyInit = new URLSearchParams(payload as { [s: string]: string });
    for (const product of productOfInterest.split(',')) {
        bodyInit.append('00N8c00000drpLw', product);
    }
    if (DEBUG_SALESFORCE) {
        bodyInit.append('debug', '1');
        bodyInit.append('debugEmail', DEBUG_EMAIL);
    }

    await fetch('https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyInit,
    });

    return res.send('Created successfully');
}
