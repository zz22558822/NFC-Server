import openpyxl
import datetime
import sqlite3
import platform

# 定義資料庫名稱
SQL = 'database.db'
# 取得今日日期用於定義數據庫表格名稱、讀取Excel檔名
today = datetime.date.today().strftime("%Y%m%d")

# Excel名稱
excel_file_name = f"{today}_tw10總務訂餐處理.xlsx"

# 當前作業系統
current_os = platform.system()

# 判斷作業系統
if current_os == "Linux":
    # 設置Ubuntu下的文件路徑
    excel_file_path = f"/mnt/smb_mount/A1B/A1BZ/00/人資部/訂餐/歸檔/計價/午餐/{today}_tw10總務訂餐處理.xlsx"
    print(excel_file_path) #DeBug

elif current_os == "Windows":
    # 設置Windows下的文件路徑
    excel_file_path = f"\\\\172.16.1.18\\fs\\A1B\\A1BZ\\00\\人資部\\訂餐\\歸檔\\計價\\午餐\\{today}_tw10總務訂餐處理.xlsx"
    # excel_file_path = r"C:\Users\User\Desktop\20231030_tw10總務訂餐處理.xlsx"
    print(excel_file_path) #DeBug

else:
    print("作業系統無法判斷")



# 讀取Excel文件 - openpyxl
try:
    # 打開Excel文件
    wb = openpyxl.load_workbook(excel_file_path, data_only=True, read_only=True)

    # 選擇要讀取的工作表
    sheet = wb["各部門訂餐明細"]

    # 標記是否是標題行
    is_header = True 

    # 遍歷工作表資料
    for row in sheet.iter_rows(values_only=True):

        # 跳過標題開關 否則會出錯
        if is_header:
            is_header = False  # 第一行是標題行，跳過它
            continue

        # 工號帶入變數
        employee_id = row[1]
        # 名字帶入變數
        employee_name = row[2]
        # 葷食帶入變數
        meat_quantity = int(row[3]) if row[3] is not None else 0  # 長期訂餐
        meat_quantity_add = int(row[8]) if row[8] is not None else 0  # 臨時訂餐
        # 素食帶入變數
        vegetarian_quantity = int(row[4]) if row[4] is not None else 0  # 長期訂餐
        vegetarian_quantity_add = int(row[9]) if row[9] is not None else 0  # 臨時訂餐
        # 本日退訂帶入變數
        cancel = int(row[7]) if row[7] is not None else 0

        # 算法公式 長期+臨時訂餐 - 退訂 = 訂餐數
        meat_quantity_totle = meat_quantity + meat_quantity_add #葷食
        vegetarian_quantity_totle = vegetarian_quantity + vegetarian_quantity_add #素食
        # 如果訂餐數不等於0，則扣除本日退訂
        if meat_quantity_totle != 0:
            meat_quantity_totle -= cancel
        if vegetarian_quantity_totle != 0:
            vegetarian_quantity_totle -= cancel



        # 將日期單元格轉換為字串 DeBug用
        formatted_row = [cell.strftime("%Y-%m-%d") if isinstance(cell, datetime.datetime) else cell for cell in row]
        print(formatted_row)  # 顯示每行資料

        print('工號:',employee_id,' 葷食:', meat_quantity_totle,' 素食:', vegetarian_quantity_totle)

        ##### 這邊為寫入SQL主程序 #####
        # 如果有需領取餐點的話才寫入資料庫當中
        if meat_quantity_totle > 0 or vegetarian_quantity_totle > 0:
            # 連接到數據庫（如果不存在，會創建新的數據庫文件）
            conn = sqlite3.connect(SQL)
            cursor = conn.cursor()
            # 定義資料表名稱 並建立
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
            data_to_insert = (today, employee_id, employee_name, meat_quantity_totle, vegetarian_quantity_totle)
            cursor.execute(f"INSERT INTO {table_name} (date, employee_id, employee_name, meat_quantity, vegetarian_quantity) VALUES (?, ?, ?, ?, ?)",
                        data_to_insert)
            
            # 提交更改並關閉連接
            conn.commit()
            conn.close()
        
        else :
            print(employee_id,'沒有餐點')



except FileNotFoundError:
    print(f"找不到Excel: {excel_file_name}")
except Exception as e:
    print(f"讀取Excel時出錯: {str(e)}")