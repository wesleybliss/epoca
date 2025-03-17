'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { GanttChart } from '@/components/gantt-chart'
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
            <main className="flex-1 overflow-auto p-4">
                <div className="h-full flex flex-col">
                    <h1 className="text-2xl font-bold mb-6">Gantt Chart</h1>
                    <div className="flex-1 overflow-x-auto">
                        <GanttChart tasks={tasks} setTasks={setTasks} />
                    </div>
                </div>
            </main>
        </div>
    )
}

