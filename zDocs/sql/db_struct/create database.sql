--# use: mysql -u root
CREATE DATABASE mymemory;
use mymemory;
-- nao funciona --> GRANT ALL PRIVILEGES ON *.* TO 'mymemoryUser'@'localhost' IDENTIFIED BY 'Tata123.';

CREATE USER 'mymemoryUser'@'localhost' IDENTIFIED BY 'mymemoryUser123';

SET PASSWORD FOR 'mymemoryUser'@'localhost' = 'mymemoryUser123';

GRANT ALL ON mymemory.* TO 'mymemoryUser'@'localhost' WITH GRANT OPTION;


-- list db users
select host, user from mysql.user;

SHOW GRANTS FOR 'mymemoryUser'@'localhost';

REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'mymemoryUser'@'localhost';
 DROP USER 'mymemoryUser'@'localhost';