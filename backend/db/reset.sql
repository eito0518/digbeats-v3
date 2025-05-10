DROP DATABASE IF EXISTS digbeats_v3;

CREATE DATABASE digbeats_v3;

USE digbeats_v3;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(255) NOT NULL,
    soundcloud_artist_id BIGINT NOT NULL,
    avatar_url VARCHAR(512) NOT NULL,
    liked_track_count INT NOT NULL,
    permalink_url VARCHAR(512) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tracks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    soundcloud_track_id BIGINT NOT NULL,
    artwork_url VARCHAR(512) NOT NULL,
    widget_url VARCHAR(512) NOT NULL,
    permalink_url VARCHAR(512) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists (id)
);

CREATE TABLE recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    track_count INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE recommendations_tracks (
    recommendation_id INT NOT NULL,
    track_id INT NOT NULL,
    liked BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (recommendation_id, track_id),
    FOREIGN KEY (recommendation_id) REFERENCES recommendations (id),
    FOREIGN KEY (track_id) REFERENCES tracks (id)
);