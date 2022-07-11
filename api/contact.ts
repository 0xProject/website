import type { VercelRequest, VercelResponse } from '@vercel/node';

// tslint:disable-next-line:no-default-export
export default async function handlerAsync(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
    const { body } = req;
    return res.send(`Hello ${body.name}, you just parsed the request body!`);
}
