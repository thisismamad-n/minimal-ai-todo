"use client"

import { useState, useEffect } from "react"
import { Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SettingsDialog() {
  const [apiKey, setApiKey] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem("mistral_api_key")
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("mistral_api_key", apiKey.trim())
    } else {
      localStorage.removeItem("mistral_api_key")
    }
    setIsOpen(false)
  }

  const handleClear = () => {
    setApiKey("")
    localStorage.removeItem("mistral_api_key")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-accent"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Mistral API key. If not provided, the default key will be used.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium leading-none">
              Mistral API Key
            </label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              {apiKey && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClear}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Your API key will be stored locally in your browser.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 