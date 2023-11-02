import sqlite3
import datetime


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