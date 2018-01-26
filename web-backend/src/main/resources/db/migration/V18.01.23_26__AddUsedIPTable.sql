create table used_ip(
  id bigint not null
    constraint used_ip_pkey
    primary key,
  ip varchar(255),
  acc_count bigint
);
