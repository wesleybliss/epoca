'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import GanttChart from '@/components/gantt-chart'
import type { Task } from '@/components/kanban-board'

// Sample data for the Gantt chart
const initialTasks: Task[] = [
    {
        id: 'task-1',
        title: 'Research competitors',
        description: 'Look into what our competitors are doing',
        priority: 'medium',
        startDate: '2023-06-01',
        dueDate: '2023-06-05',
    },
    {
        id: 'task-2',
        title: 'Design new landing page',
        description: 'Create wireframes for the new landing page',
        priority: 'high',
        startDate: '2023-06-03',
        dueDate: '2023-06-10',
    },
    {
        id: 'task-3',
        title: 'Implement authentication',
        description: 'Add Google authentication to the app',
        priority: 'high',
        startDate: '2023-05-25',
        dueDate: '2023-06-02',
    },
    {
        id: 'task-4',
        title: 'Setup project repository',
        description: 'Initialize Git repository and project structure',
        priority: 'low',
        startDate: '2023-05-20',
        dueDate: '2023-05-21',
    },
]

export default function GanttPage() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="overflow-auto flex-1 p-4">
                <div className="flex flex-col h-full">
                    <h1 className="mb-6 text-2xl font-bold">Gantt Chart</h1>
                    <div className="overflow-x-auto flex-1">
                        <GanttChart tasks={tasks} setTasks={setTasks} />
                    </div>
                </div>
            </main>
        </div>
    )
}
