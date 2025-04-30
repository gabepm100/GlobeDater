DROP PROCEDURE IF EXISTS SelectRandom;
DELIMITER $$
CREATE PROCEDURE ListMajorsInClubs(IN startdate date, IN enddate Date)
BEGIN
    SELECT question
    FROM FACT f
    ORDER BY RAND()
    LIMIT 1
    WHERE f.end_date < enddate and f.start_date >startdate;
END$$
DELIMITER ;