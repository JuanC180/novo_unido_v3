import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const AdminLayout = () => {
  const { auth, cargando } = useAuth()
  // console.log(auth)
  // console.log(cargando)

  if(cargando) return 'cargando...'

  return (
   <>
     {/* <div>AdminLayout</div> */}

     {auth?._id ? <Outlet/> : <Navigate to="/" />}
   </>
  )
}

export default AdminLayout