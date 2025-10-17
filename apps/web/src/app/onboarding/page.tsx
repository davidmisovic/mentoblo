'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/types'

export default function OnboardingPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [fullName, setFullName] = useState('')
  const [publicHandle, setPublicHandle] = useState('')
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role)
  }

  const checkHandleAvailability = async (handle: string) => {
    if (!handle) return true
    
    const { data } = await supabase
      .from('profiles')
      .select('public_handle')
      .eq('public_handle', handle)
      .single()
    
    return !data
  }

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMessage('Please sign in first')
        return
      }

      // Check handle availability
      const isHandleAvailable = await checkHandleAvailability(publicHandle)
      if (!isHandleAvailable) {
        setMessage('This handle is already taken. Please choose another one.')
        setLoading(false)
        return
      }

      const updateData: any = {
        user_role: userRole,
        full_name: fullName,
        public_handle: publicHandle
      }

      // Add tutor-specific fields
      if (userRole === 'tutor') {
        updateData.headline = headline
        updateData.bio = bio
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        setMessage(error.message)
      } else {
        if (userRole === 'tutor') {
          router.push('/dashboard/settings/availability')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
            </div>
            <CardTitle className="text-3xl">Welcome to Mentoblo!</CardTitle>
            <CardDescription className="text-lg">
              Let&apos;s set up your profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!userRole ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    How will you be using Mentoblo?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        userRole === 'tutor' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleRoleSelection('tutor')}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2">I&apos;m a Tutor</h4>
                        <p className="text-sm text-muted-foreground">
                          I want to teach students and manage my tutoring business
                        </p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        userRole === 'student' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleRoleSelection('student')}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2">I&apos;m a Student</h4>
                        <p className="text-sm text-muted-foreground">
                          I want to find tutors and book learning sessions
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCompleteOnboarding} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Complete your {userRole === 'tutor' ? 'tutor' : 'student'} profile
                  </h3>
                  <p className="text-muted-foreground">
                    This information will help personalize your experience
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publicHandle">Public Handle</Label>
                    <Input
                      id="publicHandle"
                      type="text"
                      value={publicHandle}
                      onChange={(e) => setPublicHandle(e.target.value)}
                      placeholder="e.g., john-doe (for mentoblo.com/t/john-doe)"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be your public profile URL: mentoblo.com/t/{publicHandle || 'your-handle'}
                    </p>
                  </div>

                  {userRole === 'tutor' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input
                          id="headline"
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="e.g., Certified English Tutor"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          A short description that appears on your profile
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell students about your teaching experience, qualifications, and approach..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          A detailed description of your teaching background
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {message && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{message}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setUserRole(null)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Setting up...' : 'Complete Setup'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
