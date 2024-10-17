import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Form.module.css'

function Form() {
    var data = {
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        address: '',
        country: '',
        email: '',
        password: '',
        security: '',
        answer: ''
    }
    const [inputs, setInputs] = useState(data);
    const [errors, setErrors] = useState(data);
    const [terms, setTerms] = useState(false);
    const [touched, setTouched] = useState(false);
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
    const reset = () => { setInputs(data); setErrors(data); setTerms(false); setTouched(false) };
    const input_fields = Object.keys(data);
    const can_submit = input_fields.every((input) => inputs[input] !== '') && terms
    const handleSubmit = (event) => {
        event.preventDefault();
        if (can_submit) {
            const postData = {
                email: inputs.email,
                firstName: inputs.firstName,
                password: inputs.password,
                security: inputs.security,
                answer: inputs.answer
            }
            fetch('http://localhost:8084/addAccount', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            }).then(() => {
                navigate('/conformation', { state: { userName: inputs.firstName, email: inputs.email } })
            }).catch((err) => console.log(err));
        }
        else {
            setTouched(true);
            input_fields.forEach((input) => {
                if (inputs[input] === '') {
                    setErrors((err) => { return { ...err, [input]: `${input.toUpperCase()} cannot be empty!` } })
                }
            })
        }
    };
    return (
        <form id="signUpForm" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <label htmlFor="fname">First Name </label>
            <input type="text" id="fname" name="firstName" value={inputs.firstName} onChange={handleChange} maxLength="20" className={styles.input} />
            <p className={styles.warning} id="fname_warning">{errors.firstName}</p>
            <label htmlFor="lname">Last Name </label>
            <input type="text" id="lname" name="lastName" value={inputs.lastName} onChange={handleChange} maxLength="20" className={styles.input} />
            <p className={styles.warning} id="lname_warning">{errors.lastName}</p>
            <label htmlFor="dob">Date of Birth </label>
            <input type="date" id="dob" name="dob" className={styles.input} value={inputs.dob} onChange={handleChange} placeholder="mm/dd/yyyy" />
            <p className={styles.warning} id="dob_warning">{errors.dob}</p>
            <fieldset className={styles.input}>
                <legend htmlFor="gender">Gender </legend>
                <input type="radio" id="gender male" name="gender" onChange={handleChange} value="male" />
                <label htmlFor="male">Male </label>
                <input type="radio" id="gender female" name="gender" onChange={handleChange} value="female" />
                <label htmlFor="female">Female </label>
            </fieldset>
            <p className={styles.warning} id="gender_warning">{errors.gender}</p>
            <label htmlFor="address">Address </label>
            <textarea id="address" name="address" rows="3" cols="30" className={styles.input} value={inputs.address} onChange={handleChange}></textarea>
            <p className={styles.warning} id="address_warning">{errors.address}</p>
            <label htmlFor="country">Country </label>
            <select name="country" id="country" className={styles.input} value={inputs.country} onChange={handleChange}>
                <option value="">(Select one)</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="India">India</option>
            </select>
            <p className={styles.warning} id="country_warning">{errors.country}</p>
            <label htmlFor="email">Email Id </label>
            <input type="email" id="email" name="email" className={styles.input} value={inputs.email} onChange={handleChange} />
            <p className={styles.warning} id="email_warning">{errors.email}</p>
            <label htmlFor="password">Password </label>
            <input type="password" id="password" name="password" className={styles.input} value={inputs.password} onChange={handleChange} />
            <p className={styles.warning} id="password_warning">{errors.password}</p>
            <label htmlFor="security">Security Questions</label>
            <select name="security" id="security" className={styles.input} value={inputs.security} onChange={handleChange}>
                <option value="">(Select one)</option>
                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option value="What was the make and model of your first car?">What was the make and model of your first car?</option>
                <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                <option value="In what city were you born?">In what city were you born?</option>
            </select>
            <p className={styles.warning} id="security_warning">{errors.security}</p>
            <label htmlFor="answer">Answer</label>
            <input type="text" id="answer" name="answer" maxLength="20" value={inputs.answer} onChange={handleChange} className={styles.input} />
            <p className={styles.warning} id="answer_warning">{errors.answer}</p>
            <input type="checkbox" id="subscription" name="subscription" value="subscription" />
            <label htmlFor="subscription">Subscribe to get latest news and promotional offers</label>
            <br />
            <input type="checkbox" id="terms" name="terms" value="terms" onChange={(e) => { setTerms(e.target.checked); setTouched(true) }} />
            <label id='tandc' htmlFor="terms" className={touched && !terms ? styles.warning : ''}>Accept terms and conditions</label>
            <br />
            <button type="reset" onClick={reset} className={styles.button} id={styles.reset}>Reset</button>
            <button type="submit" className={styles.button} id={styles.submit}>Submit</button>
            <p style={{ textAlign: "center" }}>Existing User? <Link to='/'>SignIn</Link></p>
        </form>
    )
}
export default Form;