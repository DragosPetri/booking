import mysql from 'mysql';
import util from 'util';

const connectionPool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'webdev',
  connectionLimit: 3,
  timezone: 'utc',
});

const promiseQuery = util.promisify(connectionPool.query).bind(connectionPool);

export const findAllCentres = () => promiseQuery('SELECT * FROM centres LEFT JOIN photos ON centres.id = photos.centre_id');

export const findCentreById = (centreId) => promiseQuery(`SELECT * FROM centres
                                                       LEFT JOIN photos ON centres.id = photos.centre_id
                                                       WHERE centres.id = ?`, [centreId]).then((c) => c[0]);

export const findAllBookingsWithCentreDetails = () => promiseQuery(`SELECT b.*, s.name, s.type, s.location, s.price FROM bookings AS b
                                                                    INNER JOIN centres as s ON s.id = b.centre_id`);

export const findAllRecurrentBookingsWithCentreDetails = () => promiseQuery(`SELECT b.*, s.name, s.type, s.location, s.price FROM recurrent_bookings as b
                                                                                INNER JOIN centres as s ON s.id = b.centre_id`);

export const findAllBookingsByCentreId = (centreId) => promiseQuery(`SELECT * FROM bookings AS b 
                                                                    INNER JOIN users AS u ON u.email = b.user_email
                                                                       WHERE b.centre_id = ?`, [centreId]);
export const findAllUsers = () => promiseQuery('SELECT * FROM users');

export const findUserByEmail = (email) => promiseQuery('SELECT * FROM users WHERE email = ?', [email]).then((c) => c[0]);

export const findBookingById = (bookingId) => promiseQuery(`SELECT * FROM bookings
                                                           WHERE id = ?`, [bookingId]).then((c) => c[0]);

export const findRecurrentBookingById = (bookingId) => promiseQuery(`SELECT * FROM recurrent_bookings
                                                           WHERE id = ?`, [bookingId]).then((c) => c[0]);

export const findAllBookingDates = (data) => promiseQuery(`SELECT date AS startDate, 
                                                            DATE_ADD(date, INTERVAL 2 HOUR) as endDate
                                                            FROM bookings
                                                            WHERE centre_id=? AND DAY(date)=DAY(?)`, [data.centreId, data.date]);

export const findAllBookingsWithCentreDetailsByUserEmail = (email) => promiseQuery(`SELECT b.*, s.name, s.type, s.location, s.price FROM bookings AS b
                                                           INNER JOIN centres as s ON s.id = b.centre_id
                                                           WHERE user_email = ?`, [email]);

export const findAllRecurrentBookingsWithCentreDetailsByUserEmail = (email) => promiseQuery(`SELECT r.*, s.name, s.type, s.location, s.price FROM recurrent_bookings AS r
                                                           INNER JOIN centres as s ON s.id = r.centre_id
                                                           WHERE user_email = ?`, [email]);

export const deleteUser = (email) => promiseQuery('DELETE FROM users WHERE email = ?', [email]);

export const deleteCentre = (id) => promiseQuery('DELETE FROM centres WHERE id = ?', [id]);

export const deleteBooking = (id) => promiseQuery('DELETE FROM bookings WHERE id = ?', [id]);

export const deleteRecurrentBooking = (id) => promiseQuery('DELETE FROM recurrent_bookings WHERE id = ?', [id]);

export const checkUserExists = (email) => promiseQuery(`SELECT 1 FROM users
                                            WHERE email = ?`, [email]);

export const checkBookingDateExist = (data) => promiseQuery(`SELECT * FROM bookings AS b
                        WHERE centre_id = ? 
                        AND ((? < DATE_ADD(b.date, INTERVAL 2 HOUR) AND ? >= b.date)
                        OR 
                        (DATE_ADD(?, INTERVAL 2 HOUR) > b.date AND DATE_ADD(?, INTERVAL 2 HOUR) < DATE_ADD(b.date, INTERVAL 2 HOUR))
                        )`, [data.centreId, data.date, data.date, data.date, data.date]);

export const checkCentreExist = (id) => promiseQuery('SELECT * FROM centres WHERE id = ?', [id]);

const checkRecurrentBookingDateExist = (data) => promiseQuery('SELECT * FROM recurrent_bookings WHERE centre_id = ? AND date = ?', [data.centreId, data.date]);

export const insertUser = async (data) => promiseQuery(`INSERT INTO users
        VALUES (?, ?, default, default)`, [data.email, data.name]);

export const insertBooking = async (data) => {
  try {
    let result = await checkCentreExist(data.centreId);
    if (!result.length) return null;

    result = await checkBookingDateExist(data);
    if (!result.length) {
      return promiseQuery(`INSERT INTO bookings
        VALUES (default, ?, ?, ?, ?)`, [data.email, data.centreId, data.date, data.recurrent]);
    }
    return null;
  } catch (e) {
    console.error(e);
  }

  // Already exist booking with provided date and centre id
  return null;
};

export const insertRecurrentBooking = async (data) => {
  try {
    let result = await checkCentreExist(data.centreId);
    if (!result.length) return null;

    result = await checkRecurrentBookingDateExist(data);
    if (!result.length) {
      return promiseQuery(`INSERT INTO recurrent_bookings
        VALUES (default, ?, ?, ?, ?)`, [data.email, data.centreId, data.date, data.nextDate]);
    }
    return null;
  } catch (e) {
    console.error(e);
  }

  // Already exist booking with provided date and centre id
  return null;
};

export const insertCentre = (data) => promiseQuery(`INSERT INTO centres
    VALUES (default, ?, ?, ?, ?, ?)`, [data.name, data.type, data.location, data.price, data.description]);

export const insertImage = (data) => promiseQuery(`INSERT INTO photos(centre_id, image_path) VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE centre_id=VALUES(centre_id), image_path=VALUES(image_path)`, [data.id, data.filename]);

export const updateRecurrentBookings = () => promiseQuery(`UPDATE recurrent_bookings
                                                            SET date = next_date, next_date = DATE_ADD(next_date, INTERVAL 7 DAY)
                                                            WHERE CURDATE() > date`);

export const updateUserName = (data) => promiseQuery('UPDATE users SET name = ? WHERE email = ?', [data.name, data.email]);

export const updateUserRole = (data) => promiseQuery('UPDATE users SET role = ? WHERE email = ?', [data.role, data.email]);

export const updateUserStatus = (data) => promiseQuery('UPDATE users SET status = ? WHERE email = ?', [data.status, data.email]);

export const updateCentreName = (data) => promiseQuery('UPDATE centres SET name = ? WHERE id = ?', [data.name, data.id]);

export const updateCentreType = (data) => promiseQuery('UPDATE centres SET type = ? WHERE id = ?', [data.type, data.id]);

export const updateCentreLocation = (data) => promiseQuery('UPDATE centres SET location = ? WHERE id = ?', [data.location, data.id]);

export const updateCentrePrice = (data) => promiseQuery('UPDATE centres SET price = ? WHERE id = ?', [data.price, data.id]);

export const updateCentreDescription = (data) => promiseQuery('UPDATE centres SET description = ? WHERE id = ?', [data.description, data.id]);

// Init
const initTableUsers = () => promiseQuery(`CREATE TABLE IF NOT EXISTS users(
        email VARCHAR(128) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        role VARCHAR(16) NOT NULL DEFAULT 'user',
        status VARCHAR(8) NOT NULL DEFAULT 'OK'
    )`);

const initTableCentres = () => promiseQuery(`CREATE TABLE IF NOT EXISTS centres(
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(128) NOT NULL,
        type VARCHAR(128) NOT NULL,
        location VARCHAR(128) NOT NULL,
        price DOUBLE NOT NULL,
        description TEXT NOT NULL
    )`);

const initTablePhotos = () => promiseQuery(`CREATE TABLE IF NOT EXISTS photos(
        centre_id INT NOT NULL UNIQUE,
        image_path VARCHAR(256),
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE
    )`);

const initTableBookings = () => promiseQuery(`CREATE TABLE IF NOT EXISTS bookings(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_email VARCHAR(128) NOT NULL,
        centre_id INT NOT NULL,
        date DATETIME NOT NULL,
        recurrent VARCHAR(8) NOT NULL,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE,
        FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    )`);

const initTableRecurrentBookings = () => promiseQuery(`CREATE TABLE IF NOT EXISTS recurrent_bookings(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_email VARCHAR(128) NOT NULL,
        centre_id INT NOT NULL,
        date DATETIME NOT NULL,
        next_date DATETIME NOT NULL,
        FOREIGN KEY (centre_id) REFERENCES centres(id) ON DELETE CASCADE,
        FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    )`);

(async () => {
  try {
    await initTableUsers();
    await initTableCentres();
    await initTablePhotos();
    await initTableBookings();
    await initTableRecurrentBookings();
  } catch (e) {
    console.error(e);
  }
})();
