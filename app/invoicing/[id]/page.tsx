'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Invoice {
  id: string
  invoice_number: string
  student_id: string
  student_name: string
  issue_date: string
  due_date: string
  items: Array<{
    id: string
    description: string
    quantity: number
    rate: number
    amount: number
  }>
  subtotal: number
  tax: number
  total: number
  notes: string
  status: string
  created_at: string
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

  const handleStatusChange = async (newStatus: string) => {
    if (!invoice) return

    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setInvoice({ ...invoice, status: newStatus })
      } else {
        alert('Failed to update invoice status')
      }
    } catch (error) {
      console.error('Error updating invoice:', error)
      alert('Failed to update invoice status')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/invoicing')
      } else {
        alert('Failed to delete invoice')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Failed to delete invoice')
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
            <h1 className="text-2xl font-semibold text-neutral-900">Invoice {invoice.invoice_number}</h1>
            <p className="text-neutral-600">Invoice details and management.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/invoicing/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Invoice
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Invoice Information */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Invoice Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Invoice Number</p>
                  <p className="mt-1 text-neutral-900">{invoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Student</p>
                  <p className="mt-1 text-neutral-900">{invoice.student_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Issue Date</p>
                  <p className="mt-1 text-neutral-900">{new Date(invoice.issue_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Due Date</p>
                  <p className="mt-1 text-neutral-900">{new Date(invoice.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Created</p>
                  <p className="mt-1 text-neutral-900">{new Date(invoice.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Invoice Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">${item.rate.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Notes</h2>
                <p className="text-neutral-700 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Invoice Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Subtotal</span>
                  <span className="text-sm font-medium text-neutral-900">${invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Tax</span>
                  <span className="text-sm font-medium text-neutral-900">${invoice.tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-neutral-900">Total</span>
                    <span className="text-base font-semibold text-neutral-900">${invoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Status Actions</h2>
              <div className="space-y-3">
                {invoice.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange('sent')}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Send Invoice
                  </button>
                )}
                {invoice.status === 'sent' && (
                  <button
                    onClick={() => handleStatusChange('paid')}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Mark as Paid
                  </button>
                )}
                {invoice.status === 'paid' && (
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Invoice Paid
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
