-- ResourceX schema. Run in Supabase SQL editor. "Users" = auth.users (managed by Supabase Auth).
create table industries (
  id uuid primary key default gen_random_uuid(), user_id uuid unique not null references auth.users on delete cascade,
  company_name text not null, gst_number text not null, industry_type text, manufacturing_type text, business_address text,
  contact_person text, designation text, official_email text, phone text, raw_materials text[], factory_location text,
  experience text, verified boolean default false, created_at timestamptz default now());
create table products (id serial primary key, name text unique not null, category text);
insert into products(name) values ('Fly Ash'),('Gypsum'),('GGBS'),('Slag'),('Bottom Ash'),('Red Mud'),('Limestone'),('Coal'),('Mill Scale');
create table sell_listings (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  material text not null, quantity_mt numeric not null check (quantity_mt > 0), price_per_mt numeric, location text not null,
  grade text, details text, status text default 'active', created_at timestamptz default now());
create table buy_requirements (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
  material text not null, quantity_mt numeric not null check (quantity_mt > 0), quality text, location text, additional text,
  status text default 'active', created_at timestamptz default now());
create table requests (
  id uuid primary key default gen_random_uuid(), kind text check (kind in ('buy','sell')), from_user uuid not null references auth.users,
  to_user uuid not null references auth.users, listing_id uuid references sell_listings, requirement_id uuid references buy_requirements,
  quantity_mt numeric, remarks text, status text default 'pending' check (status in ('pending','accepted','rejected')), created_at timestamptz default now());
create table lab_documents (
  id uuid primary key default gen_random_uuid(), listing_id uuid references sell_listings on delete cascade, user_id uuid not null references auth.users,
  doc_type text, storage_path text not null, created_at timestamptz default now());
create table transactions (
  id uuid primary key default gen_random_uuid(), request_id uuid references requests, buyer_id uuid references auth.users, seller_id uuid references auth.users,
  material text, quantity_mt numeric, price_per_mt numeric, created_at timestamptz default now());
create table feedback (
  id uuid primary key default gen_random_uuid(), author_id uuid not null references auth.users, target_user uuid not null references auth.users,
  stars int check (stars between 1 and 5), quality int, delivery int, communication int, behaviour int, review text, created_at timestamptz default now());
create table notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users, message text, read boolean default false, created_at timestamptz default now());

alter table industries enable row level security; alter table products enable row level security; alter table sell_listings enable row level security;
alter table buy_requirements enable row level security; alter table requests enable row level security; alter table lab_documents enable row level security;
alter table transactions enable row level security; alter table feedback enable row level security; alter table notifications enable row level security;

create policy "industries readable" on industries for select using (auth.role() = 'authenticated');
create policy "industries own write" on industries for insert with check (auth.uid() = user_id);
create policy "industries own update" on industries for update using (auth.uid() = user_id);
create policy "products readable" on products for select using (true);
create policy "listings readable" on sell_listings for select using (auth.role() = 'authenticated');
create policy "listings own write" on sell_listings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "requirements readable" on buy_requirements for select using (auth.role() = 'authenticated');
create policy "requirements own write" on buy_requirements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "requests parties read" on requests for select using (auth.uid() in (from_user, to_user));
create policy "requests create" on requests for insert with check (auth.uid() = from_user);
create policy "requests recipient update" on requests for update using (auth.uid() = to_user);
create policy "docs own" on lab_documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "docs readable" on lab_documents for select using (auth.role() = 'authenticated');
create policy "transactions parties read" on transactions for select using (auth.uid() in (buyer_id, seller_id));
create policy "feedback readable" on feedback for select using (auth.role() = 'authenticated');
create policy "feedback own insert" on feedback for insert with check (auth.uid() = author_id);
create policy "notifications own" on notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage: create a private bucket named lab-documents, then:
insert into storage.buckets (id, name, public) values ('lab-documents', 'lab-documents', false) on conflict do nothing;
create policy "lab docs upload own folder" on storage.objects for insert with check (bucket_id = 'lab-documents' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "lab docs read authenticated" on storage.objects for select using (bucket_id = 'lab-documents' and auth.role() = 'authenticated');
