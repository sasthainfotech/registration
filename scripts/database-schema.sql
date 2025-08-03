-- vlsid Event Management System Database Schema
-- Updated for Stripe-only payment processing with dual currency support

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    category ENUM('indian', 'international') NOT NULL,
    country ENUM('IN', 'INTL') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_category (category)
);

-- Events table
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue VARCHAR(500) NOT NULL,
    max_attendees INT NOT NULL DEFAULT 1000,
    available_seats INT NOT NULL DEFAULT 1000,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
);

-- Tickets table
CREATE TABLE tickets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    type ENUM('conference', 'tutorial', 'both') NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'used') NOT NULL DEFAULT 'pending',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    confirmation_number VARCHAR(50) UNIQUE NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    gst_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    gst_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10, 2) NOT NULL,
    currency ENUM('INR', 'USD') NOT NULL,
    user_category ENUM('indian', 'international') NOT NULL,
    purchase_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_payment_intent (payment_intent_id),
    INDEX idx_confirmation (confirmation_number),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_type (type),
    INDEX idx_currency (currency)
);

-- Payments table
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    ticket_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency ENUM('INR', 'USD') NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    payment_gateway ENUM('stripe') NOT NULL DEFAULT 'stripe',
    payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret VARCHAR(500),
    payment_method_type VARCHAR(50), -- 'card', 'upi', 'netbanking', etc.
    metadata JSON, -- Store additional payment metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_user_id (user_id),
    INDEX idx_payment_intent (payment_intent_id),
    INDEX idx_status (status),
    INDEX idx_currency (currency),
    INDEX idx_gateway (payment_gateway),
    INDEX idx_completed_at (completed_at)
);

-- Analytics events table for tracking user behavior
CREATE TABLE analytics_events (
    id VARCHAR(36) PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id VARCHAR(36),
    session_id VARCHAR(255) NOT NULL,
    properties JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_event_type (event_type),
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
);

-- Error logs table for debugging
CREATE TABLE error_logs (
    id VARCHAR(36) PRIMARY KEY,
    error_code VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    error_details TEXT,
    user_id VARCHAR(36),
    context JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_error_code (error_code),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp)
);

-- Notifications table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    ticket_id VARCHAR(36),
    type ENUM('email', 'sms') NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'bounced') NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_sent_at (sent_at)
);

-- Revenue reporting view
CREATE VIEW revenue_summary AS
SELECT 
    DATE(created_at) as date,
    currency,
    COUNT(*) as tickets_sold,
    SUM(total_price) as total_revenue,
    SUM(base_price) as base_revenue,
    SUM(gst_amount) as gst_collected,
    AVG(total_price) as avg_ticket_price
FROM tickets 
WHERE payment_status = 'completed'
GROUP BY DATE(created_at), currency;

-- Payment method usage view
CREATE VIEW payment_method_stats AS
SELECT 
    p.payment_method_type,
    p.currency,
    COUNT(*) as usage_count,
    SUM(p.amount) as total_amount,
    AVG(p.amount) as avg_amount
FROM payments p
WHERE p.status = 'completed'
GROUP BY p.payment_method_type, p.currency;

-- Ticket type distribution view
CREATE VIEW ticket_type_distribution AS
SELECT 
    t.type as ticket_type,
    t.currency,
    t.user_category,
    COUNT(*) as count,
    SUM(t.total_price) as total_revenue
FROM tickets t
WHERE t.payment_status = 'completed'
GROUP BY t.type, t.currency, t.user_category;
