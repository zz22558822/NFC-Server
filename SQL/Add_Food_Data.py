import sqlite3
import datetime

# 定義資料庫名稱
SQL = 'database.db'

# 取得今日日期用於定義數據庫表格名稱
today = datetime.date.today().strftime("%Y%m%d")

# 連接到數據庫（如果不存在，會創建新的數據庫文件）
conn = sqlite3.connect(SQL)

# 創建一個遊標對象
cursor = conn.cursor()

# 創建數據表，使用今日日期作為表名
table_name = f'food_{today}'
cursor.execute(f'''CREATE TABLE IF NOT EXISTS {table_name} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date DATE,
                    employee_id TEXT,
                    employee_name TEXT,
                    card_id TEXT,
                    meat_quantity INTEGER,
                    vegetarian_quantity INTEGER,
                    food_group TEXT,
                    food_take INTEGER
                )''')

# 插入數據
# data_to_insert = ('2023-10-26', 'T00001', '測試', '0000000001', 7, 1)
# cursor.execute(f"INSERT INTO {table_name} (date, employee_id, employee_name, card_id, meat_quantity, vegetarian_quantity) VALUES (?, ?, ?, ?, ?, ?)",
#                data_to_insert)

# 提交更改並關閉連接
conn.commit()
conn.close()
