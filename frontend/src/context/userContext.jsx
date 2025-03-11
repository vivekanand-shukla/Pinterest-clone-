import { useState ,useEffect} from "react";
import { createContext, useActionState, useContext } from "react";
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'


const UserContext = createContext()
export const UserProvider = ({ children }) => {

    const [user, setUser] = useState([])
    const [isAuth, setIsAuth] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
  

     //register 
     async function registerUser( name ,email, password, navigate,fetchPins) {
        setBtnLoading(true);

        try {

            const { data } = await axios.post("/api/user/register", {name, email, password })
            toast.success(data.massage)
            setUser(data.user)
            setIsAuth(true)


            setBtnLoading(false)
            navigate("/")
            fetchPins()
        } catch (error) {
            toast.error(error.response.data.massage)
            setBtnLoading(false)
        }
    }

     //



    async function loginUser(email, password, navigate,fetchPins) {
        setBtnLoading(true);

        try {

            const { data } = await axios.post("/api/user/login", { email, password })
            toast.success(data.massage)
            setUser(data.user)
            setIsAuth(true)


            setBtnLoading(false)
            navigate("/")
            fetchPins()
        } catch (error) {
            toast.error(error.response.data.massage)
            setBtnLoading(false)
        }
    }

    const [loading, setLoading] = useState(true)

    async function fetchUser(){
        try {

            const {data} =await  axios.get("/api/user/me")
            setUser(data)
            setIsAuth(true)
            setLoading(false)


        } catch (error) {
              console.log(error);
              setLoading(false)

        }
    }



    async function followUser(id, fetchUser) {
        try {
          const { data } = await axios.post("/api/user/follow/" + id);
    
          toast.success(data.massage);
          fetchUser();
        } catch (error) {
          toast.error(error.response.data.massage);
        }
      }


    useEffect(() => {
        fetchUser()
   
    },[] )
    






    return (<UserContext.Provider value={{ followUser,loginUser, btnLoading, isAuth, user ,loading  ,registerUser ,setIsAuth, setUser }}  >{children} <Toaster />

    </UserContext.Provider>)
}

export const UserData = () => useContext(UserContext);