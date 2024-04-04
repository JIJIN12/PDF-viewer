import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from './components/Form'
import Home from './components/Home'



function App() {

  return (
    <BrowserRouter>
    <Routes>
     <Route path='/form' element={<Form/>}/>
     <Route path='/' element={<Home/>}/>
    
    </Routes>
    </BrowserRouter>
  )
}

export default App
