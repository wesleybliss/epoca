import { useState } from 'react'
import {
    DndContext,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { KanbanColumn } from '~/components/KanbanColumn.tsx'
import { KanbanTask } from '~/components/KanbanTask.tsx'
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

// Define types for our data
export interface Task {
    id: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    dueDate?: string
    startDate?: string
}

export interface Column {
    id: string
    title: string
    tasks: Task[]
}

// Sample data
const initialColumns: Column[] = [
    {
        id: 'todo',
        title: 'To Do',
        tasks: [
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
        ],
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        tasks: [
            {
                id: 'task-3',
                title: 'Implement authentication',
                description: 'Add Google authentication to the app',
                priority: 'high',
                startDate: '2023-05-25',
                dueDate: '2023-06-02',
            },
        ],
    },
    {
        id: 'done',
        title: 'Done',
        tasks: [
            {
                id: 'task-4',
                title: 'Setup project repository',
                description: 'Initialize Git repository and project structure',
                priority: 'low',
                startDate: '2023-05-20',
                dueDate: '2023-05-21',
            },
        ],
    },
]

export default function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>(initialColumns)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [newColumnTitle, setNewColumnTitle] = useState('')
    const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    )

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const taskId = active.id as string

        // Find the task that is being dragged
        for (const column of columns) {
            const task = column.tasks.find(t => t.id === taskId)

            if (task) {
                setActiveTask(task)
                break
            }
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) {
            setActiveTask(null)
            return
        }

        const activeId = active.id as string
        const overId = over.id as string

        // Find source and destination columns
        let sourceColumnIndex = -1
        let sourceTaskIndex = -1
        let destColumnIndex = -1

        columns.forEach((column, colIndex) => {
            const taskIndex = column.tasks.findIndex(task => task.id === activeId)

            if (taskIndex !== -1) {
                sourceColumnIndex = colIndex
                sourceTaskIndex = taskIndex
            }

            if (column.id === overId) {
                destColumnIndex = colIndex
            }
        })

        // If dropping on another task, find its column
        if (destColumnIndex === -1) {
            columns.forEach((column, colIndex) => {
                const taskIndex = column.tasks.findIndex(task => task.id === overId)

                if (taskIndex !== -1) {
                    destColumnIndex = colIndex
                }
            })
        }

        if (sourceColumnIndex === -1 || destColumnIndex === -1) {
            setActiveTask(null)
            return
        }

        const newColumns = [...columns]
        const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(sourceTaskIndex, 1)

        newColumns[destColumnIndex].tasks.push(movedTask)

        setColumns(newColumns)
        setActiveTask(null)
    }

    const addNewColumn = () => {
        if (newColumnTitle.trim() === '') return

        const newColumn: Column = {
            id: `column-${Date.now()}`,
            title: newColumnTitle,
            tasks: [],
        }

        setColumns([...columns, newColumn])
        setNewColumnTitle('')
        setIsAddColumnOpen(false)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kanban Board</h1>

                <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Column
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Column</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="column-title">Column Title</Label>
                                <Input
                                    id="column-title"
                                    value={newColumnTitle}
                                    onChange={e => setNewColumnTitle(e.target.value)}
                                    placeholder="Enter column title" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={addNewColumn}>Add Column</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex-1 overflow-x-auto">
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 h-full">
                        {columns.map(column => (
                            <KanbanColumn key={column.id} column={column} setColumns={setColumns} />
                        ))}
                    </div>

                    <DragOverlay>{activeTask && <KanbanTask task={activeTask} />}</DragOverlay>
                </DndContext>
            </div>
        </div>
    )
}
