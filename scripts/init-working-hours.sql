-- Initialize default working hours for the salon
-- Monday to Saturday: 9:00 AM - 6:00 PM
-- Sunday: Closed

INSERT OR IGNORE INTO WorkingHours (id, dayOfWeek, isOpen, startTime, endTime) VALUES
  ('default-0', 0, 0, '09:00', '18:00'), -- Sunday (closed)
  ('default-1', 1, 1, '09:00', '18:00'), -- Monday
  ('default-2', 2, 1, '09:00', '18:00'), -- Tuesday
  ('default-3', 3, 1, '09:00', '18:00'), -- Wednesday
  ('default-4', 4, 1, '09:00', '18:00'), -- Thursday
  ('default-5', 5, 1, '09:00', '18:00'), -- Friday
  ('default-6', 6, 1, '09:00', '18:00'); -- Saturday
