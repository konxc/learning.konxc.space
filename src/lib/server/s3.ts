import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Default to MinIO local settings if env vars are missing
const endpoint = process.env.S3_ENDPOINT || 'http://minio:9000';
const accessKeyId = process.env.S3_ACCESS_KEY || 'admin';
const secretAccessKey = process.env.S3_SECRET_KEY || 'password123';
const region = process.env.S3_REGION || 'us-east-1';

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'naikkelas-assets';

// Public endpoint used by browser to load assets (exposed by Traefik)
export const PUBLIC_S3_URL = process.env.PUBLIC_S3_URL || 'http://s3.localhost';

export const s3Client = new S3Client({
	region,
	endpoint,
	credentials: {
		accessKeyId,
		secretAccessKey
	},
	// Required for MinIO / non-AWS S3 standard implementations
	forcePathStyle: true
});

/**
 * Upload a file buffer to S3/MinIO
 */
export async function uploadFile(
	buffer: Buffer,
	key: string,
	mimeType: string
): Promise<string> {
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: mimeType,
		// Optional but good practice if bucket isn't public by default:
		// ACL: 'public-read' 
		// Note: MinIO bucket 'naikkelas-assets' is already made public by minio-init script
	});

	await s3Client.send(command);
	return `${PUBLIC_S3_URL}/${BUCKET_NAME}/${key}`;
}

/**
 * Delete a file from S3/MinIO
 */
export async function deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });
    
    await s3Client.send(command);
}
