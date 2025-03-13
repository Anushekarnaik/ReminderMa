import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import * as os from 'os';
const app = new Hono();

type Reminder ={
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

const reminderss: Reminder[] = [];

app.post('/reminders', async (c) => {
  const { id, title, description, dueDate, isCompleted } = await c.req.json()

  if (!id || !title || !description || !dueDate || typeof isCompleted !== 'boolean') {
    return c.json({ error: 'Invalid data' }, 400)
  }

  const newReminder: Reminder = { id, title, description, dueDate, isCompleted }
  reminderss.push(newReminder)
  return c.json(newReminder, 201)
})
serve(app);

console.log('Server is running on http://localhost:3000');
