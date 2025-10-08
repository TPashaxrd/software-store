import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NoPage from './Pages/NoPage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path='/' element={<App/>}/>
    <Route path='*' element={<NoPage/>}/>
   </Routes>
  </BrowserRouter>
)
