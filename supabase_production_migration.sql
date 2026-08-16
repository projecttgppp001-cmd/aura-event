-- Apply after the base schema to configure the verified production owner.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, student_id, department, year, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), case when lower(new.email) = 'projecttgppp001@gmail.com' then 'Pavan' else '' end),
    new.email,
    new.raw_user_meta_data->>'student_id',
    coalesce(new.raw_user_meta_data->>'department', case when lower(new.email) = 'projecttgppp001@gmail.com' then 'Information Technology' end),
    new.raw_user_meta_data->>'year',
    case when lower(new.email) = 'projecttgppp001@gmail.com' then 'admin' else 'student' end
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

update public.profiles
set full_name = 'Pavan',
    department = 'Information Technology',
    role = 'admin'
where lower(email) = 'projecttgppp001@gmail.com';
