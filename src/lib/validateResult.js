export function validateResult(data) {
  if (!data || typeof data !== 'object') throw new Error('The quest returned an empty or invalid response.');
  if (typeof data.topic !== 'string' || typeof data.difficulty !== 'string') throw new Error('The quest response is missing its topic details.');
  if (!Array.isArray(data.questions) || data.questions.length !== 10) throw new Error('The quest must contain exactly 10 questions.');
  data.questions.forEach((q, i) => {
    if (!q || !Number.isInteger(q.id) || typeof q.question !== 'string' || !q.question.trim()) throw new Error(`Question ${i + 1} is incomplete.`);
    if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some(o => typeof o !== 'string' || !o.trim())) throw new Error(`Question ${i + 1} needs four valid choices.`);
    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) throw new Error(`Question ${i + 1} has an invalid answer.`);
  });
  return data;
}
