import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./components/pages/HomePage"
import { Header } from "./components/assets/Headers/Header"
import {NotFound} from './components/assets/errors/NotFound'
import { RegisterPage } from "./components/pages/RegisterPage"
import { LogInPage } from "./components/pages/LogInPage"

export const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route element={<HomePage/>} path='/'/>
                    <Route element={<NotFound/>} path='*'/>
                    <Route element={<LogInPage/>} path='/login'/>
                    <Route element={<RegisterPage/>} path='/register'/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}
