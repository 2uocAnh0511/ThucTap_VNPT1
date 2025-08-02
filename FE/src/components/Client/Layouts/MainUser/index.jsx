import { Outlet } from "react-router";
import { Header } from "../Header";
import Footer from "../Footer";
import { Card } from "react-bootstrap";
const MainUser = () => {
  return (
    <>
      <Header />
      <Card.Body className="p-5   ">
        <Outlet />
      </Card.Body>
      <Footer />
    </>
  );
};
export default MainUser;
