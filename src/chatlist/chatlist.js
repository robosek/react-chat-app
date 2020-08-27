import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';

class ChatListComponent extends Component {


    render(){
        const { classes, chats, selectedChatIndex, userEmail } = this.props

        if(chats.length > 0){
            return(
                <main className={classes.root}>
                    <Button variant="contained" fullWidth color='primary' className={classes.newChatBtn} onClick={this.newChat}>
                            New message
                    </Button>
                    <List>
                        {
                            chats.map((_chat, _index) => {
                                const notMe = this.findNotMe(_chat.users, userEmail)
                                return(
                                    <div key={_index}>
                                    <ListItem key={_index}
                                              onClick={() => this.selectChat(_index)}
                                              className={classes.listItem}
                                              selected={selectedChatIndex === _index}
                                              alignItems='flex-start'>
                                                  <ListItemAvatar>
                                                        <Avatar alt='Remy Sharp'>{this.getFirstLetter(notMe)}</Avatar>
                                                  </ListItemAvatar>
                                                  <ListItemText primary={notMe} 
                                                                secondary={
                                                                    <React.Fragment>
                                                                        <Typography component='span' color='textPrimary'>
                                                                            {
                                                                                _chat.messages[_chat.messages.length - 1].message.substring(0, 30)
                                                                            }
    
                                                                        </Typography>
                                                                    </React.Fragment>
                                                                }>
    
                                                  </ListItemText>
                                    </ListItem>
                                    <Divider></Divider>
                                    </div>
                                )
                            })
                        }
                    </List>
                </main>
            )
        }
        else{
            return(
                <main className={classes.root}>
                    <Button variant="contained" fullWidth color='primary' className={classes.newChatBtn} onClick={this.newChat}>
                            New message
                    </Button>
                    <List></List>
                </main>
            )
        }
    }

    newChat = () => {
        console.log('New chat clicked ')
    }

    selectChat = (index) => {
        console.log('Selected chat! ', index)
        this.props.selectChatFn(index)
    }

    findNotMe(users, myEmail){
        return users.filter(user => user.email !== myEmail)[0]
    }

    getFirstLetter(email){
        return email.split('')[0]
    }
}

export default withStyles(styles)(ChatListComponent)