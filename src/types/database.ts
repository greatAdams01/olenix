export type AdminRole = 'super_admin' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface MenuCategoryRow {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export interface MenuItemRow {
  id: string;
  category: string;
  name: string;
  price: string;
  description: string;
  created_at: string;
}

export interface VipBookingRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  code: string;
  status: BookingStatus;
  intentions: string | null;
  preferences: string | null;
  created_at: string;
}

export interface AdminRow {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: AdminRow;
        Insert: { id: string; email: string; role: AdminRole };
        Update: Partial<{ email: string; role: AdminRole }>;
      };
      menu_categories: {
        Row: MenuCategoryRow;
        Insert: { id: string; name: string; image_url?: string };
        Update: Partial<{ name: string; image_url: string }>;
      };
      menu: {
        Row: MenuItemRow;
        Insert: { category: string; name: string; price: string; description?: string };
        Update: Partial<{ category: string; name: string; price: string; description: string }>;
      };
      vip_bookings: {
        Row: VipBookingRow;
        Insert: {
          name: string;
          email: string;
          phone: string;
          guests: string;
          date: string;
          time: string;
          code: string;
          status?: BookingStatus;
          intentions?: string | null;
          preferences?: string | null;
        };
        Update: Partial<{
          date: string;
          time: string;
          status: BookingStatus;
        }>;
      };
    };
    Functions: {
      count_vip_bookings_for_date: {
        Args: { booking_date: string };
        Returns: number;
      };
      submit_vip_booking: {
        Args: {
          p_name: string;
          p_email: string;
          p_phone: string;
          p_guests: string;
          p_date: string;
          p_time: string;
          p_code: string;
        };
        Returns: { ok: boolean; error?: string };
      };
      get_admin_role: {
        Args: Record<string, never>;
        Returns: AdminRole | null;
      };
      list_menu_categories: {
        Args: Record<string, never>;
        Returns: MenuCategoryRow[];
      };
      list_menu_items: {
        Args: Record<string, never>;
        Returns: MenuItemRow[];
      };
      save_menu_category: {
        Args: { p_id: string; p_name: string; p_image_url?: string };
        Returns: { ok: boolean; error?: string; id?: string };
      };
      delete_menu_category: {
        Args: { p_id: string };
        Returns: { ok: boolean; error?: string };
      };
      save_menu_item: {
        Args: {
          p_id: string;
          p_category: string;
          p_name: string;
          p_price: string;
          p_description?: string;
        };
        Returns: { ok: boolean; error?: string; id?: string };
      };
      delete_menu_item: {
        Args: { p_id: string };
        Returns: { ok: boolean; error?: string };
      };
      list_admins: {
        Args: Record<string, never>;
        Returns: AdminRow[];
      };
      add_admin_record: {
        Args: { p_user_id: string; p_email: string; p_role: string };
        Returns: { ok: boolean; error?: string; id?: string };
      };
      remove_admin_record: {
        Args: { p_id: string };
        Returns: { ok: boolean; error?: string };
      };
    };
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  imageUrl: string;
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: string;
  desc: string;
}

export interface VipBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  code: string;
  status: string;
  intentions?: string;
  preferences?: string;
  createdAt?: string;
}

export interface Admin {
  id: string;
  email: string;
  role: AdminRole;
}

export function mapCategory(row: MenuCategoryRow): MenuCategory {
  return { id: row.id, name: row.name, imageUrl: row.image_url ?? '' };
}

export function mapMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    price: row.price,
    desc: row.description ?? '',
  };
}

export function mapBooking(row: VipBookingRow): VipBooking {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    guests: row.guests,
    date: row.date,
    time: row.time,
    code: row.code,
    status: row.status,
    intentions: row.intentions ?? undefined,
    preferences: row.preferences ?? undefined,
    createdAt: row.created_at,
  };
}
