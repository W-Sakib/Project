import { Navigate, NavLink, Outlet } from 'react-router'
import './App.css'
import { Button } from "@/components/ui/button"
import { UserButton, useUser } from '@clerk/clerk-react'

function App() {
  const {user,isLoaded,isSignedIn}=useUser();

  if (!isSignedIn&&isLoaded)
  {
    return <Navigate to={'auth/sign-in'}/>
  }
  return (
    <div>
     <Outlet/>
   </div>
  )
}

export default App
