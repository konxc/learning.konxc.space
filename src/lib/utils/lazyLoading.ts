/**
 * Lazy Loading Utilities
 * 
 * Helper functions untuk implementasi lazy loading yang SEO-friendly.
 * Memastikan konten tetap accessible untuk crawlers dan users.
 */

/**
 * Check if IntersectionObserver is supported
 */
export function isIntersectionObserverSupported(): boolean {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}

/**
 * Lazy load component dengan IntersectionObserver
 * 
 * @param element - Element yang akan di-observe
 * @param callback - Callback ketika element masuk viewport
 * @param options - IntersectionObserver options
 * @returns Cleanup function
 */
export function lazyLoadOnIntersect(
    element: HTMLElement | null,
    callback: () => void | Promise<void>,
    options: IntersectionObserverInit = {}
): () => void {
    if (!element || !isIntersectionObserverSupported()) {
        // Fallback: langsung execute jika tidak support
        callback();
        return () => { };
    }

    const defaultOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '50px', // Start loading 50px before element visible
        threshold: 0.1
    };

    const observerOptions = { ...defaultOptions, ...options };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(element);

    return () => observer.disconnect();
}

/**
 * Preload component untuk faster loading
 * 
 * @param componentPath - Path ke component
 */
export async function preloadComponent(componentPath: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
        await import(/* @vite-ignore */ componentPath);
    } catch (error) {
        console.warn(`Failed to preload component: ${componentPath}`, error);
    }
}

/**
 * Prefetch component saat user hover atau focus
 * 
 * @param element - Element yang akan trigger prefetch
 * @param componentPath - Path ke component
 */
export function prefetchOnHover(
    element: HTMLElement,
    componentPath: string
): () => void {
    let prefetched = false;

    const prefetch = () => {
        if (!prefetched) {
            prefetched = true;
            preloadComponent(componentPath);
        }
    };

    element.addEventListener('mouseenter', prefetch, { once: true });
    element.addEventListener('focus', prefetch, { once: true });

    return () => {
        element.removeEventListener('mouseenter', prefetch);
        element.removeEventListener('focus', prefetch);
    };
}

/**
 * Get image loading strategy berdasarkan position
 * 
 * @param isAboveFold - Apakah image di above-the-fold
 * @returns Loading strategy
 */
export function getImageLoadingStrategy(isAboveFold: boolean): {
    loading: 'lazy' | 'eager';
    fetchpriority?: 'high' | 'low' | 'auto';
} {
    if (isAboveFold) {
        return {
            loading: 'eager',
            fetchpriority: 'high'
        };
    }
    return {
        loading: 'lazy',
        fetchpriority: 'low'
    };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Delay execution untuk avoid blocking main thread
 * 
 * @param callback - Function to execute
 * @param delay - Delay in milliseconds
 */
export function deferExecution(callback: () => void, delay: number = 0): void {
    if (typeof window === 'undefined') {
        callback();
        return;
    }

    if (delay > 0) {
        setTimeout(() => {
            requestIdleCallback?.(callback) || setTimeout(callback, 0);
        }, delay);
    } else {
        requestIdleCallback?.(callback) || setTimeout(callback, 0);
    }
}

/**
 * Type untuk lazy loaded component
 */
export type LazyComponent<T = any> = () => Promise<{ default: T }>;

/**
 * Create lazy component loader dengan error handling
 * 
 * @param importFn - Dynamic import function
 * @returns Promise dengan component
 */
export async function loadLazyComponent<T = any>(
    importFn: () => Promise<{ default: T }>
): Promise<T> {
    try {
        const module = await importFn();
        return module.default;
    } catch (error) {
        console.error('Failed to load lazy component:', error);
        throw error;
    }
}

