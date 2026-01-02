'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AdminImport() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  if (!session || (session.user as any)?.role !== 'admin') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Access denied. Admin only.</div>
      </main>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setImportStatus(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setImportStatus(`Success! Generated ${data.questionsGenerated} questions.`)
      } else {
        setImportStatus(`Error: ${data.error}`)
      }
    } catch (error) {
      setImportStatus('Upload failed. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Import Questions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a DOCX file to generate questions automatically
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select DOCX File
              </label>
              <input
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {file && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm">
                  Selected: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
                </p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isUploading ? 'Processing...' : 'Import & Generate Questions'}
            </button>

            {importStatus && (
              <div
                className={`p-4 rounded-lg ${
                  importStatus.includes('Success')
                    ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}
              >
                {importStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

