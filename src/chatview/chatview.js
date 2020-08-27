import React, { Component } from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

class ChatViewComponent extends Component{

    componentDidUpdate = () => {
        var container = document.getElementById('chatview-container')
        if(container){
            container.scrollTo(0, container.scrollHeight)
        }
    }

    render(){
        const { classes, chat, user } = this.props
        if(chat === undefined){
            return(<main id='chatview-container' className={classes.content}></main>)
        }
        else{
            return(            
            <div>
                <div className={classes.chatHeader}>
                    Your conversation with <b>{chat.users.filter(_user => _user !== user)[0]}</b>
                </div>
                <main id='chatview-container' className={classes.content}>
                    {
                        chat.messages.map((message, index) => {
                            return(
                             <div key={index} className={message.sender === user ? classes.userSent : classes.friendSent}>
                               {message.message}
                             </div>
                        )
                        })
                    }
                </main>
            </div>
            )
        }
    }

}

export default withStyles(styles)(ChatViewComponent)