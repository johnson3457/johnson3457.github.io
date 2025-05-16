const express = require('express');
const line = require('@line/bot-sdk');
const cors = require('cors');
const app = express();

// Line 設定
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

// 設定 CORS
app.use(cors({
    origin: ['https://johnson3457.github.io', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 處理訂單發送
app.post('/send-order', async (req, res) => {
    try {
        const { orderText } = req.body;
        const userId = process.env.LINE_USER_ID || '您的_LINE_USER_ID';
        
        // 發送訊息到指定的使用者
        await client.pushMessage(userId, {
            type: 'text',
            text: orderText
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 處理 Line Webhook 請求
app.post('/webhook', line.middleware(config), async (req, res) => {
    try {
        const events = req.body.events;
        
        for (let event of events) {
            if (event.type === 'message') {
                // 當使用者傳送訊息時，回傳他們的 User ID
                await client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: `您的 Line User ID 是：${event.source.userId}`
                });
            }
        }
        
        res.status(200).end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).end();
    }
});

// 提供一個簡單的說明頁面
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Line User ID 獲取工具</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .container {
                        background-color: #f5f5f5;
                        padding: 20px;
                        border-radius: 8px;
                    }
                    h1 {
                        color: #06C755;
                    }
                    .steps {
                        margin-top: 20px;
                    }
                    .step {
                        margin-bottom: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Line User ID 獲取工具</h1>
                    <p>這個工具可以幫助您獲取 Line 使用者的 User ID。</p>
                    
                    <div class="steps">
                        <h2>使用步驟：</h2>
                        <div class="step">
                            1. 將您的 Line Bot 加為好友
                        </div>
                        <div class="step">
                            2. 傳送任何訊息給 Bot
                        </div>
                        <div class="step">
                            3. Bot 會回覆您的 User ID
                        </div>
                    </div>
                    
                    <p>注意：請確保您已經在 Line Developers Console 中設定了正確的 Webhook URL。</p>
                </div>
            </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
