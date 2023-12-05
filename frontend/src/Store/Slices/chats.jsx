import { createSlice } from "@reduxjs/toolkit"


const initialState = []
const chatsSlice = createSlice({

    name:"chats",
    initialState,
    reducers:{
        addChats(state,action){
            let chats = [];
            action.payload.chats.map(item=>{
                const object = {
                    chatId:item._id,
                    latestMessage:item.latestMessage,
                    user:item.users,
                    updatedAt : item.updatedAt,
                    messages: item?.messages || []
                }
                chats.push(object)
            })
            state = [...chats]
            state.sort((a, b) => b.updatedAt - a.updatedAt);

            return state
        },
        addMessages(state, action) {
            const { chatId, messages } = action.payload;
            console.log(messages)
            return state.map(chat => {
              if (chat.chatId === chatId) {
                return {
                  ...chat,
                  messages: messages,
                };
              }
              return chat;
            });
          },
          addSingleMessage(state, action) {
            const { chatId, message,user } = action.payload;
          
            // Check if chatId already exists in state
            const chatExists = state.some(chat => chat.chatId === chatId);
          
            const updatedState = state.map(chat => {
              if (chat.chatId === chatId) {
                // Chat exists, update it
                const updatedMessages = [...chat.messages, message];
                const latestMessage = updatedMessages[updatedMessages.length - 1];
          
                return {
                  ...chat,
                  updatedAt: new Date().toISOString(),
                  messages: updatedMessages,
                  latestMessage: latestMessage,
                };
              }
              return chat;
            });
            
            if (!chatExists) {
              // Chat doesn't exist, create a new one
              const newChat = {
                chatId: chatId,
                user:[user],
                updatedAt: new Date().toISOString(),
                messages: [message],
                latestMessage: message,
              };
              console.log(newChat)
              updatedState.push(newChat);
            }
          
            // Sort the updatedState based on updatedAt
            updatedState.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          
            return updatedState;
          }
          
    },
})

export const {addChats,addMessages,addSingleMessage} = chatsSlice.actions

export default chatsSlice.reducer