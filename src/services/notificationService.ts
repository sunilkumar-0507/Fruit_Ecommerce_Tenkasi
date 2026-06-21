import emailjs from '@emailjs/browser'

// ── EmailJS config — set these in .env.local ─────────────────────────────────
const SERVICE_ID  = (import.meta.env as Record<string, string>).VITE_EMAILJS_SERVICE_ID  ?? ''
const PUBLIC_KEY  = (import.meta.env as Record<string, string>).VITE_EMAILJS_PUBLIC_KEY  ?? ''

// Template IDs — one universal template, type is passed as a parameter
const TEMPLATE_ORDER    = (import.meta.env as Record<string, string>).VITE_EMAILJS_TEMPLATE_ORDER    ?? ''
const TEMPLATE_STOCK    = (import.meta.env as Record<string, string>).VITE_EMAILJS_TEMPLATE_STOCK    ?? ''
const TEMPLATE_CUSTOMER = (import.meta.env as Record<string, string>).VITE_EMAILJS_TEMPLATE_CUSTOMER ?? ''
const TEMPLATE_REPORT   = (import.meta.env as Record<string, string>).VITE_EMAILJS_TEMPLATE_REPORT   ?? ''

const ADMIN_EMAIL = 'sunilkumarofficial57@gmail.com'
const PREFS_KEY   = 'tf_notif_prefs'
const REPORT_KEY  = 'tf_last_daily_report'

export interface NotifPrefs {
  newOrder:    boolean
  lowStock:    boolean
  newCustomer: boolean
  dailyReport: boolean
  adminEmail:  string
}

const DEFAULT_PREFS: NotifPrefs = {
  newOrder:    true,
  lowStock:    true,
  newCustomer: false,
  dailyReport: true,
  adminEmail:  ADMIN_EMAIL,
}

export function loadPrefs(): NotifPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    return raw ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<NotifPrefs>) } : DEFAULT_PREFS
  } catch {
    return DEFAULT_PREFS
  }
}

export function savePrefs(prefs: NotifPrefs): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

export function isEmailJsConfigured(): boolean {
  return !!(SERVICE_ID && PUBLIC_KEY)
}

// ── Internal send helper ──────────────────────────────────────────────────────

async function send(templateId: string, params: Record<string, string>): Promise<void> {
  if (!SERVICE_ID || !PUBLIC_KEY || !templateId) return
  try {
    await emailjs.send(SERVICE_ID, templateId, params, { publicKey: PUBLIC_KEY })
  } catch (err) {
    console.warn('[Notification] EmailJS send failed:', err)
  }
}

// ── Public notification functions ─────────────────────────────────────────────

export async function notifyNewOrder(order: {
  id: string
  customerName: string
  customerEmail?: string
  items: Array<{ name: string; qty: number; price: number }>
  total: number
}): Promise<void> {
  const prefs = loadPrefs()
  if (!prefs.newOrder) return

  const itemLines = order.items.map((i) => `${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n')
  await send(TEMPLATE_ORDER, {
    to_email:      prefs.adminEmail,
    subject:       `New Order ${order.id} — ₹${order.total}`,
    order_id:      order.id,
    customer_name: order.customerName,
    customer_email: order.customerEmail ?? 'N/A',
    order_items:   itemLines,
    order_total:   `₹${order.total}`,
    order_date:    new Date().toLocaleString('en-IN'),
  })
}

export async function notifyLowStock(product: {
  name: string
  stock: number
  category?: string
}): Promise<void> {
  const prefs = loadPrefs()
  if (!prefs.lowStock) return

  await send(TEMPLATE_STOCK, {
    to_email:     prefs.adminEmail,
    subject:      `Low Stock Alert — ${product.name} (${product.stock} left)`,
    product_name: product.name,
    stock_count:  String(product.stock),
    category:     product.category ?? 'N/A',
    alert_time:   new Date().toLocaleString('en-IN'),
  })
}

export async function notifyNewCustomer(customer: {
  name: string
  email?: string
  phone?: string
}): Promise<void> {
  const prefs = loadPrefs()
  if (!prefs.newCustomer) return

  await send(TEMPLATE_CUSTOMER, {
    to_email:       prefs.adminEmail,
    subject:        `New Customer Registered — ${customer.name}`,
    customer_name:  customer.name,
    customer_email: customer.email ?? 'N/A',
    customer_phone: customer.phone ?? 'N/A',
    registered_at:  new Date().toLocaleString('en-IN'),
  })
}

export async function maybeSendDailyReport(stats: {
  revenue: string
  orders: string
  delivered: string
  topProduct: string
}): Promise<void> {
  const prefs = loadPrefs()
  if (!prefs.dailyReport) return

  const now = new Date()
  // Only send after 8 AM
  if (now.getHours() < 8) return

  const todayStr = now.toISOString().slice(0, 10)
  if (localStorage.getItem(REPORT_KEY) === todayStr) return

  await send(TEMPLATE_REPORT, {
    to_email:    prefs.adminEmail,
    subject:     `Daily Sales Report — ${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    report_date: now.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
    revenue:     stats.revenue,
    orders:      stats.orders,
    delivered:   stats.delivered,
    top_product: stats.topProduct,
  })

  localStorage.setItem(REPORT_KEY, todayStr)
}

export async function sendTestEmail(): Promise<void> {
  const prefs = loadPrefs()
  await send(TEMPLATE_ORDER, {
    to_email:       prefs.adminEmail,
    subject:        'Test Email — Tenkasi Fresh Notifications Working',
    order_id:       '#TEST-001',
    customer_name:  'Test Customer',
    customer_email: 'test@example.com',
    order_items:    'Alphonso Mango x2 = ₹560',
    order_total:    '₹560',
    order_date:     new Date().toLocaleString('en-IN'),
  })
}
