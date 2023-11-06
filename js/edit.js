// 確保資料載入後再顯示
window.onload = function() {
	// 使用API調用
	axios.get('/api')
		.then(response => {
			const entries = response.data;
			// 將表格填充為載入的資料
			populateTable(entries);
            nextInput() // 刷新 換行Input
		})
        .then(() => {
            handleArrowKeys(); // 方向鍵焦點移動
            //handleCtrlArrowKeys(); // Ctrl + 方向鍵焦點移動
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
			<td><input type="text" name="date_${entry['id']}" value="${entry['date'] !== null ? entry['date'] : ''}"></td>
			<td><input type="text" name="employee_id_${entry['id']}" value="${entry['employee_id'] !== null ? entry['employee_id'] : ''}"></td>
			<td><input type="text" name="employee_name_${entry['id']}" value="${entry['employee_name'] !== null ? entry['employee_name'] : ''}"></td>
			<td><input type="text" name="meat_quantity_${entry['id']}" value="${entry['meat_quantity'] !== null ? entry['meat_quantity'] : ''}"></td>
			<td><input type="text" name="vegetarian_quantity_${entry['id']}" value="${entry['vegetarian_quantity'] !== null ? entry['vegetarian_quantity'] : ''}"></td>
			<td><input type="text" name="food_group_${entry['id']}" value="${entry['food_group'] !== null ? entry['food_group'] : ''}"></td>
			<td><input type="text" name="food_take_${entry['id']}" value="${entry['food_take'] !== null ? entry['food_take'] : ''}"></td>
			<td class="action"><div class="actionBtn"><i class="fa fa-pencil-square-o" aria-hidden="true" onclick="updateFoodData('${entry['id']}')"></i><i class="fa fa-times-circle-o" aria-hidden="true" onclick="deleteRow('${entry['id']}')"></i></div></td>
        `;
		tableBody.appendChild(row);
	});
}

// 修改領餐資訊
function updateFoodData(entryId) {
	const newFoodTakeInput = document.getElementsByName(`food_take_${entryId}`)[0];
	let newFoodTake = newFoodTakeInput.value;

	// 如果 newFoodTake 是空白或 'null'，將其設為 null
	if (newFoodTake.trim() == '' || newFoodTake.toLowerCase() == 'null') {
		newFoodTake = null;
	}
	// 製作要發送的資料
	const data = {
		food_take: newFoodTake
	};

	// 發送 POST 請求更新資料
	axios.post(`/api/update_food_take/${entryId}`, data)
		.then(response => {
			console.log('已更新領餐');
		})
		.catch(error => {
			console.error('領餐時發生錯誤:', error);
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
    const dateInput = checkNull(document.getElementsByName(`date_${entryId}`)[0].value);
    const employeeIdInput = checkNull(document.getElementsByName(`employee_id_${entryId}`)[0].value);
    const employeeNameInput = checkNull(document.getElementsByName(`employee_name_${entryId}`)[0].value);
    const meatQuantityInput = checkNull(document.getElementsByName(`meat_quantity_${entryId}`)[0].value);
    const vegetarianQuantityInput = checkNull(document.getElementsByName(`vegetarian_quantity_${entryId}`)[0].value);
    const foodGroupInput = checkNull(document.getElementsByName(`food_group_${entryId}`)[0].value);
    const foodTakeInput = checkNull(document.getElementsByName(`food_take_${entryId}`)[0].value);

	// 製作要發送的資料
    const data = {
        card_id: cardIdInput,
        date: dateInput,
        employee_id: employeeIdInput,
        employee_name: employeeNameInput,
        meat_quantity: meatQuantityInput,
        vegetarian_quantity: vegetarianQuantityInput,
        food_group: foodGroupInput,
        food_take: foodTakeInput
    };

	// 發送 POST 請求更新資料
    axios.post(`/api/edit/${entryId}`, data)
        .then(response => {
            console.log('已更新食物資料');
        })
        .catch(error => {
            console.error('更新食物資料時發生錯誤:', error);
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


// // ---------舊版的新增行 尚未解決 undefined渲染順序問題---------
// // 新增一行
// function addNewRow() {
//     axios.post('/api/add_new_row')
//         .then(response => {
//             console.log('已新增一行:', response.data);
//             const newRow = createTableRow(response.data.id);  // 創建新行
//             const tableBody = document.getElementById('table-body');
//             tableBody.appendChild(newRow);  // 將新行添加到表格
//         })
//         .catch(error => {
//             console.error('新增一行時錯誤:', error);
//         });
// }
// function createTableRow(id) {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//         <td>${id}</td>
//         <td><input type="text" name="card_id_${id}" value=""></td>
//         <td><input type="text" name="date_${id}" value=""></td>
//         <td><input type="text" name="employee_id_${id}" value=""></td>
//         <td><input type="text" name="employee_name_${id}" value=""></td>
//         <td><input type="text" name="meat_quantity_${id}" value=""></td>
//         <td><input type="text" name="vegetarian_quantity_${id}" value=""></td>
//         <td><input type="text" name="food_group_${id}" value=""></td>
//         <td><input type="text" name="food_take_${id}" value=""></td>
//         <td><button onclick="updateFoodData('${id}')">修改</button></td>
//         <td><button onclick="deleteRow('${id}')">刪除</button></td>
//     `;
//     return row;
// }

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
        <td><input type="text" name="date_${newRowId}" value=""></td>
        <td><input type="text" name="employee_id_${newRowId}" value=""></td>
        <td><input type="text" name="employee_name_${newRowId}" value=""></td>
        <td><input type="text" name="meat_quantity_${newRowId}" value=""></td>
        <td><input type="text" name="vegetarian_quantity_${newRowId}" value=""></td>
        <td><input type="text" name="food_group_${newRowId}" value=""></td>
        <td><input type="text" name="food_take_${newRowId}" value=""></td>
        <td class="action"><div class="actionBtn"><i class="fa fa-pencil-square-o" aria-hidden="true" onclick="updateFoodData(${newRowId})"></i><i class="fa fa-times-circle-o" aria-hidden="true" onclick="deleteRow(${newRowId})"></i></div></td>
    `;

    tableBody.appendChild(newRow);
    
    // 調用 Post Function
    saveRowData(newRowId);
}
// 新增一行按鈕 Post端
function saveRowData(newRowId) {
    const cardId = null;
    const date = null;
    const employeeId = null;
    const employeeName = null;
    const meatQuantity = null;
    const vegetarianQuantity = null;
    const foodGroup = null;
    const foodTake = null;

    const data = {
        card_id: cardId,
        date: date,
        employee_id: employeeId,
        employee_name: employeeName,
        meat_quantity: meatQuantity,
        vegetarian_quantity: vegetarianQuantity,
        food_group: foodGroup,
        food_take: foodTake
    };

    axios.post(`/api/add_new_row`, data)
        .then(response => {
            nextInput() // 刷新 換行Input
            console.log('已新增食物資料');
        })
        .then(() => {
            updataArrowKeys(); // 刷新焦點
        })
        .catch(error => {
            console.error('新增食物資料時發生錯誤:', error);
        });
}


function deleteRow(entryId) {
    // 發送 DELETE 請求以刪除行
    axios.delete(`/api/delete/${entryId}`)
        .then(response => {
            console.log('已刪除食物資料');
            // 刪除對應的DOM元素
            const rowToRemove = document.getElementById(`row-${entryId}`);
            if (rowToRemove) {
                rowToRemove.remove();
            } else {
                console.error(`無法找到要刪除的行: ${entryId}`);
            }
        })
        .catch(error => {
            console.error('刪除食物資料時發生錯誤:', error);
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


// TOP按鈕
$('.top-btn i').click(function (e) { 
    e.preventDefault();
    $('html,body').animate({
        scrollTop: 0
    },350);
});


// 新增資料時刷新表格焦點
function updataArrowKeys() {
    let cells = document.querySelectorAll("input");
    // 設置初始焦點
    cells[cells.length - 1].focus();
    cells[cells.length - 1].blur();

    // 純方向鍵
    cells.forEach((cell, index) => {
        cell.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" && index < cells.length - 1) {
                cells[index + 1].focus();
            } else if (e.key === "ArrowLeft" && index > 0) {
                cells[index - 1].focus();
            } else if (e.key === "ArrowDown") {
                // 修改為觸發"下+右"
                const nextRowCell = cells[index + 8];
                if (nextRowCell) {
                    nextRowCell.focus();
                }
            } else if (e.key === "ArrowUp") {
                // 修改為觸發"上+左"
                const prevRowCell = cells[index - 8];
                if (prevRowCell) {
                    prevRowCell.focus();
                }
            }
        });
    });
}


// 方向鍵移動焦點
function handleArrowKeys() {
    let cells = document.querySelectorAll("input");
    // 設置初始焦點
    cells[0].focus();
    cells[0].blur();
    // 純方向鍵
    cells.forEach((cell, index) => {
        cell.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" && index < cells.length - 1) {
                cells[index + 1].focus();
            } else if (e.key === "ArrowLeft" && index > 0) {
                cells[index - 1].focus();
            } else if (e.key === "ArrowDown") {
                // 修改為觸發"下+右"
                const nextRowCell = cells[index + 8];
                if (nextRowCell) {
                    nextRowCell.focus();
                }
            } else if (e.key === "ArrowUp") {
                // 修改為觸發"上+左"
                const prevRowCell = cells[index - 8];
                if (prevRowCell) {
                    prevRowCell.focus();
                }
            }
        });
    });
}

// Ctrl + 方向鍵移動焦點
function handleCtrlArrowKeys() {
    let cells = document.querySelectorAll("input");
    // 設置初始焦點
    cells[0].focus();
    cells[0].blur();
    // Ctrl + 方向鍵
    cells.forEach((cell, index) => {
        cell.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" && index < cells.length - 1) {
                if (e.ctrlKey) {
                    cells[index + 1].focus();
                }
            } else if (e.key === "ArrowLeft" && index > 0) {
                if (e.ctrlKey) {
                    cells[index - 1].focus();
                }
            } else if (e.key === "ArrowDown") {
                // 修改為觸發"下+右"
                if (e.ctrlKey) {
                    const nextRowCell = cells[index + 8];
                    if (nextRowCell) {
                        nextRowCell.focus();
                    }
                }
            } else if (e.key === "ArrowUp") {
                // 修改為觸發"上+左"
                if (e.ctrlKey) {
                    const prevRowCell = cells[index - 8];
                    if (prevRowCell) {
                        prevRowCell.focus();
                    }
                }
            }
        });
    });
}
