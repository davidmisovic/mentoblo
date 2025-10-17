'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { showToast } from '@/lib/toast'

interface FileUploadProps {
  students: Array<{
    id: string
    full_name: string | null
    avatar_url: string | null
  }>
}

export function FileUpload({ students }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setMessage('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload')
      return
    }

    setIsUploading(true)
    setMessage('')

    try {
      const supabase = createClient()

      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `materials/${fileName}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, selectedFile)

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(filePath)

      // Create record in shared_materials table
      const { error: insertError } = await supabase
        .from('shared_materials')
        .insert({
          file_name: selectedFile.name,
          storage_path: filePath,
          file_type: selectedFile.type,
          file_size_bytes: selectedFile.size,
          student_id: selectedStudent || null
        })

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`)
      }

      showToast.success('File uploaded successfully!', 'Your material has been added to the library.')
      setSelectedFile(null)
      setSelectedStudent('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Revalidate the page to show the new file
      window.location.reload()
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setMessage(errorMessage)
      showToast.error('File upload failed', errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📕'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('video')) return '🎥'
    if (fileType.includes('audio')) return '🎵'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📽️'
    return '📄'
  }

  return (
    <div className="space-y-6">
      {/* File Selection */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h4 className="font-medium text-gray-900 mb-2">Upload Files</h4>
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop files here, or click to select
        </p>
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip"
        />
        <Label 
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Choose Files
        </Label>
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
              <p className="text-sm text-gray-600">
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Student Assignment */}
      <div className="space-y-2">
        <Label htmlFor="student-select">Assign to Student (Optional)</Label>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger id="student-select">
            <SelectValue placeholder="Select a student (leave empty for public material)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Public Material (All Students)</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.full_name || 'Student'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Leave empty to make this material available to all your students
        </p>
      </div>

      {/* Upload Button */}
      <Button 
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Uploading...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Material
          </div>
        )}
      </Button>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('successfully')
            ? 'bg-green-50 border border-green-200 text-green-600'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  )
}
