// 資料來源
let data
let dataSolo
// 葷 素 總數
let mNum
let vNum
// 葷 素 已拿取
let mNumTake
let vNumTake
// 領餐卡名稱 工號 葷 素 拿取數
let nameGroup
let idGroup
let mGroup = 0
let vGroup = 0


// 宣告輸入框位置
const cradInput = document.getElementById('crad');


// 網頁完成加載後自動選中 輸入框
window.addEventListener('load', function() {

	// 自動選中輸入框
	cradInput.select();

  });

// 全網頁 Enter 自動選中輸入框
document.addEventListener("keydown", function(event) {
if (event.key === "Enter") {

	// 初始選擇整個 input
	cradInput.select();

    // 將光標定位到文字最後面
    cradInput.selectionStart = cradInput.value.length;
    cradInput.selectionEnd = cradInput.value.length;
}
});


// 確認按鈕
document.querySelector(".btn").addEventListener("click", function () {
	
	// 調用主程序
	Run()

});

// 在 Input 輸入框按下 Enter
document.getElementById("crad").addEventListener("keydown", function (e) {
	if (e.key === "Enter") {

		// 調用主程序
		Run()
	}
});



// 整體執行主程序
function Run() {
	// 這邊帶入右方List的方法
	if (cradInput.value.length == 4) {
		// 這邊是輸入工號不加 T0
		console.log('輸入工號 不加 T0');
		cradInput.value = 'T0' + cradInput.value
		//測試抓取SQL
		getOneData(cradInput.value)

	}else if (cradInput.value.length == 5 && cradInput.value[0] == '0') {
		// 這邊是輸入工號不加 T
		console.log('輸入工號 不加 T');
		cradInput.value = 'T' + cradInput.value
		//測試抓取SQL
		getOneData(cradInput.value)

	}else if (cradInput.value.length == 6 && (cradInput.value[0].toUpperCase() === 'T' || cradInput.value[0].toLowerCase() === 't')) {
		// 這邊是輸入工號
		console.log('輸入完整工號');
		//測試抓取SQL
		getOneData(cradInput.value)
		
	}else if (cradInput.value.length == 10) {
		// 這邊是刷卡
		console.log('刷卡成功');
		//測試抓取SQL
		getOneData(cradInput.value)

		
	}else if (cradInput.value.length == 0) {
		// 這邊沒有輸出任何資料
		console.log('沒有輸入資料');
		sweetalert_NO()
		
	}else{
		// 這邊是輸入錯誤或資料庫中沒有此資訊
		console.error('輸入錯誤 或 資料異常');
		sweetalert_error()
	}
	
	// 清空以輸入的值
	cradInput.value = '';
	
}

// 將輸入者的資訊 新增到 nowItem
function addNow(index) {

	// 如果 index 未定義或為 null，設定為 0，並執行單人刷卡
	if (typeof index === 'undefined' || index === null) {
		index = 0;

		const newDuv = `
			<!-- 員工資訊 -->
			<div class="personnel">
				<!-- 工號 -->
				<div class="num box">
					<p>${dataSolo[index].employee_id}</p>
				</div>
				<!-- 名稱 -->
				<div class="name box">
					<p>${dataSolo[index].employee_name}</p>
				</div>
				</div>
				<!-- 食物資訊 -->
				<div class="food">
				<!-- 葷食 -->
				<div class="food_meat box">
					<img src=".//images/meat.svg" draggable="false" alt="meat">
					<p>×</p>
					<p>${dataSolo[index].meat_quantity === null || dataSolo[index].meat_quantity === 'null' ? 0 : dataSolo[index].meat_quantity}</p>
				</div>
				<!-- 素食 -->
				<div class="food_vegan box">
					<img src=".//images/vegan.svg" draggable="false" alt="meat">
					<p>×</p>
					<p>${dataSolo[index].vegetarian_quantity === null || dataSolo[index].vegetarian_quantity === 'null' ? 0 : dataSolo[index].vegetarian_quantity}</p>
				</div>
			</div>
		`
		const infoBox = document.querySelector('.nowItem');
		infoBox.innerHTML = newDuv
	
	} else {

		const newDuv = `
			<!-- 員工資訊 -->
			<div class="personnel">
				<!-- 工號 -->
				<div class="num box">
					<p>${idGroup}</p>
				</div>
				<!-- 名稱 -->
				<div class="name box">
					<p>${nameGroup}</p>
				</div>
				</div>
				<!-- 食物資訊 -->
				<div class="food">
				<!-- 葷食 -->
				<div class="food_meat box">
					<img src=".//images/meat.svg" draggable="false" alt="meat">
					<p>×</p>
					<p>${dataSolo[index].meat_quantity === null || dataSolo[index].meat_quantity === 'null' ? 0 : mGroup}</p>
				</div>
				<!-- 素食 -->
				<div class="food_vegan box">
					<img src=".//images/vegan.svg" draggable="false" alt="meat">
					<p>×</p>
					<p>${dataSolo[index].vegetarian_quantity === null || dataSolo[index].vegetarian_quantity === 'null' ? 0 : vGroup}</p>
				</div>
			</div>
		`
		const infoBox = document.querySelector('.nowItem');
		infoBox.innerHTML = newDuv

	}
	


}


// 將目前資訊新增到 ItemList 當中
function addItme(index) {

  // 如果 index 未定義或為 null，設定為 0
  if (typeof index === 'undefined' || index === null) {
	index = 0;
  }

  const newDiv = `
    <div class="item">
      <!-- 員工資訊 -->
      <div class="personnel">
        <!-- 工號 -->
        <div class="num">
          <p>${dataSolo[index].employee_id}</p>
        </div>
        <!-- 名稱 -->
        <div class="name">
          <p>${dataSolo[index].employee_name}</p>
        </div>
      </div>
      <!-- 食物資訊 -->
      <div class="food">
        <!-- 葷食 -->
        <div class="food_meat">
          <img src="./images/meat.svg" draggable="false" alt="meat">
          <p>×</p>
          <p>${dataSolo[index].meat_quantity === null || dataSolo[index].meat_quantity === 'null' ? 0 : dataSolo[index].meat_quantity}</p>
        </div>
        <!-- 素食 -->
        <div class="food_vegan">
          <img src="./images/vegan.svg" draggable="false" alt="meat">
          <p>×</p>
          <p>${dataSolo[index].vegetarian_quantity === null || dataSolo[index].vegetarian_quantity === 'null' ? 0 : dataSolo[index].vegetarian_quantity}</p>
        </div>
      </div>
    </div>
  `;


  // 滑到最上方
  $('.itemList').animate({
	scrollTop: 0
	},200);

  const container = document.querySelector('.itemList');

  // 使用 insertAdjacentHTML 在容器的最上方插入新的 div
  container.insertAdjacentHTML('afterbegin', newDiv);
}


// 將載入時已領餐 加到右側列表
function addItmeUpdata() {

	for (let i = 0; i < data.length; i++) {
		if (data[i].food_take != null) {
			if (data[i].food_take != 'null') {
				const newDiv = `
				<div class="item">
				  <!-- 員工資訊 -->
				  <div class="personnel">
					<!-- 工號 -->
					<div class="num">
					  <p>${data[i].employee_id}</p>
					</div>
					<!-- 名稱 -->
					<div class="name">
					  <p>${data[i].employee_name}</p>
					</div>
				  </div>
				  <!-- 食物資訊 -->
				  <div class="food">
					<!-- 葷食 -->
					<div class="food_meat">
					  <img src="./images/meat.svg" draggable="false" alt="meat">
					  <p>×</p>
					  <p>${data[i].meat_quantity === null || data[i].meat_quantity === 'null' ? 0 : data[i].meat_quantity}</p>
					</div>
					<!-- 素食 -->
					<div class="food_vegan">
					  <img src="./images/vegan.svg" draggable="false" alt="meat">
					  <p>×</p>
					  <p>${data[i].vegetarian_quantity === null || data[i].vegetarian_quantity === 'null' ? 0 : data[i].vegetarian_quantity}</p>
					</div>
				  </div>
				</div>
				`;
	
				// 滑到最上方
				$('.itemList').animate({
					scrollTop: 0
					},200);
				const container = document.querySelector('.itemList');
				// 使用 insertAdjacentHTML 在容器的最上方插入新的 div
				container.insertAdjacentHTML('afterbegin', newDiv);
			}
		}
		if (data[i].food_take != null) {
			if (data[i].food_take != 'null') {
				const newDuv = `
				<!-- 員工資訊 -->
				<div class="personnel">
					<!-- 工號 -->
					<div class="num box">
						<p>${data[i].employee_id}</p>
					</div>
					<!-- 名稱 -->
					<div class="name box">
						<p>${data[i].employee_name}</p>
					</div>
					</div>
					<!-- 食物資訊 -->
					<div class="food">
					<!-- 葷食 -->
					<div class="food_meat box">
						<img src=".//images/meat.svg" draggable="false" alt="meat">
						<p>×</p>
						<p>${data[i].meat_quantity === null || data[i].meat_quantity === 'null' ? 0 : data[i].meat_quantity}</p>
					</div>
					<!-- 素食 -->
					<div class="food_vegan box">
						<img src=".//images/vegan.svg" draggable="false" alt="meat">
						<p>×</p>
						<p>${data[i].vegetarian_quantity === null || data[i].vegetarian_quantity === 'null' ? 0 : data[i].vegetarian_quantity}</p>
					</div>
				</div>
			`
			const infoBox = document.querySelector('.nowItem');
			infoBox.innerHTML = newDuv
			}
		}
	}
}


// sweetalert2 刷卡成功
function sweetalert_OK(params) {
	Swal.fire({
		icon: 'success',
		title: '領餐成功',
		showConfirmButton: false,
		timer: 1000
	})
}
// sweetalert2 失敗
function sweetalert_error(params) {
	Swal.fire({
		icon: 'error',
		title: '查無此人或資料異常',
		showConfirmButton: false,
		timer: 1000
	})
}
// sweetalert2 沒有資料
function sweetalert_NO(params) {
	Swal.fire({
		icon: 'warning',
		title: '沒有輸入資料',
		showConfirmButton: false,
		timer: 1000
	})
}
// sweetalert2 沒有資料
function sweetalert_repeat(params) {
	Swal.fire({
		icon: 'warning',
		title: '餐點已領取',
		showConfirmButton: false,
		timer: 1000
	})
}



// 數值與圖表種類
let meatChart = {
	// 葷食
	series: [],
	chart: {
		height: 400,
		type: 'radialBar',
	},
	colors: ["#E33B5C"],
	plotOptions: {
		radialBar: {
			hollow: {
				size: '50%',
			},
			dataLabels: {
				name: {
					fontSize: '40px',
					offsetY: -40
				},
				value: {
					fontSize: '40px',
					offsetY: -0,
					color: '#FFF'
				}
			}
		},
	},
	labels: ['葷'],
	
	noData: { // 加載中細部設定
        text: '加載中...',
        align: 'center', // 對齊位置
        offsetX: 20, // X軸偏移
        offsetY: -30, // Y軸偏移
        style: {
            fontSize: '30px',
			color: '#FFF',
        }
    }
};
let veganChart = {
	// 素食
	series: [],
	chart: {
		height: 400,
		type: 'radialBar',
	},
	colors: ["#20E647"],
	plotOptions: {
		radialBar: {
			hollow: {
				size: '50%',
			},
			dataLabels: {
				name: {
					fontSize: '40px',
					offsetY: -40
				},
				value: {
					fontSize: '40px',
					offsetY: -0,
					color: '#FFF'
				}
			}
		},
	},
	labels: ['素'],
	noData: { // 加載中細部設定
        text: '加載中...',
        align: 'center', // 對齊位置
        offsetX: 20, // X軸偏移
        offsetY: -30, // Y軸偏移
        style: {
            fontSize: '30px',
			color: '#FFF',
        }
    }
};

// 定義圖表實體
let meat = new ApexCharts(
	document.querySelector(".meat"),
	meatChart
);
let vegan = new ApexCharts(
	document.querySelector(".vegan"),
	veganChart
);


// 更新圖表資料 參數: 圖表 數量 最大數
function updateChart(chart, newData, max) {
    // 檢查 max 是否為 0，如果是，直接返回 0
    if (max === 0) {
        chart.updateSeries([0]);  // 將 series 資料更新為 0
        return;
    }
    // 確保 newData 是有效數字
    if (isNaN(newData)) {
        console.error('領餐數量異常，請確認資料庫');
        return;
    }

    // 更新資料前 先將轉為%數
    let Num = ((newData * 100) / max).toFixed(0);
    // 更新 series 資料
    chart.updateSeries([Num]);
}






// --------------------(初始化)--------------------
// 初始化 使用 async/await 解決非同步問題
async function init() {

	//取得後端資料
	await  getAllData() //全部資料
	await  getTotal() //取得食物總量
	await  getTakeTotal() //取得已領總數

    //呼叫圖表
	meat.render();
	vegan.render();

	// 呼叫更新圖表方法，將新數據傳遞進去
	updateChart(meat,mNumTake ,mNum); // 更新葷食圖表數據
	updateChart(vegan,vNumTake , vNum); // 更新素食圖表數據

	// 更新圖表
	addItmeUpdata()

	console.log('—————————————————————————————————————————————————————————————————————————————————————————');
}

init();






// --------------------(Axios AJAX 範本)--------------------

// 讀取整體SQL資料，並將資料存入全域變數 data 中
function getAllData() {
    return new Promise((resolve) => {
        axios.get('/api')
            .then(response => {
                let foundData = response.data;
                console.log('總資料: ', foundData);
                data = foundData; // 將資料寫入到全域變數中
                resolve(foundData); // 回傳取得的資料
            })
            .catch(error => {
                console.error('Error:', error);
                // 這邊還須新增視窗顯示 沒有撈取到資料請重新整理
            });
    });
}

// 讀取特定人員的資料 並執行寫入刷卡
function getOneData(name) {
    return new Promise((resolve) => {
        axios.get(`/api/search?search=${name}`)
            .then(function (response) {
                let foundData = response.data;
                if (foundData.length > 0) {
                    // 在這裡顯示資料，或進行你需要的處理
                    console.log('符合的資料:', foundData);
                    dataSolo = foundData; // 將資料寫入到瀏覽器變數中 如果需要再改深層複製
                    if (dataSolo[0].food_take == "" || dataSolo[0].food_take == null) {
                        // 成功的運行步驟
                        submitFoodTake(dataSolo[0].id);
                        addNow(); // 寫入到右側上方欄位 並顯示
                        addItme(); // 寫入到右側下方欄位 並顯示
                        getTakeTotal(); // 重新讀取已領取數量
                        updateChart(meat, mNumTake, mNum); // 更新葷食圖表數據
                        updateChart(vegan, vNumTake, vNum); // 更新素食圖表數據
                        sweetalert_OK(); // 顯示領餐成功
                    } else {
                        // 餐點已領取
                        sweetalert_repeat();
                    }
                } else {
                    console.log('找不到符合的資料');
                    sweetalert_error();
                }

                // 更新已領取數量和圖表 這邊為了解決非同步問題
                getTakeTotal().then(() => {
                	updateChart(meat, mNumTake, mNum);
                	updateChart(vegan, vNumTake, vNum);
                });
                resolve(foundData); // 回傳取得的資料
            })
            .catch(function (error) {
                console.error('搜尋資料時發生錯誤: ', error);
            });
    });
}




// 讀取特定人員的資料 並執行寫入刷卡 群組版   ***********非同步問題待查
function getOneData(name) {
    return new Promise((resolve) => {
        axios.get(`/api/search?search=${name}`)
            .then(function (response) {
                let foundData = response.data;
                if (foundData.length > 0) {
                    console.log('符合的資料:', foundData);

                    if (foundData[0].food_group) {
						// 判斷是否已領餐
						if (foundData[0].food_take == "" || foundData[0].food_take == null) {
							// 如果有群組信息，則调用get_group_members
							getGroupMembers(foundData[0].food_group).then((groupMembers) => {
								console.log('相同群組的人員:', groupMembers);

								// 寫入刷卡人員的名稱
								nameGroup = JSON.parse(JSON.stringify(foundData[0].employee_name))
								idGroup = JSON.parse(JSON.stringify(foundData[0].employee_id))
								// 計算群組拿取的總數
								for (let i = 0; i < groupMembers.length; i++) {
									mGroup += parseInt(groupMembers[i].meat_quantity === null || groupMembers[i].meat_quantity === 'null' ? 0 : groupMembers[i].meat_quantity)
									vGroup += parseInt(groupMembers[i].vegetarian_quantity === null || groupMembers[i].vegetarian_quantity === 'null' ? 0 : groupMembers[i].vegetarian_quantity)
								}

								// 使用 Promise.all 來等待所有人員處理完成
								const promises = groupMembers.map((member) => {
									if (member.food_take == "" || member.food_take == null) {
										// 成功的運行步驟
										return submitFoodTake(member.id);
									} else {
										// 餐點已領取
										return Promise.resolve(); // 返回一個已解析的Promise
									}
								});

								// 使用 Promise.all 來等待所有Promise完成
								Promise.all(promises).then(() => {
									dataSolo = JSON.parse(JSON.stringify(groupMembers)); // 深層複製
									for (let i = 0; i < dataSolo.length; i++) {
										addNow(i); // 寫入到右側上方欄位 並顯示
									}
									for (let i = 0; i < dataSolo.length; i++) {
										addItme(i); // 寫入到右側下方欄位 並顯示
									}

									// 重新讀取已領取數量
									getTakeTotal().then(() => {
										// 更新圖表數據
										updateChart(meat, mNumTake, mNum); // 更新葷食圖表數據
										updateChart(vegan, vNumTake, vNum); // 更新素食圖表數據
									});
									

									sweetalert_OK(); // 顯示領餐成功

									// 重新讀取已領取數量
									getTakeTotal().then(() => {
										// 更新圖表數據
										updateChart(meat, mNumTake, mNum); // 更新葷食圖表數據
										updateChart(vegan, vNumTake, vNum); // 更新素食圖表數據
										console.log('—————————————————————————————————————————————————————————————————————————————————————————');

									});

								}).catch((error) => {
									console.error('處理相同群組人員时发生錯誤:', error);
								});
							}).catch((error) => {
								console.error('查詢相同群組人員时发生錯誤:', error);
							});
						} else {
							// 餐點已領取
							sweetalert_repeat();
						}

                    } else {
                        dataSolo = foundData;
                        if (dataSolo[0].food_take == "" || dataSolo[0].food_take == null) {
                            // 成功的運行步驟
                            submitFoodTake(dataSolo[0].id);
                            addNow(); // 寫入到右側上方欄位 並顯示
                            addItme(); // 寫入到右側下方欄位 並顯示

                            // 重新讀取已領取數量
                            getTakeTotal().then(() => {
                                // 更新圖表數據
                                updateChart(meat, mNumTake, mNum); // 更新葷食圖表數據
                                updateChart(vegan, vNumTake, vNum); // 更新素食圖表數據
                            });
							

                            sweetalert_OK(); // 顯示領餐成功

							// 重新讀取已領取數量
                            getTakeTotal().then(() => {
                                // 更新圖表數據
                                updateChart(meat, mNumTake, mNum); // 更新葷食圖表數據
                                updateChart(vegan, vNumTake, vNum); // 更新素食圖表數據
								console.log('—————————————————————————————————————————————————————————————————————————————————————————');
                            });

                        } else {
                            // 餐點已領取
                            sweetalert_repeat();
                        }
                    }

                } else {
                    console.log('找不到符合的資料');
                    sweetalert_error();
                }

                resolve(foundData);
            })
            .catch(function (error) {
                console.error('搜尋資料时發生錯誤: ', error);
            });
    });
}










// 獲取相同群組的人員
function getGroupMembers(foodGroup) {
    return new Promise((resolve, reject) => {
        axios.get(`/api/get_group_members/${foodGroup}`)
            .then(function (response) {
                const groupMembers = response.data;
                resolve(groupMembers);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}










// 讀取食物總數資料
function getTotal() {
    return new Promise((resolve) => {
        axios.get(`/api/total`)
            .then(function (response) {
                let foundData = response.data;
                mNum = foundData.meat;
                vNum = foundData.vegan;
                console.log('總食物數: ', response.data);
                resolve(foundData); // 回傳取得的資料
            })
            .catch(function (error) {
                console.error('搜尋食物總數錯誤: ', error);
            });
    });
}

// 讀取已拿取食物總數資料
function getTakeTotal() {
    return new Promise((resolve) => {
        axios.get('/api/takeTotal')
            .then(response => {
                let foundData = response.data;
                mNumTake = foundData.meat;
                vNumTake = foundData.vegan;
                console.log('已拿總數: ', response.data);
                resolve(foundData); // 回傳取得的資料
            })
            .catch(error => {
                console.error('搜尋已拿總數錯誤:', error);
            });
    });
}

// 刷卡寫入拿取餐點 單人
function submitFoodTake(entryId) {
    const foodTake = getTime();  // 取得當前時間

    // 要傳送的資料
    const data = {
        entry_id: entryId,
        food_take: foodTake
    };

    // 發送 POST 請求更新food_take
    axios.post(`/api/update_food_take`, data)
        .then(response => {
            //console.log('已更新food_take:', response.data);
        })
        .catch(error => {
            console.error('更新food_take時發生錯誤:', error);
        });
}

// 獲取當前時間 用於刷卡使用
function getTime() {
    //先創建一個Date實體
    let time = new Date();

    timeDetails = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        date: time.getDate(),
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: time.getSeconds(),
        day: time.getDay(),
    };
    return time.toLocaleString();
}


// 補零函式，將小於10的數字補零
function padZero(num) {
    return num < 10 ? '0' + num : num;
}
