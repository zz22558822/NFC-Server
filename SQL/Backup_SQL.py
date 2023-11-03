import schedule
import shutil
import datetime
import time
import os
import re

# 程式名稱
program_name, _ = os.path.splitext(os.path.basename(__file__))

# 在程式開始時顯示提示
now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
print(f"{now} - {program_name}已開始運行")

# 獲取當前程式的絕對路徑
script_path = os.path.dirname(os.path.abspath(__file__))
# 備份的資料庫
source_file = os.path.join(script_path, 'database.db')
# 要轉移的位置
Backup_File = os.path.join(script_path, 'Backup')

# 計算檔案名稱的月份
def database_name(dt):
    # 減去一個月的時間
    if dt.month == 1:
        return dt.replace(year=dt.year - 1, month=12)
    else:
        return dt.replace(month=dt.month - 1)


def move_and_rename_file():
    try:
        # 取得年月
        current_date = datetime.datetime.now()
        
        if current_date.day == 1:
            # 使用自訂函數減去一個月
            previous_month = database_name(current_date)
            year_month = previous_month.strftime('%Y%m')
            
            # 更新的檔案名稱
            new_file_name = f'database_{year_month}.db'

            # 如果資料夾不存在就建立
            if not os.path.exists(Backup_File):
                print(f'目錄 {Backup_File} 不存在，正在創建...')
                os.makedirs(Backup_File)
                print(f'目錄 {Backup_File} 已成功創建')
            
            # 移動並重命名文件
            Backup_path = os.path.join(Backup_File, new_file_name)

            # 檢查是否已經存在相同名稱的檔案
            if os.path.exists(Backup_path):
                base_name, ext = os.path.splitext(new_file_name)
                index = 1
                while True:
                    if re.match(r'.+_v\d+$', base_name):
                        base_name, current_index = base_name.rsplit('_v', 1)
                        current_index = int(current_index)
                        new_index = current_index + 1
                        base_name = f'{base_name}_v{new_index}'
                    else:
                        base_name = f'{base_name}_v1'
                    new_file_name_with_index = f'{base_name}{ext}'
                    Backup_path = os.path.join(Backup_File, new_file_name_with_index)
                    if not os.path.exists(Backup_path):
                        break
                    index += 1

            shutil.move(source_file, Backup_path)
            print(f'已轉移資料庫 - {Backup_path}')
    
    except FileNotFoundError:
        print(f'找不到檔案 {source_file}')

# 安排任務每天運行
schedule.every().day.at('00:00').do(move_and_rename_file)

# 每分鐘檢查一次
while True:
    schedule.run_pending()
    time.sleep(60)