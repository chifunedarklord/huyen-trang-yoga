-- =====================================================
-- SCHEMA SUPABASE cho Yoga Huyền Trang
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- BẢNG NGƯỜI DÙNG (mở rộng auth.users của Supabase)
-- =====================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admin can view all profiles" on public.profiles
  for all using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- BẢNG LỚP HỌC YOGA
-- =====================================================
create table public.yoga_classes (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  instructor text not null,
  level text default 'beginner' check (level in ('beginner', 'intermediate', 'advanced', 'all')),
  duration_minutes int default 60,
  capacity int default 20,
  price decimal(12,0) default 0,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.yoga_classes enable row level security;
create policy "Anyone can view active classes" on public.yoga_classes
  for select using (is_active = true);
create policy "Admin manages classes" on public.yoga_classes
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- BẢNG LỊCH LỚP HỌC (schedule)
-- =====================================================
create table public.class_schedules (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references public.yoga_classes(id) on delete cascade,
  scheduled_date date not null,
  start_time time not null,
  end_time time not null,
  room text default 'Phòng 1',
  is_cancelled boolean default false,
  created_at timestamptz default now()
);

alter table public.class_schedules enable row level security;
create policy "Anyone can view schedules" on public.class_schedules
  for select using (true);
create policy "Admin manages schedules" on public.class_schedules
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- BẢNG ĐẶT LỊCH LỚP HỌC
-- =====================================================
create table public.class_bookings (
  id uuid default uuid_generate_v4() primary key,
  schedule_id uuid references public.class_schedules(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  status text default 'confirmed' check (status in ('confirmed', 'cancelled', 'attended')),
  payment_method text,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  notes text,
  created_at timestamptz default now(),
  unique(schedule_id, user_id)
);

alter table public.class_bookings enable row level security;
create policy "Users view own bookings" on public.class_bookings
  for select using (auth.uid() = user_id);
create policy "Users create bookings" on public.class_bookings
  for insert with check (auth.uid() = user_id);
create policy "Users cancel own bookings" on public.class_bookings
  for update using (auth.uid() = user_id);
create policy "Admin manages bookings" on public.class_bookings
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- BẢNG DANH MỤC SẢN PHẨM
-- =====================================================
create table public.product_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamptz default now()
);

alter table public.product_categories enable row level security;
create policy "Anyone can view categories" on public.product_categories
  for select using (true);
create policy "Admin manages categories" on public.product_categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- BẢNG SẢN PHẨM
-- =====================================================
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.product_categories(id),
  name text not null,
  slug text unique not null,
  description text,
  price decimal(12,0) not null,
  sale_price decimal(12,0),
  stock_quantity int default 0,
  images jsonb default '[]',
  specifications jsonb default '{}',
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;
create policy "Anyone can view active products" on public.products
  for select using (is_active = true);
create policy "Admin manages products" on public.products
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- BẢNG ĐƠN HÀNG
-- =====================================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  order_number text unique not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded')),
  total_amount decimal(12,0) not null,
  shipping_fee decimal(12,0) default 0,
  discount_amount decimal(12,0) default 0,
  payment_method text check (payment_method in ('bank_transfer', 'vnpay', 'momo', 'zalopay', 'cod')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  shipping_province text,
  shipping_district text,
  shipping_ward text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;
create policy "Users view own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Users create orders" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "Admin manages orders" on public.orders
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- BẢNG CHI TIẾT ĐƠN HÀNG
-- =====================================================
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  product_image text,
  quantity int not null,
  unit_price decimal(12,0) not null,
  total_price decimal(12,0) not null
);

alter table public.order_items enable row level security;
create policy "Users view own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );
create policy "Admin manages order items" on public.order_items
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- BẢNG ĐÁNH GIÁ SẢN PHẨM
-- =====================================================
create table public.product_reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id),
  rating int check (rating between 1 and 5),
  comment text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

alter table public.product_reviews enable row level security;
create policy "Anyone can view approved reviews" on public.product_reviews
  for select using (is_approved = true);
create policy "Users can create reviews" on public.product_reviews
  for insert with check (auth.uid() = user_id);

-- =====================================================
-- BẢNG CÀI ĐẶT WEBSITE
-- =====================================================
create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;
create policy "Anyone can view settings" on public.site_settings for select using (true);
create policy "Admin manages settings" on public.site_settings
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =====================================================
-- DỮ LIỆU MẪU
-- =====================================================

-- Danh mục sản phẩm mẫu
insert into public.product_categories (name, slug, description) values
  ('Thảm Yoga', 'tham-yoga', 'Các loại thảm yoga chất lượng cao'),
  ('Phụ Kiện', 'phu-kien', 'Dây kéo, khối foam, vòng yoga và phụ kiện khác'),
  ('Túi & Balo', 'tui-balo', 'Túi đựng thảm và balo yoga'),
  ('Quần Áo', 'quan-ao', 'Trang phục yoga thoáng mát');

-- Cài đặt website mẫu
insert into public.site_settings (key, value) values
  ('bank_account_name', 'NGUYEN HUYEN TRANG'),
  ('bank_account_number', '0123456789'),
  ('bank_name', 'Vietcombank'),
  ('studio_address', '123 Đường Yoga, Q.1, TP.HCM'),
  ('studio_phone', '0901234567'),
  ('studio_email', 'info@yogahuyentrang.com');

-- Lớp học mẫu
insert into public.yoga_classes (name, description, instructor, level, duration_minutes, capacity, price) values
  ('Yoga Cơ Bản', 'Lớp học dành cho người mới bắt đầu, tập trung vào các tư thế cơ bản và hít thở', 'Huyền Trang', 'beginner', 60, 15, 150000),
  ('Yoga Trung Cấp', 'Nâng cao tư thế, tăng cường sức mạnh cốt lõi và sự dẻo dai', 'Huyền Trang', 'intermediate', 75, 12, 200000),
  ('Yoga Thiền', 'Kết hợp yoga nhẹ nhàng và thiền định, phù hợp mọi trình độ', 'Huyền Trang', 'all', 60, 20, 150000),
  ('Power Yoga', 'Lớp yoga cường độ cao, đốt calo hiệu quả', 'Huyền Trang', 'advanced', 60, 10, 250000);
