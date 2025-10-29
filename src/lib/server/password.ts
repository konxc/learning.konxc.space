// Use Web Crypto API for password hashing (Cloudflare Workers compatible)

/**
 * Hash a password using PBKDF2 with Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Generate a salt
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Import the key
    const key = await crypto.subtle.importKey(
        'raw',
        data,
        'PBKDF2',
        false,
        ['deriveBits']
    );

    // Derive bits
    const bits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        key,
        256
    );

    // Combine salt and hash
    const combined = new Uint8Array(salt.length + 32);
    combined.set(salt, 0);
    combined.set(new Uint8Array(bits), salt.length);

    return btoa(String.fromCharCode(...combined));
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const combined = Uint8Array.from(atob(hash), c => c.charCodeAt(0));

    // Extract salt and hash
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);

    // Derive the hash for the given password
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        key,
        256
    );

    const derivedHash = new Uint8Array(bits);

    // Compare hashes
    return derivedHash.length === storedHash.length &&
        derivedHash.every((val, idx) => val === storedHash[idx]);
}

