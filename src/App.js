import './App.css';
import "./assets/css/style.css";
import { Footer } from './component/Footer';
import Header from './component/Header';
import { BrowserRouter } from 'react-router-dom';
import {MainNavigation} from "./component/MainNavigation"
import { ThemeProvider } from "@material-ui/core/styles";
import { AuthWrapper } from "./context/auth";
import { ToastContainer } from "react-toastify";
import { theme } from "./utils/theme";

const App = () => {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <ThemeProvider theme={theme}>
          {/* <div className="loader-wrapper">
            <img src={loader} alt="loader" />
          </div> */}
          <Header />
          <main>
            <MainNavigation />
          </main>
          <Footer />
          <ToastContainer />
        </ThemeProvider>
      </AuthWrapper>
    </BrowserRouter>
  );
};

export default App;
