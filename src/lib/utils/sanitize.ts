/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify to strip dangerous scripts and elements
 * 
 * NOTE: Currently not used in favor of declarative Svelte markup
 * Kept for reference and future use cases that require dynamic HTML
 * 
 * @param html - The HTML string to sanitize
 * @returns Safe HTML string that can be rendered
 */
import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
        // Server-side: just strip tags for safety
        return html.replace(/<[^>]*>/g, '');
    }

    // Browser-side: use DOMPurify for proper sanitization
    return DOMPurify.sanitize(html, {
        // Allow only specific HTML tags
        ALLOWED_TAGS: ['strong', 'em', 'br', 'p', 'span', 'u', 's', 'mark', 'small', 'abbr'],
        // Allow specific attributes
        ALLOWED_ATTR: ['class', 'id'],
        // Don't allow data attributes (prevent data-based XSS)
        ALLOW_DATA_ATTR: false,
        // Return safe HTML string
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: false,
        // KEEP_CONTENT is false by default, which means DOMPurify will remove dangerous content
        KEEP_CONTENT: true,
    });
}

