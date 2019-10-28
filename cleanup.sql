DELETE FROM tph WHERE type = 'AVG' AND ts < '$28-days-ago';
DELETE FROM tph WHERE type = 'AVG' AND ts < '$7-days-ago' AND (EXTRACT ('hour' FROM ts) NOT IN (12) OR (EXTRACT ('hour' FROM ts) IN (12) AND EXTRACT ('minute' FROM ts) > 19));
DELETE FROM tph WHERE type = 'AVG' AND ts < '$24-hours-ago' AND (EXTRACT ('hour' FROM ts) NOT IN (0, 6, 12, 18) OR (EXTRACT ('hour' FROM ts) IN (0, 6, 12, 18) AND EXTRACT ('minute' FROM ts) > 19));

DELETE FROM wind WHERE type = 'AVG' AND ts < '$28-days-ago';
DELETE FROM wind WHERE type = 'AVG' AND ts < '$7-days-ago' AND (EXTRACT ('hour' FROM ts) NOT IN (12) OR (EXTRACT ('hour' FROM ts) IN (12) AND EXTRACT ('minute' FROM ts) > 19));
DELETE FROM wind WHERE type = 'AVG' AND ts < '$24-hours-ago' AND (EXTRACT ('hour' FROM ts) NOT IN (0, 6, 12, 18) OR (EXTRACT ('hour' FROM ts) IN (0, 6, 12, 18) AND EXTRACT ('minute' FROM ts) > 19));

DELETE FROM rain WHERE type = 'AVG' AND ts < '$28-days-ago';
DELETE FROM rain WHERE type = 'AVG' AND ts < '$7-days-ago' AND (EXTRACT ('hour' FROM ts) NOT IN (12) OR (EXTRACT ('hour' FROM ts) IN (12) AND EXTRACT ('minute' FROM ts) > 19));
DELETE FROM rain WHERE type = 'AVG' AND ts < '$24-hours-ago' AND (EXTRACT ('hour' FROM ts) NOT IN (0, 6, 12, 18) OR (EXTRACT ('hour' FROM ts) IN (0, 6, 12, 18) AND EXTRACT ('minute' FROM ts) > 19));
