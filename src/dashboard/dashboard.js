import React, { Component } from 'react'
import ChatListComponent from '../chatlist/chatlist'
import styles from './styles';
import { Button, withStyles } from '@material-ui/core';
import ChatViewComponenet from '../chatview/chatview'
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
        const { chats, email, selectedChat } = this.state

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
                <Button className={classes.signOutBtn} onClick={this.signOut} >Sing out</Button>
           </div> 
        )
    }

    signOut = () => {
        firebase.auth().signOut()
    }

    selectChat = (chatIndex) => {
        console.log(chatIndex)
        this.setState({selectedChat : chatIndex})
    }

    selectChatBtnClicked = () => this.setState({newChatFormVisible: true, selectedChat: null})

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