# everything starting with a hash is a comment and is ignored

# Drop the DB if it exist, and then re-create the DB

DROP DATABASE IF EXISTS nsu_sigapp_sc;

CREATE DATABASE IF NOT EXISTS nsu_sigapp_sc;
USE nsu_sigapp_sc;

# Drop tables if they already exist

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS roles;

DROP TABLE IF EXISTS blog;

DROP TABLE IF EXISTS blog_like_track;

DROP TABLE IF EXISTS blog_comments;

DROP TABLE IF EXISTS blog_category;

DROP TABLE IF EXISTS forum;

DROP TABLE IF EXISTS forum_reply;

DROP TABLE IF EXISTS forum_category;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS events;

DROP TABLE IF EXISTS event_registered_people;

DROP TABLE IF EXISTS reports;

DROP TABLE IF EXISTS email_queue;

CREATE TABLE IF NOT EXISTS users(
    u_id INT AUTO_INCREMENT,
    nsu_id VARCHAR(45) NOT NULL,
    role_id INT NOT NULL,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    user_name VARCHAR(45) NOT NULL,
    nsu_email VARCHAR(255) NOT NULL,
    alt_email VARCHAR(255) NOT NULL,
    password LONGTEXT NOT NULL,
    avatar_url VARCHAR(255) DEFAULT "img/sunglasses.png",
    status TINYINT NOT NULL,
    PRIMARY KEY(u_id,user_name,nsu_id) 
);

CREATE TABLE IF NOT EXISTS roles(
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS blog(
    blog_id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT,
    blog_title VARCHAR(255) NOT NULL,
    blog_description LONGTEXT NOT NULL,
    like_count INT DEFAULT 0,
    img_url VARCHAR(255),
    FOREIGN KEY(author_id) REFERENCES users(u_id) ON DELETE SET NULL # if the user who made the post is removed/deleted
	 															  	# then the posts author_id will be set to NULL
																  	# So when a user visits the post in the website, if the author_id of that
																  	# post is set to NULL, we will show the author_name as anonymous
);

CREATE TABLE IF NOT EXISTS blog_like_track(
    user_id INT,
    blog_id INT,
    action TINYINT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(u_id) ON DELETE SET NULL,
	FOREIGN KEY(blog_id) REFERENCES blog(blog_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS blog_comments(
    com_id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT,
    blog_id INT,
    com_content LONGTEXT NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(u_id) ON DELETE SET NULL,
    FOREIGN KEY(blog_id) REFERENCES blog(blog_id) ON DELETE CASCADE # if the blog is deleted, so are its comments
);

CREATE TABLE IF NOT EXISTS categories(
    cat_id INT PRIMARY KEY AUTO_INCREMENT,
    cat_name VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_category(
    blog_id INT,
    cat_id INT,
    FOREIGN KEY(blog_id) REFERENCES blog(blog_id) ON DELETE CASCADE, # if the blog is deleted, then no point in keeping
																		 # just the category of that blog, thats why CASCADE
    FOREIGN KEY(cat_id) REFERENCES categories(cat_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS forum(
    f_post_id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT,
    f_post_title VARCHAR(255) NOT NULL,
    f_post_description LONGTEXT NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(u_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS forum_reply(
    reply_id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT,
    forum_p_id INT,
    reply_content LONGTEXT NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(u_id) ON DELETE SET NULL,
    FOREIGN KEY(forum_p_id) REFERENCES forum(f_post_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS forum_category(
    f_post_id INT,
    cat_id INT,
    FOREIGN KEY(f_post_id) REFERENCES forum(f_post_id) ON DELETE CASCADE,
    FOREIGN KEY(cat_id) REFERENCES categories(cat_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events(
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    created_by INT,
    event_type VARCHAR(45) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_description LONGTEXT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status TINYINT NOT NULL,
    registered_count INT NOT NULL DEFAULT 0,
    FOREIGN KEY(created_by) REFERENCES users(u_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS event_registered_people(
    event_id INT,
    registered_id INT,
    FOREIGN KEY(registered_id) REFERENCES users(u_id) ON DELETE SET NULL,
    FOREIGN KEY(event_id) REFERENCES events(event_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reports(
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    reported_by INT,
    content_link MEDIUMTEXT NOT NULL,
    status TINYINT NOT NULL,
    resolved_by INT,
    FOREIGN KEY(reported_by) REFERENCES users(u_id) ON DELETE SET NULL,
    FOREIGN KEY(resolved_by) REFERENCES users(u_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS email_queue(
    email_id INT PRIMARY KEY AUTO_INCREMENT,
    send_to VARCHAR(255) NOT NULL,
    e_from VARCHAR(255) NOT NULL,
    email_headers MEDIUMTEXT NOT NULL,
    email_description LONGTEXT NOT NULL,
    send_progress VARCHAR(45) NOT NULL,
    sent_at DATETIME NOT NULL
);