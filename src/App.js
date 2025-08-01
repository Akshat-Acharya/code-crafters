import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from './pages/Error'
import Settings from "./components/core/dashboard/Settings";
import EnrolledCourses from "./components/core/dashboard/EnrolledCourses";
import { useDispatch, useSelector } from "react-redux";
import Cart from './components/core/dashboard/Cart'
import { ACCOUNT_TYPE } from "./utils/constants";
import { useNavigate } from "react-router-dom";
import AddCourse from "./components/core/dashboard/AddCourse";
import MyCourses from "./components/core/dashboard/MyCourses";
import EditCourse from "./components/core/dashboard/EditCourse";
import Catalog from "./pages/Catalog";

function App() {

  const { user } = useSelector((state) => state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <SignUp />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
  
        <Route element={
          <PrivateRoute>
          <Dashboard />
          </PrivateRoute> 
          } >
        <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/Settings" element={<Settings />} />
      {/* <Route path="dashboard/cart" element={<Cart />} />
      <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/> */}
      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }
      {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="dashboard/add-course" element={<AddCourse />} />
            <Route path="dashboard/my-courses" element={<MyCourses />} />
            <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
          </>
        )
      }
          </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
