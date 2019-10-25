delete from tph where ts < '2019-09-23'::date;
delete from tph where type = 'AVG' and ts < '2019-10-22'::date and extract ('hour' from ts) not in (0, 6, 12, 18);
delete from tph where type = 'AVG' and ts < '2019-10-16'::date and extract ('hour' from ts) not in (12);

delete from wind where ts < '2019-09-23'::date;
delete from wind where type = 'AVG' and ts < '2019-10-22'::date and extract ('hour' from ts) not in (0, 6, 12, 18);
delete from wind where type = 'AVG' and ts < '2019-10-16'::date and extract ('hour' from ts) not in (12);

delete from rain where ts < '2019-09-23'::date;
delete from rain where type = 'AVG' and ts < '2019-10-22'::date and extract ('hour' from ts) not in (0, 6, 12, 18);
delete from rain where type = 'AVG' and ts < '2019-10-16'::date and extract ('hour' from ts) not in (12);
