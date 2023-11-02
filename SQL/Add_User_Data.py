import sqlite3

# 定義資料庫名稱
SQL = 'database_User.db'

# 連接到數據庫（如果不存在，會創建新的數據庫文件）
conn = sqlite3.connect(SQL)

# 創建一個遊標對象
cursor = conn.cursor()

# 創建數據表，使用今日日期作為表名
cursor.execute('''CREATE TABLE IF NOT EXISTS user_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    employee_id TEXT,
                    employee_name TEXT,
                    card_id TEXT,
                    food_group TEXT
                )''')

# 插入數據 (需要否則無法透過網頁新增)
data_to_insert = ('T00001', '測試', '0000000001', 'IT')
cursor.execute(f"INSERT INTO user_data (employee_id, employee_name, card_id, food_group) VALUES (?, ?, ?, ?)",
               data_to_insert)

# 提交更改並關閉連接
conn.commit()
conn.close()
