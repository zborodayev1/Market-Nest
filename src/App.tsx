import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./components/pages/HomePage"
import { Header } from "./components/assets/Headers/Header"

export const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route element={<HomePage/>} path='/'/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}