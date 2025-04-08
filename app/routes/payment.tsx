import { Link } from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";


export default function Payment() {
  return (
    <div className="payment-wrapper">
      <Header title="Nạp tiền"></Header>
      <Navbar></Navbar>
      <Footer></Footer>
      
      <div className="payment-wrapper__inner">
        
      </div>
    </div>
    
  );
}
