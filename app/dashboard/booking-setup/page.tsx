'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateBookingSlug, getBookingUrl } from '@/lib/booking-utils'
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'

export default function BookingSetupPage() {
  const [profile, setProfile] = useState<any>(null)
  const [bookingSlug, setBookingSlug] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/signin')
        return
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(profileData)
      setBookingSlug(profileData.booking_slug || generateBookingSlug(profileData.full_name || 'tutor'))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!bookingSlug.trim()) {
      setError('Booking slug is required')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ booking_slug: bookingSlug.trim() })
        .eq('id', profile.id)

      if (error) {
        if (error.code === '23505') {
          setError('This booking slug is already taken. Please choose a different one.')
        } else {
          setError('Failed to save booking slug. Please try again.')
        }
        return
      }

      setProfile({ ...profile, booking_slug: bookingSlug.trim() })
    } catch (error) {
      console.error('Error saving booking slug:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyUrl = async () => {
    const url = getBookingUrl(bookingSlug)
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleGenerateSlug = () => {
    const newSlug = generateBookingSlug(profile?.full_name || 'tutor')
    setBookingSlug(newSlug)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile. Please try again.</p>
        </div>
      </div>
    )
  }

  const bookingUrl = getBookingUrl(bookingSlug)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Set Up Your Booking Page
          </h1>

          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                {profile.booking_slug ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {profile.booking_slug ? 'Booking Page Active' : 'Booking Page Not Set Up'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {profile.booking_slug 
                      ? 'Your students can book lessons using the link below.'
                      : 'Set up your booking page to allow students to schedule lessons with you.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Slug Setup */}
            <div>
              <label htmlFor="booking-slug" className="block text-sm font-medium text-gray-700 mb-2">
                Booking Page URL
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      mentoblo.com/book/
                    </span>
                    <input
                      type="text"
                      id="booking-slug"
                      value={bookingSlug}
                      onChange={(e) => setBookingSlug(e.target.value)}
                      className="flex-1 rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your-name"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    This will be your unique booking page URL. Only letters, numbers, and hyphens are allowed.
                  </p>
                </div>
                <button
                  onClick={handleGenerateSlug}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving || !bookingSlug.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Booking Page'}
              </button>
            </div>

            {/* Booking URL Display */}
            {profile.booking_slug && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Your Booking Page
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Share this link with your students:</p>
                      <p className="font-mono text-sm text-gray-900 break-all">{bookingUrl}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={handleCopyUrl}
                        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        title="Copy URL"
                      >
                        {isCopied ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        title="Open booking page"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">How to Use Your Booking Page</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Share the booking link with potential students</li>
                <li>• Students can select a date and time that works for them</li>
                <li>• You'll receive notifications for new bookings</li>
                <li>• Manage your bookings from your dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
