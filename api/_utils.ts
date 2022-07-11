export function validateContactForm(entries: { [s: string]: string }): { [s: string]: string } {
    const newErrors: { [s: string]: string } = {};
    const requiredFields = [
        'email',
        'firstName',
        'lastName',
        'companyName',
        'linkToProductOrWebsite',
        'usageDescription',
        'referral',
    ] as const;

    for (const field of requiredFields) {
        if (entries[field] === '') {
            newErrors[field] = 'Field is required';
        }
    }

    if (!newErrors.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(entries.email)) {
        newErrors.email = 'No valid email address';
    }

    if (entries.chainOfInterest === 'Other' && entries.chainOfInterestOther === '') {
        newErrors.chainOfInterestOther = 'Field is required';
    }
    return newErrors;
}
