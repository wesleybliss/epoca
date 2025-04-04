/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import { createRouter } from './router'

const router = createRouter()

// eslint-disable-next-line no-restricted-globals
hydrateRoot(document, <StartClient router={router} />)
