USE barberia_db;

CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  precio DECIMAL(10,2) NOT NULL,
  duracion_min INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  barbero_id INT NOT NULL,
  servicio_id INT NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  estado ENUM('pendiente','confirmada','cancelada','completada') NOT NULL DEFAULT 'pendiente',
  notas VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
  FOREIGN KEY (barbero_id) REFERENCES usuarios(id),
  FOREIGN KEY (servicio_id) REFERENCES servicios(id),
  INDEX idx_barbero_fecha (barbero_id, fecha_inicio)
);

INSERT IGNORE INTO servicios (nombre, descripcion, precio, duracion_min) VALUES
('Corte clasico', 'Corte de cabello con tijera o maquina', 25000, 30),
('Barba', 'Perfilado y arreglo de barba', 15000, 20),
('Corte y barba', 'Combo de corte de cabello y barba', 35000, 50);
