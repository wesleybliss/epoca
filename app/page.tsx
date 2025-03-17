import KanbanBoard from '@/components/kanban-board'
import { Sidebar } from '@/components/sidebar'

export default function Home() {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4">
                <KanbanBoard />
            </main>
        </div>
    )
}

