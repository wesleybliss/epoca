import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import axios from 'redaxios'
import KanbanBoard from '~/components/KanbanBoard'

export const Route = createFileRoute('/')({
    component: Home,
})

const DEPLOY_URL = 'http://localhost:3001'

const usersQueryOptions = () =>
    queryOptions({
        queryKey: ['users'],
        queryFn: () =>
            axios
                .get<Object>(DEPLOY_URL + '/api/users')
                .then((r) => r.data)
                .catch(() => {
                    throw new Error('Failed to fetch hello')
                }),
    })

function Home() {
    
    const usersQuery = useSuspenseQuery(usersQueryOptions())
    const data = usersQuery.data
    
    return (
        
        <div className="p-2">
            <h1>Hello Clerk!</h1>
            <div>
                <pre><code>{JSON.stringify(data, null, 4)}</code></pre>
            </div>
            <KanbanBoard />
        </div>
        
    )
    
}
