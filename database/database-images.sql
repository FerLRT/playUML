DO $$
DECLARE
    achievement_path TEXT := 'C:\\Users\\...\\playUML-images\\Logros\\';
	diagram_img_path TEXT := 'C:\\Users\\...\\playUML-images\\';
BEGIN
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    experience_points INT DEFAULT 0, -- Puntos de conocimiento
    level INT DEFAULT 1, -- Nivel del usuario
    role VARCHAR(20) NOT NULL DEFAULT 'estudiante',
    last_connection TIMESTAMP
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    teacher_id INT REFERENCES users(id)
);

ALTER TABLE users ADD COLUMN current_class_id INT REFERENCES classes(id);

CREATE TABLE user_classes (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, class_id)
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    experience_points INT NOT NULL -- Puntos de conocimiento que se obtienen al completar el quiz
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    type INT NOT NULL
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    image_data TEXT NOT NULL
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT,
	answer_code TEXT,
    answer_image TEXT,
    score FLOAT NOT NULL
);

CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    level_number INT NOT NULL,
    required_experience_points INT NOT NULL -- Puntos de conocimiento requeridos para alcanzar este nivel
);

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    badge_url TEXT,
    type INT NOT NULL,
    requirement INT 
);

CREATE TABLE user_achievements (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INT REFERENCES achievements(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE user_quizzes (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    score FLOAT,
    attempts INT DEFAULT 1,
    PRIMARY KEY (user_id, quiz_id)
);

CREATE TABLE user_question_answers (
    user_id INT,
    quiz_id INT,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    answer_ids INT[],
    PRIMARY KEY (user_id, quiz_id, question_id),
    FOREIGN KEY (user_id, quiz_id) REFERENCES user_quizzes(user_id, quiz_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unlock_order INT
);

CREATE TABLE quiz_category (
    quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (quiz_id, category_id)
);

-- Insertar categorías
INSERT INTO categories (name, unlock_order) VALUES ('Repaso', NULL);
INSERT INTO categories (name, unlock_order) VALUES ('Casos de Uso', 1);
INSERT INTO categories (name, unlock_order) VALUES ('Diagrama de Clases', 2);
INSERT INTO categories (name, unlock_order) VALUES ('Diagrama de Objetos', 3);
INSERT INTO categories (name, unlock_order) VALUES ('Diagrama de Secuencia', 4);

-- Insertar niveles de ejemplo con puntos de conocimiento requeridos
INSERT INTO levels (level_number, required_experience_points) 
VALUES 
    (1, 0),
    (2, 100),
    (3, 200),
    (4, 300),
    (5, 400),
    (6, 500),
    (7, 600),
    (8, 700),
    (9, 800);

-- Insertar logros
INSERT INTO achievements (name, description, badge_url, type, requirement)
VALUES
    ('Maestro en progreso', 'Completa una categoría', pg_read_binary_file(achievement_path || 'sombrero-bronce.png'), 1, 1),
    ('Maestro a medias', 'Completa el 50% de las categorías', pg_read_binary_file(achievement_path || 'sombrero-plata.png'), 1, 2),
    ('Maestro Absoluto', 'Completa el 100% de las categorías', pg_read_binary_file(achievement_path || 'sombrero-oro.png'), 1, 3),

    ('Por encima de la media', 'Obtén al menos un 5 en un test', pg_read_binary_file(achievement_path || 'guirnalda-bronce.png'), 2, 5),
    ('Superando con estilo', 'Obtén al menos un 7 en un test', pg_read_binary_file(achievement_path || 'guirnalda-plata.png'), 2, 7),
    ('La perfección personificada', 'Obtén al menos un 9 en un test', pg_read_binary_file(achievement_path || 'guirnalda-oro.png'), 2, 9),

    ('¡Volveremos!', 'Repite un test', pg_read_binary_file(achievement_path || 'reloj-bronce.png'), 3, 2),
    ('El Tercer Tiempo', 'Haz un test al menos 3 veces', pg_read_binary_file(achievement_path || 'reloj-plata.png'), 3, 3),
    ('Test-Aholic', 'Haz un test al menos 5 veces', pg_read_binary_file(achievement_path || 'reloj-oro.png'), 3, 5),

    ('Novato Certificado', 'Completa tu primer test', pg_read_binary_file(achievement_path || 'progreso-bronce.png'), 4, 1),
    ('Medio Camino Completado', 'Completa el 50% de los tests', pg_read_binary_file(achievement_path || 'progreso-plata.png'), 4, 2),
    ('Maestro de los Tests', 'Completa todos los tests', pg_read_binary_file(achievement_path || 'progreso-oro.png'), 4, 3),

    ('¡Vaya burrada!', 'Saca menos de un 2 en un test', pg_read_binary_file(achievement_path || 'burro.png'), 2, 2),
    ('¡Rompiendo barreras!', 'Supera tu mejor intento por 4 puntos', pg_read_binary_file(achievement_path || 'cohete.png'), 5, 1),
    ('Reinado de Aprobación', 'Aprueba todos los tests', pg_read_binary_file(achievement_path || 'verificado.png'), 6, 1);
	
-- Quiz Casos de Uso Básico
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Casos de Uso Básico', 50);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (1, 2);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, 'En la imagen se muestra un diagrama de casos de uso ¿Cuál es el propósito principal de este tipo de diagramas?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (1, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P1\\B_P1_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (1, 'Modelar la estructura interna del sistema', NULL, NULL, -0.25),
    (1, 'Capturar el comportamiento deseado de un sistema (el qué) sin especificar cómo se implementa', NULL, NULL, 1),
    (1, 'Visualizar la implementación detallada del sistema', NULL, NULL, -0.25),
    (1, 'Representar las clases y sus relaciones en el sistema', NULL, NULL, -0.5);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, '¿Qué representa un actor en un diagrama de casos de uso?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (2, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P2\\B_P2_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (2, 'Un objeto dentro del sistema', NULL, NULL, -0.25),
    (2, 'Una acción que realiza el sistema', NULL, NULL, -0.25),
    (2, 'Un rol que interactúa con el sistema', NULL, NULL, 1),
    (2, 'Una relación entre casos de uso', NULL, NULL, -0.5);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, '¿Cuál de los siguientes actores está correctamente nombrado?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (3, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P3\\b_p3_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (3, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P3\\b_p3_r1.png'), -0.25),
    (3, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P3\\b_p3_r2.png'), -0.25),
    (3, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P3\\b_p3_r3.png'), -0.25),
    (3, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P3\\b_p3_r4.png'), -0.25),
    (3, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P3\\b_p3_r5.png'), -0.25),
    (3, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P3\\b_p3_r6.png'), 1);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, 'En la imagen se muestra una relación de <<extend>>. ¿Qué muestra este tipo de relación?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (4, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P4\\b_p4_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (4, 'El comportamiento de un caso de uso que no es independiente, sino que forma parte de un uso más amplio', NULL, NULL, -0.25),
    (4, 'Que un caso de uso incluye el comportamiento de un actor externo en su comportamiento', NULL, NULL, -0.25),
    (4, 'Que un caso de uso proporcione opcionalmente funcionalidad adicional a otro caso de uso en determinados puntos', NULL, NULL, 1),
    (4, 'Que un caso de uso hereda el comportamiento de otro caso de uso', NULL, NULL, -0.25);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, 'En la imagen se muestra la posibilidad de agregar escenarios a un caso de uso ¿Cuáles son los diferentes tipos de escenarios que puede tener un caso de uso?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (5, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P5\\b_p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (5, 'Escenarios simples', NULL, NULL, -0.25),
    (5, 'Escenarios complejos', NULL, NULL, -0.25),
    (5, 'Escenarios principales', NULL, NULL, 0.5),
    (5, 'Escenarios alternativos', NULL, NULL, 0.5),
    (5, 'No existen distintos tipos de escenarios', NULL, NULL, -0.5);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, 'En la imagen se muestra la posibilidad de agregar descripciones a los casos de uso ¿Cuál es el objetivo de estas descripciones?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (6, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P6\\b_p6_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (6, 'Definir los requisitos no funcionales del sistema', NULL, NULL, -0.25),
    (6, 'Especificar las interfaces de usuario', NULL, NULL, -0.5),
    (6, 'Esbozar el propósito y alcance de una funcionalidad específica del sistema, identificando actores, objetivos y contexto general', NULL, NULL, 1),
    (6, 'Describir las clases y sus métodos en el sistema', NULL, NULL, -0.25);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, 'De las imágenes dadas, ¿cuál representa una colaboración?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (7, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P7\\b_p7_1.png')),
    (7, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P7\\b_p7_2.png')),
    (7, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P7\\b_p7_3.png')),
    (7, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P7\\b_p7_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (7, 'Modelo A', NULL, NULL, 1),
    (7, 'Modelo B', NULL, NULL, -0.1),
    (7, 'Modelo C', NULL, NULL, -0.1),
    (7, 'Modelo D', NULL, NULL, -0.1);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, 'En la imagen se muestra una relación de <<include>>. ¿Qué muestra este tipo de relación?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (8, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P8\\b_p8_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (8, 'Un caso de uso hereda el comportamiento de otro caso de uso', NULL, NULL, -0.25),
    (8, 'Un caso de uso incluye el comportamiento de un actor externo en su comportamiento', NULL, NULL, -0.25),
    (8, 'Que un caso de uso proporcione opcionalmente funcionalidad adicional a otro caso de uso en determinados puntos', NULL, NULL, -0.25),
    (8, 'El comportamiento de un caso de uso que no es independiente, sino que se incorpora como parte de un caso de uso más amplio', NULL, NULL, 1);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, '¿Cuál es el propósito de utilizar la herencia en un diagrama de casos de uso?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (9, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P9\\b_p9_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (9, 'Para mostrar que un caso de uso es una versión más específica de un caso de uso principal', NULL, NULL, 0.5),
    (9, 'Para representar la relación entre un caso de uso principal y sus variantes', NULL, NULL, -0.25),
    (9, 'Para demostrar la relación entre un caso de uso y sus escenarios alternativos', NULL, NULL, -0.25),
    (9, 'Para indicar que un actor hereda sus propiedades de otro actor', NULL, NULL, 0.5);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (1, '¿Cuál de los siguientes casos de uso está correctamente nombrado?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (10, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (10, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r1.png'), -0.25),
    (10, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r2.png'), -0.25),
    (10, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r3.png'), -0.25),
    (10, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r4.png'), 1),
    (10, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r5.png'), -0.25),
    (10, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r6.png'), -0.25);

-- Quiz Casos de Uso Intermedio
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Casos de Uso Intermedio', 100);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (2, 2);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'Siguiendo el diagrama dado, ¿qué actor(es) podría(n) invocar el caso de uso E? Seleccione todos los que correspondan', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (11, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P1\\i_p1_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (11, 'A', NULL, NULL, -0.25),
    (11, 'B', NULL, NULL, 1),
    (11, 'C', NULL, NULL, -0.25),
    (11, 'J', NULL, NULL, -0.25),
    (11, 'K', NULL, NULL, -0.25),
    (11, 'L', NULL, NULL, -0.25);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'En el diagrama dado, ¿qué actor(es) podría(n) invocar el comportamiento de al menos un caso de uso? Seleccione todos los que correspondan', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (12, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P2\\i_p2_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (12, 'A', NULL, NULL, 0.20),
    (12, 'B', NULL, NULL, 0.20),
    (12, 'C', NULL, NULL, 0.20),
    (12, 'J', NULL, NULL, 0.20),
    (12, 'K', NULL, NULL, 0.20),
    (12, 'L', NULL, NULL, -0.5);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'En el diagrama dado, ¿qué comportamiento de caso de uso se incorpora opcionalmente al comportamiento de otro caso de uso en un punto específico?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (13, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P3\\i_p3_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (13, 'D', NULL, NULL, -0.25),
    (13, 'E', NULL, NULL, -0.25),
    (13, 'F', NULL, NULL, 1),
    (13, 'G', NULL, NULL, -0.25),
    (13, 'H', NULL, NULL, -0.25),
    (13, 'I', NULL, NULL, -0.25);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'En el diagrama dado, ¿qué caso de uso puede ser iniciado por el actor B?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (14, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P4\\i_p4_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (14, 'A', NULL, NULL, -0.25),
    (14, 'C', NULL, NULL, -0.25),
    (14, 'D', NULL, NULL, 1),
    (14, 'E', NULL, NULL, -0.25),
    (14, 'F', NULL, NULL, -0.25),
    (14, 'G', NULL, NULL, -0.25),
    (14, 'H', NULL, NULL, -0.25);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'En el siguiente diagrama, ¿qué caso de uso tiene un comportamiento similar al caso de uso D?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (15, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P5\\i_p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (15, 'A', NULL, NULL, -0.25),
    (15, 'B', NULL, NULL, -0.25),
    (15, 'C', NULL, NULL, 1),
    (15, 'E', NULL, NULL, -0.25),
    (15, 'F', NULL, NULL, -0.25),
    (15, 'G', NULL, NULL, -0.25),
    (15, 'H', NULL, NULL, -0.25);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'En el siguiente diagrama, ¿qué caso de uso no puede ser independiente, sino que está incorporado en el comportamiento de otro caso de uso?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (16, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P6\\i_p6_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (16, 'D', NULL, NULL, -0.25),
    (16, 'E', NULL, NULL, -0.25),
    (16, 'F', NULL, NULL, -0.25),
    (16, 'G', NULL, NULL, -0.25),
    (16, 'H', NULL, NULL, 1),
    (16, 'I', NULL, NULL, -0.25);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'De las imágenes dadas, ¿cuáles son elementos básicos de un diagrama de casos de uso?  Seleccione todos los que correspondan', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (17, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P7\\i_p7_1.png')),
    (17, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P7\\i_p7_2.png')),
    (17, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P7\\i_p7_3.png')),
    (17, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P7\\i_p7_4.png')),
    (17, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P7\\i_p7_5.png')),
    (17, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P7\\i_p7_6.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (17, 'Elemento A', NULL, NULL, -0.25),
    (17, 'Elemento B', NULL, NULL, 0.33),
    (17, 'Elemento C', NULL, NULL, -0.25),
    (17, 'Elemento D', NULL, NULL, 0.33),
    (17, 'Elemento E', NULL, NULL, -0.25),
    (17, 'Elemento F', NULL, NULL, 0.34);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'En el diagrama dado, ¿qué actor(es) no puede(n) invocar el comportamiento de ningún caso de uso?  Seleccione todos los que correspondan', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (18, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P8\\i_p8_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (18, 'A', NULL, NULL, -0.25),
    (18, 'B', NULL, NULL, -0.25),
    (18, 'C', NULL, NULL, -0.25),
    (18, 'J', NULL, NULL, -0.25),
    (18, 'K', NULL, NULL, -0.25),
    (18, 'L', NULL, NULL, 1);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'En el diagrama dado, ¿qué dos casos de uso están relacionados con la relación de generalización?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (19, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P9\\i_p9_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (19, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P9\\i_p9_r1.png'), -0.25),
    (19, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P9\\i_p9_r2.png'), -0.25),
    (19, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P9\\i_p9_r3.png'), -0.25),
    (19, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P9\\i_p9_r4.png'), -0.25),
    (19, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P9\\i_p9_r5.png'), 1);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (2, 'En el diagrama dado, ¿qué actor(es) podría(n) desencadenar el comportamiento de los casos de uso F y G?  Seleccione todos los que correspondan', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (20, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P10\\i_p10_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (20, 'A', NULL, NULL, -0.25),
    (20, 'B', NULL, NULL, 0.5),
    (20, 'C', NULL, NULL, 0.5),
    (20, 'J', NULL, NULL, -0.25),
    (20, 'K', NULL, NULL, -0.25),
    (20, 'L', NULL, NULL, -0.25);

-- Quiz Casos de Uso Avanzado
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Casos de Uso Avanzado', 150);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (3, 2);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Dada la siguiente descripción: "El alumno y el profesor se autenticarán mediante un nombre de usuario y una clave, además, ambos podrán dar de alta incidencias cuando noten que el sistema no funciona bien. A parte, el alumno y el profesor podrán acceder a sus funcionalidades específicas en el sistema". Identifica los actores', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (21, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P1\\a_p1_1.png')),
    (21, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P1\\a_p1_2.png')),
    (21, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P1\\a_p1_3.png')),
    (21, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P1\\a_p1_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (21, 'Modelo A', NULL, NULL, -0.25),
    (21, 'Modelo B', NULL, NULL, -0.25),
    (21, 'Modelo C', NULL, NULL, 1),
    (21, 'Modelo D', NULL, NULL, -0.25);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Dada la siguiente descripción: "El sistema de vigilancia inteligente detecta, mediante sensores de movimiento, posibles intrusiones en el edificio. El sistema notifica en una pantalla cualquier alerta al Personal de Seguridad. Todas las mañanas, el sistema imprime en papel el listado de avisos que luego revisa el gerente de la organización". Identifica los actores', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (22, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P2\\a_p2_1.png')),
    (22, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P2\\a_p2_2.png')),
    (22, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P2\\a_p2_3.png')),
    (22, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P2\\a_p2_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (22, 'Modelo A', NULL, NULL, -0.5),
    (22, 'Modelo B', NULL, NULL, 0.5),
    (22, 'Modelo C', NULL, NULL, 0.5),
    (22, 'Modelo D', NULL, NULL, -0.5);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Dada la siguiente descripción: "Los sistemas informáticos de Alcafrán gozan de un gran nivel de seguridad, por lo tanto, siempre que los usuarios se autentican o realizan una consulta, el sistema guarda un registro con la acción. Así, cuando los auditores de la JJCC tengan que auditar la seguridad del sistema se podrá consultar (mediante una funcionalidad del sistema destinada a tal fin) si alguien realizó alguna acción indebida o hubo intentos de acceso al sistema no permitidos". Identifica los actores y los casos de uso', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (23, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P3\\a_p3_1.png')),
    (23, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P3\\a_p3_2.png')),
    (23, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P3\\a_p3_3.png')),
    (23, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P3\\a_p3_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (23, 'Modelo A', NULL, NULL, 1),
    (23, 'Modelo B', NULL, NULL, -0.5),
    (23, 'Modelo C', NULL, NULL, -0.5),
    (23, 'Modelo D', NULL, NULL, -0.5);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Dada la siguiente descripción: "Los clientes del banco hacen compras con su tarjeta de crédito, y el importe se decrementa automáticamente del crédito asociado a la tarjeta. No obstante, si el cliente es un cliente “Gold” y hace una compra superior al crédito de la tarjeta, el crédito de ésta se ve incrementado para poder realizar la compra". Identifica los actores y los casos de uso', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (24, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P4\\a_p4_1.png')),
    (24, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P4\\a_p4_2.png')),
    (24, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P4\\a_p4_3.png')),
    (24, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P4\\a_p4_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (24, 'Modelo A', NULL, NULL, -0.25),
    (24, 'Modelo B', NULL, NULL, -0.25),
    (24, 'Modelo C', NULL, NULL, -0.25),
    (24, 'Modelo D', NULL, NULL, 1);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Dada la siguiente descripción: "Los clientes de los bancos, haciendo uso de su tarjeta en los cajeros, pueden sacar dinero del banco, hacer una transferencia o recargar el saldo del móvil. Eso sí, siempre tendrán que introducir el PIN previamente para poder acceder al sistema". Identifica los actores y los casos de uso', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (25, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P5\\a_p5_1.png')),
    (25, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P5\\a_p5_2.png')),
    (25, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P5\\a_p5_3.png')),
    (25, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P5\\a_p5_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (25, 'Modelo A', NULL, NULL, -0.5),
    (25, 'Modelo B', NULL, NULL, 0.5),
    (25, 'Modelo C', NULL, NULL, 0.5),
    (25, 'Modelo D', NULL, NULL, -0.5);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'iTunes permite realizar agrupaciones de canciones sobre un conjunto que el usuario ha seleccionado. Cada una de estas agrupaciones tienen una duración de 74 minutos exactos. iTunes permite realizar esta agrupación tanto manual como automáticamente". Identifica los actores y los casos de uso', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (26, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P6\\a_p6_1.png')),
    (26, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P6\\a_p6_2.png')),
    (26, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P6\\a_p6_3.png')),
    (26, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P6\\a_p6_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (26, 'Modelo A', NULL, NULL, 1),
    (26, 'Modelo B', NULL, NULL, -0.5),
    (26, 'Modelo C', NULL, NULL, -0.5),
    (26, 'Modelo D', NULL, NULL, -0.5);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Siguiendo el diagrama dado, ¿qué combinación(es) se comunica con el caso de uso F?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (27, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P7\\a_p7_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (27, 'R', NULL, NULL, -0.25),
    (27, 'R ∧ R', NULL, NULL, -0.25),
    (27, 'R ∧ T', NULL, NULL, -0.25),
    (27, 'S ∧ S', NULL, NULL, -0.25),
    (27, 'T', NULL, NULL, 1),
    (27, 'S', NULL, NULL, -0.25),
    (27, 'T ∧ S', NULL, NULL, -0.25),
    (27, 'R ∧ S', NULL, NULL, -0.25),
    (27, 'T ∧ T', NULL, NULL, -0.25);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Siguiendo el diagrama dado, ¿qué combinación(es) se comunica con el caso de uso A?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (28, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P8\\a_p8_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (28, 'Ninguno', NULL, NULL, -0.25),
    (28, 'S', NULL, NULL, -0.25),
    (28, 'R ∧ R', NULL, NULL, -0.25),
    (28, 'R', NULL, NULL, 1),
    (28, 'R ∧ U', NULL, NULL, -0.25),
    (28, 'R ∧ S', NULL, NULL, -0.25),
    (28, 'U', NULL, NULL, -0.25),
    (28, 'S ∧ S', NULL, NULL, -0.25);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Teniendo en cuenta esta descripción: "Un estudiante edita su perfil de usuario. En el transcurso de lo anterior, también puede cambiar su contraseña si lo desea". Completa el diagrama con las relaciones correctas', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (29, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (29, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r1.png'), -0.25),
    (29, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r2.png'), 1),
    (29, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r3.png'), -0.25),
    (29, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r4.png'), -0.25),
    (29, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r5.png'), -0.25),
    (29, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r6.png'), -0.25);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (3, 'Teniendo en cuenta esta descripción: "Un profesor está realizando una entrevista con un estudiante. En el transcurso de eso, el maestro siempre tiene que calificar al alumno". Completa el diagrama con las relaciones correctas', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (30, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P10\\a_p10_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (30, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P10\\a_p10_r1.png'), -0.25),
    (30, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P10\\a_p10_r2.png'), -0.25),
    (30, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P10\\a_p10_r3.png'), -0.25),
    (30, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P10\\a_p10_r4.png'), 1);

-- Quiz Diagrama de Clases Básico
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Diagrama de Clases Básico', 50);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (4, 3);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, 'Selecciona el modelo que mejor representa "una empresa cobra muebles hechos a medida que se ensamblan a partir de componentes prefabricados"', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (31, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P1\\b_p1_1.png')),
    (31, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P1\\b_p1_2.png')),
    (31, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P1\\b_p1_3.png')),
    (31, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P1\\b_p1_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (31, 'Modelo A', NULL, NULL, -0.25),
    (31, 'Modelo B', NULL, NULL, -0.25),
    (31, 'Modelo C', NULL, NULL, 1),
    (31, 'Modelo D', NULL, NULL, -0.25);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Un diagrama de clases describe…?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (32, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P2\\b_p2_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (32, 'La vista práctica de un sistema', NULL, NULL, -0.25),
    (32, 'La vista de interacción de un sistema', NULL, NULL, -0.25),
    (32, 'La vista estática de un sistema', NULL, NULL, 1),
    (32, 'La vista dinámica de un sistema', NULL, NULL, -0.25);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Qué modelo de los dados representa correctamente que cada charla puede ser impartida por un profesor o por un asistente?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (33, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P3\\b_p3_1.png')),
    (33, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P3\\b_p3_2.png')),
    (33, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P3\\b_p3_3.png')),
    (33, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P3\\b_p3_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (33, 'Modelo A', NULL, NULL, -0.25),
    (33, 'Modelo B', NULL, NULL, -0.25),
    (33, 'Modelo C', NULL, NULL, -0.25),
    (33, 'Modelo D', NULL, NULL, 1);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Qué modelo de los dados representa correctamente que un evento puede ser parte de otro evento?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (34, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P4\\b_p4_1.png')),
    (34, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P4\\b_p4_2.png')),
    (34, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P4\\b_p4_3.png')),
    (34, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P4\\b_p4_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (34, 'Modelo A', NULL, NULL, -0.25),
    (34, 'Modelo B', NULL, NULL, -0.25),
    (34, 'Modelo C', NULL, NULL, -0.25),
    (34, 'Modelo D', NULL, NULL, 1);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Qué modelo de los dados representa correctamente que un viaje puede comprender varios tours y un tour puede incluirse en varios viajes?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (35, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P5\\b_p5_1.png')),
    (35, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P5\\b_p5_2.png')),
    (35, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P5\\b_p5_3.png')),
    (35, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P5\\b_p5_4.png')),
    (35, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P5\\b_p5_5.png')),
    (35, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P5\\b_p5_6.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (35, 'Modelo A', NULL, NULL, -0.25),
    (35, 'Modelo B', NULL, NULL, -0.25),
    (35, 'Modelo C', NULL, NULL, -0.25),
    (35, 'Modelo D', NULL, NULL, 1),
    (35, 'Modelo E', NULL, NULL, -0.25),
    (35, 'Modelo F', NULL, NULL, -0.25);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Qué modelo de los dados representa correctamente que hay exactamente dos tipos de participantes, "miembros" e "invitados" y que los "invitados" son invitados por los "miembros"?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (36, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P6\\b_p6_1.png')),
    (36, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P6\\b_p6_2.png')),
    (36, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P6\\b_p6_3.png')),
    (36, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P6\\b_p6_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (36, 'Modelo A', NULL, NULL, 1),
    (36, 'Modelo B', NULL, NULL, -0.25),
    (36, 'Modelo C', NULL, NULL, -0.25),
    (36, 'Modelo D', NULL, NULL, -0.25);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Qué modelo de los dados representa correctamente que un equipo se puede componer de otros equipos?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (37, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P7\\b_p7_1.png')),
    (37, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P7\\b_p7_2.png')),
    (37, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P7\\b_p7_3.png')),
    (37, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P7\\b_p7_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (37, 'Modelo A', NULL, NULL, -0.25),
    (37, 'Modelo B', NULL, NULL, -0.25),
    (37, 'Modelo C', NULL, NULL, 1),
    (37, 'Modelo D', NULL, NULL, -0.25);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Qué modelo de la izquierda representa correctamente que durante una temporada de fútbol, varios jugadores participan en varios partidos y cada jugador marca en cada partido un determinado número de goles?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (38, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P8\\b_p8_1.png')),
    (38, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P8\\b_p8_2.png')),
    (38, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P8\\b_p8_3.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (38, 'Modelo A', NULL, NULL, -0.25),
    (38, 'Modelo B', NULL, NULL, -0.25),
    (38, 'Modelo C', NULL, NULL, 1);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Qué modelo de los dados representa correctamente que un gimnasio consta de varios sectores y un sector puede dividirse en varios sectores que también podrían dividirse en sectores y así sucesivamente?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (39, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P9\\b_p9_1.png')),
    (39, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P9\\b_p9_2.png')),
    (39, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P9\\b_p9_3.png')),
    (39, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P9\\b_p9_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (39, 'Modelo A', NULL, NULL, -0.25),
    (39, 'Modelo B', NULL, NULL, 1),
    (39, 'Modelo C', NULL, NULL, -0.25),
    (39, 'Modelo D', NULL, NULL, -0.25);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (4, '¿Qué modelo de los dados representa correctamente que la flota de coches de una compañía de alquiler dispone de varios coches y un coche pertenece exactamente a una flota?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (40, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P10\\b_p10_1.png')),
    (40, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P10\\b_p10_2.png')),
    (40, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P10\\b_p10_3.png')),
    (40, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P10\\b_p10_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (40, 'Modelo A', NULL, NULL, -0.25),
    (40, 'Modelo B', NULL, NULL, -0.25),
    (40, 'Modelo C', NULL, NULL, -0.25),
    (40, 'Modelo D', NULL, NULL, 1);

-- Quiz Diagrama de Clases Avanzado 1
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Diagrama de Clases Avanzado 1', 150);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (5, 3);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Qué indica la navegabilidad en la asociación del diagrama UML dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (41, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P1\\a_p1_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (41, 'Indica que las instancias de Clase A pueden acceder a las instancias de Clase B, pero no al revés', NULL, NULL, 0.5),
    (41, 'Indica que las instancias de Clase B pueden acceder a las instancias de Clase A, pero no al revés', NULL, NULL, -0.5),
    (41, 'Indica que las instancias de Clase A y Clase C pueden acceder a las instancias de la otra clase en ambos sentidos', NULL, NULL, 0.5),
    (41, 'Indica que las instancias de Clase C pueden acceder a las instancias de Clase A, pero no al revés', NULL, NULL, -0.5);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Qué fragmento de código representa correctamente el diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (42, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P2\\a_p2_1.png'));
	
INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (42, NULL, 'class A {\n  B b;\n\n  void metodoA() {}\n}\n\nclass B {\n  C c;\n\n  void metodoB() {}\n}\n\nclass C {\n  A a;\n\n  void metodoC() {}\n}', NULL, 1),
    (42, NULL, 'class A {\n  B b;\n\n  void metodoA() {}\n}\n\nclass B {\n  A a;\n\n  void metodoB() {}\n}\n\nclass C {\n  B b;\n\n  void metodoC() {}\n}', NULL, -0.25),
    (42, NULL, 'class A {\n  void metodoA() {}\n}\n\nclass B {\n  void metodoB() {}\n}\n\nclass C {\n  void metodoC() {}\n}', NULL, -0.25),
    (42, NULL, 'class A {\n  B b;\n\n  void metodoA() {}\n}\n\nclass B {\n  C c;\n\n  void metodoB() {}\n}\n\nclass C {\n  void metodoC() {}\n}', NULL, -0.25);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, 'Dado el diagrama de clases, selecciona el fragmento de código que representa correctamente una de las clases del diagrama', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (43, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P3\\a_p3_1.png'));
	
INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (43, NULL, 'class Cliente {\n  Pedido pedido;\n\n  void realizarPedido()\n}', NULL, -0.25),
    (43, NULL, 'class Producto {\n  Cliente cliente;\n\nvoid calcularTotal()\n}', NULL, -0.25),
    (43, NULL, 'class Pedido {\n  Cliente[] clientes;\n}', NULL, -0.25),
    (43, NULL, 'class Pedido {\n  Producto[] productos;\n\n  void añadirProducto()\n}', NULL, 1);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Cuáles de las siguientes afirmaciones son verdaderas sobre el diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (44, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P4\\a_p4_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (44, 'Un objeto de A1 puede estar asociado con un objeto de A2', NULL, NULL, 0.33),
    (44, 'Es posible que un objeto directo de A esté asociado a un objeto de B', NULL, NULL, -0.5),
    (44, 'Un objeto (indirecto) de A puede estar asociado con un objeto de A1', NULL, NULL, 0.33),
    (44, 'Los objetos de clase B pueden asociarse con objetos de clase C a través de objetos de clase A2', NULL, NULL, 0.34);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Qué indica la multiplicidad en las asociaciones del diagrama UML dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (45, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P5\\a_p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (45, 'Indica que un cliente puede realizar ninguna o muchas órdenes', NULL, NULL, 0.25),
    (45, 'Indica que una orden debe contener al menos un producto', NULL, NULL, 0.25),
    (45, 'Indica que un producto puede estar contenido en ninguna o muchas órdenes', NULL, NULL, 0.25),
    (45, 'Indica que una orden puede ser realizada por ninguno o muchos clientes', NULL, NULL, 0.25);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Qué indican los roles en las asociaciones del diagrama UML dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (46, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P6\\a_p6_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (46, 'Indican que en un trabajo puede haber un jefe que gestione a los trabajadores', NULL, NULL, 0.34),
    (46, 'Especifican que una persona puede ser empleado de una compañía y, al mismo tiempo, ser jefe de otros empleados en un trabajo', NULL, NULL, 0.33),
    (46, 'Indican que una compañía puede ser empleadora de personas y, al mismo tiempo, tener un rol de gestión sobre otras compañías en una asociación', NULL, NULL, -0.5),
    (46, 'Expresan que en una relación laboral, una persona puede tener roles tanto de empleado como de jefe, dependiendo del contexto del trabajo', NULL, NULL, 0.33);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Qué afirmaciones son ciertas?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (47, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P7\\a_p7_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (47, 'Un objeto de A1 puede asociarse directamente con un objeto de B', NULL, NULL, 0.25),
    (47, 'Existen objetos de clase B que no están asociados con objetos de clase A2', NULL, NULL, 0.25),
    (47, 'Cada objeto de A1 tiene que ser una instancia de A', NULL, NULL, 0.25),
    (47, 'Un objeto (indirecto) de A puede asociarse con un objeto de A2', NULL, NULL, 0.25);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Cuáles de las siguientes afirmaciones son verdaderas respecto al diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (48, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P8\\a_p8_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (48, 'Los objetos de C y B pueden ver f', NULL, NULL, -0.5),
    (48, 'Un objeto de A puede o no contener objetos de C', NULL, NULL, 0.33),
    (48, 'Los objetos de B y D pueden ver g', NULL, NULL, 0.33),
    (48, 'Una instancia de A puede ver y', NULL, NULL, 0.34);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Cuáles de las siguientes afirmaciones son verdaderas respecto al diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (49, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P9\\a_p9_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (49, 'Los grupos solo pueden estar formados por personas, no pueden formar parte de otros grupos', NULL, NULL, -0.2),
    (49, 'Si se elimina una cita, todas las referencias vinculadas a ella también se eliminan', NULL, NULL, 0.5),
    (49, 'Es posible navegar desde una cita hasta la persona que está a cargo de la misma', NULL, NULL, 0.5),
    (49, 'Se puede asignar una referencia a varias citas', NULL, NULL, -0.2),
    (49, 'Hay citas que aún no tienen ningún participante asignado', NULL, NULL, -0.2),
    (49, 'Si se elimina un grupo, todas las personas que están en ese grupo también se eliminan', NULL, NULL, -0.2);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (5, '¿Qué afirmaciones son ciertas respecto al diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (50, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P10\\a_p10_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (50, 'Un objeto de D está asociado con al menos un objeto de B', NULL, NULL, 0.5),
    (50, 'Existen instancias directas de A', NULL, NULL, -0.25),
    (50, 'Un objeto de B está asociado con 1..* objetos de D', NULL, NULL, -0.25),
    (50, 'Un objeto de una subclase de A está asociado con * objetos de C', NULL, NULL, 0.5);

-- Quiz Diagrama de Clases Avanzado 2
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Diagrama de Clases Avanzado 2', 150);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (6, 3);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, 'En el contexto del diagrama de clases UML dado, ¿por qué se ha elegido la agregación en las relaciones entre la clase Telephone y las clases Ringer, Caller ID y Answering Machine en lugar de la composición?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (51, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P1\\a2_p1_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (51, 'La agregación se prefirió sobre la composición porque las instancias de las clases Ringer, Caller ID y Answering Machine pueden existir independientemente del Teléfono y podrían ser compartidas por varios teléfonos ', NULL, NULL, 1),
    (51, 'Se eligió la agregación en lugar de la composición debido a que las instancias de Ringer, Caller ID y Answering Machine son parte integral de la clase Teléfono y su existencia está directamente controlada por esta última', NULL, NULL, -0.25),
    (51, 'La composición fue preferida sobre la agregación para garantizar que las instancias de Ringer, Caller ID y Answering Machine se destruyan automáticamente cuando se destruye una instancia de Teléfono', NULL, NULL, -0.25),
    (51, 'La agregación se seleccionó sobre la composición porque las instancias de Ringer, Caller ID y Answering Machine están completamente encapsuladas dentro de las instancias de Teléfono y no pueden existir sin ellas', NULL, NULL, -0.25);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, 'Teniendo en cuenta el modelo original, ¿qué variación(es) representa(n) correctamente la posibilidad de enviar mensajes de texto?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (52, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P2\\a2_p2_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (52, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P2\\a2_p2_r1.png'), -0.25),
    (52, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P2\\a2_p2_r2.png'), 1),
    (52, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P2\\a2_p2_r3.png'), -0.25);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, 'Teniendo en cuenta el modelo original, ¿qué variación(es) representa(n) correctamente que cada empleado tiene asignado un cargo?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (53, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P3\\a2_p3_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (53, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P3\\a2_p3_r1.png'), 0.5),
    (53, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P3\\a2_p3_r2.png'), 0.5),
    (53, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P3\\a2_p3_r3.png'), -0.5);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, 'En el contexto del diagrama de clases UML dado, ¿cuántos empleados comforman un departamente?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (54, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P4\\a2_p4_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (54, 'No es necesario un mínimo de empleados por departamento', NULL, NULL, -0.25),
    (54, 'Cada departamento tiene un único empleado', NULL, NULL, -0.25),
    (54, 'Cada departamento tiene al menos un empleado', NULL, NULL, 1),
    (54, 'Son necesarios al menos 10 empleados por departamento', NULL, NULL, -0.25);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, '¿Cuáles de las siguientes afirmaciones son verdaderas respecto al diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (55, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P5\\a2_p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (55, 'Hay grupos que no tienen personas asignadas', NULL, NULL, 0.33),
    (55, 'Un grupo puede constar de varias personas', NULL, NULL, 0.33),
    (55, 'Varias personas están a cargo de una cita', NULL, NULL, -0.25),
    (55, 'Una persona puede estar incluida en varios grupos', NULL, NULL, 0.34),
    (55, 'Un participante que ha sido asignado a una cita puede ser grupo y persona a la vez', NULL, NULL, -0.25),
    (55, 'Es posible navegar desde una persona a las citas que tiene a su cargo', NULL, NULL, -0.25);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, 'Teniendo en cuenta el modelo original, ¿qué variación(es) representa(n) correctamente que el motor es una parte esencial del coche, y su existencia y funcionalidad están intrínsecamente ligadas al coche mismo?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (56, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (56, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_r1.png'), -0.25),
    (56, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_r2.png'), -0.25),
    (56, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_r3.png'), 1),
    (56, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_r4.png'), -0.25);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, 'Teniendo en cuenta el modelo original, ¿qué variación(es) representa(n) correctamente que existen distintos tipos de vehículos con unas propiedades concretas para cada tipo?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (57, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P7\\a2_p7_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (57, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P7\\a2_p7_r1.png'), -0.25),
    (57, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P7\\a2_p7_r2.png'), -0.25),
    (57, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P7\\a2_p7_r3.png'), 1);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, 'En el contexto del diagrama de clases UML dado, ¿por qué se utiliza la enumeración?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (58, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P8\\a2_p8_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (58, 'Se podría modelar el estado del pedido como una clase separada llamada "OrderStatus" conectada a la clase "Order". Esto permitiría una mayor flexibilidad al definir nuevos estados de pedido en el futuro sin necesidad de modificar la estructura de clases existente', NULL, NULL, -0.25),
    (58, 'Se utiliza una enumeración porque el estado del pedido es un conjunto finito y predefinido de valores que pueden ser claramente definidos. Esto simplifica la representación y el manejo de los estados del pedido en el sistema, evitando la necesidad de definir múltiples clases o atributos', NULL, NULL, 1),
    (58, 'Podríamos tener un atributo "status" de tipo String en la clase "Order" en lugar de una enumeración. Esto permitiría una representación más flexible de los estados del pedido, ya que podríamos almacenar cualquier valor de cadena como estado, en lugar de limitarnos a un conjunto predefinido de valores simplificando el sistema', NULL, NULL, -0.25),
    (58, 'En lugar de utilizar una enumeración, podríamos representar el estado del pedido como un conjunto de clases separadas. Esto permitiría una mayor flexibilidad al definir comportamientos específicos para cada estado del pedido', NULL, NULL, -0.25);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, '¿Qué característica comparten todas las formas de pago representadas en el diagrama de clases dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (59, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P9\\a2_p9_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (59, 'Todas las formas de pago heredan el atributo "amount" de la clase Payment', NULL, NULL, 1),
    (59, 'Todas las formas de pago tienen métodos "realizarPago()" para procesar la transacción', NULL, NULL, -0.25),
    (59, 'Todas las formas de pago tienen un atributo "tipo" para identificar el método de pago', NULL, NULL, -0.25),
    (59, 'Todas las formas de pago tienen un método "verificarFondos()" para comprobar si hay suficiente dinero disponible para la transacción', NULL, NULL, -0.25);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (6, 'Teniendo en cuenta el modelo original, ¿qué variación(es) representa(n) correctamente que un Hub tenga al menos un nodo asociado?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (60, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P10\\a2_p10_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (60, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P10\\a2_p10_r1.png'), -0.25),
    (60, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P10\\a2_p10_r2.png'), -0.25),
    (60, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P10\\a2_p10_r3.png'), 1);

-- Quiz Diagrama de Objetos
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Diagrama de Objetos', 50);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (7, 4);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (7, '¿Cuáles de los siguientes diagramas de objetos son consistentes con el diagrama de clases?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (61, pg_read_binary_file(diagram_img_path || 'Objetos\\P1\\p1_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (61, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P1\\p1_r1.png'), 1),
    (61, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P1\\p1_r2.png'), -0.25),
    (61, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P1\\p1_r3.png'), -0.25),
    (61, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P1\\p1_r4.png'), -0.25),
    (61, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P1\\p1_r5.png'), -0.25);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (7, '¿Cuáles de los siguientes diagramas de objetos son consistentes con el diagrama de clases?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (62, pg_read_binary_file(diagram_img_path || 'Objetos\\P2\\p2_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (62, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P2\\p2_r1.png'), 0.5),
    (62, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P2\\p2_r2.png'), -0.25),
    (62, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P2\\p2_r3.png'), -0.25),
    (62, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P2\\p2_r4.png'), 0.5),
    (62, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P2\\p2_r5.png'), -0.25);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (7, '¿Cuáles de los siguientes diagramas de objetos son consistentes con el diagrama de clases?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (63, pg_read_binary_file(diagram_img_path || 'Objetos\\P3\\p3_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (63, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P3\\p3_r1.png'), 0.5),
    (63, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P3\\p3_r2.png'), -0.25),
    (63, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P3\\p3_r3.png'), -0.25),
    (63, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P3\\p3_r4.png'), -0.25),
    (63, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Objetos\\P3\\p3_r5.png'), 0.5);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (7, '¿Cuál es la implicación de la asociación entre "ReservaJuan" y "Suitte Lujo" en el contexto del modelo representado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (64, pg_read_binary_file(diagram_img_path || 'Objetos\\P4\\p4_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (64, 'Define el precio de la suite de lujo reservada por Juan', NULL, NULL, 1),
    (64, 'Indica la disponibilidad de suites de lujo en el hotel', NULL, NULL, -0.25),
    (64, 'Establece la relación entre la reserva de Juan y otras reservas en el hotel', NULL, NULL, -0.25),
    (64, 'Determina el descuento aplicado a las reservas de suites de lujo', NULL, NULL, -0.25);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (7, '¿Qué función principal cumplen los atributos "ocupadas" y "disponibles" en "Hotel Pepe" según el diagrama de objetos presentado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (65, pg_read_binary_file(diagram_img_path || 'Objetos\\P5\\p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (65, 'Registrar el nombre y la dirección del hotel', NULL, NULL, -0.25),
    (65, 'Representar el estado actual de las habitaciones en el hotel', NULL, NULL, 1),
    (65, 'Determinar el número total de habitaciones en el hotel', NULL, NULL, -0.25),
    (65, 'Establecer las habitaciones disponibles para los clientes', NULL, NULL, -0.25);

-- Quiz Diagrama de Secuencia Básico
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Diagrama de Secuencia Básico', 50);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (8, 5);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (8, 'Un diagrama de secuencia describe...', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (66, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P1\\b_p1_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (66, 'Flujo de acciones no secuenciales y el resultado de estas acciones', NULL, NULL, -0.25),
    (66, 'Flujo de recursos necesarios para desarrollar una actividad', NULL, NULL, -0.25),
    (66, 'Flujo de acciones secuenciales', NULL, NULL, -0.25),
    (66, 'Flujo de acciones secuenciales y el resultado de estas acciones', NULL, NULL, 1);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (8, 'Selecciona los elementos principales de un diagrama de secuencia', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (67, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P2\\b_p2_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (67, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P2\\b_p2_r1.png'), 0.5),
    (67, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P2\\b_p2_r2.png'), 0.5),
    (67, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P2\\b_p2_r3.png'), -0.5),
    (67, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P2\\b_p2_r4.png'), -0.5);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (8, '¿Qué representan las flechas en un diagrama de secuencia?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (68, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P3\\b_p3_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (68, 'Las relaciones de herencia entre objetos', NULL, NULL, -0.25),
    (68, 'Las llamadas de métodos entre objetos', NULL, NULL, 1),
    (68, 'La asignación de valores a los atributos de un objeto', NULL, NULL, -0.25),
    (68, 'La estructura de control condicional dentro de un método', NULL, NULL, -0.25);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (8, '¿Qué indica el número al lado de una flecha en un diagrama de secuencia?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (69, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P4\\b_p4_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (69, 'El número de mensajes enviados entre objetos', NULL, NULL, -0.25),
    (69, 'La cantidad de objetos involucrados en la interacción', NULL, NULL, -0.25),
    (69, 'El orden de ejecución de los mensajes', NULL, NULL, 1),
    (69, 'La multiplicidad de la asociación entre los objetos', NULL, NULL, -0.25);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (8, '¿Qué representa el tiempo en un diagrama de secuencia?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (70, pg_read_binary_file(diagram_img_path || 'Secuencia\\Basic\\P5\\b_p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (70, 'El tiempo real en el que se ejecuta el sistema', NULL, NULL, -0.25),
    (70, 'El tiempo de vida de un objeto durante la ejecución', NULL, NULL, 1),
    (70, 'El tiempo de espera entre mensajes', NULL, NULL, -0.25),
    (70, 'El tiempo de respuesta del sistema a una solicitud', NULL, NULL, -0.25);

-- Quiz Diagrama de Secuencia Avanzado
INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Diagrama de Secuencia Avanzado', 150);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (9, 5);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, '¿Qué acción realiza el cliente en el diagrama de secuencia dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (71, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P1\\a_p1_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (71, 'Realiza un pago al banco', NULL, NULL, -0.25),
    (71, 'Solicita una cotización de préstamo', NULL, NULL, 1),
    (71, 'Recibe un informe de transacciones bancarias', NULL, NULL, -0.25),
    (71, 'Se comunica con el servicio de atención al cliente del banco', NULL, NULL, -0.25);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, '¿Cómo quedaría el modelo dado al agregar una función para que los clientes puedan revisar el historial de cotizaciones previas?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (72, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P2\\a_p2_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (72, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P2\\a_p2_r1.png'), 0.33),
    (72, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P2\\a_p2_r2.png'), 0.33),
    (72, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P2\\a_p2_r3.png'), 0.34);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, '¿Por qué son importantes los mensajes de respuesta en un diagrama de secuencia?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (73, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P3\\a_p3_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (73, 'Los mensajes de respuesta permiten al sistema comunicar el resultado de una operación al objeto que inició la solicitud', NULL, NULL, 1),
    (73, 'Los mensajes de respuesta son opcionales y no afectan el funcionamiento del sistema', NULL, NULL, -0.25),
    (73, 'Los mensajes de respuesta solo se utilizan para informar errores en el sistema', NULL, NULL, -0.25),
    (73, 'Los mensajes de respuesta no son importantes y pueden ser omitidos en un diagrama de secuencia', NULL, NULL, -0.25);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, '¿Qué utilidad tiene el mensaje que se muestra en el diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (74, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P4\\a_p4_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (74, 'Se utiliza para comunicarse con otros objetos en el sistema', NULL, NULL, -0.25),
    (74, 'Es una forma de representar bucles o iteraciones en el comportamiento de un objeto', NULL, NULL, 1),
    (74, 'Es opcional y no afecta al funcionamiento del sistema', NULL, NULL, -0.25),
    (74, 'Solo se utiliza en casos de error en el sistema', NULL, NULL, -0.25);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, '¿Qué representa el fragmento combinado con la etiqueta "opt" del diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (75, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P5\\a_p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (75, 'Indica una opción que puede ocurrir en ciertas circunstancias durante la secuencia de interacción', NULL, NULL, -0.25),
    (75, 'Representa una iteración que se repetirá varias veces durante la secuencia', NULL, NULL, -0.25),
    (75, 'Se refiere a un mensaje opcional que puede ser enviado dependiendo de ciertas condiciones', NULL, NULL, 1),
    (75, 'Indica una condición de tiempo límite para completar la secuencia de interacción', NULL, NULL, -0.25);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, 'Para que el usuario tenga que confirmar la cita una vez creada, ¿qué cambios habría que hacer en el diagrama de secuencia dado?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (76, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P6\\a_p6_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (76, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P6\\a_p6_r1.png'), -0.25),
    (76, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P6\\a_p6_r2.png'), 1),
    (76, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P6\\a_p6_r3.png'), -0.25);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, '¿Qué mensaje indica al paciente que la cita ha sido creada con éxito en el diagrama de secuencia dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (77, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P7\\a_p7_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (77, 'El paciente no recibe ningún mensaje de confirmación', NULL, NULL, 1),
    (77, 'Mensaje 1', NULL, NULL, -0.25),
    (77, 'Mensaje 6', NULL, NULL, -0.25),
    (77, 'Mensaje 4', NULL, NULL, -0.25);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, 'En el diagrama dado, ¿qué representa la "x" debajo de las líneas de vida?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (78, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P8\\a_p8_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (78, 'La "x" indica que se está creando un nuevo objeto representado por la línea de vida', NULL, NULL, -0.25),
    (78, 'La "x" representa un mensaje enviado desde el objeto representado por la línea de vida', NULL, NULL, -0.25),
    (78, 'La "x" indica que se está destruyendo el objeto representado por la línea de vida', NULL, NULL, 1),
    (78, 'La "x" indica un punto de bifurcación en la secuencia de interacción', NULL, NULL, -0.25);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, 'En el diagrama dado, ¿qué diferencia hay entre el mensaje 1 y el mensaje 2?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (79, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P9\\a_p9_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (79, 'El mensaje 1 ocurre de forma asincrónica, mientras que el mensaje 2 ocurre de forma síncrona', NULL, NULL, -0.25),
    (79, 'El mensaje 1 ocurre de forma síncrona, mientras que el mensaje 2 ocurre de forma asincrónica', NULL, NULL, 1),
    (79, 'El mensaje 1 espera una respuesta inmediata, mientras que el mensaje 2 no espera una respuesta inmediata', NULL, NULL, -0.25),
    (79, 'El mensaje 1 no espera una respuesta inmediata, mientras que el mensaje 2 espera una respuesta inmediata', NULL, NULL, -0.25);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (9, '¿Cómo quedaría el diagrama si se quisiera añadir la funcionalidad de almacenar el resultado de la consulta en una caché antes de devolverlo?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (80, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P10\\a_p10_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (80, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P10\\a_p10_r1.png'), -0.25),
    (80, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P10\\a_p10_r2.png'), 1),
    (80, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Secuencia\\Advanced\\P10\\a_p10_r3.png'), -0.25);

INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Casos de Uso EXTRA', 20);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (10, 1);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'En la imagen se muestra un diagrama de casos de uso ¿Cuál es el propósito principal de este tipo de diagramas?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (81, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P1\\B_P1_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (81, 'Modelar la estructura interna del sistema', NULL, NULL, -0.25),
    (81, 'Capturar el comportamiento deseado de un sistema (el qué) sin especificar cómo se implementa', NULL, NULL, 1),
    (81, 'Visualizar la implementación detallada del sistema', NULL, NULL, -0.25),
    (81, 'Representar las clases y sus relaciones en el sistema', NULL, NULL, -0.5);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'En el diagrama dado, ¿qué actor(es) podría(n) invocar el comportamiento de al menos un caso de uso? Seleccione todos los que correspondan', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (82, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P2\\i_p2_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (82, 'A', NULL, NULL, 0.20),
    (82, 'B', NULL, NULL, 0.20),
    (82, 'C', NULL, NULL, 0.20),
    (82, 'J', NULL, NULL, 0.20),
    (82, 'K', NULL, NULL, 0.20),
    (82, 'L', NULL, NULL, -0.5);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'Dada la siguiente descripción: "Los sistemas informáticos de Alcafrán gozan de un gran nivel de seguridad, por lo tanto, siempre que los usuarios se autentican o realizan una consulta, el sistema guarda un registro con la acción. Así, cuando los auditores de la JJCC tengan que auditar la seguridad del sistema se podrá consultar (mediante una funcionalidad del sistema destinada a tal fin) si alguien realizó alguna acción indebida o hubo intentos de acceso al sistema no permitidos". Identifica los actores y los casos de uso', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (83, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P3\\a_p3_1.png')),
    (83, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P3\\a_p3_2.png')),
    (83, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P3\\a_p3_3.png')),
    (83, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P3\\a_p3_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (83, 'Modelo A', NULL, NULL, 1),
    (83, 'Modelo B', NULL, NULL, -0.5),
    (83, 'Modelo C', NULL, NULL, -0.5),
    (83, 'Modelo D', NULL, NULL, -0.5);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'En la imagen se muestra una relación de <<extend>>. ¿Qué muestra este tipo de relación?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (84, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P4\\b_p4_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (84, 'El comportamiento de un caso de uso que no es independiente, sino que forma parte de un uso más amplio', NULL, NULL, -0.25),
    (84, 'Que un caso de uso incluye el comportamiento de un actor externo en su comportamiento', NULL, NULL, -0.25),
    (84, 'Que un caso de uso proporcione opcionalmente funcionalidad adicional a otro caso de uso en determinados puntos', NULL, NULL, 1),
    (84, 'Que un caso de uso hereda el comportamiento de otro caso de uso', NULL, NULL, -0.25);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'En el siguiente diagrama, ¿qué caso de uso tiene un comportamiento similar al caso de uso D?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (85, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P5\\i_p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (85, 'A', NULL, NULL, -0.25),
    (85, 'B', NULL, NULL, -0.25),
    (85, 'C', NULL, NULL, 1),
    (85, 'E', NULL, NULL, -0.25),
    (85, 'F', NULL, NULL, -0.25),
    (85, 'G', NULL, NULL, -0.25),
    (85, 'H', NULL, NULL, -0.25);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'iTunes permite realizar agrupaciones de canciones sobre un conjunto que el usuario ha seleccionado. Cada una de estas agrupaciones tienen una duración de 74 minutos exactos. iTunes permite realizar esta agrupación tanto manual como automáticamente". Identifica los actores y los casos de uso', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (86, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P6\\a_p6_1.png')),
    (86, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P6\\a_p6_2.png')),
    (86, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P6\\a_p6_3.png')),
    (86, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P6\\a_p6_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (86, 'Modelo A', NULL, NULL, 1),
    (86, 'Modelo B', NULL, NULL, -0.5),
    (86, 'Modelo C', NULL, NULL, -0.5),
    (86, 'Modelo D', NULL, NULL, -0.5);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'De las imágenes dadas, ¿cuál representa una colaboración?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (87, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P7\\b_p7_1.png')),
    (87, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P7\\b_p7_2.png')),
    (87, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P7\\b_p7_3.png')),
    (87, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P7\\b_p7_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (87, 'Modelo A', NULL, NULL, 1),
    (87, 'Modelo B', NULL, NULL, -0.1),
    (87, 'Modelo C', NULL, NULL, -0.1),
    (87, 'Modelo D', NULL, NULL, -0.1);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'En el diagrama dado, ¿qué actor(es) no puede(n) invocar el comportamiento de ningún caso de uso?  Seleccione todos los que correspondan', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (88, pg_read_binary_file(diagram_img_path || 'CdU\\Intermediate\\P8\\i_p8_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (88, 'A', NULL, NULL, -0.25),
    (88, 'B', NULL, NULL, -0.25),
    (88, 'C', NULL, NULL, -0.25),
    (88, 'J', NULL, NULL, -0.25),
    (88, 'K', NULL, NULL, -0.25),
    (88, 'L', NULL, NULL, 1);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, 'Teniendo en cuenta esta descripción: "Un estudiante edita su perfil de usuario. En el transcurso de lo anterior, también puede cambiar su contraseña si lo desea". Completa el diagrama con las relaciones correctas', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (89, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (89, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r1.png'), -0.25),
    (89, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r2.png'), 1),
    (89, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r3.png'), -0.25),
    (89, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r4.png'), -0.25),
    (89, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r5.png'), -0.25),
    (89, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Advanced\\P9\\a_p9_r6.png'), -0.25);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (10, '¿Cuál de los siguientes casos de uso está correctamente nombrado?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (90, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (90, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r1.png'), -0.25),
    (90, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r2.png'), -0.25),
    (90, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r3.png'), -0.25),
    (90, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r4.png'), 1),
    (90, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r5.png'), -0.25),
    (90, NULL, NULL, pg_read_binary_file(diagram_img_path || 'CdU\\Basic\\P10\\b_p10_r6.png'), -0.25);

INSERT INTO quizzes (name, experience_points) 
VALUES 
    ('Diagrama de Clases EXTRA', 20);

INSERT INTO quiz_category (quiz_id, category_id)
VALUES 
    (11, 1);

-- Pregunta 1
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, 'Selecciona el modelo que mejor representa "una empresa cobra muebles hechos a medida que se ensamblan a partir de componentes prefabricados"', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (91, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P1\\b_p1_1.png')),
    (91, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P1\\b_p1_2.png')),
    (91, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P1\\b_p1_3.png')),
    (91, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P1\\b_p1_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (91, 'Modelo A', NULL, NULL, -0.25),
    (91, 'Modelo B', NULL, NULL, -0.25),
    (91, 'Modelo C', NULL, NULL, 1),
    (91, 'Modelo D', NULL, NULL, -0.25);

-- Pregunta 2
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, '¿Qué fragmento de código representa correctamente el diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (92, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P2\\a_p2_1.png'));
	
INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (92, NULL, 'class A {\n  B b;\n\n  void metodoA() {}\n}\n\nclass B {\n  C c;\n\n  void metodoB() {}\n}\n\nclass C {\n  A a;\n\n  void metodoC() {}\n}', NULL, 1),
    (92, NULL, 'class A {\n  B b;\n\n  void metodoA() {}\n}\n\nclass B {\n  A a;\n\n  void metodoB() {}\n}\n\nclass C {\n  B b;\n\n  void metodoC() {}\n}', NULL, -0.25),
    (92, NULL, 'class A {\n  void metodoA() {}\n}\n\nclass B {\n  void metodoB() {}\n}\n\nclass C {\n  void metodoC() {}\n}', NULL, -0.25),
    (92, NULL, 'class A {\n  B b;\n\n  void metodoA() {}\n}\n\nclass B {\n  C c;\n\n  void metodoB() {}\n}\n\nclass C {\n  void metodoC() {}\n}', NULL, -0.25);

-- Pregunta 3
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, 'Teniendo en cuenta el modelo original, ¿qué variación(es) representa(n) correctamente que cada empleado tiene asignado un cargo?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (93, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P3\\a2_p3_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (93, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P3\\a2_p3_r1.png'), 0.5),
    (93, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P3\\a2_p3_r2.png'), 0.5),
    (93, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P3\\a2_p3_r3.png'), -0.5);

-- Pregunta 4
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, '¿Qué modelo de los dados representa correctamente que un evento puede ser parte de otro evento?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (94, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P4\\b_p4_1.png')),
    (94, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P4\\b_p4_2.png')),
    (94, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P4\\b_p4_3.png')),
    (94, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P4\\b_p4_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (94, 'Modelo A', NULL, NULL, -0.25),
    (94, 'Modelo B', NULL, NULL, -0.25),
    (94, 'Modelo C', NULL, NULL, -0.25),
    (94, 'Modelo D', NULL, NULL, 1);

-- Pregunta 5
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, '¿Qué indica la multiplicidad en las asociaciones del diagrama UML dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (95, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P5\\a_p5_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (95, 'Indica que un cliente puede realizar ninguna o muchas órdenes', NULL, NULL, 0.25),
    (95, 'Indica que una orden debe contener al menos un producto', NULL, NULL, 0.25),
    (95, 'Indica que un producto puede estar contenido en ninguna o muchas órdenes', NULL, NULL, 0.25),
    (95, 'Indica que una orden puede ser realizada por ninguno o muchos clientes', NULL, NULL, 0.25);

-- Pregunta 6
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, 'Teniendo en cuenta el modelo original, ¿qué variación(es) representa(n) correctamente que el motor es una parte esencial del coche, y su existencia y funcionalidad están intrínsecamente ligadas al coche mismo?', 3);

INSERT INTO images (question_id, image_data) 
VALUES 
    (96, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (96, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_r1.png'), -0.25),
    (96, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_r2.png'), -0.25),
    (96, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_r3.png'), 1),
    (96, NULL, NULL, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P6\\a2_p6_r4.png'), -0.25);

-- Pregunta 7
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, '¿Qué modelo de los dados representa correctamente que un equipo se puede componer de otros equipos?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (97, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P7\\b_p7_1.png')),
    (97, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P7\\b_p7_2.png')),
    (97, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P7\\b_p7_3.png')),
    (97, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P7\\b_p7_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (97, 'Modelo A', NULL, NULL, -0.25),
    (97, 'Modelo B', NULL, NULL, -0.25),
    (97, 'Modelo C', NULL, NULL, 1),
    (97, 'Modelo D', NULL, NULL, -0.25);

-- Pregunta 8
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, '¿Cuáles de las siguientes afirmaciones son verdaderas respecto al diagrama dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (98, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced\\P8\\a_p8_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (98, 'Los objetos de C y B pueden ver f', NULL, NULL, -0.5),
    (98, 'Un objeto de A puede o no contener objetos de C', NULL, NULL, 0.33),
    (98, 'Los objetos de B y D pueden ver g', NULL, NULL, 0.33),
    (98, 'Una instancia de A puede ver y', NULL, NULL, 0.34);

-- Pregunta 9
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, '¿Qué característica comparten todas las formas de pago representadas en el diagrama de clases dado?', 1);

INSERT INTO images (question_id, image_data) 
VALUES 
    (99, pg_read_binary_file(diagram_img_path || 'Clases\\Advanced2\\P9\\a2_p9_1.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (99, 'Todas las formas de pago heredan el atributo "amount" de la clase Payment', NULL, NULL, 1),
    (99, 'Todas las formas de pago tienen métodos "realizarPago()" para procesar la transacción', NULL, NULL, -0.25),
    (99, 'Todas las formas de pago tienen un atributo "tipo" para identificar el método de pago', NULL, NULL, -0.25),
    (99, 'Todas las formas de pago tienen un método "verificarFondos()" para comprobar si hay suficiente dinero disponible para la transacción', NULL, NULL, -0.25);

-- Pregunta 10
INSERT INTO questions (quiz_id, question_text, type) 
VALUES 
    (11, '¿Qué modelo de los dados representa correctamente que la flota de coches de una compañía de alquiler dispone de varios coches y un coche pertenece exactamente a una flota?', 2);

INSERT INTO images (question_id, image_data) 
VALUES 
    (100, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P10\\b_p10_1.png')),
    (100, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P10\\b_p10_2.png')),
    (100, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P10\\b_p10_3.png')),
    (100, pg_read_binary_file(diagram_img_path || 'Clases\\Basic\\P10\\b_p10_4.png'));

INSERT INTO answers (question_id, answer_text, answer_code, answer_image, score) 
VALUES 
    (100, 'Modelo A', NULL, NULL, -0.25),
    (100, 'Modelo B', NULL, NULL, -0.25),
    (100, 'Modelo C', NULL, NULL, -0.25),
    (100, 'Modelo D', NULL, NULL, 1);
END $$;
