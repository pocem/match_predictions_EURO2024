CREATE TABLE player (
    name VARCHAR(20) PRIMARY KEY,
    age INT,
    supporting VARCHAR(20)
);
SELECT * FROM PLAYER

ALTER TABLE player
ADD COLUMN password_ VARCHAR(20);

CREATE TABLE player_credentials (
    name VARCHAR (20) PRIMARY KEY,
    password_ VARCHAR(20)
);
SELECT * FROM player_credentials



CREATE TABLE top_charts (
    rank_ INT PRIMARY KEY,
    name VARCHAR(20),
    points INT,
    supporting VARCHAR(20),
    FOREIGN KEY (name) REFERENCES player(name) ON DELETE SET NULL
);
SELECT * FROM top_charts;


CREATE TABLE match_predictions (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    home_team VARCHAR(50) NOT NULL,
    away_team VARCHAR(50) NOT NULL,
    match_date DATE NOT NULL,
    guesser_name VARCHAR(50),
    home_team_score INT,
    away_team_score INT,
    CONSTRAINT unique_match_teams UNIQUE (home_team, away_team),
    CONSTRAINT fk_match_guesser FOREIGN KEY (guesser_name) REFERENCES player(name) ON DELETE SET NULL
);
SELECT * FROM match_predictions;
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('GERMANY', 'SCOTLAND', '2024-06-14');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('HUNGARY', 'SWITZERLAND', '2024-06-15');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SPAIN', 'CROATIA', '2024-06-15');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('ITALY', 'ALBANIA', '2024-06-15');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('POLAND', 'NETHERLANDS', '2024-06-16');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SLOVENIA', 'DENMARK', '2024-06-16');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SERBIA', 'ENGLAND', '2024-06-16');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('ROMANIA', 'UKRAINE', '2024-06-17');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('BELGIUM', 'SLOVAKIA', '2024-06-17');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('AUSTRIA', 'FRANCE', '2024-06-17');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('TURKIYE', 'GEORGIA', '2024-06-18');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('PORTUGAL', 'CZECHIA', '2024-06-18');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('CROATIA', 'ALBANIA', '2024-06-19');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('GERMANY', 'HUNGARY', '2024-06-19');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SCOTLAND', 'SWITZERLAND', '2024-06-19');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SLOVENIA', 'SERBIA', '2024-06-20');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('DENMARK', 'ENGLAND', '2024-06-20');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SPAIN', 'ITALY', '2024-06-20');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SLOVAKIA', 'UKRAINE', '2024-06-21');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('POLAND', 'AUSTRIA', '2024-06-21');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('NETHERLANDS', 'FRANCE', '2024-06-21');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('GEORGIA', 'CZECHIA', '2024-06-22');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('TURKIYE', 'PORTUGAL', '2024-06-22');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('BELGIUM', 'ROMANIA', '2024-06-22');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SWITZERLAND', 'GERMANY', '2024-06-23');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SCOTLAND', 'HUNGARY', '2024-06-23');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('ALBANIA', 'SPAIN', '2024-06-24');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('CROATIA', 'ITALY', '2024-06-24');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('NETHERLANDS', 'AUSTRIA', '2024-06-25');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('FRANCE', 'POLAND', '2024-06-25');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('ENGLAND', 'SLOVENIA', '2024-06-25');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('ENGLAND', 'SERBIA', '2024-06-25');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('SLOVAKIA', 'ROMANIA', '2024-06-26');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('UKRAINE', 'BELGIUM', '2024-06-26');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('CZECHIA', 'TURKIYE', '2024-06-26');
INSERT INTO match_predictions (home_team, away_team, match_date) VALUES('GEORGIA', 'PORTUGAL', '2024-06-26');