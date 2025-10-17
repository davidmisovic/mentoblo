'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthButton } from '@/components/auth/auth-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Brain, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600'
    },
    {
      name: 'Sessions',
      href: '/dashboard/sessions',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      name: 'Materials',
      href: '/dashboard/materials',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      name: 'AI Tools',
      href: '/dashboard/ai-tools',
      icon: Brain,
      color: 'text-orange-600'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      color: 'text-gray-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-gradient">Mentoblo</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-slate-100 rounded-xl"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-900 hover:shadow-md"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-slate-100 group-hover:bg-white"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : item.color
                    )} />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-6 border-t border-slate-200/50 bg-white/50">
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-72">
        {/* Modern Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-20 px-6 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-slate-100 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-gradient">Mentoblo</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hover:bg-slate-100 rounded-xl">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-slate-100 rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between h-20 px-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-slate-100 rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Page content with modern styling */}
        <main className="min-h-screen">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
