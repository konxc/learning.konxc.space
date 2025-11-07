import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
    highlight(code, language) {
        if (language && hljs.getLanguage(language)) {
            return hljs.highlight(code, { language }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    langPrefix: 'hljs language-'
});

export function renderMarkdown(markdown: string) {
    return marked.parse(markdown);
}
