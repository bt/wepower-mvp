-- Data for testing purposes
INSERT INTO public.location_area(id, code, description) VALUES(1, 'DEU', 'Germany');
INSERT INTO public.location_area(id, code, description) VALUES(2, 'ESP', 'Spain');
INSERT INTO public.location_area(id, code, description) VALUES(3, 'ITA', 'Italy');
INSERT INTO public.location_area(id, code, description) VALUES(4, 'GRC', 'Greece');

INSERT INTO public.house_size(id, code, description) VALUES(1, 'S', '10 - 50 m2');
INSERT INTO public.house_size(id, code, description) VALUES(2, 'M', '50 - 100 m2');
INSERT INTO public.house_size(id, code, description) VALUES(3, 'L', '100 - 150 m2');


INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-1, '2017-07-10', 'LT', 'NORD_POOL', 36);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-2, '2017-07-11', 'LT', 'NORD_POOL', 38);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-3, '2017-07-12', 'LT', 'NORD_POOL', 39);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-4, '2017-07-13', 'LT', 'NORD_POOL', 45);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-5, '2017-07-14', 'LT', 'NORD_POOL', 31);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-6, '2017-07-15', 'LT', 'NORD_POOL', 33);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-7, '2017-07-16', 'LT', 'NORD_POOL', 36);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-8, '2017-07-17', 'LT', 'NORD_POOL', 38);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-9, '2017-07-18', 'LT', 'NORD_POOL', 39);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-10, '2017-07-19', 'LT', 'NORD_POOL', 45);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-11, '2017-07-20', 'LT', 'NORD_POOL', 31);
INSERT INTO electricity_daily_price(id, date, region, source, unit_price) VALUES(-12, '2017-07-21', 'LT', 'NORD_POOL', 33);