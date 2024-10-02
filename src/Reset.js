import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Form.module.css'

function Reset() {
    const values = {
        email: '',
        answer: '',
        password: '',
        confirmPassword: ''
    }
    const [inputs, setInputs] = useState(values);
    const [errors, setErrors] = useState(values);
    const [data, setData] = useState({});
    const [hide, setHide] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value.trim();
        setInputs((values) => { return { ...values, [name]: value } })
        if (value === "") {
            setErrors((err) => { return { ...err, [name]: `${name.toUpperCase()} cannot be empty!` } })
        }
        else {
            setErrors((err) => { return { ...err, [name]: '' } })
        }
    }

    const getData = async (event) => {
        event.preventDefault();
        if (inputs.email === '') {
            setErrors((err) => { return { ...err, email: 'EMAIL cannot be empty!' } });
        }
        else {
            const response = await fetch(`http://localhost:8084/account/${inputs.email}`)
            const response_text = await response.text();
            if (response_text) {
                setData(JSON.parse(response_text));
                setHide(true);
            }
            else {
                setErrors((err) => { return { ...err, email: 'Cannot find Account with this EmailId. If you are a new user please SignUp' } });
            }
        }
    }

    const input_fields = Object.keys(values);
    const can_submit = input_fields.every((input) => inputs[input] !== '');
    const handleSubmit = (event) => {
        event.preventDefault();
        if (can_submit) {
            if(inputs.answer === data.answer){
                if(inputs.password === inputs.confirmPassword){
                    const postData = {
                        email : data.email,
                        firstName : data.firstName,
                        password : inputs.password,
                        security : data.security,
                        answer : data.answer
                    }
                    fetch('http://localhost:8084/updateAccount',{
                        method: 'PUT',
                        headers : {'Content-Type' : 'application/json'},
                        body : JSON.stringify(postData)
                    }).then(() => {
                        alert('Password changed Successfully');
                        navigate('/')
                    }).catch((err) => console.log(err));
                }
                else{
                    setErrors((err) => { return { ...err, confirmPassword: "Passwords doesn't match" } })    
                }
            }
            else{
                setErrors((err) => { return { ...err, answer: 'Incorrect Answer, please try again!' } })
            }
        }
        else {
            input_fields.forEach((input) => {
                if (inputs[input] === '') {
                    setErrors((err) => { return { ...err, [input]: `${input.toUpperCase()} cannot be empty!` } })
                }
            })
        }
    };
    return (
        <form>
            <h2>Reset Password</h2>
            <div hidden={hide} >
                <label htmlFor="email">Email Id </label>
                <input type="email" id="email" name="email" className={styles.input} value={inputs.email} onChange={handleChange} />
                <p className={styles.warning} id="email_warning">{errors.email}</p>
                <button type='button' className={styles.button} id={styles.submit}><Link to='/' style={{textDecoration: 'none',color : 'white'}}>&#8592;  Back</Link></button>
                <button className={styles.button} id={styles.submit} onClick={getData}>Submit</button>
            </div>
            <div hidden={!hide} >
                <p style={{color: '#007bff'}}>{data.security}</p>
                <label htmlFor="answer">Answer</label>
                <input type="text" id="answer" name="answer" maxLength="20" value={inputs.answer} onChange={handleChange} className={styles.input} />
                <p className={styles.warning} id="answer_warning">{errors.answer}</p>
                <label htmlFor="password">New Password </label>
                <input type="password" id="password" name="password" className={styles.input} value={inputs.password} onChange={handleChange} />
                <p className={styles.warning} id="password_warning">{errors.password}</p>
                <label htmlFor="confirmPassword">Confirm Password </label>
                <input type="password" id="password" name="confirmPassword" className={styles.input} value={inputs.confirmPassword} onChange={handleChange} />
                <p className={styles.warning} id="confirmPassword_warning">{errors.confirmPassword}</p>
                <button type='button' className={styles.button} id={styles.submit}><Link to='/' style={{textDecoration: 'none',color : 'white'}}>&#8592;  Back</Link></button>
                <button className={styles.button} id={styles.submit} onClick={handleSubmit}>Submit</button>
            </div>
            <p style={{ textAlign: "center" }}>New User? <Link to='/signUp'>SignUp</Link></p>
        </form>
    )
}

export default Reset;