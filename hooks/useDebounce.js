import { useEffect, useRef } from 'react'

const useDebounce = (fn, delay = 500) => {
    const timeoutRef = useRef(null)
    
    const debouncedFn = (...args) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            fn(...args)
            timeoutRef.current = null
        }, delay)
    }
    
    useEffect(() => {
        return () => clearTimeout(timeoutRef.current)
    }, [])
    
    return debouncedFn
}

export default useDebounce

