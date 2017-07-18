create table consumer
(
  id bigint not null
    constraint consumer_pkey
    primary key,
  consumption numeric(19,2),
  meter_id varchar(255),
  wallet_id varchar(255),
  area_id bigint,
  size_id bigint
);

create table consumption_log
(
  id bigint not null
    constraint consumption_log_pkey
    primary key,
  amount numeric(19,2),
  date date,
  type varchar(255),
  consumer_id bigint
    constraint fk_consumption_consumer
    references consumer
);

create table house_size
(
  id bigint not null
    constraint house_size_pkey
    primary key,
  code varchar(255),
  description varchar(255)
);

alter table consumer
  add constraint fk_consumer_house
foreign key (size_id) references house_size;

create table location_area
(
  id bigint not null
    constraint location_area_pkey
    primary key,
  code varchar(255),
  description varchar(255)
);

alter table consumer
  add constraint fk_consumer_location
foreign key (area_id) references location_area;

create table plant
(
  id bigint not null
    constraint plant_pkey
    primary key,
  capacity numeric(19,2),
  latitude numeric(19,2),
  longtitude numeric(19,2),
  name varchar(255),
  active_from date,
  active_to date,
  type varchar(255),
  wallet_id varchar(255),
  area_id bigint
    constraint fk_plant_location
    references location_area
);

create table production_log
(
  id bigint not null
    constraint production_log_pkey
    primary key,
  amount numeric(19,2),
  date date,
  type varchar(255),
  plant_id bigint
    constraint fk_production_plant
    references plant
);

create table electricity_daily_price
(
  id bigint not null
    constraint electricity_daily_price_pkey
    primary key,
  date date,
  region varchar(255),
  source varchar(255),
  unit_price numeric(19,2)
);

create table nord_pool_token
(
  id bigint not null
    constraint nord_pool_token_pkey
    primary key,
  expires_at timestamp,
  token varchar(255)
);