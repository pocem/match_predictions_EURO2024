import bcrypt
import mysql.connector
from flask import Flask, request, session, jsonify, send_from_directory
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from flask_cors import CORS, cross_origin
from flask_session import Session
import threading
import os
from dotenv import load_dotenv

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from itertools import islice


app = Flask(__name__, static_folder='Frontend/React/build', static_url_path='/')

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

load_dotenv()

host =  os.getenv("HOST")
user = os.getenv("USER")
password = os.getenv("PASSWORD")
database = os.getenv("DATABASE")

secret_key = os.getenv("SECRET_KEY")

db_config = {
    'host': host,
    'user': user,
    'password': password,
    'database': database,
    'port': 3306
}
mydb = mysql.connector.connect(**db_config)
myCursor = mydb.cursor()
app = Flask(__name__)

app.secret_key = secret_key
SESSION_TYPE = "filesystem"
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
app.config.from_object(__name__)
login_manager = LoginManager(app)
Session(app)
CORS(app, supports_credentials=True)

# SIGNUP--------------------------------------------------
def signup(name, password, age, supportingTeam):
    check_name_query = "SELECT name FROM player WHERE name = %s"
    myCursor.execute(check_name_query, (name,))
    existing_name = myCursor.fetchone()
    if existing_name is not None:
        print("Name already exists in the database.")
        return {"error": "Name already exists"}, 400

    insert_player_query = "INSERT INTO player (name, password_) VALUES (%s, %s)"
    val = (name, password)
    myCursor.execute(insert_player_query, val)
    mydb.commit()

    insert_top_charts_query = "INSERT INTO top_charts (name, age, supporting, points) VALUES (%s, %s, %s, %s)"
    val = (name, age, supportingTeam, 0)
    myCursor.execute(insert_top_charts_query, val)
    mydb.commit()

    print("Signup successful!")
    return {"message": "Signup successful"}, 200



# LOGIN---------------------------------------------
class User(UserMixin):
    def __init__(self, name, password):
        self.name = name
        self.password = password

    @staticmethod
    def get(name):
        try:
            user_data_query = "SELECT password_ FROM player WHERE name = %s"
            myCursor.execute(user_data_query, (name,))
            user_password = myCursor.fetchone()
            if user_password:
                print(f"User found in DB: {name} with password: {user_password[0]}")
                return User(name, user_password[0])
            else:
                print(f"User {name} not found in DB")
                return None
        except Exception as e:
            print(f"Error querying user {name} from DB: {e}")
            return None

    def get_id(self):
        return self.name
def get_matches():
    myCursor.execute("SELECT match_id, home_team_score, away_team_score FROM match_predictions")
    return myCursor.fetchall()

def fetch_player_predictions(username):
    try:
        query = """
            SELECT match_id, home_score, away_score 
            FROM player_predictions 
            WHERE name = %s 
            ORDER BY match_id ASC
        """
        myCursor.execute(query, (username,))
        predictions = myCursor.fetchall()
        return predictions
    except Exception as e:
        print(f"An error occurred while fetching predictions for {username}: {e}")
        return []


player_predictions = []

def get_predictions(data):
    global player_predictions
    predictions = []

    name = session.get("username")
    if not name:
        print("No player name found in session")
        return False

    print("Session name:", name)
    print("Received data:", data)

    player_predictions = fetch_player_predictions(name)
    max_match_id = player_predictions[-1][0] if player_predictions else 0
    match_id = max_match_id + 1

    for match in data:
        match_id = match.get("match_id")
        home_score = match.get("homeScore")
        away_score = match.get("awayScore")

        if match_id is None or home_score is None or away_score is None:
            print("Incomplete match data:", match)
            continue

        try:
            insert_query = "INSERT INTO player_predictions (name, match_id, home_score, away_score) VALUES (%s, %s, %s, %s)"
            val = (name, match_id, home_score, away_score)
            myCursor.execute(insert_query, val)

            predictions.append((match_id, home_score, away_score))
        except Exception as e:
            print("Error inserting prediction:", e)
            continue

    mydb.commit()
    player_predictions.extend(predictions)
    print("Predictions added:", player_predictions)
    return player_predictions


def top_charts():
    myCursor.execute("SELECT name, age, supporting, points FROM top_charts")
    players = myCursor.fetchall()

    player_credentials = {}
    for name, age, supporting_team, points in players:
        player_credentials[name] = {
            'age': age,
            'supporting_team': supporting_team,
            'points': points
        }

    sorted_players = sorted(player_credentials.items(), key=lambda x: x[1].get('points', 0), reverse=True)

    top_players_data = []
    rank = 1
    for name, player_data in sorted_players:
        player_info = {k: v for k, v in player_data.items()}
        player_info['rank_'] = rank

        update_query = """
            UPDATE top_charts 
            SET rank_ = %s
            WHERE name = %s
        """
        val = (rank, name)
        myCursor.execute(update_query, val)
        mydb.commit()

        top_players_data.append(player_info)
        rank += 1

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

#RETURNS A LIST OF MATCH RESULTS FROM WEB WITH EACH HAVING MATCH_ID, HOME SCORE AND AWAY SCORE
def fetch_match_results():
    try:
        # Set up Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Ensure GUI is off
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920x1080")

        # Initialize the Chrome driver
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

        driver.get("https://www.flashscore.com/football/europe/euro/results/")
        score_home_elements = driver.find_elements(By.CLASS_NAME, "event__score--home")
        score_away_elements = driver.find_elements(By.CLASS_NAME, "event__score--away")

        match_data = []

        for index, (home_element, away_element) in enumerate(islice(zip(score_home_elements, score_away_elements), 36),
                                                             start=1):
            home_score = home_element.text
            away_score = away_element.text

            if not home_score.isdigit() or not away_score.isdigit():
                continue

            match_data.append((index, int(home_score), int(away_score)))

        driver.quit()
        print("Fetched matchdata: ", match_data)
        return match_data
    except Exception as e:
        if 'driver' in locals():
            driver.quit()
        print(f"Error fetching match results: {e}")
        return []

def periodic_fetch():
    match_data = fetch_match_results()

    if match_data:
        print(f"Match data for: ", match_data)
        insert_query = "UPDATE match_predictions SET home_team_score = %s, away_team_score = %s WHERE match_id = %s"

        try:
            myCursor.executemany(insert_query, [(home_score, away_score, match_id) for match_id, home_score, away_score in match_data])
            mydb.commit()
        except Exception as e:
            print("Error inserting match data:", e)

    evaluate_predictions(match_data)
    # Sleep for an hour before fetching again



#UPDATING TOP CHART TABLE WITH POINTS FOR EACH PLAYER BASED ON THEIR PREDICTION ACCURACY
def evaluate_predictions(match_data):
    try:
        # Fetch player predictions from the database
        myCursor.execute("SELECT * FROM player_predictions")
        result = myCursor.fetchall()
        print(result)

        # Organize player predictions by player and match_id
        player_predictions = {}
        for row in result:
            player, match_id, home_prediction, away_prediction = row
            if player not in player_predictions:
                player_predictions[player] = {}
            player_predictions[player][match_id] = (home_prediction, away_prediction)

        # Initialize a dictionary to store points for each player
        player_points = {player: 0 for player in player_predictions}

        # Compare match data with player predictions and calculate points
        for match in match_data:
            match_id, real_score_home, real_score_away = match

            for player, predictions in player_predictions.items():
                if match_id in predictions:
                    home_prediction, away_prediction = predictions[match_id]

                    if home_prediction == real_score_home and away_prediction == real_score_away:
                        player_points[player] += 4
                    elif home_prediction > away_prediction and real_score_home > real_score_away:
                        player_points[player] += 1
                    elif home_prediction < away_prediction and real_score_home < real_score_away:
                        player_points[player] += 1
                    elif home_prediction == away_prediction and real_score_home == real_score_away:
                        player_points[player] += 2

        # Fetch and sort the top charts data by points
        sorted_results = sorted(player_points.items(), key=lambda x: x[1], reverse=True)
        print("Sorted top charts data:", sorted_results)

        # Update the points and rank in the top_charts table for each player
        for rank, (player, points) in enumerate(sorted_results, start=1):
            try:
                update_query = "UPDATE top_charts SET rank_ = %s, points = %s WHERE name = %s"
                myCursor.execute(update_query, (rank, points, player))
                mydb.commit()
                print(f"Updated {player}: rank {rank}, points {points}")
            except Exception as e:
                print(f"Error updating rank and points for {player}: {e}")

    except Exception as e:
        print(f"Error evaluating predictions: {e}")

def match_results_shown():
    myCursor.execute("SELECT match_id, home_team_score, away_team_score FROM match_predictions")
    latest_match_data = myCursor.fetchall()
    return latest_match_data

@app.route('/match_results')
def get_match_results():
    latest_match_data = match_results_shown()
    return jsonify(latest_match_data)

@app.route('/matches')
def matches():
    print("hit")
    return get_matches()


@app.route('/signup', methods=['POST'])
@cross_origin(supports_credentials=True)
def signup_route():
    data = request.get_json()
    name = data.get('name')
    password = data.get('password')
    age = data.get('age')
    supportingTeam = data.get('team')

    if not name or not password or not age or not supportingTeam:
        return jsonify({"message": "Missing fields"}), 400

    try:
        response = signup(name, password, age, supportingTeam)
        return jsonify(response), 200
    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({"message": "An error occurred during signup"}), 500

@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login_web():
    data = request.get_json()
    print("Received login data:", data)
    name = data.get('name')
    password = data.get('password')


    user = User.get(name)

    if user and user.password == password:
        login_user(user)
        session["username"] = user.name
        session.modified = True
        print("User", session["username"], "logged in.")
        print("Session name login:", name)

        # Call periodic_fetch with the username
        threading.Thread(target=periodic_fetch).start()

        return jsonify(fetch_player_predictions(name)), 200
    else:
        return jsonify({"message": "Incorrect username or password"}), 401
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

@app.route('/predictions', methods=['POST'])
@cross_origin(supports_credentials=True)
def predictions():
    data = request.get_json()
    name = session.get('_user_id')

    print("Session name:", name)
    if name:
        success = get_predictions(data)
        if success:
            print("Predictions saved.")
            return jsonify({"message": "Predictions saved."}), 200
        else:
            print("No player name provided. No success")
            return jsonify({"error": "No player name provided."}), 500
    else:
        print("No player name provided in session")
        return jsonify({"error": "No player name provided."}), 400


@app.route('/predictions', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_saved_predictions():
    name = session.get('username')

    if not name:
        return jsonify({"error": "User not logged in"}), 401

    try:
        predictions = fetch_player_predictions(name)
        result = [
            {"match_id": match_id, "home_score": home_score, "away_score": away_score}
            for match_id, home_score, away_score in predictions
        ]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching predictions: {e}")
        return jsonify({"error": "Failed to fetch predictions"}), 500

@app.route('/leaderboard')
@cross_origin(supports_credentials=True)
def get_leaderboard_data():
    name = session.get("username")
    leaderboard_data = get_top_charts_data()  # Assuming get_top_charts_data() returns your leaderboard data
    return jsonify({
        'leaderboardData': leaderboard_data,
        'loggedInUserName': name
    })

if __name__ == '__main__':
    app.run(debug=True)
