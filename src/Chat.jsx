import React, { useEffect, useState } from 'react'
import { CardContent, Card, Icon, Button,Form, Container,FormField, Input, Divider } from 'semantic-ui-react'
import { MessageHeader, Message } from 'semantic-ui-react'
import axios from 'axios'
import ScrollToBottom from  'react-scroll-to-bottom'
const Chat = ({socket, username, room}) => {

    const [currentMessage, SetCurrentMessage]=useState('')
    const [listMessage, SetlistMessage]=useState([])
    const [longPollingEnabled, setLongPollingEnabled] = useState(true);

    const sendMessage = async()=>{
      if(username && currentMessage){
        const info = {
          message:currentMessage,
          room:room,
          author:username,
          time:
          new Date(Date.now()).getHours()+ 
          ':'+ 
          new Date(Date.now()).getMinutes()
        }
          await socket.emit('send_message', info)
          SetlistMessage((list)=>[...list, info])
          SetCurrentMessage('')
          
      }
    }

    const startLongPolling = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/long-polling-notifications?room=${room}`);
        const data = response.data;
  
        if (data.message !== null) {
          // Procesa la nueva notificación
          const newNotification = {
            message: data.message,
            author: data.author,
            time: new Date(Date.now()).getHours() +
              ':' +
              new Date(Date.now()).getMinutes(),
          };
          SetlistMessage((list) => [...list, newNotification]);
        }
  
        // Vuelve a iniciar el Long Polling
        startLongPolling();
      } catch (error) {
        console.error('Error en la solicitud de Long Polling:', error);
        // Maneja el error según tus necesidades
      }
    };

    useEffect(()=>{
      const messageHandle = (data)=>{
       SetlistMessage((list)=>[...list, data])
      }
      socket.on('receive_message', messageHandle )

      return ()=>   socket.off('receive_message', messageHandle )
    }, [socket])

    useEffect(() => {
      if (longPollingEnabled) {
        startLongPolling();
      }


      return () => setLongPollingEnabled(false);
    }, [room, longPollingEnabled]);
    
  return (
    <>
    <Container>
       <Card fluid>
        <CardContent header={`Chat en vivo | Sala: ${room}`} />
          <ScrollToBottom>
        <CardContent style={{height:"400px"}} >
          {
            listMessage.map((item, index)=>{
              return <span key={index}>
              <Message style={{textAlign: username===item.author ? 'right': 'left'}}
              color={`${username===item.author ? 'blue': 'green'}`}
             
              >
              <MessageHeader>{item.message}</MessageHeader>
              <p><strong>{item.author}</strong> <i>{item.time}</i></p>
             
            </Message>
            <Divider/>
              </span>
            })
          }
        </CardContent>
          </ScrollToBottom>
        <CardContent extra>
          <Form>
        <FormField>
          <Input 
           action={{
            color: 'teal',
            icon: 'send',
            onClick:sendMessage
          }}
          value={currentMessage}
          type="text" placeholder='Escriba algo...' 
                onChange={e=> SetCurrentMessage(e.target.value)}
                
                />
        </FormField>
                </Form>
        </CardContent>
      </Card>
       
    </Container>
    </>
  )
}

export default Chat