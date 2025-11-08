import { marked, type RendererObject, type Tokens } from 'marked';
import hljs from 'highlight.js';

const renderer: RendererObject = {
    code(token: Tokens.Code): string {
        const code = token.text ?? '';
        const language = token.lang?.trim();

        if (language && hljs.getLanguage(language)) {
            const highlighted = hljs.highlight(code, { language }).value;
            return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
        }

        const highlighted = hljs.highlightAuto(code).value;
        return `<pre><code class="hljs">${highlighted}</code></pre>`;
    }
};

marked.use({ renderer });

export function renderMarkdown(markdown: string): string {
    // pastikan hasil parse selalu string, bukan Promise
    const result = marked.parse(markdown);
    if (typeof result === 'string') return result;
    // jika ternyata Promise (pada versi tertentu)
    throw new Error('Expected marked.parse to return a string, but got Promise');
}
