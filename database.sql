CREATE DATABASE IF NOT EXISTS afaps_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE afaps_db;

-- สร้างตารางผู้ใช้งาน
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- เพิ่มข้อมูล User ตามโจทย์ (ในระบบจริงควรเข้ารหัส Password ด้วย bcrypt)
INSERT INTO users (username, password) VALUES ('sed', 'sed@afaps');

-- สร้างตารางหนังสือรุ่น
CREATE TABLE IF NOT EXISTS yearbooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_number INT NOT NULL,
    pdf_url VARCHAR(255) NOT NULL
);

-- เพิ่มข้อมูลหนังสือรุ่นที่ 1 ถึง 80 (ใช้ Stored Procedure เพื่อความรวดเร็ว)
DELIMITER $$
CREATE PROCEDURE InsertYearbooks()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 80 DO
        INSERT INTO yearbooks (class_number, pdf_url) 
        VALUES (i, CONCAT('https://www.afaps.ac.th/subdomain/sed/gallery/book/', i, '.pdf'));
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

CALL InsertYearbooks();
