'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import type { SharedMaterial } from '@/types'

interface MaterialsTableProps {
  materials: (SharedMaterial & {
    profiles?: {
      full_name: string | null
      avatar_url: string | null
    } | null
  })[]
}

export function MaterialsTable({ materials }: MaterialsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

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
      year: 'numeric',
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

  const handleDownload = async (material: typeof materials[0]) => {
    try {
      const supabase = createClient()
      
      // Get the file from storage
      const { data, error } = await supabase.storage
        .from('materials')
        .download(material.storage_path)

      if (error) {
        console.error('Download error:', error)
        return
      }

      // Create download link
      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = material.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDelete = async (materialId: number) => {
    if (!confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return
    }

    setDeletingId(materialId)

    try {
      const supabase = createClient()
      
      // Get the material to get the storage path
      const { data: material } = await supabase
        .from('shared_materials')
        .select('storage_path')
        .eq('id', materialId)
        .single()

      if (material) {
        // Delete from storage
        await supabase.storage
          .from('materials')
          .remove([material.storage_path])
      }

      // Delete from database
      const { error } = await supabase
        .from('shared_materials')
        .delete()
        .eq('id', materialId)

      if (error) {
        throw new Error('Failed to delete material')
      }

      // Refresh the page
      window.location.reload()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete material. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h3>
        <p className="text-gray-600 mb-4">Upload your first teaching material to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getFileIcon(material.file_type)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{material.file_name}</p>
                    <p className="text-sm text-gray-500">{material.file_type}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {material.student_id && material.profiles ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-medium">
                        {material.profiles.full_name?.charAt(0).toUpperCase() || 'S'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {material.profiles.full_name || 'Student'}
                    </span>
                  </div>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Public</Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {formatFileSize(material.file_size_bytes)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {formatDate(material.created_at)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownload(material)}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(material.id)}
                      disabled={deletingId === material.id}
                      className="text-red-600 focus:text-red-600"
                    >
                      {deletingId === material.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      ) : (
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
