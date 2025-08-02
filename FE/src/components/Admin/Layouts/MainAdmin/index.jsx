
import { Outlet } from "react-router";
import HeaderAdmin from "../Navbar";
import Navbar from "../Header";


import "./style.css";


const MainAdmin = () => {
    return (
        <>
            <HeaderAdmin />
            <div className="main-content">
                <Navbar />
                <div className="container mt-4">
                    <Outlet />
                </div>
            </div>

        </>
    )


}
export default MainAdmin;