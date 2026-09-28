import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Toaster position="top-center" />
    <RouterProvider router={router} />
  </>
)