
import { useState } from 'react'
import './App.css'
import io from 'socket.io-client'
import Chat from './Chat'
import {Container, Divider, CardContent, Card, Icon, FormField, Button, Form } from 'semantic-ui-react'


const socket= io.connect('http://localhost:9000')

function App() {
 
  const [username, SetUsername]=useState('')
  const [room, SetRoom]=useState('')
  const [showChat, SetShowChat]=useState(false)

  const joinRoom = ()=>{
    if(username !== '' && room !== ''){
      socket.emit('join_room', room)
      SetShowChat(true)
    }
  }

  return (
    <>
        <Container>
          {!showChat ?(
        <Card fluid>
        <CardContent header='Unirme al chat' />
        <CardContent>
        <Form>
        <FormField>
          <label>Username</label>
          <input type="text" placeholder='Username:'
        onChange={e=> SetUsername(e.target.value)}
        />
        </FormField>
        <FormField>
          <label>Sala</label>
          <input type="text" placeholder='ID Sala:'
        onChange={e=> SetRoom(e.target.value)}/>
        </FormField>
        <FormField>
          
        </FormField>
        <Button onClick={joinRoom}>Unirme </Button>
      </Form>
        </CardContent>
        <CardContent extra>
          <Icon name='user' />4 Friends
        </CardContent>
      </Card>
          ):(
      <Chat socket={socket} username={username}room={room}/>
         ) }
        </Container>
    </>
  )
}

export default App
