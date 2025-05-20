import { useState } from 'react'
import Login from "./api/Login"
import Home from "./Home"
import reactLogo from './assets/react.svg'
import Chat from './api/Chat'
import viteLogo from '/vite.svg'
import {Routes, Route,Link } from 'react-router-dom';
import './App.css'
import AddFriend from "../components/AddFriend"
import Register from './api/Register';
import FriendRequest from '../components/FriendRequest'
import ChatSpace from '../components/ChatSpace'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='login' element= {<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='chatPage' element={<Chat/>}></Route>
      <Route path="login" element={<Login/>}></Route>
      <Route path='home' element={<Home/>}></Route>
      <Route path="addfriend" element={<AddFriend/>}></Route>
      <Route path='friendrequest' element={<FriendRequest/>}></Route>
      <Route path="chatspace" element={<ChatSpace/>}></Route>
    </Routes>
  )
}

export default App
