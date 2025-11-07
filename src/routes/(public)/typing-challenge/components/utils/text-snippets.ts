export interface TextSnippet {
	id: string;
	text: string;
	difficulty: 'easy' | 'medium' | 'hard';
	length: number;
	tags: string[];
}

export const textSnippets: TextSnippet[] = [
	// Easy - Short phrases
	{
		id: 'easy-1',
		text: 'The quick brown fox jumps over the lazy dog',
		difficulty: 'easy',
		length: 43,
		tags: ['pangram']
	},
	{
		id: 'easy-2',
		text: 'To be or not to be, that is the question',
		difficulty: 'easy',
		length: 40,
		tags: ['shakespeare']
	},
	{
		id: 'easy-3',
		text: 'Practice makes perfect. Keep coding every day.',
		difficulty: 'easy',
		length: 45,
		tags: ['motivational']
	},
	{
		id: 'easy-4',
		text: 'A journey of a thousand miles begins with a single step',
		difficulty: 'easy',
		length: 60,
		tags: ['wisdom']
	},
	{
		id: 'easy-5',
		text: 'Technology is just a tool. It is the people who make the difference.',
		difficulty: 'easy',
		length: 73,
		tags: ['technology']
	},

	// Medium - Paragraphs
	{
		id: 'med-1',
		difficulty: 'medium',
		tags: ['technology', 'programming'],
		text: 'Programming is not just about writing code. It is about solving problems, thinking logically, and creating solutions that make a difference. Every developer starts their journey by learning the fundamentals, practicing consistently, and never giving up on the challenges ahead.',
		length: 223
	},
	{
		id: 'med-2',
		difficulty: 'medium',
		tags: ['motivational', 'growth'],
		text: 'Continuous learning is the key to success in the tech industry. The landscape changes rapidly, and those who adapt thrive. Whether you are learning a new framework, exploring different programming paradigms, or diving into system architecture, every bit of knowledge builds your expertise.',
		length: 251
	},
	{
		id: 'med-3',
		difficulty: 'medium',
		tags: ['collaboration', 'teamwork'],
		text: 'Building great software requires more than technical skills. Effective communication, empathy, and collaboration are equally important. The best code is often written by teams that trust each other, share knowledge openly, and work towards common goals. Together we can create something extraordinary.',
		length: 264
	},
	{
		id: 'med-4',
		difficulty: 'medium',
		tags: ['philosophy', 'thinking'],
		text: 'The art of programming lies not in writing clever code, but in writing code that others can understand and maintain. Simplicity is the ultimate sophistication. A solution that works today and can evolve tomorrow is worth more than a hack that solves today but blocks the future.',
		length: 246
	},

	// Hard - Long texts
	{
		id: 'hard-1',
		difficulty: 'hard',
		tags: ['education', 'philosophy'],
		text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
		length: 437
	},
	{
		id: 'hard-2',
		difficulty: 'hard',
		tags: ['technology', 'future'],
		text: 'The rapid advancement of artificial intelligence and machine learning technologies has transformed the way we approach problem-solving in the digital age. From natural language processing to computer vision, from autonomous vehicles to medical diagnosis, the applications are vast and transformative. As we stand on the brink of these technological revolutions, it becomes increasingly important to ensure that these tools are developed responsibly, ethically, and with the greater good in mind.',
		length: 511
	},
	{
		id: 'hard-3',
		difficulty: 'hard',
		tags: ['wisdom', 'life'],
		text: 'In the midst of chaos, find order. In the depths of complexity, discover simplicity. The path to mastery is not through shortcuts or tricks, but through consistent practice, deliberate learning, and relentless curiosity. Those who succeed in any field understand that there are no overnight successes, only years of preparation that finally culminate in moments of recognition. The journey itself is the destination, and every step forward is a victory worth celebrating.',
		length: 507
	}
];

export function getRandomText(difficulty?: 'easy' | 'medium' | 'hard'): TextSnippet {
	let filtered = textSnippets;

	if (difficulty) {
		filtered = filtered.filter((t) => t.difficulty === difficulty);
	}

	return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getTextsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): TextSnippet[] {
	return textSnippets.filter((t) => t.difficulty === difficulty);
}
