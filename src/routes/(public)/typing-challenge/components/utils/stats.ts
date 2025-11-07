export interface TypingStats {
	wpm: number;
	accuracy: number;
	time: number;
	errors: number;
	totalChars: number;
	correctChars: number;
	progress: number;
}

export function calculateWPM(totalChars: number, timeInSeconds: number): number {
	if (timeInSeconds === 0) return 0;
	const minutes = timeInSeconds / 60;
	const words = totalChars / 5; // Standard: 5 chars per word
	return Math.round(words / minutes);
}

export function calculateAccuracy(totalChars: number, errors: number): number {
	if (totalChars === 0) return 100;
	const correctChars = totalChars - errors;
	return Math.round((correctChars / totalChars) * 100);
}

export function calculateStats(
	typedChars: number,
	errors: number,
	timeInSeconds: number,
	totalLength: number
): TypingStats {
	const wpm = calculateWPM(typedChars, timeInSeconds);
	const accuracy = calculateAccuracy(typedChars, errors);
	const progress = totalLength > 0 ? Math.round((typedChars / totalLength) * 100) : 0;

	return {
		wpm,
		accuracy,
		time: timeInSeconds,
		errors,
		totalChars: typedChars,
		correctChars: typedChars - errors,
		progress
	};
}
