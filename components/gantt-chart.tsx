'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import type { Task } from '@/components/kanban-board'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GripHorizontal } from 'lucide-react'
import cn from 'classnames'

interface GanttChartProps {
  tasks: Task[]
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>
}

export function GanttChart({ tasks, setTasks }: GanttChartProps) {
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
    const [editedTask, setEditedTask] = useState<Task | null>(null)
    const [draggedTask, setDraggedTask] = useState<string | null>(null)
    const [resizingTask, setResizingTask] = useState<string | null>(null)
    const [dragStartX, setDragStartX] = useState(0)
    const [originalStartDate, setOriginalStartDate] = useState<Date | null>(null)
    const [originalEndDate, setOriginalEndDate] = useState<Date | null>(null)
    const [resizeStartX, setResizeStartX] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [handleDragMove, setHandleDragMove] = useState<((e: MouseEvent) => void) | null>(null)
    const [handleResizeMove, setHandleResizeMove] = useState<((e: MouseEvent) => void) | null>(null)
    
    // Sort tasks by start date
    const sortedTasks = [...tasks].sort((a, b) => {
        if (!a.startDate) return 1
        if (!b.startDate) return -1
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
    
    // Filter out tasks without dates
    const tasksWithDates = sortedTasks.filter(task => task.startDate && task.dueDate)
    
    if (tasksWithDates.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No tasks with dates to display</p>
            </div>
        )
    }
    
    // Find the earliest and latest dates
    const earliestDate = new Date(Math.min(...tasksWithDates.map(task => new Date(task.startDate!).getTime())))
    const latestDate = new Date(Math.max(...tasksWithDates.map(task => new Date(task.dueDate!).getTime())))
    
    // Calculate the total number of days
    const totalDays = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    // Generate dates for the header
    const dates = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date(earliestDate)
        
        date.setDate(date.getDate() + i)
        return date
    })
    
    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-blue-100 text-blue-800',
        high: 'bg-red-100 text-red-800',
    }
    
    // Handle double-click to open edit modal
    const handleTaskDoubleClick = (task: Task) => {
        if (!isDragging && !isResizing) {
            setEditedTask({ ...task })
            setIsEditTaskOpen(true)
        }
    }
    
    // Handle drag end
    useEffect(() => {
        const handleMouseUp = () => {
            if (isDragging || isResizing) {
                setIsDragging(false)
                setIsResizing(false)
                setDraggedTask(null)
                setResizingTask(null)
                setOriginalStartDate(null)
                setOriginalEndDate(null)
            }
        }
        
        document.addEventListener('mouseup', handleMouseUp)
        
        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, isResizing])
    
    const updateTask = () => {
        if (!setTasks || !editedTask) return
        
        setTasks(prev => prev.map(t => (t.id === editedTask.id ? editedTask : t)))
        
        setIsEditTaskOpen(false)
        setEditedTask(null)
    }
    
    const deleteTask = () => {
        if (!setTasks || !editedTask) return
        
        setTasks(prev => prev.filter(t => t.id !== editedTask.id))
        
        setIsEditTaskOpen(false)
        setEditedTask(null)
    }
    
    // Handle drag start
    const handleDragStart = (e: React.MouseEvent, taskId: string) => {
    // Prevent text selection during drag
        e.preventDefault()
        e.stopPropagation()
        
        setDraggedTask(taskId)
        setDragStartX(e.clientX)
        setIsDragging(true)
        
        const task = tasks.find(t => t.id === taskId)
        
        if (task && task.startDate && task.dueDate) {
            setOriginalStartDate(new Date(task.startDate))
            setOriginalEndDate(new Date(task.dueDate))
        }
    }
    
    // Handle drag movement
    useEffect(() => {
        if (draggedTask && originalStartDate && originalEndDate && setTasks) {
            const newHandleDragMove = (e: MouseEvent) => {
                const deltaX = e.clientX - dragStartX
                const daysDelta = Math.round(deltaX / 48) // 48px per day
                
                if (daysDelta === 0) return
                
                const task = tasks.find(t => t.id === draggedTask)
                
                if (!task) return
                
                const newStartDate = new Date(originalStartDate)
                
                newStartDate.setDate(newStartDate.getDate() + daysDelta)
                
                const newEndDate = new Date(originalEndDate)
                
                newEndDate.setDate(newEndDate.getDate() + daysDelta)
                
                setTasks(prev =>
                    prev.map(t =>
                        t.id === draggedTask
                            ? {
                                ...t,
                                startDate: newStartDate.toISOString().split('T')[0],
                                dueDate: newEndDate.toISOString().split('T')[0],
                            }
                            : t,
                    ),
                )
            }
            
            setHandleDragMove(() => newHandleDragMove)
            document.addEventListener('mousemove', newHandleDragMove)
            
            return () => {
                document.removeEventListener('mousemove', newHandleDragMove)
                setHandleDragMove(null)
            }
        } else {
            setHandleDragMove(null)
            
            return () => {}
        }
    }, [draggedTask, dragStartX, originalStartDate, originalEndDate, tasks, setTasks])
    
    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent, taskId: string) => {
    // Prevent the event from bubbling up to the task drag handler
        e.stopPropagation()
        e.preventDefault()
        
        setResizingTask(taskId)
        setResizeStartX(e.clientX)
        setIsResizing(true)
        
        const task = tasks.find(t => t.id === taskId)
        
        if (task && task.dueDate) {
            setOriginalEndDate(new Date(task.dueDate))
        }
    }
    
    // Handle resize movement
    useEffect(() => {
        if (resizingTask && originalEndDate && setTasks) {
            const newHandleResizeMove = (e: MouseEvent) => {
                const deltaX = e.clientX - resizeStartX
                const daysDelta = Math.round(deltaX / 48) // 48px per day
                
                if (daysDelta === 0) return
                
                const task = tasks.find(t => t.id === resizingTask)
                
                if (!task) return
                
                const newEndDate = new Date(originalEndDate)
                
                newEndDate.setDate(newEndDate.getDate() + daysDelta)
                
                // Ensure end date is not before start date
                const startDate = new Date(task.startDate!)
                
                if (newEndDate < startDate) {
                    newEndDate.setTime(startDate.getTime())
                }
                
                setTasks(prev =>
                    prev.map(t => (t.id === resizingTask ? { ...t, dueDate: newEndDate.toISOString().split('T')[0] } : t)),
                )
            }
            
            setHandleResizeMove(() => newHandleResizeMove)
            document.addEventListener('mousemove', newHandleResizeMove)
            
            return () => {
                document.removeEventListener('mousemove', newHandleResizeMove)
                setHandleResizeMove(null)
            }
        } else {
            setHandleResizeMove(null)
            
            return () => {}
        }
    }, [resizingTask, resizeStartX, originalEndDate, tasks, setTasks])
    
    return (
        <div className="relative">
            {/* Header with dates */}
            <div className="flex border-b sticky top-0 bg-background z-10">
                <div className="w-64 shrink-0 p-2 font-medium">Task</div>
                <div className="flex-1 flex">
                    {dates.map((date, index) => (
                        <div key={index} className="w-12 shrink-0 text-center text-xs p-2 border-l">
                            {date.getDate()}
                            <div className="text-[10px] text-muted-foreground">
                                {date.toLocaleString('default', { month: 'short' })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Tasks with bars */}
            <div className="flex flex-col">
                {tasksWithDates.map(task => {
                    // Calculate position and width of the task bar
                    const startDate = new Date(task.startDate!)
                    const endDate = new Date(task.dueDate!)
                    
                    const startDayIndex = Math.floor((startDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24))
                    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                    
                    const isBeingDragged = draggedTask === task.id
                    const isBeingResized = resizingTask === task.id
                    
                    return (
                        <div key={task.id} className="flex border-b">
                            <div className="w-64 shrink-0 p-2 flex items-center">
                                <div>
                                    <div className="font-medium">{task.title}</div>
                                    <Badge className={priorityColors[task.priority]}>
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex-1 flex relative">
                                {dates.map((_, index) => (
                                    <div key={index} className="w-12 shrink-0 border-l h-16"></div>
                                ))}
                                <div
                                    className={cn('absolute top-2 h-12 rounded-md select-none transition-colors duration-150', {
                                        'bg-blue-100 border-2 border-blue-500 shadow-lg z-10': isBeingDragged,
                                        'bg-green-100 border-2 border-green-500 shadow-lg z-10': isBeingResized,
                                        'bg-primary/20 border-2 border-primary hover:bg-primary/30': !isBeingDragged && !isBeingResized,
                                    })}
                                    style={{
                                        left: `${startDayIndex * 48}px`,
                                        width: `${duration * 48 - 8}px`,
                                    }}
                                    onDoubleClick={() => handleTaskDoubleClick(task)}>
                                    {/* Drag handle */}
                                    <div
                                        className={cn('absolute left-0 top-0 bottom-0 w-full flex items-center px-1', {
                                            'cursor-move': isDragging,
                                            'cursor-pointer': !isDragging && !isResizing,
                                        })}
                                        onMouseDown={e => handleDragStart(e, task.id)}>
                                        <GripHorizontal className="h-4 w-4 text-muted-foreground mr-1" />
                                        <span className="text-xs font-medium truncate">{task.title}</span>
                                    </div>
                                    
                                    {/* Resize handle */}
                                    <div
                                        className="absolute right-0 top-0 bottom-0 w-6 cursor-ew-resize flex items-center justify-center"
                                        onMouseDown={e => handleResizeStart(e, task.id)}>
                                        <div className="h-8 w-1 rounded-full bg-muted-foreground/30"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {/* Task Edit Dialog */}
            {editedTask && (
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
                                    onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-task-description">Description</Label>
                                <Textarea
                                    id="edit-task-description"
                                    value={editedTask.description}
                                    onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}/>
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
                                        onChange={e => setEditedTask({ ...editedTask, startDate: e.target.value })}/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-due-date">Due Date</Label>
                                    <Input
                                        id="edit-due-date"
                                        type="date"
                                        value={editedTask.dueDate}
                                        onChange={e => setEditedTask({ ...editedTask, dueDate: e.target.value })}/>
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
        </div>
    )
}

