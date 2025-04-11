// 為所有飲料名稱添加點擊事件和懸停效果的樣式
document.querySelectorAll('.item-name').forEach(item => {
    item.style.cursor = 'pointer';
    item.style.transition = 'background-color 0.3s';
    
    // 懸停效果
    item.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#f0f0f0';
    });
    
    item.addEventListener('mouseout', function() {
        if (!this.classList.contains('selected')) {
            this.style.backgroundColor = '';
        }
    });

    // 點擊事件
    item.addEventListener('click', function() {
        // 移除其他項目的選中狀態
        document.querySelectorAll('.item-name').forEach(i => {
            i.style.backgroundColor = '';
        });
        
        // 設置當前項目的選中狀態
        this.style.backgroundColor = '#e3f2fd';
        
        // 獲取飲料名稱和價格
        const name = this.textContent.split('(')[0].trim();
        const priceElements = this.closest('.menu-item').querySelectorAll('.item-price');
        let prices = [];
        priceElements.forEach(el => {
            if(el.textContent.trim()) {
                prices.push(el.textContent);
            }
        });
        
        // 檢查是否有多個價格（表示有不同杯型）
        const hasSizeOptions = prices.length > 1;
        document.getElementById('sizeSelect').style.display = 'block';
        
        // 更新價格顯示
        if (hasSizeOptions) {
            document.getElementById('selectedDrinkPrice').textContent = 
                `價格：M ${prices[0]} / L ${prices[1]} 元`;
            // 啟用所有杯型按鈕
            document.querySelectorAll('.size-options .option-btn').forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
        } else {
            document.getElementById('selectedDrinkPrice').textContent = 
                `價格：${prices[0]} 元`;
            // 根據價格所在欄位決定預設選中的杯型
            const priceHeaders = this.closest('.menu-category').querySelector('.price-header .item-size');
            const defaultSize = priceHeaders.textContent.trim();
            
            // 設置預設杯型並禁用其他選項
            document.querySelectorAll('.size-options .option-btn').forEach(btn => {
                if (btn.textContent === defaultSize) {
                    btn.classList.add('size-selected');
                    btn.disabled = false;
                    btn.style.opacity = '1';
                } else {
                    btn.classList.remove('size-selected');
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
            });
        }
        
        // 更新並顯示點餐視窗
        document.getElementById('selectedDrinkName').textContent = name;
        openModal();
        
        // 檢查是否有熱飲選項
        const hasHotOption = this.querySelector('.hot') !== null;
        document.getElementById('tempSelect').style.display = hasHotOption ? 'block' : 'none';
        
        // 如果不是熱飲選項，重置溫度選擇
        if (!hasHotOption) {
            document.querySelector('.temp-options .option-btn').classList.add('temp-selected');
        }
    });
});

// 修改開啟視窗的方式
function openModal() {
    const modal = document.getElementById('orderModal');
    modal.style.display = 'block';
    // 使用 setTimeout 確保 display:block 後再設置位置
    setTimeout(() => {
        modal.style.right = '0';
    }, 10);
}

// 修改關閉視窗的方式
function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.style.right = '-400px';
    // 等待動畫完成後再隱藏
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 添加選擇甜度的函數
function selectSugar(btn, value) {
    // 移除其他按鈕的選中狀態
    document.querySelectorAll('.sugar-options .option-btn').forEach(b => {
        b.classList.remove('sugar-selected');
    });
    // 添加當前按鈕的選中狀態
    btn.classList.add('sugar-selected');
}

// 添加選擇冰塊的函數
function selectIce(btn, value) {
    // 移除其他按鈕的選中狀態
    document.querySelectorAll('.ice-options .option-btn').forEach(b => {
        b.classList.remove('ice-selected');
    });
    // 添加當前按鈕的選中狀態
    btn.classList.add('ice-selected');
}

// 添加選擇溫度的函數
function selectTemp(btn, value) {
    document.querySelectorAll('.temp-options .option-btn').forEach(b => {
        b.classList.remove('temp-selected');
    });
    btn.classList.add('temp-selected');
}

// 添加選擇杯型的函數
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
    const quantity = document.getElementById('quantity').value;
    const tempLevel = document.getElementById('tempSelect').style.display === 'block' ? 
        document.querySelector('.temp-options .temp-selected').textContent : '冷飲';
    const note = document.getElementById('note').value;
    
    // 處理杯型和價格
    const hasSizeOptions = document.getElementById('sizeSelect').style.display === 'block';
    const size = hasSizeOptions ? document.querySelector('.size-options .size-selected').textContent : '';
    const priceText = document.getElementById('selectedDrinkPrice').textContent;
    
    let unitPrice;
    if (hasSizeOptions) {
        const prices = priceText.match(/\d+/g);
        if (prices && prices.length >= 1) {
            if (prices.length === 1) {
                // 只有一個價格時
                unitPrice = parseInt(prices[0]);
            } else {
                // 有兩個價格時，根據選擇的杯型決定
                unitPrice = size === 'M' ? parseInt(prices[0]) : parseInt(prices[1]);
            }
        } else {
            alert('無法取得價格資訊！');
            return;
        }
    } else {
        const price = priceText.match(/\d+/);
        if (price) {
            unitPrice = parseInt(price[0]);
        } else {
            alert('無法取得價格資訊！');
            return;
        }
    }
    
    if (isNaN(unitPrice)) {
        alert('價格資訊有誤！');
        return;
    }
    
    const totalPrice = unitPrice * quantity;
    
    // 創建新的表格行
    const tbody = document.querySelector('#orderTable tbody');
    const newRow = tbody.insertRow();
    
    // 組合顯示名稱（包含大小和溫度）
    let displayName = name;
    if (hasSizeOptions) {
        displayName += `(${size})`;
    }
    if (tempLevel === '熱飲') {
        displayName += '(熱)';
    }
    
    newRow.innerHTML = `
        <td class="table-cell">${displayName}</td>
        <td class="table-cell">${sugarLevel}</td>
        <td class="table-cell">${iceLevel}</td>
        <td class="table-cell">${quantity}</td>
        <td class="table-cell">${totalPrice}</td>
        <td class="table-cell">${note}</td>
        <td class="table-cell">
            <button onclick="deleteRow(this)" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">刪除</button>
        </td>
    `;
    
    // 重置所有選項為預設值
    resetOrderForm();
    updateTotal();
    closeModal();
}

// 新增重置表單的函數
function resetOrderForm() {
    // 重置甜度
    document.querySelectorAll('.sugar-options .option-btn').forEach(b => {
        b.classList.remove('sugar-selected');
    });
    document.querySelector('.sugar-options .option-btn').classList.add('sugar-selected');
    
    // 重置冰塊
    document.querySelectorAll('.ice-options .option-btn').forEach(b => {
        b.classList.remove('ice-selected');
    });
    document.querySelector('.ice-options .option-btn').classList.add('ice-selected');
    
    // 重置溫度選擇
    document.querySelectorAll('.temp-options .option-btn').forEach(b => {
        b.classList.remove('temp-selected');
    });
    document.querySelector('.temp-options .option-btn').classList.add('temp-selected');
    
    // 重置杯型選擇
    document.querySelectorAll('.size-options .option-btn').forEach(b => {
        b.classList.remove('size-selected');
    });
    document.querySelector('.size-options .option-btn').classList.add('size-selected');
    
    // 重置數量
    document.getElementById('quantity').value = '1';
    
    // 重置備註
    document.getElementById('note').value = '';
}

// 刪除訂單項目
function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateTotal();
}

// 更新總價
function updateTotal() {
    const prices = Array.from(document.querySelectorAll('#orderTable tbody td:nth-child(5)'))
        .map(td => parseInt(td.textContent));
    const total = prices.reduce((sum, price) => sum + price, 0);
    document.getElementById('totalPrice').textContent = `${total} 元`;
}

// 匯出訂單
function exportOrder() {
    const rows = document.querySelectorAll('#orderTable tbody tr');
    if (rows.length === 0) {
        alert('訂單是空的！請先加入飲品。');
        return;
    }

    // 建立訂單內容
    let orderText = "訂單明細\n\n";
    
    // 修改表格標題
    orderText += "     飲料名稱\t\t\t甜度\t冰塊\t數量\t價格\t備註\n";
    orderText += "-------------------------------------------------------------------------------------\n";

    // 添加訂單項目
    rows.forEach(row => {
        const cells = row.cells;
        let name = "     " + cells[0].textContent; // 在品名前加五個空格
        
        // 根據名稱長度決定要加入多少個 tab
        let nameField;
        // 特殊品項的處理
        const specialItems = [
            '波霸奶茶/粉圓奶茶',
            '波霸/粉圓紅茶拿鐵',
            '芝麻鮮奶/花生鮮奶'
        ];
        
        if (specialItems.some(item => name.includes(item))) {
            // 特殊品項使用兩個 tab
            nameField = `${name}\t\t`;
        } else {
            // 一般品項的處理
            if (name.length <= 8) {
                nameField = `${name}\t\t\t\t`;
            } else if (name.length <= 12) {
                nameField = `${name}\t\t\t`;
            } else if (name.length <= 16) {
                nameField = `${name}\t\t`;
            } else if (name.length <= 20) {
                nameField = `${name}\t`;
            } else {
                name = name.slice(0, 19) + "…";
                nameField = `${name}\t`;
            }
        }
        
        const note = cells[5].textContent;
        
        // 組合輸出行
        orderText += `${nameField}${cells[1].textContent}\t${cells[2].textContent}\t${cells[3].textContent}\t${cells[4].textContent}\t${note}\n`;
    });

    // 添加總計
    orderText += "-------------------------------------------------------------------------------------\n";
    orderText += `總計：${document.getElementById('totalPrice').textContent}\n\n`;

    // 添加訂單時間
    const now = new Date();
    orderText += `訂單時間：${now.toLocaleString()}\n`;
    
    // 創建並下載文字檔
    const blob = new Blob([orderText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `訂單_${now.toLocaleString().replace(/[/:]/g, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // 清除表格內容
    const tbody = document.querySelector('#orderTable tbody');
    tbody.innerHTML = '';
    
    // 更新總價
    updateTotal();
}

// 幫助函數：文字置中對齊
function centerAlign(text, width) {
    text = text.trim();
    const spaces = width - text.length;
    const leftPadding = Math.floor(spaces / 2);
    const rightPadding = spaces - leftPadding;
    return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
}

// 幫助函數：文字靠右對齊
function rightAlign(text, width) {
    text = text.trim();
    const spaces = width - text.length;
    return ' '.repeat(spaces) + text;
}

// 修改點擊外部關閉的處理
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target == modal) {
        closeModal();
    }
}

// 添加清除所有訂單的函數
function clearAllOrders() {
    if (document.querySelectorAll('#orderTable tbody tr').length === 0) {
        alert('訂單是空的！');
        return;
    }
    
    if (confirm('確定要清除所有訂單項目嗎？')) {
        const tbody = document.querySelector('#orderTable tbody');
        tbody.innerHTML = '';
        updateTotal();
    }
}