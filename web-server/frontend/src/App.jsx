import { useState, useEffect } from 'react'
import {DeviceCard} from './components/DeviceCard'
import './App.css'

const startWatering = async ()=>{
  await fetch('api/start-watering', {
  method: "POST",
  headers: {
     "Content-Type": "application/json"
  },
  body: JSON.stringify({command: "WATER", plantGroup: "TOMATOES", duration: 5000})
})
}

function App() {
const [payload, setPayload] = useState([])

useEffect(()=>{
   const fetchData = async() =>  await fetch('api/devices').
            then(resp=>resp.json()).
            then(respJson=>setPayload(respJson))
   fetchData()
}, [])

  return (
    <>
      <h1>Watering Dashboard</h1>
      <div className="card" styles={{display: 'flex', flexDirection: "row"}}>
        { payload.map(device =>
         <DeviceCard key={device.device_id} data={device} 
              extraFunctionality={device.type === "pump" && 
              <button onClick={startWatering}>Start watering</button>}/>) }
      </div>
    </>
  )
}

export default App
