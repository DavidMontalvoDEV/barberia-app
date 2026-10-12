USE barberia_db;
UPDATE usuarios SET rol = 'admin' WHERE email = 'admin@mail.com';
UPDATE usuarios SET rol = 'barbero' WHERE email = 'barbero@mail.com';
