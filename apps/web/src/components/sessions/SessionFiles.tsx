'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Booking, SharedMaterial } from '@/types'

interface SessionFilesProps {
  session: Booking
  materials: SharedMaterial[]
  isTutor: boolean
}

export function SessionFiles({ session, materials, isTutor }: SessionFilesProps) {
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return '📄'
    
    if (fileType.includes('pdf')) return '📕'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('video')) return '🎥'
    if (fileType.includes('audio')) return '🎵'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️'
    
    return '📄'
  }

  const handleDownload = async (material: SharedMaterial) => {
    try {
      // In a real implementation, this would download from Supabase Storage
      console.log('Downloading:', material.file_name)
      // For now, we'll just show an alert
      alert(`Downloading ${material.file_name}...`)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          Session Materials
        </CardTitle>
        <CardDescription>
          {isTutor ? 'Files shared with your student' : 'Files shared by your tutor'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {materials.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No materials shared yet</p>
            <p className="text-gray-400 text-xs mt-1">
              {isTutor ? 'Upload files to share with your student' : 'Your tutor will share materials here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{getFileIcon(material.file_type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{material.file_name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{formatFileSize(material.file_size_bytes)}</span>
                    <span>•</span>
                    <span>{formatDate(material.created_at)}</span>
                    {material.student_id && (
                      <>
                        <span>•</span>
                        <Badge className="bg-blue-100 text-blue-800">Personal</Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownload(material)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isTutor && (
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/materials">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Material
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
