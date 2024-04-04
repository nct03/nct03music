UPDATE songs
SET file_name = CONCAT('http://localhost:8080/v1/songs/files/', file_name),
    image_name = COALESCE(CONCAT('http://localhost:8080/v1/songs/images/', COALESCE(image_name, 'default.jpg')), 'default.jpg');

UPDATE artists
SET photo = COALESCE(CONCAT('http://localhost:8080/v1/artists/images/', COALESCE(photo, 'default.jpg')), 'default.jpg');

UPDATE users
SET photo = COALESCE(CONCAT('http://localhost:8080/v1/users/images/', COALESCE(photo, 'default.jpg')), 'default.jpg');