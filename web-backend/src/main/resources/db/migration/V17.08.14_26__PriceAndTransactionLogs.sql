create table price_log(
  id bigint not null
    constraint price_log_pkey
    primary key,
  plant varchar(255),
  date date,
  price numeric(19, 6)
);

create table transaction_log(
id bigint not null
    constraint transaction_log_pkey
    primary key,
    plant varchar(255),
    consumer varchar(255),
    date date,
    transaction varchar(255),
    amount_eth numeric(19, 6),
    amount_kwh numeric(19, 6)
);