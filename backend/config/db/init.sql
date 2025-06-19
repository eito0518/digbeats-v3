CREATE DATABASE IF NOT EXISTS digbeats;
USE digbeats;

DROP TABLE IF EXISTS recommendations_tracks;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    soundcloud_user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    soundcloud_artist_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(512) NOT NULL,
    permalink_url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tracks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    soundcloud_track_id BIGINT NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    artwork_url VARCHAR(512) NOT NULL,
    permalink_url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists (id)
);

CREATE TABLE recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE recommendations_tracks (
    recommendation_id INT NOT NULL,
    track_id INT NOT NULL,
    is_liked BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (recommendation_id, track_id),
    FOREIGN KEY (recommendation_id) REFERENCES recommendations (id),
    FOREIGN KEY (track_id) REFERENCES tracks (id)
);