-- Production starter data. Safe to run repeatedly.
insert into public.events
  (title, description, category, event_date, start_time, end_time, venue, organizer, capacity, registration_deadline, prize, status)
select * from (values
  ('TechFest 2026', 'A three-day celebration of technology, innovation and student projects across every engineering department.', 'Technical', date '2026-09-12', time '09:00', time '18:00', 'Main Auditorium', 'IT Department', 150, date '2026-09-10', '₹25,000', 'Registration Open'),
  ('AI Hackathon', '24-hour hackathon focused on building applied AI solutions for real campus problems.', 'Hackathon', date '2026-09-20', time '10:00', time '10:00', 'Innovation Lab', 'AI/ML Club', 80, date '2026-09-18', '₹50,000', 'Registration Open'),
  ('Code Sprint', 'Competitive programming contest with algorithmic problems of increasing difficulty.', 'Competition', date '2026-09-05', time '14:00', time '17:00', 'Computer Lab 3', 'Coding Club', 60, date '2026-09-03', '₹10,000', 'Registration Open'),
  ('Cultural Night', 'An evening of music, dance and drama performances from every department.', 'Cultural', date '2026-10-02', time '18:00', time '22:00', 'Open Air Theatre', 'Cultural Committee', 400, date '2026-09-28', '', 'Registration Open'),
  ('Web Dev Workshop', 'Hands-on workshop covering modern React, Vite and Tailwind CSS fundamentals.', 'Workshop', date '2026-08-28', time '11:00', time '15:00', 'Seminar Hall 2', 'Information Technology Department', 50, date '2026-08-26', '', 'Registration Open'),
  ('Inter-College Cricket Cup', 'Annual T20 cricket tournament between departments and affiliated colleges.', 'Sports', date '2026-09-15', time '08:00', time '17:00', 'College Sports Ground', 'Sports Committee', 200, date '2026-09-12', '₹15,000', 'Registration Open'),
  ('Entrepreneurship Seminar', 'Talks and panel discussion with alumni founders on building startups after college.', 'Seminar', date '2026-09-08', time '13:00', time '16:00', 'Conference Hall', 'E-Cell', 120, date '2026-09-06', '', 'Registration Open'),
  ('Robotics Expo', 'Showcase of student-built robots with a live obstacle-course competition round.', 'Technical', date '2026-10-10', time '10:00', time '16:00', 'Mechanical Block Yard', 'Robotics Club', 90, date '2026-10-07', '₹20,000', 'Registration Open')
) as seed(title, description, category, event_date, start_time, end_time, venue, organizer, capacity, registration_deadline, prize, status)
where not exists (select 1 from public.events where events.title = seed.title);

insert into public.announcements (title, message, priority)
select * from (values
  ('Welcome to AuraEvent', 'Production registrations are now live. Secure your event access before seats run out.', 'Important'),
  ('Information Technology', 'IT department event operations are active in the new command center.', 'Normal')
) as seed(title, message, priority)
where not exists (select 1 from public.announcements where announcements.title = seed.title);

-- Owner account becomes admin only after signing up and verifying this email.
update public.profiles
set full_name = 'Pavan',
    department = 'Information Technology',
    role = 'admin'
where lower(email) = 'projecttgppp001@gmail.com';
