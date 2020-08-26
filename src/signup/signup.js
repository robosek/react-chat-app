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

class SignupComponent extends Component{

    constructor(){
        super()
        this.state = {
            email: null,
            password: null,
            passwordConfirmation:null,
            singUpError: ''
        }
    }


    formIsValid = () => this.state.password === this.state.passwordConfirmation
        
    submitSignup = (e) => {
        e.preventDefault()
        if(!this.formIsValid()){
            this.setState({singUpError: 'Passwords do not match!'});
            return 
        }

        firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(authResponse => {
            const userObj = {
                email: authResponse.user.email
            }
            firebase
                .firestore()
                .collection('users')
                .doc(this.state.email)
                .set(userObj)
                .then(() => {
                    this.props.history.push('/dashboard')
                }, dbError => {
                    console.log(dbError)
                    this.setState({singUpError: 'Failed to add user!'})
                })
            }, authError => {
                console.log(authError)
                this.setState({singUpError: 'Failed to add user!'})
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
            case 'passwordConfirmation':
                this.setState({passwordConfirmation: e.target.value})
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
                        Sign up!
                    </Typography>
                    <form onSubmit={(e)=> this.submitSignup(e)} className={classes.form}>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor='singup-email-input'>Enter your email</InputLabel>
                            <Input autoComplete='email' autoFocus id='singup-email-input' onChange={(e) => this.userTyping('email', e)}></Input>
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor='singup-password-input'>Enter your password</InputLabel>
                            <Input type='password' autoFocus id='singup-password-input' onChange={(e) => this.userTyping('password', e)}></Input>
                        </FormControl>
                        <FormControl required fullWidth margin="normal">
                            <InputLabel htmlFor='singup-password-confirmation-input'>Confirm your password</InputLabel>
                            <Input type='password' autoFocus id='singup-password-confirmation-input' onChange={(e) => this.userTyping('passwordConfirmation', e)}></Input>
                        </FormControl>
                        <Button type='submit' fullWidth color='primary' variant='contained' className={classes.submit}>Submit</Button>
                        {
                            this.state.singUpError ? <Typography component='h5' variant='h6' className={classes.errorText}>{this.state.singUpError}</Typography> : null
                        }
                        <Typography component='h5' variant='h6' className={classes.hasAccountHeader}>Already have an account?</Typography>
                        <Link className={classes.logInLink} to='/login'>Log in!</Link>
                    </form>
                </Paper>
        </main>
        )
    }
}

export default withStyles(styles)(SignupComponent);