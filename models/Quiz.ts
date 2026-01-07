interface Quiz {
	question: string;
	answers_json: Answer[];
}

interface Answer {
	answer: string;
	points: number;
}
