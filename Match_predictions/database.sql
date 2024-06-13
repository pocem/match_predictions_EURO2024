CREATE TABLE player (
    name VARCHAR(20) PRIMARY KEY,
    password_ VARCHAR(20)
);

CREATE TABLE top_charts (
    rank_ INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    points INT,
    age INT,
    supporting VARCHAR(20),
    FOREIGN KEY (name) REFERENCES player(name) ON DELETE SET NULL
);

CREATE TABLE match_predictions (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    home_team VARCHAR(50) NOT NULL,
    away_team VARCHAR(50) NOT NULL,
    match_date DATE NOT NULL,
    home_team_score INT,
    away_team_score INT,
    CONSTRAINT unique_match_teams UNIQUE (home_team, away_team)
);

INSERT INTO match_predictions (home_team, away_team, match_date) VALUES
('GERMANY', 'SCOTLAND', '2024-06-14'),
('HUNGARY', 'SWITZERLAND', '2024-06-15'),
('SPAIN', 'CROATIA', '2024-06-15'),
('ITALY', 'ALBANIA', '2024-06-15'),
('POLAND', 'NETHERLANDS', '2024-06-16'),
('SLOVENIA', 'DENMARK', '2024-06-16'),
('SERBIA', 'ENGLAND', '2024-06-16'),
('ROMANIA', 'UKRAINE', '2024-06-17'),
('BELGIUM', 'SLOVAKIA', '2024-06-17'),
('AUSTRIA', 'FRANCE', '2024-06-17'),
('TURKIYE', 'GEORGIA', '2024-06-18'),
('PORTUGAL', 'CZECHIA', '2024-06-18'),
('CROATIA', 'ALBANIA', '2024-06-19'),
('GERMANY', 'HUNGARY', '2024-06-19'),
('SCOTLAND', 'SWITZERLAND', '2024-06-19'),
('SLOVENIA', 'SERBIA', '2024-06-20'),
('DENMARK', 'ENGLAND', '2024-06-20'),
('SPAIN', 'ITALY', '2024-06-20'),
('SLOVAKIA', 'UKRAINE', '2024-06-21'),
('POLAND', 'AUSTRIA', '2024-06-21'),
('NETHERLANDS', 'FRANCE', '2024-06-21'),
('GEORGIA', 'CZECHIA', '2024-06-22'),
('TURKIYE', 'PORTUGAL', '2024-06-22'),
('BELGIUM', 'ROMANIA', '2024-06-22'),
('SWITZERLAND', 'GERMANY', '2024-06-23'),
('SCOTLAND', 'HUNGARY', '2024-06-23'),
('ALBANIA', 'SPAIN', '2024-06-24'),
('CROATIA', 'ITALY', '2024-06-24'),
('NETHERLANDS', 'AUSTRIA', '2024-06-25'),
('FRANCE', 'POLAND', '2024-06-25'),
('ENGLAND', 'SLOVENIA', '2024-06-25'),
('ENGLAND', 'SERBIA', '2024-06-25'),
('SLOVAKIA', 'ROMANIA', '2024-06-26'),
('UKRAINE', 'BELGIUM', '2024-06-26'),
('CZECHIA', 'TURKIYE', '2024-06-26'),
('GEORGIA', 'PORTUGAL', '2024-06-26');

CREATE TABLE player_predictions (
    name VARCHAR(20),
    match_id INT,
    home_score INT,
    away_score INT,
    PRIMARY KEY (name, match_id),
    FOREIGN KEY (name) REFERENCES player(name),
    FOREIGN KEY (match_id) REFERENCES match_predictions(match_id)
);
