import KanbanBoard from '@/components/kanban-board'
import Sidebar from '@/components/sidebar'

export default function Home() {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="overflow-auto flex-1 p-4">
                <KanbanBoard />
            </main>
        </div>
    )
}
