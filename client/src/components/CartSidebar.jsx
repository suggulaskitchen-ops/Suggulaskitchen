function CartSidebar({ isOpen, onClose, businessInfo, cartItems, total, onRemove, onUpdateQuantity, onClearCart }) {
  if (!isOpen) {
    return null
  }

  const whatsappRaw = businessInfo.whatsapp || ''
  const cleanedPhone = whatsappRaw.replace(/[^0-9]/g, '')
  const phone = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone
  const whatsappText = cartItems.length
    ? `Hello! I would like to order from ${businessInfo.name || "Suggula's Kitchen"}:\n\n${cartItems
        .map((item, index) => `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
        .join('\n')}\n\nTotal: ₹${total}\n\nPlease confirm the order and delivery details.`
    : 'Hello! I would like to place an order.'
  const whatsappUrl = `https://wa.me/${phone || '919876543210'}?text=${encodeURIComponent(whatsappText)}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <aside className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-900/50">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
        >
          ×
        </button>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Your cart</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Order summary</h2>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-slate-500">Your cart is empty. Add a product to start checkout.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">Qty: {item.quantity}</p>
                      <p className="mt-1 text-sm text-slate-600">₹{item.price} each</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                      >
                        Remove
                      </button>
                      <div className="flex items-center gap-2 text-slate-600">
                        <button type="button" onClick={() => onUpdateQuantity(item.id, -1)} className="rounded-full border border-slate-300 px-2 py-1 text-sm">-</button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button type="button" onClick={() => onUpdateQuantity(item.id, 1)} className="rounded-full border border-slate-300 px-2 py-1 text-sm">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-3xl bg-slate-100 p-4 text-slate-900">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-full bg-emerald-600 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-emerald-500"
                >
                  Checkout via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="w-full rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear cart
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default CartSidebar
