from flask import Flask, jsonify, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

SQL = 'database.db'


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/edit')
def edit_form():
    return render_template('edit.html')

# 定義一個  api 路由
@app.route('/api', methods=['GET'])
def get_food_entries():
    # 連接到數據庫
    conn = sqlite3.connect(SQL)  # 這邊須定義 數據庫的名稱
    cursor = conn.cursor()

    # 查詢所有資料
    cursor.execute("SELECT * FROM food_entries")
    entries = cursor.fetchall()

    # 關閉數據庫連接
    conn.close()

    # 將查詢結果轉化為JSON並返回給前端
    response = [{"id": row[0],  # 第一列是ID
                 "date": row[1],  # 第二列是日期
                 "employee_id": row[2],  # 第三列是員工ID
                 "employee_name": row[3],  # 第四列是員工名稱
                 "card_id": row[4],  # 第五列是卡ID
                 "meat_quantity": row[5],  # 第六列是肉類數量
                 "vegetarian_quantity": row[6],  # 第七列是素食數量
                 "food_group": row[7],  # 第八列是食品組別
                 "food_take": row[8]}  # 第九列是食品是否拿走
                for row in entries]  # 對於查詢結果的每一行，創建一個字典並添加到列表中

    return jsonify(response)  # 將字典轉化為JSON格式並返回給客戶端


# 查詢人員的路由
@app.route('/api/search', methods=['GET'])
def search_food_entries():
    # 獲取搜尋條件（員工名稱或卡ID）
    search_value = request.args.get('search')

    # 連接到數據庫
    conn = sqlite3.connect(SQL)
    cursor = conn.cursor()

    # 使用LIKE運算符進行模糊匹配，並將搜尋條件轉為小寫
    cursor.execute("SELECT * FROM food_entries WHERE LOWER(card_id) LIKE LOWER(?) OR LOWER(employee_id) LIKE LOWER(?)", ('%' + search_value.lower() + '%', '%' + search_value.lower() + '%'))
    entries = cursor.fetchall()

    # 關閉數據庫連接
    conn.close()

    # 將查詢結果轉化為JSON並返回給前端
    response = [{"id": row[0],  # 第一列是ID
                 "date": row[1],  # 第二列是日期
                 "employee_id": row[2],  # 第三列是員工ID
                 "employee_name": row[3],  # 第四列是員工名稱
                 "card_id": row[4],  # 第五列是卡ID
                 "meat_quantity": row[5],  # 第六列是肉類數量
                 "vegetarian_quantity": row[6],  # 第七列是素食數量
                 "food_group": row[7],  # 第八列是食品組別
                 "food_take": row[8]}  # 第九列是食品是否拿走
                for row in entries]

    return jsonify(response)  # 將字典轉化為JSON格式並返回給客戶端

# 查詢食物總數的路由
@app.route('/api/total', methods=['GET'])
def get_total():
    # 連接到數據庫
    conn = sqlite3.connect(SQL)  # 這邊須定義 數據庫的名稱
    cursor = conn.cursor()

    # 查詢所有葷食資料
    cursor.execute("SELECT SUM(meat_quantity) FROM food_entries")
    meat_total = cursor.fetchone()[0] or 0  # 取得總和，如果為None則設為0

    # 查詢所有素食資料
    cursor.execute("SELECT SUM(vegetarian_quantity) FROM food_entries")
    vegan_total = cursor.fetchone()[0] or 0  # 取得總和，如果為None則設為0

    # 關閉數據庫連接
    conn.close()

    # 組織成JSON格式的字典
    response = {
        "meat": meat_total,
        "vegan": vegan_total
    }

    # 將字典轉化為JSON格式並返回給客戶端
    return jsonify(response)


# 查詢拿取食物總數的路由
@app.route('/api/takeTotal', methods=['GET'])
def get_takeTotal():
    # 連接到數據庫
    conn = sqlite3.connect(SQL)  # 這邊須定義數據庫的名稱
    cursor = conn.cursor()

    # 查詢葷食總數
    cursor.execute("SELECT SUM(meat_quantity) FROM food_entries WHERE food_take IS NOT NULL")
    meat_total = cursor.fetchone()[0] or 0  # 取得總和，如果為None則設為0

    # 查詢素食總數
    cursor.execute("SELECT SUM(vegetarian_quantity) FROM food_entries WHERE food_take IS NOT NULL")
    vegan_total = cursor.fetchone()[0] or 0  # 取得總和，如果為None則設為0

    # 關閉數據庫連接
    conn.close()

    # 組織成JSON格式的字典
    response = {
        "meat": meat_total,
        "vegan": vegan_total
    }

    # 將字典轉化為JSON格式並返回給客戶端
    return jsonify(response)


# 刷卡寫入拿取餐點 單人
@app.route('/api/update_food_take', methods=['POST'])
def update_food_take():
    entry_id = request.json.get('entry_id')  # 從POST請求中取得entry_id
    food_take = request.json.get('food_take')  # 從POST請求中取得food_take

    # 連接到數據庫
    conn = sqlite3.connect(SQL)
    cursor = conn.cursor()

    # 更新指定ID的食物資料的food_take欄位
    cursor.execute("UPDATE food_entries SET food_take = ? WHERE id = ?", (food_take, entry_id))
    conn.commit()

    # 關閉數據庫連接
    conn.close()

    return jsonify({"message": "已更新food_take"})





# 預覽拿取食物並寫入 全部
@app.route('/api/edit/<int:id>', methods=['POST'])
def update_food_data(id):
    # 獲取表單提交的食物資料
    card_id = request.json.get('card_id')
    date = request.json.get('date')
    employee_id = request.json.get('employee_id')
    employee_name = request.json.get('employee_name')
    meat_quantity = request.json.get('meat_quantity')
    vegetarian_quantity = request.json.get('vegetarian_quantity')
    food_group = request.json.get('food_group')
    food_take = request.json.get('food_take')

    # 連接到數據庫
    conn = sqlite3.connect(SQL)
    cursor = conn.cursor()

    # 更新指定ID的食物資料
    cursor.execute("UPDATE food_entries SET card_id = ?, date = ?, employee_id = ?, "
                   "employee_name = ?, meat_quantity = ?, vegetarian_quantity = ?, "
                   "food_group = ?, food_take = ? WHERE id = ?",
                   (card_id, date, employee_id, employee_name, meat_quantity,
                    vegetarian_quantity, food_group, food_take, id))
    conn.commit()

    # 關閉數據庫連接
    conn.close()

    return jsonify({"message": "已更新食物資料"})



# 新增一行
@app.route('/api/add_new_row', methods=['POST'])
def add_new_row():
    # 連接到數據庫
    conn = sqlite3.connect(SQL)
    cursor = conn.cursor()

    # 獲取最大ID並加1
    cursor.execute("SELECT MAX(id) FROM food_entries")
    max_id = cursor.fetchone()[0] or 0  # 獲取最大ID，如果為None則設為0
    new_id = max_id + 1

    # 插入新數據
    cursor.execute("INSERT INTO food_entries (id) VALUES (?)", (new_id,))
    conn.commit()

    # 關閉數據庫連接
    conn.close()

    return jsonify({"message": "已新增一行數據"})



# 刪除指定行
@app.route('/api/delete/<int:id>', methods=['DELETE'])
def delete_food_data(id):
    # 连接到数据库
    conn = sqlite3.connect(SQL)
    cursor = conn.cursor()

    # 删除指定ID的食物数据
    cursor.execute("DELETE FROM food_entries WHERE id = ?", (id,))
    conn.commit()

    # 关闭数据库连接
    conn.close()

    return jsonify({"message": "已删除食物資料"})




# 主程序，確保當文件被直接運行時啟動Flask應用程序
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

