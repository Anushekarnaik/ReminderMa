import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import * as os from 'os';
const app = new Hono();

type Reminder = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

const reminders: Reminder[] = [];

function isValidReminder(reminder: Reminder): boolean {
  return (
    typeof reminder.id === 'string' &&
    typeof reminder.title === 'string' &&
    typeof reminder.description === 'string' &&
    typeof reminder.dueDate === 'string' &&
    typeof reminder.isCompleted === 'boolean'
  );
}
//1. Create a new reminder
app.post('/reminders', async (c) => {
  const { id, title, description, dueDate, isCompleted } = await c.req.json()

  if (!id || !title || !description || !dueDate || typeof isCompleted !== 'boolean') {
    return c.json({ error: 'Invalid data' }, 400)
  }

  const newReminder: Reminder = { id, title, description, dueDate, isCompleted }
  reminders.push(newReminder)
  return c.json(newReminder, 201)
})
//4. Update a reminder
app.patch('/reminders/:id', async (c) => {
  const reminder = reminders.find((r) => r.id === c.req.param('id'))
  if (!reminder) {
    return c.json({ error: 'Reminder not found' }, 404)
  }
  const data = await c.req.json()
  if (!isValidReminder({ ...reminder, ...data })) {
    return c.json({ error: 'Invalid data' }, 400)
  }
  Object.assign(reminder, data)
  return c.json(reminder)
})

//2. Get all reminders
app.get('/reminders', (c) => {
  if (reminders.length === 0) {
    return c.json({ error: 'No reminders found' }, 404);
  }
  return c.json(reminders, 200);
});
//Mark a reminder as completed
app.post('/reminders/:id/mark-completed', (c) => {
  const id = c.req.param('id');
  const reminder = reminders.find((r) => r.id === id);

  if (!reminder) {
    return c.json({ error: 'Reminder not found' }, 404);
  }

  reminder.isCompleted = true;
  return c.json({ message: 'Reminder marked as completed', reminder }, 200);
});
//Unmark a reminder as completed
app.post('/reminders/:id/unmark-completed', (c) => {
  const id = c.req.param('id');
  const reminder = reminders.find((r) => r.id === id);

  if (!reminder) {
    return c.json({ error: 'Reminder not found' }, 404);
  }

  reminder.isCompleted = false;
  return c.json({ message: 'Reminder unmarked as completed', reminder }, 200);
});

//Get reminders completed
app.get('/reminders/completed', (c) => {
  const completedReminders = reminders.filter((r) => r.isCompleted === true);

  if (completedReminders.length === 0) {
    return c.json({ error: 'No completed reminders found' }, 404);
  }

  return c.json(completedReminders, 200);
});
//Get reminders not completed
app.get('/reminders/not-completed', (c) => {
  const notCompletedReminders = reminders.filter((r) => r.isCompleted === false);

  if (notCompletedReminders.length === 0) {
    return c.json({ error: 'No uncompleted reminders found' }, 404);
  }

  return c.json(notCompletedReminders, 200);
});
//Get reminders due today
app.get('/reminders/due-today', (c) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const dueTodayReminders = reminders.filter((r) => r.dueDate === today);

  if (dueTodayReminders.length === 0) {
    return c.json({ error: 'No reminders due today' }, 404);
  }

  return c.json(dueTodayReminders, 200);
});
//Delete a reminder
app.delete('/reminders/:id', (c) => {
  const id = c.req.param('id');
  const index = reminders.findIndex((r) => r.id === id);

  if (index === -1) {
    return c.json({ error: 'Reminder not found' }, 404);
  }

  reminders.splice(index, 1);
  return c.json({ message: 'Reminder deleted successfully' }, 200);
});

//3. Get a reminder by id
app.get('/reminders/:id', (c) => {
  const  id  = c.req.param("id");
  const reminder = reminders.find(r => r.id === id);

  if (!reminder) {
    return c.json({ error: 'Reminder not found' }, 404);
  }

  return c.json(reminder, 200);
});

serve(app);
// serve({ fetch: app.fetch, port: 3000 });


console.log('Server is running on http://localhost:3000');