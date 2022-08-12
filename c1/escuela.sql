drop table if exists estudiantes;
create table estudiantes(
    nombre varchar(255) not null,    
    rut varchar(255) primary key not null,
    curso varchar(255) not null,
    nivel int not null
    );
    
select * from estudiantes;
   