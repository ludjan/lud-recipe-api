-- Select inni select
SELECT navn, masse
FROM planet
WHERE sid = (SELECT sid FROM planet WHERE navn = 'Tellus')
ORDER BY masse -- trenger ikke ASC, default er minst --> størst

-- SET med select
UPDATE stjerne
SET
    masse = masse * 0.45
WHERE 
    oid = (SELECT oid FROM observator WHERE navn = 'BESS') AND
    oppdaget < 1990

-- union 
-- brukte union all, fordi det kan være at to objekter har samme id og masse, men jeg ønsker ikke å fjerne duplikater
CREATE VIEW universet (total_antall_objekter, total_masse) AS 
    SELECT count(*), sum(u.masse)
    FROM (
        SELECT sid, masse FROM stjerne
        UNION ALL
        SELECT pid, masse FROM planet
        UNION ALL
        SELECT mid, masse FROM måne
    ) AS u


WITH 
    s_total_vekt (sid, total_vekt) AS ( -- gir en rad per solsystem (stjerne) og dets totale vekt
        SELECT a.sid, sum(a.masse)
        FROM (
            -- en rad per stjerne med stjernens vekt
            SELECT sid, masse 
            FROM stjerne
            
            UNION 
            -- en rad per planet med planetens vekt og referens til stjerne
            SELECT sid, masse 
            FROM planet
            
            UNION 
            -- en rad per måne med månens vekt og referens til stjerne
            SELECT p.sid AS sid, m.masse AS masse
            FROM måne AS m
            JOIN planet AS p USING (pid)
        ) as a
        GROUP BY a.sid
    ), 
    s_antall_planeter (sid, antall_planeter) AS ( -- en rad per stjerne med antall planeter
        SELECT sid, count(*)
        FROM planet
        GROUP BY sid
    )

SELECT DISTINCT navn -- ønsker kun unike stjerner
FROM stjerne
WHERE 
    sid IN (SELECT sid FROM s_total_vekt WHERE vekt > 400) OR 
    sid IN (SELECT sid FROM s_antall_planeter WHERE antall_planeter > 10)

-- join AS
-- navn som skal projiseres må være navn til observator siden navn til stjerne blir selektert bort
-- må ha med DISTINCT, ettersom SQL beholder duplikater ved seleksjon, men relasjonsalgebra fjerner dem
SELECT DISTINCT o.navn 
FROM observator AS o
JOIN stjerne AS s USING (oid)
WHERE s.lysstyrke > 50