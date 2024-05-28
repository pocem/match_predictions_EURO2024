import mysql.connector
from flask import Flask, request, session, jsonify, render_template
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from flask_cors import CORS, cross_origin
from flask_session import Session

from itertools import islice


import time
from selenium import webdriver
from selenium.webdriver.common.by import By



mydb = mysql.connector.connect(host="localhost", user="root", passwd="grepolismiso21", database="euro")

myCursor = mydb.cursor()
app = Flask(__name__)
with open('./.env', 'r') as file:
    SECRET_KEY = file.read().strip()

app.secret_key = SECRET_KEY
SESSION_TYPE = "filesystem"
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
app.config.from_object(__name__)
login_manager = LoginManager(app)
Session(app)
CORS(app, supports_credentials=True)

# SIGNUP--------------------------------------------------
def signup(name, password, age, supportingTeam):
    # Check if the entered name already exists in the database
    check_name_query = "SELECT name FROM player WHERE name = %s"
    myCursor.execute(check_name_query, (name,))
    existing_name = myCursor.fetchone()

    if existing_name is not None:
        print("Name already exists in the database.")
        return {"error": "Name already exists"}, 400

    # Insert the signup credentials into the player table
    insert_player_query = "INSERT INTO player (name, password_) VALUES (%s, %s)"
    val = (name, password)
    myCursor.execute(insert_player_query, val)
    mydb.commit()

    # Insert the player into the top_charts table with 0 points
    insert_top_charts_query = "INSERT INTO top_charts (name, age, supporting, points) VALUES (%s, %s, %s, %s)"
    val = (name, age, supportingTeam, 0)
    myCursor.execute(insert_top_charts_query, val)
    mydb.commit()

    print("Signup successful!")
    return {"message": "Signup successful"}, 200




# LOGIN---------------------------------------------
def login(name, password):
    print(name)
    try:
        # Execute a SQL query to check login credentials
        sql = "SELECT password_ FROM player WHERE name = %s"
        myCursor.execute(sql, (name,))
        result = myCursor.fetchone()
        print(result)

        # Check if a row was returned and if the provided password matches the stored password
        if result:
            if result[0] == password:
                print("Login successful!")
                return {"message": "Login successful"}
            else:
                print("Incorrect password. Please try again.")
                return {"message": "Incorrect password"}
        else:
            print("Name not found. Please check your credentials or sign up.")
            return {"message": "Name not found"}
    except Exception as e:
        print("An error occurred while querying the database:", e)
        return {"message": "An error occurred while querying the database"}



# storing all info about the player in a dictionary
player_credentials = {}

myCursor.execute("SELECT name, password_ FROM player")
signup_data = myCursor.fetchall()

for name, password in signup_data:
    player_credentials[name] = {'password': password}

class User(UserMixin):
    def __init__(self, name, password):
        self.name = name
        self.password = password

    @staticmethod
    def get(name):
        # Retrieve user from the database based on name
        # Return user object if found, otherwise return None
        user_data_query = "SELECT password_ FROM player WHERE name = %s"
        myCursor.execute(user_data_query, (name,))
        user_password = myCursor.fetchone()
        if user_password:
            return User(name, user_password[0])  # Return User object with password
        else:
            return None
    def get_id(self):
        return self.name

# Function to retrieve matches from the database
def get_matches():
    myCursor.execute("SELECT match_id, home_team_score, away_team_score FROM match_predictions")
    return myCursor.fetchall()

player_predictions = []
def get_predictions(data):
    predictions = []

    name = session.get("username")
    if not name:
        print("No player name found in session")
        return False

    print("Session name:", name)
    print(data)

    # Get the current maximum match_id for this player
    myCursor.execute("SELECT MAX(match_id) FROM player_predictions WHERE name = %s", (name,))
    max_match_id = myCursor.fetchone()[0] or 0

    # Set initial match_id for the player
    match_id = max_match_id + 1

    # Iterate over the prediction data and insert each prediction into the database
    for match in data:
        home_score = match.get("homeScore")
        away_score = match.get("awayScore")

        if home_score is None or away_score is None:
            print("Incomplete match data:", match)
            continue

        # Ensure the scores are numeric
       
        try:
            insert_query = "INSERT INTO player_predictions (name, match_id, home_score, away_score) VALUES (%s, %s, %s, %s)"
            val = (name, match_id, home_score, away_score)

            myCursor.execute(insert_query, val)

            predictions.append((match_id, home_score, away_score))
            match_id += 1  # Increment match_id for the next prediction
        except Exception as e:
            print("Error inserting prediction:", e)
            continue

    mydb.commit()
    player_predictions.extend(predictions)


    return player_predictions



# TOP CHARTS ----------------------------------
def top_charts():
    # Fetch player credentials to include age and supporting_team from top_charts
    myCursor.execute("SELECT name, age, supporting, points FROM top_charts")
    players = myCursor.fetchall()

    player_credentials = {}
    for name, age, supporting_team, points in players:
        player_credentials[name] = {
            'age': age,
            'supporting_team': supporting_team,
            'points': points
        }

    # Sort players by points (descending order)
    sorted_players = sorted(player_credentials.items(), key=lambda x: x[1].get('points', 0), reverse=True)

    # List to store top players data
    top_players_data = []

    # Assign ranks and update the database
    rank = 1
    for name, player_data in sorted_players:
        # Add rank to player info
        player_info = {k: v for k, v in player_data.items()}
        player_info['rank_'] = rank

        # Update player information in the database
        update_query = """
            
            UPDATE top_charts 
            SET rank_ = %s
            WHERE name = %s
        """
        val = (rank, name)
        myCursor.execute(update_query, val)
        mydb.commit()

        # Append player information to top players data list
        top_players_data.append(player_info)

        # Increment rank for the next player
        rank += 1

    # Return the top players data
    return top_players_data




def get_top_charts_data():
    try:
        myCursor.execute("SELECT rank_, name, age, supporting, points FROM top_charts ORDER BY rank_ ASC")
        result = myCursor.fetchall()
        top_charts_data = []

        for row in result:
            rank_, name, age, supporting, points = row
            top_charts_data.append({
                "rank": rank_,
                "name": name,
                "age": age,
                "supporting_team": supporting,
                "points": points
            })

        return top_charts_data
    except Exception as e:
        print("An error occurred while querying the top_charts database:", e)
        return []



# check the predictions with real outcomes --- WEBSCRAPING/API
def fetch_match_results():
    try:
        driver = webdriver.Chrome()
        driver.get("https://www.flashscore.com/football/uzbekistan/pro-liga/#/l00sNjki/table/overall")
        score_home_elements = driver.find_elements(By.CLASS_NAME, "event__score--home")
        score_away_elements = driver.find_elements(By.CLASS_NAME, "event__score--away")
        match_data = []

        for index, (home_element, away_element) in enumerate(islice(zip(score_home_elements, score_away_elements), 4), start=1):
            home_score = home_element.text
            away_score = away_element.text

            if not home_score.isdigit() or not away_score.isdigit():
                continue

            match_data.append((index, int(home_score), int(away_score)))  # Convert scores to integers

        driver.quit()
        print("Fetched matchdata: ", match_data)
        return match_data
    except Exception as e:
        if 'driver' in locals():
            driver.quit()
        print(f"Error fetching match results: {e}")
        return []

def periodic_fetch():
    while True:
        match_data = fetch_match_results()

        if match_data:
            print("matchdata: ",match_data)
            insert_query = "UPDATE match_predictions SET home_team_score = %s, away_team_score = %s WHERE match_id = %s"

            try:
                myCursor.executemany(insert_query,[(home_score, away_score, match_id) for match_id, home_score, away_score in match_data])
                mydb.commit()
            except Exception as e:
                print("Error inserting match dataaa:", e)

            if all(isinstance(home_score, int) and isinstance(away_score, int) for _, home_score, away_score in match_data):
                evaluate_predictions(match_data)
                break

        time.sleep(3600)



# FUNCTION TO EVALUATE PREDICTIONS
def evaluate_predictions(match_data):
    matches = get_matches()
    points = 0

    for match_id, index in enumerate(range(len(matches))):
        home_prediction, away_prediction = player_predictions[match_id][1:2]
        real_score_home, real_score_away = match_data[index][1:2]


        if home_prediction == real_score_home and away_prediction == real_score_away:
            points += 4
        elif home_prediction > away_prediction and real_score_home > real_score_away:
            points += 1
        elif home_prediction < away_prediction and real_score_home < real_score_away:
            points += 1
        elif home_prediction == away_prediction and real_score_home == real_score_away:
            points += 2

# showing the live match results--------------------------
def match_results_shown():
    myCursor.execute("SELECT match_id, home_team_score, away_team_score FROM match_predictions")
    latest_match_data = myCursor.fetchall()
    return latest_match_data


# API-------------------------------------------------------------------
# GET live match results on the site
@app.route('/match_results')
def get_match_results():
    latest_match_data = match_results_shown()
    return jsonify(latest_match_data)

# GET all the matches
@app.route('/matches')
def matches():
    print("hit")
    return get_matches()

# SIGNUP POST to the database from user
@app.route('/signup', methods=['POST'])
def signup_web():
    data = request.get_json()  # Get JSON data from the request body
    # Access individual fields from the JSON data
    print("Received signup data:", data)
    name = data.get('name')
    password = data.get('password')
    age = data.get('age')
    supporting_team = data.get('team')

    message,status_code = signup(name, password, age, supporting_team)


    return jsonify(message), status_code


# LOGIN POST to check if the user exists
@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login_web():
    data = request.get_json()  # Get JSON data from the request body
    print("Received login data:", data)  # Log received data for debugging
    name = data.get('name')
    password = data.get('password')

    user = User.get(name)  # Retrieve user from the database

    if user and user.password == password:
        # Login successful, authenticate the user and start session
        login_user(user)
        session["username"] = user.name
        session.modified = True
        print("User", session["username"], "logged in.")
        print("Session name login:", name)


        return jsonify({"message": "Login successful"}), 200,  # Send HTTP status code 200 (OK) for success
    else:
        return jsonify(
            {"message": "Incorrect username or password"}), 401  # Send HTTP status code 401 (Unauthorized) for failure

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.route('/protected')
@login_required
def protected():
    return 'Protected view'

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return 'Logged out successfully'

# POST sending user's predictions to backend
@app.route('/predictions', methods=['POST'])
@cross_origin(supports_credentials=True)
def predictions():
    data = request.get_json()

    name = session.get('_user_id')

    print("session name:", name)
    if name:

        success = get_predictions(data)
        if success:
            print("Predictions saved.")
            return jsonify({"message": "Predictions saved."}),200
        else:
            print("No player name provided. No success")
            return jsonify({"error": "No player name provided."}), 500
    else:
        print("No player name provided in session")
        return jsonify({"error": "No player name provided."}), 400

# GET method for posting the players' leaderboard online
@app.route('/leaderboard')
@cross_origin(supports_credentials=True)
def get_top_charts():

    return jsonify(get_top_charts_data())

# Run the Flask application
if __name__ == '__main__':
    periodic_fetch()
    app.run(debug=True)