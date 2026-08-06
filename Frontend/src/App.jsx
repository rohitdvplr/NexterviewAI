import { RouterProvider } from "react-router"
import { router } from "./appRoutes.jsx" // Import the router from appRoutes.jsx
import { AuthProvider } from "./services/authContext.jsx"
import { InterviewProvider } from "./features/interview/interviewContext.jsx"
import Footer from "./features/auth/components/Footer.jsx"
import Navbar from "./features/auth/components/Navbar.jsx"


RouterProvider
function App() {

  return (
   <> 
   <AuthProvider>
   <InterviewProvider>
    <Navbar/>
   <RouterProvider router={router} />
   <Footer/>
   </InterviewProvider>
   </AuthProvider>
   </>
  )
}

export default App
