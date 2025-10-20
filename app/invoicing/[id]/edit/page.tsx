'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Invoice {
  id: string
  invoice_number: string
  student_id: string
  student_name: string
  issue_date: string
  due_date: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes: string
  status: string
  created_at: string
}

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  const { id } = params
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    issue_date: '',
    due_date: '',
    notes: '',
    status: 'draft'
  })

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }
      fetchInvoice()
    }
    checkUser()
  }, [router, id])

  const fetchInvoice = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/invoices/${id}`)
      const data = await response.json()

      if (response.ok) {
        setInvoice(data.invoice)
        setFormData({
          issue_date: data.invoice.issue_date,
          due_date: data.invoice.due_date,
          notes: data.invoice.notes,
          status: data.invoice.status
        })
        setInvoiceItems(data.invoice.items)
      } else {
        setError(data.error || 'Invoice not found')
      }
    } catch (err) {
      console.error('Error fetching invoice:', err)
      setError('Failed to fetch invoice details')
    } finally {
      setLoading(false)
    }
  }

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
    setInvoiceItems([...invoiceItems, newItem])
  }

  const removeInvoiceItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId))
  }

  const updateInvoiceItem = (itemId: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    }))
  }

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.1 // 10% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          items: invoiceItems,
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          total: calculateTotal(),
          notes: formData.notes,
          status: formData.status
        }),
      })

      if (response.ok) {
        router.push(`/invoicing/${id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update invoice')
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
      setError('Failed to update invoice')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
          <p className="mt-2 text-neutral-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-neutral-700">{error}</p>
          <button
            onClick={() => router.push('/invoicing')}
            className="mt-4 inline-flex items-center rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Invoice Not Found</h2>
          <p className="mt-2 text-neutral-700">The invoice you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/invoicing')}
            className="mt-4 inline-flex items-center rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] border border-neutral-200 bg-white shadow-sm grid place-items-center">
                <span className="text-[13px] font-medium tracking-tight text-neutral-900">M</span>
              </div>
              <span className="text-[15px] font-medium tracking-tight text-neutral-900">Mentoblo</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Dashboard</Link>
              <Link href="/scheduling" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Scheduling</Link>
              <Link href="/students" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">Students</Link>
              <Link href="/invoicing" className="text-[14px] text-neutral-900 font-medium">Invoicing</Link>
              <Link href="/ai" className="text-[14px] text-neutral-700 hover:text-neutral-900 transition">AI Tools</Link>
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push('/')
                }}
                className="text-[14px] text-neutral-700 hover:text-neutral-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Edit Invoice {invoice.invoice_number}</h1>
            <p className="text-neutral-600">Update invoice details and items.</p>
          </div>
          <Link
            href={`/invoicing/${id}`}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Invoice
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Information */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Invoice Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Issue Date *</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-neutral-900">Invoice Items</h2>
              <button
                type="button"
                onClick={addInvoiceItem}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {invoiceItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-neutral-200 rounded-lg">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                      placeholder="Item description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Rate</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateInvoiceItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeInvoiceItem(item.id)}
                      className="w-full inline-flex justify-center items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="md:col-span-5">
                    <div className="text-right">
                      <span className="text-sm text-neutral-600">Amount: </span>
                      <span className="text-sm font-medium text-neutral-900">${item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Notes</h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="Additional notes for this invoice..."
            />
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Invoice Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Subtotal</span>
                <span className="text-sm font-medium text-neutral-900">${calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Tax (10%)</span>
                <span className="text-sm font-medium text-neutral-900">${calculateTax().toLocaleString()}</span>
              </div>
              <div className="border-t border-neutral-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-neutral-900">Total</span>
                  <span className="text-base font-semibold text-neutral-900">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/invoicing/${id}`}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
