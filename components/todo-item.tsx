"use client"

import { useState } from "react"
import { Trash2, Pencil, Check, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type TodoItemProps = {
  todo: {
    id: number
    text: string
    completed: boolean
  }
  onToggle: () => void
  onDelete: () => void
  onEdit: (newText: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(editText)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
    >
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
          <span className="sr-only">Drag to reorder</span>
        </Button>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="h-4 w-4 rounded border-primary text-primary focus:ring-1 focus:ring-primary"
        />
        {isEditing ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
            autoFocus
          />
        ) : (
          <span 
            className={`${
              todo.completed 
                ? "line-through text-muted-foreground" 
                : "text-foreground"
            } transition-colors flex-1`}
          >
            {todo.text}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSave}
              className="h-8 w-8 hover:bg-green-500 hover:text-white"
              disabled={!editText.trim()}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Save todo</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              className="h-8 w-8 hover:bg-red-500 hover:text-white"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel edit</span>
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 hover:bg-blue-500 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit todo</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete} 
              className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete todo</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

