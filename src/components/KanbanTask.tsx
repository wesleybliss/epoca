import type React from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/components/kanban-board'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

interface KanbanTaskProps {
    task: Task
    setColumns?: React.Dispatch<React.SetStateAction<any[]>>
}

export function KanbanTask({ task, setColumns }: KanbanTaskProps) {
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
    const [editedTask, setEditedTask] = useState<Task>({ ...task })

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task.id,
        data: {
            type: 'task',
            task,
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-blue-100 text-blue-800',
        high: 'bg-red-100 text-red-800',
    }

    const updateTask = () => {
        if (!setColumns) return

        setColumns(prev =>
            prev.map(column => ({
                ...column,
                tasks: column.tasks.map(t => (t.id === task.id ? editedTask : t)),
            })),
        )

        setIsEditTaskOpen(false)
    }

    const deleteTask = () => {
        if (!setColumns) return

        setColumns(prev =>
            prev.map(column => ({
                ...column,
                tasks: column.tasks.filter(t => t.id !== task.id),
            })),
        )

        setIsEditTaskOpen(false)
    }

    return (
        <>
            <Card
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
                onClick={() => setColumns && setIsEditTaskOpen(true)}>
                <CardContent className="p-3">
                    <div className="mb-1 font-medium">{task.title}</div>
                    {task.description && (
                        <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                        </p>
                    )}
                    <Badge className={priorityColors[task.priority]}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                </CardContent>
                {(task.startDate || task.dueDate) && (
                    <CardFooter className="flex gap-2 p-3 pt-0 text-xs text-muted-foreground">
                        {task.startDate && (
                            <div className="flex items-center">
                                <Calendar className="mr-1 w-3 h-3" />
                                {new Date(task.startDate).toLocaleDateString()}
                            </div>
                        )}
                        {task.dueDate && (
                            <div className="flex items-center">
                                <Clock className="mr-1 w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                        )}
                    </CardFooter>
                )}
            </Card>

            {setColumns && (
                <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-task-title">Title</Label>
                                <Input
                                    id="edit-task-title"
                                    value={editedTask.title}
                                    onChange={e => setEditedTask({ ...editedTask, title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-task-description">Description</Label>
                                <Textarea
                                    id="edit-task-description"
                                    value={editedTask.description}
                                    onChange={e => setEditedTask({ ...editedTask, description: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-task-priority">Priority</Label>
                                <Select
                                    value={editedTask.priority}
                                    onValueChange={value =>
                                        setEditedTask({ ...editedTask, priority: value as 'low' | 'medium' | 'high' })
                                    }>
                                    <SelectTrigger id="edit-task-priority">
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
                                    <Label htmlFor="edit-start-date">Start Date</Label>
                                    <Input
                                        id="edit-start-date"
                                        type="date"
                                        value={editedTask.startDate}
                                        onChange={e => setEditedTask({ ...editedTask, startDate: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-due-date">Due Date</Label>
                                    <Input
                                        id="edit-due-date"
                                        type="date"
                                        value={editedTask.dueDate}
                                        onChange={e => setEditedTask({ ...editedTask, dueDate: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex justify-between">
                            <Button variant="destructive" onClick={deleteTask}>
                                Delete Task
                            </Button>
                            <Button onClick={updateTask}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
