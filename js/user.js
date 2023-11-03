// 確保資料載入後再顯示
window.onload = function() {
	// 使用API調用
	axios.get('/api_User')
		.then(response => {
			const entries = response.data;
			// 將表格填充為載入的資料
			populateTable(entries);
            nextInput() // 刷新 換行Input
		})
		.catch(error => console.error('錯誤:', error));
};

// 渲染表格使用
function populateTable(entries) {
	const tableBody = document.getElementById('table-body');
	tableBody.innerHTML = ''; // 清除先前的內容

	entries.forEach(entry => {
		const row = document.createElement('tr');
		row.id = `row-${entry['id']}`; //加入ID用於動態刪除
        row.innerHTML = `
			<td class="ID">${entry['id']}</td>
			<td><input type="text" name="card_id_${entry['id']}" value="${entry['card_id'] !== null ? entry['card_id'] : ''}"></td>
			<td><input type="text" name="employee_id_${entry['id']}" value="${entry['employee_id'] !== null ? entry['employee_id'] : ''}"></td>
			<td><input type="text" name="employee_name_${entry['id']}" value="${entry['employee_name'] !== null ? entry['employee_name'] : ''}"></td>
			<td><input type="text" name="food_group_${entry['id']}" value="${entry['food_group'] !== null ? entry['food_group'] : ''}"></td>
			<td class="action"><div class="actionBtn"><i class="fa fa-pencil-square-o" aria-hidden="true" onclick="updateFoodData('${entry['id']}')"></i><i class="fa fa-times-circle-o" aria-hidden="true" onclick="deleteRow('${entry['id']}')"></i></div></td>
        `;
		tableBody.appendChild(row);
	});
}

// 空白與文字null 轉空值
function checkNull(value) {
    // 檢查 value 是否為空字符串或 "null"，如果是則返回 null，否則返回原值
    return (value === "" || value.toLowerCase() === "null") ? null : value;
}

// 修改全部資訊
function updateFoodData(entryId) {
    const cardIdInput = checkNull(document.getElementsByName(`card_id_${entryId}`)[0].value);
    const employeeIdInput = checkNull(document.getElementsByName(`employee_id_${entryId}`)[0].value);
    const employeeNameInput = checkNull(document.getElementsByName(`employee_name_${entryId}`)[0].value);
    const foodGroupInput = checkNull(document.getElementsByName(`food_group_${entryId}`)[0].value);

	// 製作要發送的資料
    const data = {
        card_id: cardIdInput,
        employee_id: employeeIdInput,
        employee_name: employeeNameInput,
        food_group: foodGroupInput,
    };

	// 發送 POST 請求更新資料
    axios.post(`/api_User/edit/${entryId}`, data)
        .then(response => {
            console.log('已更新人員資料');
        })
        .catch(error => {
            console.error('更新人員資料時發生錯誤:', error);
        });
}

// 修改所有人全部資訊 (迴圈)
function updateAllFoodData() {
    const rows = document.querySelectorAll('#table-body tr');
    rows.forEach(row => {
        const entryId = row.querySelector('td').innerText;
        updateFoodData(entryId);
    });
    Updata_OK()
}

// 更新成功
function Updata_OK() {
	Swal.fire({
		icon: 'success',
		title: '更新成功',
		showConfirmButton: false,
		timer: 1000
	})
}


// ---------新版的新增行---------
// 新增一行按鈕 DOM端
function addNewRow() {
    const tableBody = document.getElementById('table-body');
    const lastRow = tableBody.lastElementChild;
    const lastId = parseInt(lastRow.querySelector('td').innerText);
    const newRowId = lastId + 1;

    const newRow = document.createElement('tr');
    newRow.id = `row-${newRowId}`; //加入ID用於動態刪除
    newRow.innerHTML = `
        <td class="ID">${newRowId}</td>
        <td><input type="text" name="card_id_${newRowId}" value=""></td>
        <td><input type="text" name="employee_id_${newRowId}" value=""></td>
        <td><input type="text" name="employee_name_${newRowId}" value=""></td>
        <td><input type="text" name="food_group_${newRowId}" value=""></td>
        <td class="action"><div class="actionBtn"><i class="fa fa-pencil-square-o" aria-hidden="true" onclick="updateFoodData(${newRowId})"></i><i class="fa fa-times-circle-o" aria-hidden="true" onclick="deleteRow(${newRowId})"></i></div></td>
    `;

    tableBody.appendChild(newRow);
    
    // 調用 Post Function
    saveRowData(newRowId);
}
// 新增一行按鈕 Post端
function saveRowData(newRowId) {
    const cardId = null;
    const employeeId = null;
    const employeeName = null;
    const foodGroup = null;

    const data = {
        card_id: cardId,
        employee_id: employeeId,
        employee_name: employeeName,
        food_group: foodGroup,
    };

    axios.post(`/api_User/add_new_row`, data)
        .then(response => {
            nextInput() // 刷新 換行Input
            console.log('已新增人員資料');
        })
        .catch(error => {
            console.error('新增人員資料時發生錯誤:', error);
        });
}


function deleteRow(entryId) {
    // 發送 DELETE 請求以刪除行
    axios.delete(`/api_User/delete/${entryId}`)
        .then(response => {
            console.log('已刪除人員資料');
            // 刪除對應的DOM元素
            const rowToRemove = document.getElementById(`row-${entryId}`);
            if (rowToRemove) {
                rowToRemove.remove();
            } else {
                console.error(`無法找到要刪除的行: ${entryId}`);
            }
        })
        .catch(error => {
            console.error('刪除人員資料時發生錯誤:', error);
        });
}


// 按下 Enter 可以換下一個 Input
function nextInput() {
    // 獲取所有表格中的輸入框
    let inputFields = document.querySelectorAll('table input[type="text"]');
    // 為每個輸入框添加事件監聽器
    inputFields.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
            event.preventDefault();
            // 獲取下一個輸入框
            let nextInput = inputFields[index + 1];
            if (nextInput) {
                // 將焦點設置到下一個輸入框
                nextInput.focus();
            }
            }
        });
    });
}



// 下載 User 資料
function downloadDB() {
    // 創建一個虛擬的<a>標簽
    let link = document.createElement("a");
    link.href = "/download/database_User.db"; // 下載資料庫文件的URL
    link.download = "database_User.db"; // 設置下載文件的名稱
    link.style.display = "none"; // 隱藏鏈接元素
  
    // 模擬用戶單擊<a>標簽以觸發下載
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// TOP按鈕
$('.top-btn i').click(function (e) { 
    e.preventDefault();
    $('html,body').animate({
        scrollTop: 0
    },350);
});