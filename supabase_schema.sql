-- Supabase SQL Schema for College Event Management System (AuraEvent)

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Create Profiles Table (extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text unique not null,
  student_id text,
  department text,
  year text,
  role text not null check (role in ('student', 'admin')) default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Keep the admin check in a security-definer function so profile policies do
-- not recursively query themselves.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Users only see their own profile; admins can see profiles for rosters.
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profiles" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- A browser client may edit profile fields, but never its id, email, or role.
revoke update on public.profiles from authenticated;
grant update(full_name, student_id, department, year) on public.profiles to authenticated;

-- 2. Create Events Table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null check (category in ('Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Competition', 'Other')),
  image_url text,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  venue text not null,
  organizer text not null,
  capacity integer not null check (capacity > 0),
  registration_deadline date not null,
  prize text,
  status text not null check (status in ('Draft', 'Published', 'Registration Open', 'Registration Closed', 'Completed', 'Cancelled')) default 'Published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.events enable row level security;

-- Event policies
create policy "Events are viewable by everyone" on public.events
  for select using (true);

create policy "Events can be managed by admins only" on public.events
  for all using (public.is_admin())
  with check (public.is_admin());

-- 3. Create Registrations Table
create table public.registrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_id uuid references public.events(id) on delete cascade not null,
  registration_date timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null check (status in ('Registered', 'Cancelled', 'Completed')) default 'Registered',
  qr_data text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Ensure a user can only register once for an event
  constraint unique_user_event unique(user_id, event_id)
);

alter table public.registrations enable row level security;

-- Registration policies
create policy "Users can view their own registrations" on public.registrations
  for select using (auth.uid() = user_id);

create policy "Users can create their own registrations" on public.registrations
  for insert with check (auth.uid() = user_id);

create policy "Users can update/cancel their own registrations" on public.registrations
  for update using (auth.uid() = user_id);

create policy "Admins can view and manage all registrations" on public.registrations
  for all using (public.is_admin())
  with check (public.is_admin());

-- Seat totals are public, but individual student registrations are not.
create or replace function public.event_seats_taken(target_event_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.registrations
  where event_id = target_event_id and status = 'Registered';
$$;

revoke all on function public.event_seats_taken(uuid) from public;
grant execute on function public.event_seats_taken(uuid) to anon, authenticated;

-- Enforce registration rules in PostgreSQL as well as in the UI. Locking the
-- event row makes the capacity check safe when two students register at once.
create or replace function public.validate_registration()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_event public.events%rowtype;
  active_count integer;
begin
  if not public.is_admin() then
    if tg_op = 'INSERT' then
      if new.status <> 'Registered' then
        raise exception 'New registrations must be active.';
      end if;
    else
      if new.user_id is distinct from old.user_id
         or new.event_id is distinct from old.event_id
         or new.id is distinct from old.id
         or new.created_at is distinct from old.created_at then
        raise exception 'Registration ownership and event cannot be changed.';
      end if;

      if old.status = 'Registered' and new.status = 'Cancelled' then
        if new.registration_date is distinct from old.registration_date
           or new.qr_data is distinct from old.qr_data then
          raise exception 'Cancellation cannot alter ticket data.';
        end if;
      elsif old.status = 'Cancelled' and new.status = 'Registered' then
        null; -- Re-registration refreshes the date and QR payload.
      else
        raise exception 'Only cancellation or re-registration is allowed.';
      end if;
    end if;
  end if;

  if new.status = 'Registered'
     and (tg_op = 'INSERT'
       or old.status is distinct from new.status
       or old.event_id is distinct from new.event_id) then
    select * into target_event
    from public.events
    where id = new.event_id
    for update;

    if not found then
      raise exception 'Event not found.';
    end if;
    if target_event.status not in ('Published', 'Registration Open') then
      raise exception 'Registration is not open for this event.';
    end if;
    if target_event.registration_deadline < current_date then
      raise exception 'The registration deadline for this event has passed.';
    end if;

    select count(*) into active_count
    from public.registrations
    where event_id = new.event_id
      and status = 'Registered'
      and (tg_op = 'INSERT' or id <> new.id);

    if active_count >= target_event.capacity then
      raise exception 'This event has reached full capacity.';
    end if;
  end if;

  return new;
end;
$$;

create trigger validate_registration_before_write
  before insert or update on public.registrations
  for each row execute procedure public.validate_registration();

-- 4. Create Announcements Table
create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text not null,
  priority text not null check (priority in ('Normal', 'Important', 'Urgent')) default 'Normal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.announcements enable row level security;

-- Announcement policies
create policy "Announcements are viewable by everyone" on public.announcements
  for select using (true);

create policy "Announcements can be managed by admins only" on public.announcements
  for all using (public.is_admin())
  with check (public.is_admin());

-- Trigger to automatically create a Profile after user signs up in Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, student_id, department, year, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'student_id',
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'year',
    'student'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
