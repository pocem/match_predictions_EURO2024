import mysql.connector
import json

mydb = mysql.connector.connect(host="localhost", user="root", passwd="grepolismiso21", database="euro")

myCursor = mydb.cursor()

#SIGNUP--------------------------------------------------
def signup():
    # Prompt the user for signup credentials
    player_name = input("Enter your name: ")
    player_password = input("Enter your password: ")
    player_age = input("Enter your age: ")
    player_supporting = input("Enter the team you support: ")

    # Check if the entered name already exists in the database
    check_name_query = "SELECT name FROM player WHERE name = %s"
    myCursor.execute(check_name_query, (player_name,))
    existing_name = myCursor.fetchone()

    if existing_name:
        print(f"Name '{player_name}' already exists. Please choose a different name.")
        return  # Exit the function if the name already exists

    # Insert the signup credentials into the database
    insert_query = "INSERT INTO player (name, password_, age, supporting) VALUES (%s, %s, %s, %s)"
    val = (player_name, player_password, player_age, player_supporting)
    myCursor.execute(insert_query, val)
    mydb.commit()

    print("Signup successful!")

#STORE THE SIGNUP INFO--------------------
def save_player_credentials(player_credentials):
    filename = 'player_credentials.json'
    with open(filename, 'w') as file:
        json.dump(player_credentials, file)
    print("Player credentials saved successfully.")

#LOGIN------------------------------------
def load_player_credentials():
    try:
        filename = 'player_credentials.json'
        with open(filename, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}



def login():

    login_name = input("Enter your name: ")
    login_password = input("Enter your password: ")

    # Execute a SQL query to check login credentials
    sql = "SELECT password_ FROM player WHERE name = %s"
    myCursor.execute(sql, (login_name,))
    result = myCursor.fetchone()

    # Check if a row was returned and if the provided password matches the stored password
    if result:
        if result[0] == login_password:
            print("Login successful!")
        else:
            print("Incorrect password. Please try again.")
    else:
        print("Name not found. Please check your credentials or sign up.")

#storing all info about the player in a dictionary
player_credentials = {}

myCursor.execute("SELECT name, password_, age, supporting FROM player")
signup_data = myCursor.fetchall()

for name, password, age, supporting_team in signup_data:
    player_credentials[name] = {'password': password, 'age': age, 'supporting_team': supporting_team}



# Function to retrieve matches from the database
def get_matches():
    myCursor.execute("SELECT home_team, away_team, match_date FROM match_predictions")
    return myCursor.fetchall()

all_predictions = []
def get_predictions(matches):
    predictions = []
    for i, match in enumerate(matches, 1):
        home_team, away_team, match_date = match
        print(f"Match {i}: {home_team} vs {away_team} (Date: {match_date})")
        while True:
            try:
                home_prediction = int(input(f"Enter your prediction for {home_team} (home) goals: "))
                away_prediction = int(input(f"Enter your prediction for {away_team} (away) goals: "))
                if home_prediction < 0 or away_prediction < 0:
                    raise ValueError("Predictions must be natural numbers.")
                break
            except ValueError as e:
                print(e)
        predictions.append((home_prediction, away_prediction))
    return predictions

# Main function
def main():
    matches = get_matches()
    predictions = get_predictions(matches)
    print("Predictions:", predictions)

if __name__ == "__main__":
    main()

#check the predictions with real outcomes --- WEBSCRAPING/API

#assessment of the predictions
matches = get_matches()

all_predictions, _, _ = get_predictions(matches)  # Discard home_prediction and away_prediction

real_scores = [(0, 0) for _ in range(len(matches))]  # For the time being, set all real scores to (0, 0)

points = 0
for i in range(len(matches)):
    home_prediction, away_prediction = all_predictions[i]
    real_score_home, real_score_away = real_scores[i]

    if home_prediction == real_score_home and away_prediction == real_score_away:
        points += 4
    elif home_prediction > away_prediction and real_score_home > real_score_away:
        points += 1
    elif home_prediction < away_prediction and real_score_home < real_score_away:
        points += 1
    elif home_prediction == away_prediction and real_score_home == real_score_away:
        points += 2

#TOP CHARTS ----------------------------------
top_chart = {}


def top_charts():
    # Sort players by points (descending order)
    sorted_players = sorted(player_credentials.items(), key=lambda x: x[1]['points'], reverse=True)

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

        # Increment rank for the next player
        rank += 1




