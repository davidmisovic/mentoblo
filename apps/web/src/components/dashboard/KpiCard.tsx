'use client'

import { Card, CardContent } from '@/components/ui/card'

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  textColor: string
}

export function KpiCard({ title, value, icon, color, textColor }: KpiCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
