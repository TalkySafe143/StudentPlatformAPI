-- Generated by Oracle SQL Developer Data Modeler 23.1.0.087.0806

CREATE TABLE estudiante (
    id       VARCHAR2(100 BYTE) NOT NULL,
    email    VARCHAR2(100 BYTE) NOT NULL,
    password VARCHAR2(100 BYTE) NOT NULL,
    name     VARCHAR2(100 BYTE) NOT NULL,
    college  VARCHAR2(100 BYTE) NOT NULL,
    semester NUMBER,
    carreer  VARCHAR2(100 BYTE)
);

COMMENT ON COLUMN estudiante.id IS
    'ID del estudiante registrado';

COMMENT ON COLUMN estudiante.email IS
    'Email del estudiante que se registra';

COMMENT ON COLUMN estudiante.password IS
    'Contraseña del estudiante en el sistema';

COMMENT ON COLUMN estudiante.name IS
    'Nombre del estudiante registrado';

COMMENT ON COLUMN estudiante.college IS
    'Universidad en el que se encuentra registrado el estudiante';

COMMENT ON COLUMN estudiante.semester IS
    'Numero del semestre que esta cursando el estudiante';

COMMENT ON COLUMN estudiante.carreer IS
    'Nombre de la carrera que se encuentra inscrito el estudiante';

ALTER TABLE estudiante ADD CONSTRAINT estudiante_pk PRIMARY KEY ( email,
                                                                  id );

CREATE TABLE materia (
    idmateria VARCHAR2(100 BYTE) NOT NULL,
    name      VARCHAR2(100 BYTE) NOT NULL,
    hours     NUMBER NOT NULL
);

COMMENT ON COLUMN materia.idmateria IS
    'ID de la materia (Generado)';

COMMENT ON COLUMN materia.name IS
    'Nombre de la materia';

COMMENT ON COLUMN materia.hours IS
    'Numero de horas de la materia';

ALTER TABLE materia ADD CONSTRAINT materia_pkv1 PRIMARY KEY ( idmateria );

ALTER TABLE materia ADD CONSTRAINT materia_pk UNIQUE ( idmateria );

CREATE TABLE material (
    title             VARCHAR2(100 BYTE) NOT NULL,
    description       VARCHAR2(100 BYTE) NOT NULL,
    url               VARCHAR2(100 BYTE),
    idmaterial        VARCHAR2(100 BYTE) NOT NULL,
    materia_idmateria VARCHAR2(100 BYTE) NOT NULL
);

COMMENT ON COLUMN material.title IS
    'Titulo del material';

COMMENT ON COLUMN material.description IS
    'Descripcion del material';

COMMENT ON COLUMN material.url IS
    'URL del recurso en S3';

COMMENT ON COLUMN material.idmaterial IS
    'ID del material publicado';

ALTER TABLE material ADD CONSTRAINT material_pk PRIMARY KEY ( idmaterial );

CREATE TABLE materiasxestudiante (
    estudiante_email  VARCHAR2(100 BYTE) NOT NULL,
    estudiante_id     VARCHAR2(100 BYTE) NOT NULL,
    materia_idmateria VARCHAR2(100 BYTE) NOT NULL
);

ALTER TABLE materiasxestudiante
    ADD CONSTRAINT materiasxestudiante_pk PRIMARY KEY ( estudiante_email,
                                                        estudiante_id,
                                                        materia_idmateria );

ALTER TABLE material
    ADD CONSTRAINT material_materia_fk FOREIGN KEY ( materia_idmateria )
        REFERENCES materia ( idmateria )
            ON DELETE CASCADE;

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE materiasxestudiante
    ADD CONSTRAINT materiasxestudiante_fk FOREIGN KEY ( estudiante_email,
                                                                   estudiante_id )
        REFERENCES estudiante ( email,
                                id )
            ON DELETE CASCADE;

ALTER TABLE materiasxestudiante
    ADD CONSTRAINT materiasxestudiante_materia_fk FOREIGN KEY ( materia_idmateria )
        REFERENCES materia ( idmateria )
            ON DELETE CASCADE;

