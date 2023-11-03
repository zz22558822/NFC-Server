# 取得目錄路徑
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 執行Add_Excel_Data
gnome-terminal -- python3 "$DIR/Add_Excel_Data.py"

# 執行User_Group
gnome-terminal -- python3 "$DIR/User_Group.py"

# 執行User_Group
gnome-terminal -- python3 "$DIR/Backup_SQL.py"

# 執行Flask後端
gnome-terminal -- python3 "$DIR/myapp.py"