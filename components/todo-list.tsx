"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TodoItem } from '@/components/todo-item'
import { generateTodo } from '@/lib/ai'
import { Loader2 } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SettingsDialog } from '@/components/settings-dialog'

type Todo = {
  id: number
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addTodo = async () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: input,
        completed: false
      }
      setTodos([...todos, newTodo])
      setInput('')
    }
  }

  const generateAITodo = async () => {
    try {
      setIsGenerating(true)
      const aiTodos = await generateTodo(aiPrompt)
      if (aiTodos && aiTodos.length > 0) {
        const newTodos = aiTodos.map(todoText => ({
          id: Date.now() + Math.random(),
          text: todoText,
          completed: false
        }))
        setTodos([...todos, ...newTodos])
        setAiPrompt('')
      }
    } catch (error) {
      console.error('Failed to generate todo:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">AI-Powered Todo List</CardTitle>
          <SettingsDialog />
        </div>
        <CardDescription>Manage your tasks with AI assistance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new todo..."
            className="flex-1"
          />
          <Button onClick={addTodo} className="shrink-0">Add</Button>
        </div>
        <div className="flex gap-2 mb-4">
          <Input
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Enter what kind of todo you want AI to generate..."
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={generateAITodo} 
            className="shrink-0"
            disabled={isGenerating || !aiPrompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate AI Todo'
            )}
          </Button>
        </div>
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={todos}
              strategy={verticalListSortingStrategy}
            >
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={() => toggleTodo(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                  onEdit={(newText) => editTodo(todo.id, newText)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  )
}

