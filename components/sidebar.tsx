import { Button } from '@/components/ui/button'
import { Calendar, LayoutDashboard, LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import cn from 'classnames'

export function Sidebar() {
    return (
        <aside className="flex flex-col w-64 h-screen border-r bg-card border-border">
            <div className="p-4 border-b border-border">
                <h1 className="text-xl font-bold">Kanban</h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
                <Button variant="ghost" className="justify-start w-full" asChild>
                    <Link href="/">
                        <LayoutDashboard className="mr-2 w-4 h-4" />
            Board
                    </Link>
                </Button>
                
                <Button variant="ghost" className="justify-start w-full" asChild>
                    <Link href="/gantt">
                        <Calendar className="mr-2 w-4 h-4" />
                        Gantt
                    </Link>
                </Button>
                
                <Button variant="ghost" className="justify-start w-full" asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 w-4 h-4" />
            Settings
                    </Link>
                </Button>
            </nav>
            
            <div className="p-4 border-t border-border">
                <div className="flex items-center mb-4">
                    <div className={cn(
                        'flex justify-center items-center mr-2',
                        'w-8 h-8 rounded-full bg-primary text-primary-foreground',
                    )}>
                        <User className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">User Name</p>
                        <p className="text-xs text-muted-foreground">user@example.com</p>
                    </div>
                </div>
                
                <Button variant="outline" className="justify-start w-full" size="sm">
                    <LogOut className="mr-2 w-4 h-4" />
          Sign Out
                </Button>
            </div>
        </aside>
    )
}
