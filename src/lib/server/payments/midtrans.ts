import { env } from '$env/dynamic/private';

export type MidtransTransactionRequest = {
	orderId: string;
	amount: number; // in IDR
	customer?: {
		firstName?: string;
		lastName?: string;
		email?: string;
		phone?: string;
	};
	itemDetails?: Array<{ id?: string; price: number; quantity: number; name: string }>;
	expiryMinutes?: number;
};

export type MidtransTransactionResponse = {
	token: string;
	redirect_url: string;
};

export function getMidtransBaseUrl(): string {
	const isProd = env.MIDTRANS_IS_PRODUCTION === 'true';
	return isProd ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';
}

export function getMidtransServerKey(): string {
	if (!env.MIDTRANS_SERVER_KEY) throw new Error('MIDTRANS_SERVER_KEY is not set');
	return env.MIDTRANS_SERVER_KEY;
}

export function getMidtransClientKey(): string {
	if (!env.MIDTRANS_CLIENT_KEY) throw new Error('MIDTRANS_CLIENT_KEY is not set');
	return env.MIDTRANS_CLIENT_KEY;
}

export async function createSnapTransaction(
	payload: MidtransTransactionRequest
): Promise<MidtransTransactionResponse> {
	const url = `${getMidtransBaseUrl()}/snap/v1/transactions`;
	const auth = Buffer.from(`${getMidtransServerKey()}:`).toString('base64');

	const body = {
		transaction_details: {
			order_id: payload.orderId,
			gross_amount: payload.amount
		},
		customer_details: payload.customer,
		item_details: payload.itemDetails,
		expiry: payload.expiryMinutes
			? { unit: 'minutes', duration: payload.expiryMinutes }
			: undefined
	};

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${auth}`
		},
		body: JSON.stringify(body)
	});

	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`Midtrans error ${res.status}: ${errText}`);
	}

	return (await res.json()) as MidtransTransactionResponse;
}

export function verifyMidtransSignature(params: {
	order_id: string;
	status_code: string;
	gross_amount: string | number;
	signature_key: string;
}): boolean {
	const serverKey = getMidtransServerKey();
	const raw = `${params.order_id}${params.status_code}${params.gross_amount}${serverKey}`;
	const crypto = require('crypto') as typeof import('crypto');
	const digest = crypto.createHash('sha512').update(raw).digest('hex');
	return digest === params.signature_key;
}
