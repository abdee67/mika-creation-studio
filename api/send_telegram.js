/* global process */

// Helper function to escape HTML special characters for Telegram HTML parse mode
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Support both fullName (from front-end) and name
  const name = req.body.fullName || req.body.name;
  const { email, phone, service, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Support both correct spelling and the typo found in .env.local
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Telegram credentials are not configured' });
  }

  // Format the message with HTML (safer and cleaner than Markdown for user inputs)
  const telegramMessage = `<b>📬 New Contact Form Submission</b>\n\n` +
                          `<b>👤 Name:</b> ${escapeHtml(name)}\n` +
                          `<b>📧 Email:</b> ${escapeHtml(email)}\n` +
                          (phone ? `<b>📞 Phone:</b> ${escapeHtml(phone)}\n` : '') +
                          (service ? `<b>💼 Service:</b> ${escapeHtml(service)}\n` : '') +
                          `\n<b>💬 Message:</b>\n${escapeHtml(message)}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML',
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Notification sent!' });
    } else {
      const errorData = await response.json();
      return res.status(500).json({ error: 'Telegram API error', details: errorData });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

