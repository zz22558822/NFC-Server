import sqlite3
import datetime
import schedule
import time
import os

# 程式名稱
program_name, _ = os.path.splitext(os.path.basename(__file__))

# 在程式開始時顯示提示
now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
print(f"{now} - {program_name}已開始運行")

# 寫入資訊主程序
def Run():
    # 定義資料庫名稱
    DataSQL = 'database.db'  # 第一份資料
    UserSQL = 'database_User.db'  # 第二份資料

    # 取得今日日期用於定義數據庫表格名稱
    today = datetime.date.today().strftime("%Y%m%d")

    # 連接到數據庫（如果不存在，會創建新的數據庫文件）
    conn_user = sqlite3.connect(UserSQL)
    cursor_user = conn_user.cursor()

    conn_data = sqlite3.connect(DataSQL)
    cursor_data = conn_data.cursor()

    # 創建數據表，使用今日日期作為表名
    table_name = f'food_{today}'

    # 讀取第一份資料
    cursor_data.execute(f"SELECT ID, date, employee_id, employee_name, card_id, meat_quantity, vegetarian_quantity, food_group, food_take FROM {table_name}")
    data1 = cursor_data.fetchall()

    # 讀取第二份資料
    cursor_user.execute("SELECT ID, employee_id, employee_name, card_id, food_group FROM user_data")
    data2 = cursor_user.fetchall()

    # 顯示讀取的資料
    print("餐點資料:")
    for row in data1:
        print(row)

    print("人員資料:")
    for row in data2:
        print(row)

    # 遍歷第二份資料，對比 employee_id 並更新第一份資料的 card_id 和 food_group
    for row2 in data2:
        employee_id = row2[1]
        card_id = row2[3]
        food_group = row2[4]

        for i, row1 in enumerate(data1):
            if row1[2] == employee_id:
                data1[i] = (row1[0], row1[1], row1[2], row1[3], card_id, row1[5], row1[6], food_group, row1[8])

    # 顯示更新後的資料
    print("更新後資料:")
    for row in data1:
        print(row)

    # 更新第一份資料到 DataSQL 資料庫
    for row in data1:
        cursor_data.execute(f"UPDATE {table_name} SET card_id=?, food_group=? WHERE ID=?", (row[4], row[7], row[0]))
    conn_data.commit()
    print("更新完成。")

    # 關閉連接
    conn_user.close()
    conn_data.close()



# 使用 schedule 模塊設定每日早上10:18後執行 Run 函數
schedule.every().day.at("10:18").do(Run)



# 每分鐘檢查是否達到時間
while True:
    schedule.run_pending()  # 檢查並執行排程任務
    time.sleep(60)  # 每分鐘檢查一次