import mysql.connector
from flask import Flask, request, session, jsonify, render_template
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from flask_cors import CORS
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
import secrets


secret_key = secrets.token_hex(16)

mydb = mysql.connector.connect(host="localhost", user="root", passwd="grepolismiso21", database="euro")

myCursor = mydb.cursor()
app = Flask(__name__)
app.secret_key = secret_key
login_manager = LoginManager(app)
CORS(app)

# SIGNUP--------------------------------------------------
def signup(name, password, age, supportingTeam):
    # Check if the entered name already exists in the database
    check_name_query = "SELECT name FROM player WHERE name = %s"
    myCursor.execute(check_name_query, (name,))
    existing_name = myCursor.fetchone()

    if existing_name is not None:
        print("Name already exists in the database.")
        return {"error": "Name already exists"}

    # Insert the signup credentials into the database
    insert_query = "INSERT INTO player (name, password_, age, supporting) VALUES (%s, %s, %s, %s)"
    val = (name, password, age, supportingTeam)
    myCursor.execute(insert_query, val)
    mydb.commit()

    print("Signup successful!")
    return {"message": "Signup successful"}

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

myCursor.execute("SELECT name, password_, age, supporting FROM player")
signup_data = myCursor.fetchall()

for name, password, age, supporting_team in signup_data:
    player_credentials[name] = {'password': password, 'age': age, 'supporting_team': supporting_team}

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
    myCursor.execute("SELECT home_team, away_team, match_date FROM match_predictions")
    return myCursor.fetchall()

player_predictions = []
def get_predictions(name, data):
    global player_predictions
    # Iterate over the prediction data and insert each prediction into the database
    for match_id, scores in data.items():
        home_score, away_score = scores  # Extract home and away scores from the tuple
        insert_query = "INSERT INTO player_predictions (name, match_id, home_score, away_score) VALUES (%s, %s, %s, %s)"
        val = (name, match_id, home_score, away_score)
        myCursor.execute(insert_query, val)

        player_predictions.append((match_id, home_score, away_score))
    mydb.commit()

# TOP CHARTS ----------------------------------
def top_charts():
    # Sort players by points (descending order)
    sorted_players = sorted(player_credentials.items(), key=lambda x: x[1]['points'], reverse=True)

    # List to store top players data
    top_players_data = []

    # Assign ranks and insert into database
    rank = 1
    for name, player_data in sorted_players:
        # Copy player data without the 'password' key
        player_info = {k: v for k, v in player_data.items() if k != 'password'}

        # Add rank to player info
        player_info['rank'] = rank

        # Insert player information into the database
        insert_query = "INSERT INTO top_charts (name, age, supporting, points, rank) VALUES (%s, %s, %s, %s, %s)"
        val = (rank, name, player_data['age'], player_data['supporting_team'], player_data['points'])
        myCursor.execute(insert_query, val)
        mydb.commit()

        # Append player information to top players data list
        top_players_data.append(player_info)

        # Increment rank for the next player
        rank += 1

    # Return the top players data
    return top_players_data

# check the predictions with real outcomes --- WEBSCRAPING/API
# while True:
#     try:
#         driver = webdriver.Chrome()
#         # Open the website
#         driver.get("https://www.flashscore.com/football/europe/euro/fixtures/")
#
#         # Find all div elements where the home scores are stored
#         score_home_elements = driver.find_elements(By.CLASS_NAME, "event__score--home")
#         # Find all div elements where the away scores are stored
#         score_away_elements = driver.find_elements(By.CLASS_NAME, "event__score--away")
#
#         # Initialize empty list to store match data
#         match_data = []
#
#         # Loop through the matches and extract the scores
#         for index, (score_home_element, score_away_element) in enumerate(zip(score_home_elements, score_away_elements), start=1):
#             score_home = score_home_element.text
#             score_away = score_away_element.text
#             match_data.append((index, score_home, score_away))
#
#         # Insert the scraped data into the database
#         insert_query = "INSERT INTO match_predictions (match_id, home_team_score, away_team_score) VALUES (%s, %s, %s)"
#         myCursor.executemany(insert_query, match_data)
#         mydb.commit()
#
#         # Output the success message
#         print("Scraped data inserted into database successfully.")
#
#         # Check if all matches have started
#         if all(score != "-" for _, score, _ in match_data):
#             # Evaluate points for the last match
#             matches = get_matches()
#             points = 0
#             for match_id, index in range(len(matches)):
#                 match_id, home_prediction, away_prediction = player_predictions[match_id]
#                 index, real_score_home, real_score_away = match_data[index]
#
#                 if home_prediction == real_score_home and away_prediction == real_score_away:
#                     points += 4
#                 elif home_prediction > away_prediction and real_score_home > real_score_away:
#                     points += 1
#                 elif home_prediction < away_prediction and real_score_home < real_score_away:
#                     points += 1
#                 elif home_prediction == away_prediction and real_score_home == real_score_away:
#                     points += 2
#             break  # Exit the loop if all matches have started
#
#     except Exception as e:
#         # Handle any exceptions gracefully
#         print("An error occurred:", str(e))
#
#     finally:
#         # Close the WebDriver to free up resources
#         driver.quit()
#
#     # Wait for 1 hour (3600 seconds) before the next update
#     time.sleep(3600)

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
    print("Received login data:", data)
    name = data.get('name')
    password = data.get('password')
    age = data.get('age')
    supporting_team = data.get('supportingTeam')

    message = signup(name, password, age, supporting_team)

    return jsonify({"message": message})

# LOGIN POST to check if the user exists
@app.route('/login', methods=['POST'])
def login_web():
    data = request.get_json()  # Get JSON data from the request body
    print("Received login data:", data)  # Log received data for debugging
    name = data.get('username')
    password = data.get('password')

    user = User.get(name)  # Retrieve user from the database

    if user and user.password == password:
        # Login successful, authenticate the user and start session
        login_user(user)
        return jsonify({"message": "Login successful"}), 200  # Send HTTP status code 200 (OK) for success
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
def predictions():
    data = request.get_json()

    name = session.get('player_name')

    if name:
        get_predictions(name, data)
        print("Predictions saved.")
        return jsonify({"message": "Predictions saved."})
    else:
        print("No player name provided.")
        return jsonify({"error": "No player name provided."})

# GET method for posting the players' leaderboard online
@app.route('/leaderboard')
def get_top_charts():
    top_players_data = top_charts()
    return jsonify(top_players_data)

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)

