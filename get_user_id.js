const express = require('express');
const line = require('@line/bot-sdk');
const cors = require('cors');
const app = express();

// Line 設定
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

// 檢查環境變數
if (!config.channelAccessToken || !config.channelSecret) {
    console.error('錯誤：未設定 LINE_CHANNEL_ACCESS_TOKEN 或 LINE_CHANNEL_SECRET');
}

const client = new line.Client(config);

// 設定 CORS
app.use(cors({
    origin: ['https://johnson3457.github.io', 'http://localhost:3000', 'https://johnson3457-github-io.vercel.app'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// 重要：在 middleware 之前設定 raw body
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

// 處理訂單發送
app.post('/send-order', async (req, res) => {
    try {
        const { orderText, userId, orderTime } = req.body;
        
        if (!userId) {
            throw new Error('未提供使用者 ID');
        }

        // 解析訂單文字
        const lines = orderText.split('\n');
        const title = lines[0]; // WHITE ALLEY 訂單明細
        const items = lines.slice(4, -2); // 訂單項目
        const total = lines[lines.length - 1]; // 總金額

        // 建立 Flex Message
        const flexMessage = {
            type: 'flex',
            altText: 'WHITE ALLEY 訂單明細',
            contents: {
                type: 'bubble',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: 'WHITE ALLEY',
                            weight: 'bold',
                            size: 'xl',
                            color: '#b8925d'
                        },
                        {
                            type: 'text',
                            text: '訂單明細',
                            size: 'lg',
                            margin: 'md'
                        },
                        {
                            type: 'text',
                            text: `訂單時間：${orderTime}`,
                            size: 'sm',
                            color: '#666666',
                            margin: 'md'
                        }
                    ]
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: items.map(item => {
                        const [name, sugar, ice, quantity, price, note] = item.split('\t');
                        return {
                            type: 'box',
                            layout: 'vertical',
                            margin: 'md',
                            contents: [
                                {
                                    type: 'box',
                                    layout: 'horizontal',
                                    contents: [
                                        {
                                            type: 'text',
                                            text: name,
                                            size: 'sm',
                                            weight: 'bold',
                                            flex: 5
                                        },
                                        {
                                            type: 'text',
                                            text: `${quantity}杯`,
                                            size: 'sm',
                                            flex: 2,
                                            align: 'end'
                                        }
                                    ]
                                },
                                {
                                    type: 'box',
                                    layout: 'horizontal',
                                    margin: 'sm',
                                    contents: [
                                        {
                                            type: 'text',
                                            text: `${sugar} / ${ice}`,
                                            size: 'xs',
                                            color: '#666666',
                                            flex: 3
                                        },
                                        {
                                            type: 'text',
                                            text: `$${price}`,
                                            size: 'sm',
                                            color: '#b8925d',
                                            flex: 2,
                                            align: 'end'
                                        }
                                    ]
                                },
                                note ? {
                                    type: 'text',
                                    text: `備註：${note}`,
                                    size: 'xs',
                                    color: '#666666',
                                    margin: 'sm'
                                } : null
                            ].filter(Boolean)
                        };
                    })
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: '總金額',
                                    size: 'md',
                                    weight: 'bold',
                                    flex: 0
                                },
                                {
                                    type: 'text',
                                    text: total.replace('總金額：', ''),
                                    size: 'md',
                                    weight: 'bold',
                                    color: '#b8925d',
                                    align: 'end',
                                    flex: 0
                                }
                            ]
                        }
                    ]
                },
                styles: {
                    header: {
                        backgroundColor: '#f8f8f8'
                    },
                    footer: {
                        backgroundColor: '#f8f8f8'
                    }
                }
            }
        };

        // 發送 Flex Message
        await client.pushMessage(userId, flexMessage);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 處理 Line Webhook 請求
app.post('/webhook', line.middleware(config), async (req, res) => {
    try {
        console.log('收到 Webhook 請求');
        const events = req.body.events;
        
        if (!events || events.length === 0) {
            console.log('沒有事件');
            return res.status(200).end();
        }
        
        // 只處理訂單相關的訊息
        for (let event of events) {
            if (event.type === 'message') {
                console.log('收到訊息事件');
                // 不自動回覆任何訊息
            }
        }
        
        res.status(200).end();
    } catch (error) {
        console.error('Webhook 處理錯誤:', error);
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
