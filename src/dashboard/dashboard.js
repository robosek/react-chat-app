import React, { Component } from 'react'
import ChatListComponent from '../chatlist/chatlist'
import styles from './styles';
import { Button, withStyles } from '@material-ui/core';
import ChatViewComponenet from '../chatview/chatview'
import ChatTextBox from '../chattextbox/chattextbox'
const firebase = require("firebase");


class DashboardComponent extends Component {

    constructor(){
        super()
        this.state = {
            chats:[],
            selectedChat:null,
            email:null,
            newChatFormVisible:false
        }
    }

    render(){
        
        const { classes } = this.props
        const { chats, email, selectedChat, newChatFormVisible } = this.state

        return(
           <div>
               <ChatListComponent history={this.props.history}
                                  selectChatFn={this.selectChat}
                                  selectChatBtnClickedFn={this.selectChatBtnClicked}
                                  selectedChatIndex={this.state.selectedChat}
                                  chats={this.state.chats}
                                  userEmail={this.state.email}>
                                    
                </ChatListComponent>
                {
                    this.state.newChatFormVisible ? 
                    null :
                    <ChatViewComponenet user={email} chat={chats[selectedChat]}></ChatViewComponenet>
                }
                {
                    selectedChat !== null && !newChatFormVisible ?
                    <ChatTextBox messageReadFn={this.messageRead} submitMessageFn={this.submitMessage}></ChatTextBox> :
                    null
                }
                <Button className={classes.signOutBtn} onClick={this.signOut} >Sing out</Button>
           </div> 
        )
    }

    signOut = () => {
        firebase.auth().signOut()
    }

    selectChat = async (chatIndex) => {
       await this.setState({selectedChat : chatIndex})
       this.messageRead()
    }

    submitMessage = (message) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_user => _user !== this.state.email)[0])
        firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                sender: this.state.email,
                message: message,
                timestamp: Date.now()
            }),
            receiverHasRead: false
        })
    }

    buildDocKey = (friend) => [this.state.email, friend].sort().join(':')

    messageRead = () =>{
        const selectedChatIndex = this.state.selectedChat;
        const sender = this.findSender(selectedChatIndex); 
        const docKey = this.buildDocKey(sender)

        if(this.clickedChatWhereNotSender(selectedChatIndex)){
            firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({receiverHasRead: true})
        }
        else{
            console.log('User has clicked chat!')
        }
    }

    selectChatBtnClicked = (index) => this.setState({newChatFormVisible: true, selectedChat: index})

    getCurrentChat = (chatIndex) => this.state.chats[chatIndex]

    getLastMessageIndex = (chat) => chat.messages.length - 1

    getLastMessage = (chatIndex) => {
        const currentChat = this.getCurrentChat(chatIndex)
        const lastMessageIndex = this.getLastMessageIndex(currentChat)

        return currentChat.messages[lastMessageIndex];
    }

    clickedChatWhereNotSender = (chatIndex) => {
        const lastMessage = this.getLastMessage(chatIndex)

        return lastMessage.sender !== this.state.email;
    }

    findSender = (chatIndex, myEmail) => this.getCurrentChat(chatIndex).users.filter(_user => _user !== myEmail)[0]
         
    componentDidMount = () => {
        firebase
        .auth()
        .onAuthStateChanged(async user => {
            console.log(user)
            if(!user)
                this.props.history.push('/login')
            else
            {
                await firebase
                        .firestore()
                        .collection('chats')
                        .where('users','array-contains', user.email)
                        .onSnapshot(async response => {
                            const chats = await response.docs.map(_doc=>_doc.data())
                            await this.setState({
                                email: user.email,
                                chats: chats
                            })
                            console.log(this.state)
                        })
            }
        })

    }
}

export default withStyles(styles)(DashboardComponent)