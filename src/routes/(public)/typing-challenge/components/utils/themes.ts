export type ThemeName =
	| 'monokai'
	| 'dracula'
	| 'nord'
	| 'vs-code-dark'
	| 'one-dark'
	| 'github-light'
	| 'solarized-light'
	| 'custom';

export interface Theme {
	name: ThemeName;
	displayName: string;
	background: string;
	text: string;
	caret: string;
	correct: string;
	error: string;
	keyword: string;
	string: string;
	number: string;
	comment: string;
	operator: string;
	lineNumber: string;
	lineNumberText: string;
}

export const themes: Theme[] = [
	// Dark themes
	{
		name: 'monokai',
		displayName: 'Monokai',
		background: '#272822',
		text: '#f8f8f2',
		caret: '#f8f8f2',
		correct: '#a6e22e',
		error: '#f92672',
		keyword: '#f92672',
		string: '#e6db74',
		number: '#ae81ff',
		comment: '#75715e',
		operator: '#f92672',
		lineNumber: '#272822',
		lineNumberText: '#75715e'
	},
	{
		name: 'dracula',
		displayName: 'Dracula',
		background: '#282a36',
		text: '#f8f8f2',
		caret: '#f8f8f2',
		correct: '#50fa7b',
		error: '#ff5555',
		keyword: '#ff79c6',
		string: '#f1fa8c',
		number: '#bd93f9',
		comment: '#6272a4',
		operator: '#ff79c6',
		lineNumber: '#282a36',
		lineNumberText: '#6272a4'
	},
	{
		name: 'nord',
		displayName: 'Nord',
		background: '#2e3440',
		text: '#d8dee9',
		caret: '#d8dee9',
		correct: '#a3be8c',
		error: '#bf616a',
		keyword: '#81a1c1',
		string: '#a3be8c',
		number: '#b48ead',
		comment: '#616e88',
		operator: '#81a1c1',
		lineNumber: '#2e3440',
		lineNumberText: '#616e88'
	},
	{
		name: 'vs-code-dark',
		displayName: 'VS Code Dark',
		background: '#1e1e1e',
		text: '#d4d4d4',
		caret: '#d4d4d4',
		correct: '#4ec9b0',
		error: '#f48771',
		keyword: '#569cd6',
		string: '#ce9178',
		number: '#b5cea8',
		comment: '#6a9955',
		operator: '#569cd6',
		lineNumber: '#1e1e1e',
		lineNumberText: '#858585'
	},
	{
		name: 'one-dark',
		displayName: 'One Dark',
		background: '#282c34',
		text: '#abb2bf',
		caret: '#abb2bf',
		correct: '#98c379',
		error: '#e06c75',
		keyword: '#c678dd',
		string: '#98c379',
		number: '#d19a66',
		comment: '#5c6370',
		operator: '#56b6c2',
		lineNumber: '#282c34',
		lineNumberText: '#5c6370'
	},

	// Light themes
	{
		name: 'github-light',
		displayName: 'GitHub Light',
		background: '#ffffff',
		text: '#24292e',
		caret: '#24292e',
		correct: '#22863a',
		error: '#cb2431',
		keyword: '#d73a49',
		string: '#032f62',
		number: '#005cc5',
		comment: '#6a737d',
		operator: '#d73a49',
		lineNumber: '#ffffff',
		lineNumberText: '#6a737d'
	},
	{
		name: 'solarized-light',
		displayName: 'Solarized Light',
		background: '#fdf6e3',
		text: '#657b83',
		caret: '#657b83',
		correct: '#859900',
		error: '#dc322f',
		keyword: '#268bd2',
		string: '#2aa198',
		number: '#d33682',
		comment: '#93a1a1',
		operator: '#268bd2',
		lineNumber: '#fdf6e3',
		lineNumberText: '#93a1a1'
	}
];

export function getTheme(name: ThemeName): Theme {
	return themes.find((t) => t.name === name) || themes[0];
}

export function getDefaultTheme(): Theme {
	return themes[0]; // Monokai
}
