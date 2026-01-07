export interface Quiz {
	id: string;
	created_at: string;
	title: string;
	questions_json: Question[];
}

export interface Question {
	question: string;
	options: Option[];
}

export interface Option {
	option: string;
	points: Points[];
}

export interface Points {
	result: string;
	points: number;
}
