CREATE DATABASE platform;
USE platform;

CREATE TABLE estudiante (
                            cc       VARCHAR(15) NOT NULL COMMENT 'Cedula de ciudadanía del estudiante',
                            name     VARCHAR(50) NOT NULL COMMENT 'Nombre del estudiante',
                            semester DOUBLE NOT NULL COMMENT 'Numero del semestre del estudiante',
                            career   VARCHAR(30) NOT NULL COMMENT 'Nombre de la carrera del estudiante',
                            password VARCHAR(200) NOT NULL COMMENT 'Contraseña del estudiante en la plataforma'
);

ALTER TABLE estudiante ADD CONSTRAINT estudiante_pk PRIMARY KEY ( cc );

CREATE TABLE materia (
                         name       VARCHAR(20) NOT NULL COMMENT 'Nombre de la materia',
                         dept       VARCHAR(50) NOT NULL COMMENT 'Nombre del departamento al que pertenece la materia',
                         materia_id VARCHAR(50) NOT NULL
);


ALTER TABLE materia ADD CONSTRAINT materia_pk PRIMARY KEY ( materia_id );

CREATE TABLE material (
                          title              VARCHAR(20) NOT NULL COMMENT 'Titulo del material publicado',
                          `desc`             VARCHAR(200) NOT NULL COMMENT 'Descripcion del material',
                          link               VARCHAR(300) NOT NULL COMMENT 'Link generado por S3 de los archivos aduntos del material',
                          estudiante_cc      VARCHAR(15),
                          material_id        VARCHAR(50) NOT NULL,
                          materia_materia_id VARCHAR(50)
);


ALTER TABLE material ADD CONSTRAINT material_pk PRIMARY KEY ( material_id );

CREATE TABLE materiaxestu (
                              materia_materia_id VARCHAR(50) NOT NULL,
                              estudiante_cc      VARCHAR(15) NOT NULL
);

ALTER TABLE materiaxestu ADD CONSTRAINT materiaxestu_pk PRIMARY KEY ( materia_materia_id,
                                                                      estudiante_cc );

ALTER TABLE material
    ADD CONSTRAINT material_estudiante_fk FOREIGN KEY ( estudiante_cc )
        REFERENCES estudiante ( cc )
            ON DELETE CASCADE;

ALTER TABLE material
    ADD CONSTRAINT material_materia_fk FOREIGN KEY ( materia_materia_id )
        REFERENCES materia ( materia_id )
            ON DELETE CASCADE;

ALTER TABLE materiaxestu
    ADD CONSTRAINT materiaxestu_estudiante_fk FOREIGN KEY ( estudiante_cc )
        REFERENCES estudiante ( cc )
            ON DELETE CASCADE;

ALTER TABLE materiaxestu
    ADD CONSTRAINT materiaxestu_materia_fk FOREIGN KEY ( materia_materia_id )
        REFERENCES materia ( materia_id )
            ON DELETE CASCADE;