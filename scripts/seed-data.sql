-- Insert sample event
INSERT INTO events (name, description, start_date, end_date, venue, max_attendees) VALUES
('vlsid', 'The premier event bringing together innovators from around the world', '2024-03-15', '2024-03-17', 'Bangalore, India', 5000);

-- Insert ticket types
INSERT INTO ticket_types (event_id, name, description, price_inr, price_usd, max_quantity) VALUES
(1, 'Conference', 'Access to all conference sessions', 5000.00, 60.00, 2000),
(1, 'Tutorial', 'Hands-on tutorial sessions', 3000.00, 40.00, 1000),
(1, 'Both', 'Complete access to everything', 7500.00, 90.00, 2000);
