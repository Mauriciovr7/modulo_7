drop table if exists citas;

create table citas(
	id serial primary key,
	nombre varchar(255) not null,
	cita varchar(255) not null,
  fecha date not null default current_date,
  hora time not null default now()
);

select * from citas;