import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from './Form.module.css'

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            email_Warning: '',
            password_Warning: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.getData = this.getData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value.trim();
        const err_field = `${name}_Warning`;
        this.setState({ [name]: value });
        if (value === "") {
            this.setState({ [err_field]: `${name.toUpperCase()} cannot be empty!` });
        }
        else {
            this.setState({ [err_field]: '' });
        }
    }

    async getData() {
        const response = await fetch(`http://localhost:8084/account/${this.state.email}`)
        const response_text = await response.text();
        if(response_text){
            const data = JSON.parse(response_text);
            if(this.state.password === data.password){
                this.props.navigate('/main', { state: { userData: data} });
            }
            else {
                this.setState({password_Warning : 'Incorrect Password' });
            }
        }
        else {
            this.setState({email_Warning : 'Cannot find Account with this EmailId. If you are a new user please SignUp' });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.email !== '' && this.state.password !== '') {
            this.getData();
        }
        else {
            this.setState({
                email_Warning: this.state.email === '' ? 'EMAIL cannot be empty' : '',
                password_Warning: this.state.password === '' ? 'PASSWORD cannot be empty' : ''
            });
        }
    }

    render() {
        return (
            <form id="signInForm" onSubmit={this.handleSubmit}>
                <h2>Sign In</h2>
                <label htmlFor="email">Email </label>
                <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleChange} className={styles.input} />
                <p className={styles.warning} id="email_warning">{this.state.email_Warning}</p>
                <label htmlFor="password">Password </label>
                <input type="password" id="password" name="password" value={this.state.password} onChange={this.handleChange} maxLength="20" className={styles.input} />
                <Link style={{float: 'right'}} to='/reset'>Forgot Password?</Link>
                <p className={styles.warning} id="password_warning">{this.state.password_Warning}</p>
                <button type="submit" className={styles.login} id={styles.submit}>Login</button>
                <p style={{textAlign: "center"}}>New User? <Link to='/signUp'>SignUp</Link></p>
            </form>
        )
    }

}

function Login() {
    const nav = useNavigate();
    return (
        <SignIn navigate={nav} />
    )
}

export default Login;