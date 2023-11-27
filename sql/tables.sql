-- Table create scripts here

create table clients (
    client_id serial primary key,
    client_first_name text,
    client_last_name text,
    phone_number text
);

create table treatments (
    treatment_id serial primary key,
    treatment_type text,
    code VARCHAR(3) unique,
    price numeric
);

create table stylists (
    stylist_id serial primary key,
    stylist_first_name text,
    stylist_last_name text,
    phone_number text unique,
    commission_percentage numeric(3,2)
);

create table bookings (
    booking_id serial primary key,
    booking_date date,
    booking_time time,
    booked boolean,
    treatment_code VARCHAR(3),
    foreign key (treatment_code) references treatments(code) on delete cascade,
    client_id int,
    foreign key (client_id) references clients(client_id) on delete cascade,
    stylist_id int,
    foreign key (stylist_id) references stylists(stylist_id) on delete cascade
);

create table treatments_made (
    id serial primary key,
    date_treatment_made date,
    client_id int,
    foreign key (client_id) references clients(client_id) on delete cascade,
    stylist_id int,
    foreign key (stylist_id) references stylists(stylist_id) on delete cascade,
    treatment_id int,
    foreign key (treatment_id) references treatments(treatment_id) on delete cascade
);