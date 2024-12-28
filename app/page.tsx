import { TodoList } from '@/components/todo-list'

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <TodoList />
      </div>
    </main>
  )
}

