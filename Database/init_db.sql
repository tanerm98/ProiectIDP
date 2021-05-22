CREATE TABLE IF NOT EXISTS roles (
    id serial PRIMARY KEY,
    value varchar NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    role_id integer REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS user_metrics (
    today_date date DEFAULT CURRENT_DATE PRIMARY KEY,
    registers integer DEFAULT 0,
    logins integer DEFAULT 0,
    jobs integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS workspaces (
    app_bundle_id varchar PRIMARY KEY,
    description varchar,
    repository_link varchar
);

CREATE TABLE IF NOT EXISTS jobs (
    id serial PRIMARY KEY,
    app_bundle_id varchar NOT NULL REFERENCES workspaces(app_bundle_id) ON DELETE CASCADE,
    pr_id integer DEFAULT 0,
    summary varchar
);

CREATE TABLE IF NOT EXISTS launch_data (
    id serial PRIMARY KEY,
    today_date date DEFAULT CURRENT_DATE,
    app_bundle_id varchar NOT NULL REFERENCES workspaces(app_bundle_id) ON DELETE CASCADE,
    device varchar NOT NULL,
    launch_type varchar NOT NULL,
    launch_duration real NOT NULL,
    memory_usage real NOT NULL
);

CREATE TABLE IF NOT EXISTS install_data (
    id serial PRIMARY KEY,
    today_date date DEFAULT CURRENT_DATE,
    app_bundle_id varchar NOT NULL REFERENCES workspaces(app_bundle_id) ON DELETE CASCADE,
    app_size integer NOT NULL,
    install_launch real NOT NULL,
    install_memory real NOT NULL
);

INSERT INTO roles (value) VALUES ('ADMIN');
INSERT INTO roles (value) VALUES ('MANAGER');
INSERT INTO roles (value) VALUES ('USER');

INSERT INTO users (username, password, role_id) VALUES ('admin', '$2y$10$BLMZFAnCPXX0cVRmdPP3Meu3NR/xWucAyQ4aAW2z57RlLdLPvH0Hi', 1);
INSERT INTO users (username, password, role_id) VALUES ('Taner', '$2a$10$GOiWGnJcxm3BRqEOKo7Hpeg9TzT8.OQHb173q9xQaKQFHibjM27ZK', 2);
INSERT INTO users (username, password, role_id) VALUES ('Corina', '$2a$10$C9eMXpNg00RfBbjbNHAhDOT4iiFZavZX7x9pwjrF0F6gfXNkPX6Ge', 2);
INSERT INTO users (username, password, role_id) VALUES ('Teodor', '$2a$10$K/iDjdPoDyr986LIBZmld.OOdVYMHA2zq4AxsstUXOevSYZSTuDl.', 2);
INSERT INTO users (username, password, role_id) VALUES ('Guest', '$2a$10$3Wju907cCAcewID7wG35N.uFBJAsIDERsZCR6H/Q5kXbcVv0sMT/m', 3);

INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-15', 1, 1);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-16', 2, 1);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-17', 3, 2);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-18', 4, 2);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-19', 5, 3);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-20', 4, 4);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-21', 3, 8);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-22', 2, 9);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-23', 6, 0);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-24', 7, 2);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-25', 0, 5);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-26', 7, 11);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-27', 8, 19);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-28', 9, 10);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-29', 10, 4);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-30', 7, 3);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-05-31', 12, 13);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-06-01', 19, 10);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-06-02', 22, 8);
INSERT INTO user_metrics (today_date, registers, logins) VALUES ('2021-06-03', 5, 9);

INSERT INTO workspaces (app_bundle_id, description, repository_link) VALUES ('Fitbit.Concentration', 'Simple Memory Game', 'github.com/tanerm98/ProiectIDP');
INSERT INTO workspaces (app_bundle_id, description, repository_link) VALUES ('App.Snake', 'Classic Snake Game', 'www.abc.com');
INSERT INTO workspaces (app_bundle_id, description, repository_link) VALUES ('Game.GTA', 'GTA 5 Game', 'www.def.com');
INSERT INTO workspaces (app_bundle_id, description, repository_link) VALUES ('Tool.Reader', 'PDF Reader', 'www.ghi.com');

INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (1, 'Fitbit.Concentration', 0, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (2, 'Fitbit.Concentration', 0, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (3, 'Fitbit.Concentration', 0, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (4, 'Fitbit.Concentration', 0, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (5, 'Fitbit.Concentration', 0, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (6, 'Fitbit.Concentration', 1, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (7, 'Fitbit.Concentration', 1, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (8, 'Fitbit.Concentration', 2, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (9, 'Fitbit.Concentration', 3, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');
INSERT INTO jobs (id, app_bundle_id, pr_id, summary) VALUES (10, 'Fitbit.Concentration', 4, 'Performance Metrics of Fitbit.Concentration Application Tested from this PR\n---------------------------------------------------------------\n> APP SIZE: 1MB  :white_check_mark:\n> FIRST LAUNCH AFTER INSTALL - DURATION: 2058ms  :x:\n> FIRST LAUNCH AFTER INSTALL - MEMORY USAGE: 5.43MB  :white_check_mark:\n---------------------------------------------------------------\n> DEVICE: iPhone 8 | LAUNCH TYPE: WARM | DURATION: 2142ms  :x: | MEMORY USAGE: 5.32MB  :white_check_mark:\n> DEVICE: iPhone 8 | LAUNCH TYPE: COLD | DURATION: 2936ms  :x: | MEMORY USAGE: 5.42MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: WARM | DURATION: 2084ms  :x: | MEMORY USAGE: 5.37MB  :white_check_mark:\n> DEVICE: iPhone 11 | LAUNCH TYPE: COLD | DURATION: 3390ms  :x: | MEMORY USAGE: 5.45MB  :white_check_mark:\n----------------------------------------------------\n');

INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-15', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-15', 'iPhone 8', 'WARM', 1.50, 5.1);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-15', 'iPhone 11', 'COLD', 1.50, 5.2);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-15', 'iPhone 11', 'WARM', 1.50, 6.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-16', 'iPhone 8', 'COLD', 1.50, 7.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-16', 'iPhone 8', 'WARM', 1.50, 4.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-16', 'iPhone 11', 'COLD', 1.50, 3.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-16', 'iPhone 11', 'WARM', 1.50, 2.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-17', 'iPhone 8', 'COLD', 1.50, 1.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-17', 'iPhone 8', 'WARM', 1.50, 9.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-17', 'iPhone 11', 'COLD', 1.50, 10.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-17', 'iPhone 11', 'WARM', 1.50, 1.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-18', 'iPhone 8', 'COLD', 1.50, 2.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-18', 'iPhone 8', 'WARM', 1.50, 2.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-18', 'iPhone 11', 'COLD', 1.50, 3.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-18', 'iPhone 11', 'WARM', 1.50, 5.4);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-19', 'iPhone 8', 'COLD', 1.50, 5.1);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-19', 'iPhone 8', 'WARM', 1.50, 5.8);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-19', 'iPhone 11', 'COLD', 1.50, 5.8);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-19', 'iPhone 11', 'WARM', 1.50, 5.9);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-20', 'iPhone 8', 'COLD', 1.50, 4.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-20', 'iPhone 8', 'WARM', 1.50, 4.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-20', 'iPhone 11', 'COLD', 1.50, 2.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-20', 'iPhone 11', 'WARM', 1.50, 1.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-21', 'iPhone 8', 'COLD', 1.50, 6.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-21', 'iPhone 8', 'WARM', 1.50, 7.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-21', 'iPhone 11', 'COLD', 1.50, 8.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-21', 'iPhone 11', 'WARM', 1.50, 9.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-22', 'iPhone 8', 'COLD', 1.50, 1.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-22', 'iPhone 8', 'WARM', 1.50, 2.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-22', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-22', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-23', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-23', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-23', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-23', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-24', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-24', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-24', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-24', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-25', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-25', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-25', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-25', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-26', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-26', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-26', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-26', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-27', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-27', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-27', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-27', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-28', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-28', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-28', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-28', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-29', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-29', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-29', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-29', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-30', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-30', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-30', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-30', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-31', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-31', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-31', 'iPhone 11', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-31', 'iPhone 11', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-01', 'iPhone 8', 'COLD', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-01', 'iPhone 8', 'WARM', 1.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-01', 'iPhone 11', 'COLD', 5.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-01', 'iPhone 11', 'WARM', 4.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-02', 'iPhone 8', 'COLD', 3.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-02', 'iPhone 8', 'WARM', 0.90, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-02', 'iPhone 11', 'COLD', 0.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-02', 'iPhone 11', 'WARM', 3.50, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-03', 'iPhone 8', 'COLD', 1.59, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-03', 'iPhone 8', 'WARM', 1.40, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-03', 'iPhone 11', 'COLD', 1.60, 5.0);
INSERT INTO launch_data (app_bundle_id, today_date, device, launch_type, launch_duration, memory_usage) VALUES ('Fitbit.Concentration', '2021-05-03', 'iPhone 11', 'WARM', 2.50, 5.0);

INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-15', 10, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-16', 11, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-17', 12, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-18', 9, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-19', 8, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-20', 20, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-21', 15, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-22', 14, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-23', 16, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-24', 17, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-25', 10, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-26', 10, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-27', 10, 2.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-28', 10, 4.50, 8.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-30', 10, 2.60, 9.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-31', 10, 1.90, 3.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-01', 10, 1.50, 4.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-02', 10, 2.60, 6.0);
INSERT INTO install_data (app_bundle_id, today_date, app_size, install_launch, install_memory) VALUES ('Fitbit.Concentration', '2021-05-03', 10, 3.50, 5.0);
