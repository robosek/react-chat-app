import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import Paper from "@material-ui/core/Paper"
import withStyles from "@material-ui/core/styles/withStyles"
import CssBaseline from "@material-ui/core/CssBaseline"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import styles from './styles'
const firebase = require('firebase')

class LoginComponent extends Component {

    constructor(){
        super()
        this.state = {
            email: null,
            password: null,
            loginError: ''
        }
    }
        
    submitLogin= (e) => {
        e.preventDefault()

        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.history.push('/dashboard')
            }, error => {
                console.log(error)
                this.setState({loginError: 'Server error'})
            })
        
    }

    userTyping = (type, e) => {
        switch(type){
            case 'email':
                this.setState({email: e.target.value})
                break;
            case 'password':
                this.setState({password: e.target.value})
                break;
            default:
                break;
        }
    }

    render(){
        const { classes } = this.props
    
        return(
        <main className={classes.main}>
            <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Login!
                    </Typography>
                    <form onSubmit={(e)=> this.submitLogin(e)} className={classes.form}>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor='login-email-input'>Enter your email</InputLabel>
                            <Input autoComplete='email' autoFocus id='login-email-input' onChange={(e) => this.userTyping('email', e)}></Input>
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor='login-password-input'>Enter your password</InputLabel>
                            <Input type='password' autoFocus id='login-password-input' onChange={(e) => this.userTyping('password', e)}></Input>
                        </FormControl>

                        <Button type='submit' fullWidth color='primary' variant='contained' className={classes.submit}>Submit</Button>
                        {
                            this.state.loginError ? <Typography component='h5' variant='h6' className={classes.errorText}>Login error!</Typography> : null
                        }
                        <Typography component='h5' variant='h6' className={classes.hasAccountHeader}>Want to create account?</Typography>
                        <Link className={classes.logInLink} to='/signup'>Sing up!</Link>
                    </form>
                </Paper>
        </main>
        )
    }
}

export default withStyles(styles)(LoginComponent);