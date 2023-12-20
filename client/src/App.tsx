import { BrowserRouter as Router , Route , Routes} from "react-router-dom"
import './App.css';
import Navbar from "./components/navbar";
import CheckoutPage from "./pages/checkout";
import AuthPage from "./pages/auth";
import PurchasedItemPage from "./pages/purchased-items";
import ShopPage from "./pages/shop";


function App() {
  return (
    <div className = "App">
     <Router>
        <Navbar />
        <Routes>
          <Route path="/auth" element={<AuthPage/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
          <Route path="/purchased-items" element={<PurchasedItemPage/>}/>
          <Route path="/" element={<ShopPage/>} />
        </Routes>
     </Router>
    </div>
  );
}

export default App;
