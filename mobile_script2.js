// 菜單數據
const menuData = {
    "好茶系列": [
        { name: "茉香綠茶", hot: true, prices: { M: 25, L: 30 } },
        { name: "春芽綠茶", hot: true, prices: { M: 25, L: 30 } },
        { name: "四季春青茶", hot: true, prices: { M: 25, L: 30 } },
        { name: "手採金萱烏龍", hot: true, prices: { M: 25, L: 30 } },
        { name: "古早味冬瓜茶（熬煮）", hot: false, prices: { M: 25, L: 30 } },
        { name: "冬瓜青茶", hot: false, prices: { M: 30, L: 35 } },
        { name: "梅之綠茶", hot: true, prices: { M: 30, L: 40 } },
        { name: "冰淇淋紅茶", hot: false, prices: { L: 55 } }
    ],
    "芭菲系列": [
        { name: "抹茶草莓芭菲", hot: false, prices: { M: 95 }, season: "冬季限定12~3月" },
        { name: "抹茶芒果芭菲", hot: false, prices: { M: 95 }, season: "季節限定6~9月" }
    ],
    "奶茶系列": [
        { name: "奶茶", hot: true, prices: { M: 35, L: 45 } },
        { name: "奶綠", hot: true, prices: { M: 35, L: 45 } },
        { name: "波霸奶茶/粉圓奶茶", hot: true, prices: { M: 40, L: 50 } },
        { name: "波霸粉圓奶茶", hot: true, prices: { M: 40, L: 50 } },
        { name: "阿華田", hot: true, prices: { M: 40, L: 50 } },
        { name: "波霸阿華田", hot: true, prices: { M: 45, L: 55 } },
        { name: "可可芭蕾", hot: true, prices: { M: 40, L: 50 } },
        { name: "布丁奶茶", hot: true, prices: { M: 50, L: 60 } }
    ],
    "黑糖熬煮系列": [
        { name: "黑糖珍珠鮮奶", hot: true, prices: { M: 55 } },
        { name: "芋見黑糖珍珠鮮奶", hot: true, prices: { M: 65 } },
        { name: "黑糖珍珠可可芭蕾拿鐵", hot: true, prices: { M: 60 } }
    ],
    "鮮果系列": [
        { name: "櫻桃可可", hot: false, prices: { L: 90 }, season: "季節限定6~9月/12~2月" },
        { name: "楊枝甘露", hot: false, prices: { L: 80 }, season: "季節限定6~9月" },
        { name: "滿杯水果茶", hot: false, prices: { L: 65 } },
        { name: "滿杯橙子", hot: false, prices: { L: 65 } },
        { name: "滿杯紅柚", hot: false, prices: { L: 65 } },
        { name: "一顆檸檬吧", hot: false, prices: { L: 55 } },
        { name: "檸檬四季春", hot: false, prices: { L: 55 } },
        { name: "港式凍檸茶", hot: false, prices: { L: 55 } },
        { name: "檸檬梅子", hot: false, prices: { L: 55 } },
        { name: "金桔檸檬", hot: false, prices: { L: 55 } },
        { name: "冬瓜檸檬", hot: false, prices: { L: 55 } },
        { name: "鮮桔青茶", hot: false, prices: { L: 55 } },
        { name: "甘蔗青茶", hot: false, prices: { L: 60 } }
    ],
    "養樂多系列": [
        { name: "綠茶養樂多", hot: false, prices: { L: 50 } },
        { name: "橙子養樂多", hot: false, prices: { L: 75 } },
        { name: "紅柚養樂多", hot: false, prices: { L: 75 } },
        { name: "火龍果養樂多", hot: false, prices: { L: 75 } }
    ]
};

// LIFF 相關變數
let userId = null;
let isLiffInitialized = false;

// 初始化 LIFF
async function initializeLiff() {
    console.log('開始初始化 LIFF...');
    try {
        // 檢查 LIFF SDK 是否已載入
        if (typeof liff === 'undefined') {
            throw new Error('LIFF SDK 未載入');
        }

        console.log('呼叫 liff.init()');
        await liff.init({ liffId: '2007324025-3akjMML1' });
        isLiffInitialized = true;
        console.log('LIFF 初始化成功');
        
        if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            userId = profile.userId;
            console.log('LIFF 已登入，獲取到用戶ID:', userId);
        } else {
            console.log('LIFF 未登入，準備呼叫 liff.login()');
            // 不管是在 LINE 內還是外部，都進行登入
            liff.login();
        }
    } catch (error) {
        console.error('LIFF 初始化失敗:', error);
        isLiffInitialized = false;
        alert('Line 登入系統初始化失敗：' + error.message);
    }
}

// 動態生成菜單
function generateMenu() {
    const menuSection = document.querySelector('.menu-section');
    
    for (const [category, items] of Object.entries(menuData)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'menu-category';
        
        // 創建分類標題
        const priceHeader = document.createElement('div');
        priceHeader.className = 'price-header';
        
        const sizes = new Set();
        items.forEach(item => {
            Object.keys(item.prices).forEach(size => sizes.add(size));
        });
        
        const sizeColumns = Array.from(sizes).map(size => 
            `<span class="item-size">${size}</span>`
        ).join('');
        
        priceHeader.innerHTML = `
            <span class="category-name">${category}</span>
            ${sizeColumns}
        `;
        
        categoryDiv.appendChild(priceHeader);
        
        // 創建菜單項目
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'item-name';
            nameSpan.innerHTML = item.name;
            
            if (item.hot) {
                const hotDiv = document.createElement('div');
                hotDiv.className = 'hot';
                nameSpan.appendChild(hotDiv);
            }
            
            if (item.season) {
                const seasonSpan = document.createElement('span');
                seasonSpan.className = 'small-text';
                seasonSpan.textContent = `(${item.season})`;
                nameSpan.appendChild(seasonSpan);
            }
            
            const priceSpans = Array.from(sizes).map(size => {
                const price = item.prices[size] || '';
                return `<span class="item-price">${price}</span>`;
            }).join('');
            
            menuItem.innerHTML = `
                ${nameSpan.outerHTML}
                ${priceSpans}
            `;
            
            categoryDiv.appendChild(menuItem);
        });
        
        menuSection.appendChild(categoryDiv);
    }
}

// 頁面載入時初始化 LIFF 並生成菜單
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeLiff();
        if (isLiffInitialized) {
            generateMenu();
            // 為所有飲料名稱添加點擊事件
            document.querySelectorAll('.item-name').forEach(item => {
                item.style.cursor = 'pointer';
                item.addEventListener('click', function() {
                    const itemName = this.textContent.split('(')[0].trim();
                    const menuItem = this.closest('.menu-item');
                    const prices = Array.from(menuItem.querySelectorAll('.item-price'))
                        .map(el => el.textContent.trim())
                        .filter(price => price !== '');
                    
                    document.getElementById('selectedDrinkName').textContent = itemName;
                    document.getElementById('selectedDrinkPrice').textContent = 
                        `價格：${prices.map((price, i) => `${['M', 'L'][i]} ${price}`).join(' / ')} 元`;
                    
                    openModal();
                });
            });
        }
    } catch (error) {
        console.error('頁面初始化失敗:', error);
        alert('頁面初始化失敗：' + error.message);
    }
});

// 開啟點餐視窗
function openModal() {
    const modal = document.getElementById('orderModal');
    modal.style.display = 'block';
    // 使用 setTimeout 確保 display:block 後再添加動畫類
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// 關閉點餐視窗
function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show');
    // 等待動畫完成後再隱藏
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 選擇甜度
function selectSugar(btn, value) {
    document.querySelectorAll('.sugar-options .option-btn').forEach(b => {
        b.classList.remove('sugar-selected');
    });
    btn.classList.add('sugar-selected');
}

// 選擇冰塊
function selectIce(btn, value) {
    document.querySelectorAll('.ice-options .option-btn').forEach(b => {
        b.classList.remove('ice-selected');
    });
    btn.classList.add('ice-selected');
}

// 選擇溫度
function selectTemp(btn, value) {
    document.querySelectorAll('.temp-options .option-btn').forEach(b => {
        b.classList.remove('temp-selected');
    });
    btn.classList.add('temp-selected');
}

// 選擇杯型
function selectSize(btn, value) {
    document.querySelectorAll('.size-options .option-btn').forEach(b => {
        b.classList.remove('size-selected');
    });
    btn.classList.add('size-selected');
}

// 提交訂單
function submitOrder() {
    const name = document.getElementById('selectedDrinkName').textContent;
    const sugarLevel = document.querySelector('.sugar-options .sugar-selected').textContent;
    const iceLevel = document.querySelector('.ice-options .ice-selected').textContent;
    const tempLevel = document.querySelector('.temp-options .temp-selected').textContent;
    const size = document.querySelector('.size-options .size-selected').textContent;
    const quantity = document.getElementById('quantity').value;
    const note = document.getElementById('note').value;
    
    const priceText = document.getElementById('selectedDrinkPrice').textContent;
    const priceMatch = priceText.match(/\d+/g);
    const unitPrice = priceMatch ? parseInt(priceMatch[0]) : 0;
    const totalPrice = unitPrice * quantity;
    
    const tbody = document.querySelector('#orderTable tbody');
    const newRow = tbody.insertRow();
    
    newRow.innerHTML = `
        <td class="table-cell">${name}(${size})${tempLevel === '熱飲' ? '(熱)' : ''}</td>
        <td class="table-cell">${sugarLevel}</td>
        <td class="table-cell">${iceLevel}</td>
        <td class="table-cell">${quantity}</td>
        <td class="table-cell">${totalPrice}</td>
        <td class="table-cell">${note}</td>
        <td class="table-cell">
            <button class="delete-btn" onclick="deleteRow(this)">刪除</button>
        </td>
    `;
    
    updateTotal();
    closeModal();
}

// 刪除訂單項目
function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
    updateTotal();
}

// 更新總金額
function updateTotal() {
    const rows = document.querySelectorAll('#orderTable tbody tr');
    let total = 0;
    
    rows.forEach(row => {
        const priceCell = row.cells[4];
        total += parseInt(priceCell.textContent);
    });
    
    document.getElementById('totalAmount').textContent = total;
}

// 傳送到 Line
async function sendToLine() {
    const rows = document.querySelectorAll('#orderTable tbody tr');
    if (rows.length === 0) {
        alert('沒有訂單可以傳送！');
        return;
    }
    
    // 檢查 LIFF 是否已初始化
    if (!isLiffInitialized) {
        console.error('LIFF 未初始化');
        alert('請等待頁面完全載入！');
        return;
    }
    
    // 檢查是否已登入
    if (!liff.isLoggedIn()) {
        alert('請先登入 Line！');
        liff.login();
        return;
    }
    
    // 如果已登入但沒有 userId，重新獲取
    if (!userId) {
        try {
            const profile = await liff.getProfile();
            userId = profile.userId;
            console.log('獲取到用戶ID:', userId);
        } catch (error) {
            console.error('獲取用戶資料失敗:', error);
            alert('獲取用戶資料失敗，請重新登入');
            liff.login();
            return;
        }
    }
    
    // 構建訂單文字
    let orderText = 'WHITE ALLEY 訂單明細\n\n';
    orderText += '品項\t甜度\t冰塊\t數量\t金額\t備註\n';
    
    rows.forEach(row => {
        const cells = row.cells;
        orderText += `${cells[0].textContent}\t${cells[1].textContent}\t${cells[2].textContent}\t${cells[3].textContent}\t${cells[4].textContent}\t${cells[5].textContent}\n`;
    });
    
    orderText += `\n總金額：${document.getElementById('totalAmount').textContent} 元`;
    
    const exportBtn = document.querySelector('.export-btn');
    const originalText = exportBtn.textContent;
    
    try {
        // 顯示載入中
        exportBtn.textContent = '傳送中...';
        exportBtn.disabled = true;
        
        console.log('準備發送訂單，用戶ID:', userId);
        
        // 發送到後端
        const response = await fetch('https://johnson3457-github-io.vercel.app/send-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderText: orderText,
                userId: userId
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // 清除訂單明細
            const tbody = document.querySelector('#orderTable tbody');
            if (tbody) {
                tbody.innerHTML = '';
                updateTotal();
                alert('訂單已成功傳送到您的 Line！');
            } else {
                console.error('找不到訂單表格');
            }
        } else {
            throw new Error(result.error || '傳送失敗');
        }
    } catch (error) {
        console.error('傳送錯誤:', error);
        alert('傳送失敗：' + error.message);
    } finally {
        // 恢復按鈕狀態
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
    }
}

// 清除所有訂單
function clearAllOrders() {
    if (confirm('確定要清除所有訂單嗎？')) {
        // 清空表格內容
        const tbody = document.querySelector('#orderTable tbody');
        if (tbody) {
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            // 更新總金額
            document.getElementById('totalAmount').textContent = '0';
        }
    }
} 
