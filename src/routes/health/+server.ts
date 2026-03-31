import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return new Response('OK', { status: 200 });
};

export const HEAD: RequestHandler = async () => {
    return new Response(null, { status: 200 });
};
