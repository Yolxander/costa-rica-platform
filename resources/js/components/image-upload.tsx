import * as React from "react"
import { useCallback } from "react"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  value: string[]
  files: File[]
  onChange: (urls: string[], files: File[]) => void
  maxFiles?: number
  accept?: string
}

export function ImageUpload({
  value = [],
  files = [],
  onChange,
  maxFiles = 20,
  accept = "image/*",
}: ImageUploadProps) {
  const urls = value
  const totalCount = urls.length + files.length

  const handleFilesAdded = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles).filter((f) => f.type.startsWith("image/"))
      const remaining = maxFiles - totalCount
      const toAdd = arr.slice(0, Math.max(0, remaining))
      if (toAdd.length > 0) {
        onChange(urls, [...files, ...toAdd])
      }
    },
    [urls, files, totalCount, maxFiles, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer.files) {
        handleFilesAdded(e.dataTransfer.files)
      }
    },
    [handleFilesAdded]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files
      if (selected) {
        handleFilesAdded(selected)
        e.target.value = ""
      }
    },
    [handleFilesAdded]
  )

  const removeUrl = useCallback(
    (index: number) => {
      onChange(
        urls.filter((_, i) => i !== index),
        files
      )
    },
    [urls, files, onChange]
  )

  const removeFile = useCallback(
    (index: number) => {
      onChange(
        urls,
        files.filter((_, i) => i !== index)
      )
    },
    [urls, files, onChange]
  )

  const [urlInput, setUrlInput] = React.useState("")
  const addUrl = useCallback(() => {
    const trimmed = urlInput.trim()
    if (!trimmed || totalCount >= maxFiles) return
    try {
      new URL(trimmed)
      if (!urls.includes(trimmed)) {
        onChange([...urls, trimmed], files)
        setUrlInput("")
      }
    } catch {
      // Invalid URL, ignore
    }
  }, [urlInput, urls, files, totalCount, maxFiles, onChange])

  const handleUrlKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addUrl()
      }
    },
    [addUrl]
  )

  return (
    <div className="space-y-4">
      <div>
        <Label>Property Images</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Drag and drop images, or add by URL. Up to {maxFiles} images, 5MB each.
        </p>

        <div
          className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">Drop images here or click to upload</p>
          <input
            type="file"
            multiple
            accept={accept}
            className="sr-only"
            id="image-upload-input"
            onChange={handleFileInputChange}
            disabled={totalCount >= maxFiles}
          />
          <label htmlFor="image-upload-input" className="cursor-pointer mt-1 block text-xs text-muted-foreground">
            PNG, JPG up to 5MB each
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Or paste image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleUrlKeyDown}
          disabled={totalCount >= maxFiles}
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={addUrl} disabled={!urlInput.trim() || totalCount >= maxFiles}>
          Add URL
        </Button>
      </div>

      {(urls.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {urls.map((url, index) => (
            <div key={`url-${index}`} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
              <img src={url} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeUrl(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {files.map((file, index) => (
            <div key={`file-${index}`} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
