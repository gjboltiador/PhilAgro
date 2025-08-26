-- DANGER: Drops existing core tables (dev only). Run before re-applying schema if FKs block creation.
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS catalog_items;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS tractors;
DROP TABLE IF EXISTS trucks;
DROP TABLE IF EXISTS farms;
DROP TABLE IF EXISTS planter_memberships;
DROP TABLE IF EXISTS planters;
DROP TABLE IF EXISTS associations;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS=1;


