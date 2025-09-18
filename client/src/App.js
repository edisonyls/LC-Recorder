import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import NewQuestion from "./pages/NewQuestion";
import QuestionDetails from "./pages/QuestionDetails";
import ProfilePage from "./pages/ProfilePage";
import FriendPage from "./pages/FriendPage";
import DataStructurePage from "./pages/DataStructurePage";
import { UserProvider } from "./context/userContext";
import { DataStructureProvider } from "./context/dataStructureContext";
import TablePage from "./pages/TablePage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import UpgradePage from "./pages/UpgradePage";
import NotFoundPage from "./pages/NotFoundPage";
import PremiumRoute from "./components/routes/PremiumRoute";
import PremiumPlusRoute from "./components/routes/PremiumPlusRoute";

function App() {
  return (
    <>
      <UserProvider>
        <DataStructureProvider>
          <Router>
            <Routes>
              <Route path="/" Component={Home} exact />
              <Route path="/signin" Component={SignInPage} exact />
              <Route path="/register" Component={RegisterPage} exact />
              <Route Component={PrivateRoute} exact>
                <Route path="/table" Component={TablePage} exact />
                <Route path="/new" Component={NewQuestion} exact />
                <Route path="/question/:id" Component={QuestionDetails} exact />
                <Route path="/profile" Component={ProfilePage} exact />
                <Route path="/upgrade" Component={UpgradePage} exact />
                <Route path="/dashboard" Component={Dashboard} exact />
                <Route Component={PremiumRoute} exact>
                  <Route Component={PremiumPlusRoute} exact>
                    <Route
                      path="/data-structure"
                      Component={DataStructurePage}
                      exact
                    />
                  </Route>
                  <Route path="/friends" Component={FriendPage} exact />
                </Route>
                <Route path="*" Component={NotFoundPage} exact />
              </Route>
            </Routes>
          </Router>

          <ToastContainer
            autoClose={3000}
            closeOnClick
            pauseOnHover={false}
            limit={5}
            theme="light"
          />
        </DataStructureProvider>
      </UserProvider>
    </>
  );
}

export default App;
