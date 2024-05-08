import { NavigationContainer } from "@react-navigation/native"
import { useEffect, useState } from "react"
import AuthNavigator from "./AuthNavigator"
import MainNavigator from "./MainNavigator"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../redux/store"
import { fetchTokenFromStorage } from "../redux/auth/authSlice"

const RootNavigator = () => {
  //TEMP
  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  const token = useSelector((state: RootState) => state.auth.token)
  const dispatch = useDispatch<AppDispatch>()


  useEffect(() => {
    dispatch(fetchTokenFromStorage())
  }, [dispatch])
  console.log(token)
  return (
    <NavigationContainer>
      {!token ?
        <AuthNavigator />
        :
        <MainNavigator />
      }
    </NavigationContainer>

  )
}
export default RootNavigator