-- Add insert scripts here


-- treatment entries
insert into treatments (treatment_id, treatment_type, price, code) values (1, 'Pedicure', 175, '001');
insert into treatments (treatment_id, treatment_type, price, code) values (2, 'Manicure', 215, '002');
insert into treatments (treatment_id, treatment_type, price, code) values (3, 'Make up', 185, '003');
insert into treatments (treatment_id, treatment_type, price, code) values (4, 'Brows & Lashes', 240, '004');

-- stylist entries
insert into stylists (stylist_id, stylist_first_name, stylist_last_name, commission_percentage, phone_number) values (1, 'Sino', 'Mguli', 7, '0786457736');
insert into stylists (stylist_id, stylist_first_name, stylist_last_name, commission_percentage, phone_number) values (2, 'Eric', 'Timmy', 15, '0601002100');
insert into stylists (stylist_id, stylist_first_name, stylist_last_name, commission_percentage, phone_number) values (3, 'Noxolo', 'Mndeni', 9, '0705532314');

-- clients entries
insert into clients (client_id, client_first_name, client_last_name, phone_number) values (1, 'Dreezy', 'Drako', '078746887');
insert into clients (client_id, client_first_name, client_last_name, phone_number) values (2, 'Katlego', 'Mokhele', '062542311');
insert into clients (client_id, client_first_name, client_last_name, phone_number) values (3, 'Mthunzi', 'Tom', '0212215521');
insert into clients (client_id, client_first_name, client_last_name, phone_number) values (4, 'Asisipho', 'AsiCoder', '0874635542');
insert into clients (client_id, client_first_name, client_last_name, phone_number) values (5, 'Dev', 'Stack', '0234526534');
insert into clients (client_id, client_first_name, client_last_name, phone_number) values (6, 'Dev', 'Eddy', '0315418762');
insert into clients (client_id, client_first_name, client_last_name, phone_number) values (7, 'Nick', 'Truter', '0767469843');