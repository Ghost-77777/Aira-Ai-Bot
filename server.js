import 'dotenv/config';
import express from 'express';
import { Telegraf } from 'telegraf';
import { getAIResponse } from './services/aiService.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 24/7 Ping Route for UptimeRobot
app.get('/ping', (req, res) => {
  res.send('Bot is alive!');
});

// Telegram Bot Setup
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.on('text', async (ctx) => {
  try {
    const userMessage = ctx.message.text;
    const replyText = await getAIResponse(userMessage);
    await ctx.reply(replyText);
  } catch (error) {
    console.error('Telegram Error:', error);
    await ctx.reply('Maaf kijiye, kuch error aa gaya hai.');
  }
});

// Website API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const replyText = await getAIResponse(message);
    res.json({ reply: replyText });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

bot.launch();
console.log('Telegram bot is running...');
