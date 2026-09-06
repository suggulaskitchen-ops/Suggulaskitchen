import { supabase } from './supabaseClient'

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file and restart the dev server.')
  }
}

// ----- ADMIN AUTH -----

export async function adminLogin(email, password) {
  ensureSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function adminLogout() {
  ensureSupabase()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentAdmin() {
  ensureSupabase()
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}

// ----- ADMIN: MENU MANAGEMENT -----

export async function getAllMenuItems() {
  let { data, error } = await supabase.from('menus').select('*')
  if (error?.code === 'PGRST205') {
    ({ data, error } = await supabase.from('menu').select('*'))
  }
  if (error) throw error
  return data
}

export async function getAllCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, categories_id, actual_price, current_price, price, availability')
    .order('name', { ascending: true })
  if (error) throw error
  return data
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, status')
    .order('name', { ascending: true })
  if (error) throw error
  return data
}

export async function createCustomer({ name, phone, address }) {
  const { data, error } = await supabase
    .from('customers')
    .insert([{ name, phone, address }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function addMenuItem({ name, description, price, photo_url }) {
  const { data, error } = await supabase
    .from('menus')
    .insert([{ name, description, actual_price: price, current_price: price, photo_url, available: true }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMenuItem(id, updates) {
  const { data, error } = await supabase
    .from('menus')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMenuItem(id) {
  const { error } = await supabase.from('menus').delete().eq('id', id)
  if (error) throw error
}

// ----- ADMIN: PHOTO UPLOAD -----
// Requires a Storage bucket named "menu-photos" created in Supabase dashboard

export async function uploadMenuPhoto(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('menu-photos')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('menu-photos').getPublicUrl(fileName)
  return data.publicUrl
}

// ----- ADMIN: ORDER MANAGEMENT -----

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(name, phone, address)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllShippingInformation() {
  const { data, error } = await supabase
    .from('shipping_information')
    .select('*')
  if (error) throw error
  return data
}

export async function createOrder({ customer_id, items, total, status }) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ customer_id, items, total: Number(total), status }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createShippingInformation(payload) {
  const { data, error } = await supabase
    .from('shipping_information')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateShippingInformation(id, payload) {
  const { data, error } = await supabase
    .from('shipping_information')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()
  if (error) throw error
  return data
}
