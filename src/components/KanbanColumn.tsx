import type React from 'react'
import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Column, Task } from '@/components/KanbanBoard'
import { KanbanTask } from '@/components/KanbanTask'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoreHorizontal, Plus, Trash } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface KanbanColumnProps {
    column: Column
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>
}

export function KanbanColumn({ column, setColumns }: KanbanColumnProps) {
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
    const [newTask, setNewTask] = useState < Partial < Task >> ({
        title: '',
        description: '',
        priority: 'medium',
    })

    const { /* attributes, listeners, */ setNodeRef, transform, transition } = useSortable({
        id: column.id,
        data: {
            type: 'column',
            column,
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const addTask = () => {
        if (!newTask.title) return

        const task: Task = {
            id: `task-${Date.now()}`,
            title: newTask.title,
            description: newTask.description || '',
            priority: (newTask.priority as 'low' | 'medium' | 'high') || 'medium',
            startDate: newTask.startDate,
            dueDate: newTask.dueDate,
        }

        setColumns(prev => prev.map(col => (col.id === column.id ? { ...col, tasks: [...col.tasks, task] } : col)))

        setNewTask({
            title: '',
            description: '',
            priority: 'medium',
        })

        setIsAddTaskOpen(false)
    }

    const deleteColumn = () => {
        setColumns(prev => prev.filter(col => col.id !== column.id))
    }

    return (
        <Card ref={setNodeRef} style={style} className="flex flex-col w-72 h-full shrink-0">
            <CardHeader className="flex flex-row justify-between items-center p-4 space-y-0">
                <CardTitle className="font-medium text-md">{column.title}</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={deleteColumn} className="text-destructive">
                            <Trash className="mr-2 w-4 h-4" />
                            Delete Column
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="overflow-y-auto flex-1 p-2 space-y-2">
                {column.tasks.map(task => (
                    <KanbanTask key={task.id} task={task} setColumns={setColumns} />
                ))}
            </CardContent>

            <div className="p-2 border-t border-border">
                <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="justify-start w-full">
                            <Plus className="mr-2 w-4 h-4" />
                            Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="task-title">Title</Label>
                                <Input
                                    id="task-title"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="Enter task title" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="task-description">Description</Label>
                                <Textarea
                                    id="task-description"
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Enter task description" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="task-priority">Priority</Label>
                                <Select
                                    value={newTask.priority}
                                    onValueChange={value => setNewTask({
                                        ...newTask,
                                        priority: value as 'low' | 'medium' | 'high',
                                    })}>
                                    <SelectTrigger id="task-priority">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start-date">Start Date</Label>
                                    <Input
                                        id="start-date"
                                        type="date"
                                        value={newTask.startDate}
                                        onChange={e => setNewTask({ ...newTask, startDate: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="due-date">Due Date</Label>
                                    <Input
                                        id="due-date"
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={addTask}>Add Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </Card>
    )
}
