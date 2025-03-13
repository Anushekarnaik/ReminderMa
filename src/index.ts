import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import * as os from 'os';
const app = new Hono();
const reminders: string[] = [];
 const numbers :number[] = [];

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

const reminderss: Reminder[] = [];
app.get('/helath',(context)=>{
  
  return context.json({message:"hello world!"},200);
});

app.get("/reminders", (context) => {
  return context.json(reminders, 200)
});

  app.post("/reminders", async(context) => {
    const body = await context.req.json();
   
    const reminder = body.reminder;
    reminders.push(reminder);
    return context.json(reminders, 201);
  });

  app.get('/random', (context) => {
    const randomNumber = Math.floor(Math.random() * 100000) + 1; 
    return context.json({ randomNumber }, 200);
  });

  app.get('/time', (context) => {
    const currentTime = new Date().toISOString(); 
    return context.json({ currentTime }, 200);
  });

  app.get('/env', (context) => {
    const nodeVersion = process.version;
    const platform = os.platform();
    return context.json({ nodeVersion, platform }, 200);
  });

  app.get('/puppet', (context) => {
    return context.json({ queryReceived: context.req.query() }, 200);
  });

  app.post('/numbers', async (context) => {
    const body = await context.req.json();
    const number = body.number;
    numbers.push(number);
    return context.json({latestNumber:numbers}, 201);
  });

  app.post("/reminders", async (context) => {
    try {
      const body = await context.req.json();
      const { id, title, description, dueDate, isCompleted } = body;
  
      if (!id || !title || !description || !dueDate || typeof isCompleted !== 'boolean') {
        return context.json({ error: "Invalid data" }, 400);
      }
  
      const newReminder: Reminder = { id, title, description, dueDate, isCompleted };
      reminderss.push(newReminder);
      return context.json(newReminder, 201);
    } catch (error) {
      return context.json({ error: "Invalid data" }, 400);
    }
  });

serve(app);

console.log('Server is running on http://localhost:3000');
