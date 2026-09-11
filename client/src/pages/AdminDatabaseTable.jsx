import { useEffect, useRef, useState } from 'react'
import {
  createCustomer,
  createOrder,
  createShippingInformation,
  getAllCategories,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
  getAllShippingInformation,
  updateShippingInformation,
  updateOrderStatus
} from '../services/supabase/adminApi'

const tableConfigs = {
  customers: {
    title: 'Customers',
    description: 'Customer records stored in public.customers.',
    load: getAllCustomers,
    columns: [['id', 'ID'], ['name', 'Name'], ['phone', 'Phone'], ['address', 'Address'], ['created_at', 'Created']]
  },
  orders: {
    title: 'Orders',
    description: 'Orders stored in public.orders and linked to customers.',
    load: getAllOrders,
    columns: [['id', 'ID'], ['customer.name', 'Customer'], ['customer.phone', 'Phone'], ['items', 'Items'], ['total', 'Total'], ['status', 'Status'], ['created_at', 'Created']],
    orderStatus: true
  },
  shipping: {
    title: 'Shipping Information',
    description: 'Delivery records stored in public.shipping_information.',
    load: getAllShippingInformation,
    columns: [['id', 'ID'], ['order_id', 'Order ID'], ['customer_id', 'Customer ID'], ['delivery_partner_name', 'Delivery partner'], ['delivery_date', 'Delivery date'], ['delivery_status', 'Delivery status'], ['shipping_date', 'Shipping date'], ['tracking_link', 'Tracking link'], ['__edit', 'Actions']]
  }
}

function getValue(record, path) {
  const value = path.split('.').reduce((current, key) => current?.[key], record)
  if (value === null || value === undefined || value === '') return '-'
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}

function OrderItemsCell({ items, orderTotal }) {
  const [open, setOpen] = useState(false)
  let parsedItems = items
  if (typeof items === 'string') {
    try { parsedItems = JSON.parse(items) } catch { parsedItems = [] }
  }
  if (!Array.isArray(parsedItems) || parsedItems.length === 0) return <span className="text-slate-500">No items</span>

  const calculatedTotal = parsedItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)
  const total = Number(orderTotal) > 0 ? Number(orderTotal) : calculatedTotal

  return <>
    <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/20">View {parsedItems.length} items</button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Order details</p><h2 className="mt-1 text-2xl font-semibold text-white">Items in this order</h2></div><button type="button" onClick={() => setOpen(false)} className="text-2xl text-slate-400" aria-label="Close">×</button></div>
        <div className="space-y-2">{parsedItems.map((item, index) => <div key={`${item.product_id || item.name}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"><div><p className="font-medium text-slate-100">{item.name || `Product ${item.product_id}`}</p><p className="text-xs text-slate-500">₹{Number(item.price || 0).toFixed(2)} each</p></div><div className="text-right"><p className="font-semibold text-emerald-300">x{item.quantity || 1}</p><p className="text-xs text-slate-400">₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</p></div></div>)}</div>
        <div className="mt-5 flex justify-between border-t border-slate-700 pt-4 font-semibold text-white"><span>Total</span><span className="text-emerald-300">₹{total.toFixed(2)}</span></div>
      </div>
    </div>}
  </>
}

function AdminDatabaseTable({ table }) {
  const config = tableConfigs[table]
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false)
  const customerSearchRef = useRef(null)
  const orderSearchRef = useRef(null)
  const [orderCategory, setOrderCategory] = useState('')
  const [editingShippingId, setEditingShippingId] = useState(null)
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '' })
  const [form, setForm] = useState({
    customer_id: '',
    order_id: '',
    status: 'pending',
      delivery_partner_name: '',
    delivery_date: '',
    delivery_status: 'pending',
    shipping_date: ''
  })

  useEffect(() => {
    let mounted = true
    config.load()
      .then((data) => mounted && setRecords(data || []))
      .catch((loadError) => mounted && setError(loadError?.message || `Unable to load ${config.title.toLowerCase()}.`))
      .finally(() => mounted && setLoading(false))

    if (table === 'orders' || table === 'shipping') {
      getAllCustomers().then((data) => mounted && setCustomers(data || [])).catch(() => {})
    }
    if (table === 'orders') {
      getAllProducts().then((data) => mounted && setProducts(data || [])).catch(() => {})
      getAllCategories().then((data) => mounted && setCategories(data || [])).catch(() => {})
    }
    if (table === 'shipping') {
      getAllOrders().then((data) => mounted && setOrders(data || [])).catch(() => {})
    }

    return () => { mounted = false }
  }, [config, table])

  const visibleProducts = products.filter((product) => {
    if (!orderCategory) return true
    const category = categories.find((item) => String(item.id) === orderCategory)
    return product.category === category?.name || String(product.categories_id) === orderCategory
  })

  const orderTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const matchingCustomers = customers.filter((customer) => `${customer.name || ''} ${customer.phone || ''}`.toLowerCase().includes(customerSearch.trim().toLowerCase()))
  const matchingOrders = orders.filter((order) => {
    const search = orderSearch.trim().toLowerCase()
    const customer = order.customer?.name || order.customers?.name || ''
    return `${order.id} ${customer} ${order.status || ''}`.toLowerCase().includes(search)
  })

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!customerSearchRef.current?.contains(event.target)) setCustomerDropdownOpen(false)
      if (!orderSearchRef.current?.contains(event.target)) setOrderDropdownOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])
  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')
    try {
      let created
      if (table === 'customers') {
        created = await createCustomer(customerForm)
      } else if (table === 'orders') {
        if (!form.customer_id) throw new Error('Select a customer before saving the order.')
        if (selectedItems.length === 0) throw new Error('Select at least one product before saving the order.')
        created = await createOrder({ customer_id: Number(form.customer_id), items: selectedItems, total: orderTotal, status: form.status })
      } else if (editingShippingId) {
        created = await updateShippingInformation(editingShippingId, {
          order_id: Number(form.order_id),
          customer_id: Number(form.customer_id),
          delivery_partner_name: form.delivery_partner_name || null,
          delivery_date: form.delivery_date || null,
          delivery_status: form.delivery_status,
          shipping_date: form.shipping_date || null,
          tracking_link: form.tracking_link || null
        })
      } else {
        if (!form.customer_id || !form.order_id) throw new Error('Select both a customer and an order before saving shipping information.')
        created = await createShippingInformation({
          order_id: Number(form.order_id),
          customer_id: Number(form.customer_id),
          delivery_partner_name: form.delivery_partner_name || null,
          delivery_date: form.delivery_date || null,
          delivery_status: form.delivery_status,
          shipping_date: form.shipping_date || null,
          tracking_link: form.tracking_link || null
        })
      }
      setRecords((current) => editingShippingId
        ? current.map((record) => record.id === created.id ? { ...record, ...created } : record)
        : [created, ...current])
      setCustomerForm({ name: '', phone: '', address: '' })
      setCustomerSearch('')
      setOrderSearch('')
      setCustomerDropdownOpen(false)
      setOrderDropdownOpen(false)
      setSelectedItems([])
      setOrderCategory('')
      setEditingShippingId(null)
      setForm({ customer_id: '', order_id: '', status: 'pending', delivery_partner_name: '', delivery_date: '', delivery_status: 'pending', shipping_date: '' })
    } catch (createError) {
      setError(createError?.message || 'Unable to create record.')
    }
  }

  const changeOrderStatus = async (orderId, status) => {
    setSavingId(orderId)
    setError('')
    try {
      const updated = await updateOrderStatus(orderId, status)
      setRecords((current) => current.map((record) => record.id === updated.id ? { ...record, ...updated } : record))
    } catch (statusError) {
      setError(statusError?.message || 'Unable to update order status.')
    } finally {
      setSavingId(null)
    }
  }

  const selectCustomer = (customer) => {
    updateForm('customer_id', String(customer.id))
    setCustomerSearch(`${customer.name} (${customer.phone})`)
    setCustomerDropdownOpen(false)
  }

  const selectOrder = (order) => {
    updateForm('order_id', String(order.id))
    setOrderSearch(`Order #${order.id}${order.customer?.name ? ` - ${order.customer.name}` : ''}`)
    setOrderDropdownOpen(false)
  }

  const editShipping = (record) => {
    setEditingShippingId(record.id)
    const customer = customers.find((item) => String(item.id) === String(record.customer_id))
    setCustomerSearch(customer ? `${customer.name} (${customer.phone})` : `Customer #${record.customer_id}`)
    const order = orders.find((item) => String(item.id) === String(record.order_id))
    setOrderSearch(order ? `Order #${order.id}${order.customer?.name ? ` - ${order.customer.name}` : ''}` : `Order #${record.order_id}`)
    setForm({
      customer_id: String(record.customer_id || ''),
      order_id: String(record.order_id || ''),
      status: 'pending',
      delivery_partner_name: record.delivery_partner_name || '',
      delivery_date: record.delivery_date || '',
      delivery_status: record.delivery_status || 'pending',
      shipping_date: record.shipping_date || '',
      tracking_link: record.tracking_link || ''
    })
  }

  const toggleProduct = (product, checked) => {
    const price = Number(product.current_price ?? product.price ?? product.actual_price ?? 0)
    setSelectedItems((current) => checked
      ? [...current, { product_id: product.id, name: product.name, price, quantity: 1 }]
      : current.filter((item) => item.product_id !== product.id))
  }

  const changeQuantity = (productId, amount) => setSelectedItems((current) => current.map((item) => item.product_id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item))

  if (loading) return <div className="rounded-[2rem] bg-slate-900/90 p-8 text-slate-300">Loading {config.title.toLowerCase()}...</div>

  return (
    <section className="space-y-6 rounded-[2rem] bg-slate-900/90 p-8 text-slate-100 shadow-2xl shadow-black/20">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Database table</p>
        <h1 className="mt-3 text-3xl font-semibold">{config.title}</h1>
        <p className="mt-2 text-slate-400">{config.description}</p>
      </div>

      {error && <div className="flex items-start justify-between gap-4 rounded-2xl bg-rose-500/15 p-4 text-rose-200"><p>{error}</p><button type="button" onClick={() => setError('')} className="text-sm font-semibold">Dismiss</button></div>}

      {table === 'customers' && (
        <form onSubmit={handleCreate} className="grid gap-4 rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5 md:grid-cols-3">
          <h2 className="text-xl font-semibold md:col-span-3">Add customer</h2>
          <input required placeholder="Customer name" value={customerForm.name} onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
          <input required type="tel" placeholder="Phone" value={customerForm.phone} onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
          <input required placeholder="Address" value={customerForm.address} onChange={(event) => setCustomerForm({ ...customerForm, address: event.target.value })} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
          <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white md:col-span-3">Save customer</button>
        </form>
      )}

      {(table === 'orders' || table === 'shipping') && (
        <form onSubmit={handleCreate} className="grid gap-4 rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5 md:grid-cols-2">
          <h2 className="text-xl font-semibold md:col-span-2">{editingShippingId ? 'Update shipping record' : `Add ${table === 'orders' ? 'order' : 'shipping record'}`}</h2>
          <div ref={customerSearchRef} className="relative">
            <input required value={customerSearch} placeholder="Search customer by name or phone" onFocus={() => setCustomerDropdownOpen(true)} onChange={(event) => { setCustomerSearch(event.target.value); updateForm('customer_id', ''); setCustomerDropdownOpen(true) }} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500" />
            {customerDropdownOpen && !form.customer_id && <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-2xl">
              {matchingCustomers.map((customer) => <button key={customer.id} type="button" onClick={() => selectCustomer(customer)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800">{customer.name} <span className="text-slate-500">{customer.phone}</span></button>)}
              {matchingCustomers.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">No matching customer.</p>}
            </div>}
          </div>

          {table === 'orders' ? (
            <>
              <div className="space-y-3 md:col-span-2">
                <p className="text-sm font-medium text-slate-300">Choose category</p>
                <select value={orderCategory} onChange={(event) => setOrderCategory(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100">
                  <option value="">All categories</option>
                  {categories.filter((category) => category.status !== 'hidden').map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <p className="text-sm font-medium text-slate-300">Choose products</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {visibleProducts.map((product) => {
                    const selected = selectedItems.some((item) => item.product_id === product.id)
                    const price = Number(product.current_price ?? product.price ?? product.actual_price ?? 0)
                    return <label key={product.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200"><input type="checkbox" checked={selected} onChange={(event) => toggleProduct(product, event.target.checked)} className="h-4 w-4 accent-emerald-500" /><span>{product.name} <span className="text-xs text-slate-500">₹{price}</span></span></label>
                  })}
                </div>
                {visibleProducts.length === 0 && <p className="text-sm text-slate-500">No products found for this category.</p>}
              </div>
              {selectedItems.length > 0 && <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 md:col-span-2"><p className="text-sm font-medium text-emerald-200">Added products</p>{selectedItems.map((item) => <div key={item.product_id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-900 px-3 py-2"><span className="truncate text-sm text-slate-200">{item.name}</span><div className="flex items-center gap-2"><button type="button" onClick={() => changeQuantity(item.product_id, -1)} className="h-7 w-7 rounded-md border border-slate-700">-</button><span className="w-6 text-center text-sm">{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.product_id, 1)} className="h-7 w-7 rounded-md border border-slate-700">+</button><button type="button" onClick={() => setSelectedItems((current) => current.filter((entry) => entry.product_id !== item.product_id))} className="ml-2 text-xs text-rose-300">Remove</button></div></div>)}<p className="text-right text-sm font-semibold text-emerald-300">Total: ₹{orderTotal.toFixed(2)}</p></div>}
              <select value={form.status} onChange={(event) => updateForm('status', event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="preparing">Preparing</option></select>
            </>
          ) : (
            <>
              <div ref={orderSearchRef} className="relative">
                <input required value={orderSearch} placeholder="Search order by ID, customer, or status" onFocus={() => setOrderDropdownOpen(true)} onChange={(event) => { setOrderSearch(event.target.value); updateForm('order_id', ''); setOrderDropdownOpen(true) }} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500" />
                {orderDropdownOpen && !form.order_id && <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-2xl">
                  {matchingOrders.map((order) => <button key={order.id} type="button" onClick={() => selectOrder(order)} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800">Order #{order.id} <span className="text-slate-500">{order.customer?.name || order.customers?.name || 'Customer'} · {order.status}</span></button>)}
                  {matchingOrders.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">No matching order.</p>}
                </div>}
              </div>
              <input type="text" placeholder="Delivery partner name" value={form.delivery_partner_name || ''} onChange={(event) => updateForm('delivery_partner_name', event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
              
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 text-slate-100">
                <span className="shrink-0 text-sm font-medium text-slate-500">Ship date</span>
                <input type="date" value={form.shipping_date} onChange={(event) => updateForm('shipping_date', event.target.value)} className="w-full bg-transparent py-2 outline-none" />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 text-slate-100">
                <span className="shrink-0 text-sm font-medium text-slate-500">Delivery</span>
                <input type="date" value={form.delivery_date} onChange={(event) => updateForm('delivery_date', event.target.value)} className="w-full bg-transparent py-2 outline-none" />
              </div>

              <select value={form.delivery_status} onChange={(event) => updateForm('delivery_status', event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"><option value="pending">Pending</option><option value="assigned">Assigned</option><option value="out_for_delivery">Out for delivery</option><option value="delivered">Delivered</option></select>
              <input type="url" placeholder="Tracking link" value={form.tracking_link || ''} onChange={(event) => updateForm('tracking_link', event.target.value)} className="md:col-span-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
            </>
          )}
          <button type="submit" disabled={(table === 'orders' && selectedItems.length === 0) || !form.customer_id} className="md:col-span-2 mt-2 rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50">{editingShippingId ? 'Update shipping' : 'Save record'}</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-950"><table className="min-w-full text-left text-sm"><thead className="bg-slate-900 text-slate-400"><tr>{config.columns.map(([, label]) => <th key={label} className="whitespace-nowrap px-5 py-4">{label}</th>)}{config.orderStatus && <th className="whitespace-nowrap px-5 py-4">Update status</th>}</tr></thead><tbody className="divide-y divide-slate-800">{records.map((record) => <tr key={record.id} className="align-top">{config.columns.map(([path, label]) => <td key={label} className="max-w-xs px-5 py-4 text-slate-300">{path === '__edit' ? <button type="button" onClick={() => editShipping(record)} className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25">Edit</button> : path === 'items' ? <OrderItemsCell items={record.items} orderTotal={record.total} /> : path === 'tracking_link' && record.tracking_link ? <a href={record.tracking_link} target="_blank" rel="noreferrer" className="max-w-40 truncate text-emerald-300 underline">Open tracking</a> : getValue(record, path)}</td>)}{config.orderStatus && <td className="px-5 py-4"><select value={record.status || 'pending'} disabled={savingId === record.id} onChange={(event) => changeOrderStatus(record.id, event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="preparing">Preparing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td>}</tr>)}</tbody></table>{records.length === 0 && <p className="p-6 text-slate-400">No records found in this table.</p>}</div>
    </section>
  )
}

export default AdminDatabaseTable
