import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './providers/AuthProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Toaster position="top-center" />
    <RouterProvider router={router} />
  </AuthProvider>
)