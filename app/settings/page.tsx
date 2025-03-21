'use client'

import { useSettingsStore } from '../../store/settings'
import Sidebar from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SettingsPage = () => {
    
    const {
        theme,
        setTheme,
        /* language,
        setLanguage,
        notificationsEnabled,
        toggleNotifications,
        soundEnabled,
        toggleSound, */
    } = useSettingsStore()
    
    return (
        
        <div className="flex h-screen bg-background">
            
            <Sidebar />
            
            <main className="overflow-auto flex-1 p-4">
                
                <div className="flex flex-col h-full">
                    
                    <h1 className="mb-6 text-2xl font-bold">Settings</h1>
                    
                    <Tabs defaultValue="account" className="w-full max-w-3xl">
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="appearance">Appearance</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>
                                    <CardDescription>Manage your account settings and preferences.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue="User Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue="user@example.com" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save changes</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="appearance">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Appearance</CardTitle>
                                    <CardDescription>Customize the appearance of the application.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="theme-select">Theme</Label>
                                        <Select value={theme} onValueChange={setTheme}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="compact-view">Compact view</Label>
                                        <Switch id="compact-view" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save preferences</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                        
                        <TabsContent value="notifications">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notifications</CardTitle>
                                    <CardDescription>Configure how you receive notifications.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="email-notifications">Email notifications</Label>
                                        <Switch id="email-notifications" defaultChecked />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="push-notifications">Push notifications</Label>
                                        <Switch id="push-notifications" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="task-reminders">Task reminders</Label>
                                        <Switch id="task-reminders" defaultChecked />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save notification settings</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}

export default SettingsPage
