export type CreateQuestionRequest = {
  question: string;
};

export type CreateQuestionResponse = {
  questionId: string;
  answer: string | null;
};
