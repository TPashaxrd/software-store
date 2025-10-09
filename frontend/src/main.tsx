import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NoPage from './Pages/NoPage.tsx'
import Library from './Pages/Library.tsx'
import Packages from './Pages/Packages.tsx'
import Product from './Pages/Product.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path='/' element={<App/>}/>
    <Route path="/packages" element={<Packages/>}/>
    <Route path='/product/:id' element={<Product/>}/>
    <Route path='/library/mine' element={<Library/>}/>
    <Route path='*' element={<NoPage/>}/>
   </Routes>
  </BrowserRouter>
)
