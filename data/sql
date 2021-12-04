
CREATE TABLE runners (
    runner_id serial PRIMARY KEY,
    nom varchar(25) NOT NULL,
	cognoms varchar (50) NOT NULL,
	dorsal smallint NOT NULL UNIQUE
);


CREATE TABLE points ( 
   	runner_id integer REFERENCES runners (runner_id),
	geom geometry(Point,25831)
);	

-- https://spatialreference.org/ref/epsg/25831/
--create table prueba2(gid serial primary key, nombre varchar, numero int, geom geometry(Linestring,5343));
-- alter table prueba1 add column geom geometry(Point,5343);

	
