import OpenAI from 'openai'; import { questionPrompt } from '../prompts/questionPrompt.js'; import { validateResult } from '../../src/lib/validateResult.js';
export async function createQuest(topic, difficulty) {
 if (!process.env.OPENAI_API_KEY) { const e=new Error('Server is missing OPENAI_API_KEY. Add it to .env and restart.'); e.status=503; throw e; }
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const response=await client.chat.completions.create({model:process.env.OPENAI_MODEL || 'gpt-4o-mini', response_format:{type:'json_object'}, messages:[{role:'system',content:'You produce strictly valid JSON quiz payloads.'},{role:'user',content:questionPrompt(topic,difficulty)}], temperature:0.4});
 const text=response.choices?.[0]?.message?.content; if (!text) { const e=new Error('The LLM sent an empty response.'); e.status=502; throw e; }
 try { return validateResult(JSON.parse(text)); } catch (cause) { const e=new Error(`The generated quest did not pass validation: ${cause.message}`); e.status=502; throw e; }
}
