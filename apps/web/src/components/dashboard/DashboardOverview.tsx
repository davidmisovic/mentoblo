'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/stripe'
import Link from 'next/link'
import type { Profile } from '@/types'

interface DashboardOverviewProps {
  profile: Profile
  totalBookings: number
  completedSessions: number
  totalEarnings: number
}

export function DashboardOverview({ profile, totalBookings, completedSessions, totalEarnings }: DashboardOverviewProps) {
  const completionRate = totalBookings > 0 ? Math.round((completedSessions / totalBookings) * 100) : 0
  const averageEarnings = completedSessions > 0 ? Math.round(totalEarnings / completedSessions) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          Overview
        </CardTitle>
        <CardDescription>
          Your tutoring business at a glance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || 'User'} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-medium text-sm">
                {(profile.full_name || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">
              {profile.full_name || 'Tutor'}
            </h4>
            <p className="text-sm text-gray-600 capitalize">
              {profile.user_role}
            </p>
            {profile.public_handle && (
              <p className="text-xs text-gray-500">
                @{profile.public_handle}
              </p>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <span className="font-medium text-gray-900">{completionRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average Earnings</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(averageEarnings)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Earnings</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(totalEarnings)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/dashboard/settings">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </Button>
          
          {profile.user_role === 'tutor' && (
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/dashboard/analytics">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
