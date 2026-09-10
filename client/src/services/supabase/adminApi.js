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
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null
  
  if (!user) return null

  // Check if their ID is in the admins VIP table
  const { data: adminRecord } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (adminRecord) {
    console.log("Welcome back, VIP Admin!")
    return user
  } else {
    console.log("Normal user logged in. Admin access denied.")
    return null
  }
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
