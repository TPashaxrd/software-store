import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NoPage from './Pages/NoPage.tsx'
import Library from './Pages/Library.tsx'
import Packages from './Pages/Packages.tsx'
import Product from './Pages/Product.tsx'
import Ticket from './Pages/Ticket.tsx'
import MyTickets from './Pages/Tickets.tsx'
import Admin from './Pages/Admin/Admin.tsx'
import Contact from './Pages/Contact.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path='/' element={<App/>}/>
    <Route path="/packages" element={<Packages/>}/>
    <Route path='/tickets/mine' element={<MyTickets/>}/>
    <Route path='/product/:id' element={<Product/>}/>
    <Route path='/ticket' element={<MyTickets/>}/>
    <Route path="/ticket/:id" element={<Ticket/>}/>
    <Route path='/library/mine' element={<Library/>}/>

    <Route path='/contact' element={<Contact/>}/>
    
    {/* ADMIN */}
    <Route path='/admin' element={<Admin/>}/>
    <Route path='/admin/*' element={<Admin/>}/>

    <Route path='*' element={<NoPage/>}/>
   </Routes>
  </BrowserRouter>
)
