import { useState } from 'react';
import './Form.css';

function Form() {
    var data = {
        firstname: '',
        lastname: '',
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
    const [errors, setErrors] = useState({});
    const [terms, setTerms] = useState(false);
    const [touched, setTouched] = useState(false)
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => { return {...values, [name]: value}})
        if(value.trim() === ""){
            setErrors((err) => { return {...err, [name]: `${name.toUpperCase()} cannot be empty!`}})
        }
        else {
            setErrors((err) => { return {...err, [name]: ''}})
        }
    }
    const reset = () => {setInputs(data); setErrors({}); setTerms(true)};
    const input_fields = Object.keys(data);
    const can_submit = input_fields.every((input) => inputs[input] !== '' ) && terms
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs);
    };
    return (
        <form id="signUpForm" onSubmit={handleSubmit}>
            <label htmlFor="fname">First Name </label>
            <input type="text" id="fname" name="firstname" value={inputs.firstname} onChange={handleChange} maxLength="20" className="input"/>
            <p className="warning" id="fname_warning">{errors.firstname}</p>
            <label htmlFor="lname">Last Name </label>
            <input type="text" id="lname" name="lastname" value={inputs.lastname} onChange={handleChange} maxLength="20" className="input"/>
            <p className="warning" id="lname_warning">{errors.lastname}</p>
            <label htmlFor="dob">Date of Birth </label>
            <input type="date" id="dob" name="dob" className="input" value={inputs.dob} onChange={handleChange} placeholder="mm/dd/yyyy"/>
            <p className="warning" id="dob_warning">{errors.dob}</p>
            <fieldset className="input">
                <legend htmlFor="gender">Gender </legend>
                <input type="radio" id="gender male" name="gender" onChange={handleChange} value="male"/>
                <label htmlFor="male">Male </label>
                <input type="radio" id="gender female" name="gender" onChange={handleChange} value="female"/>
                <label htmlFor="female">Female </label>    
            </fieldset>
            <br/>
            <label htmlFor="address">Address </label>
            <textarea id="address" name="address" rows="3" cols="30" className="input" value={inputs.address} onChange={handleChange}></textarea>
            <p className="warning" id="address_warning">{errors.address}</p>
            <label htmlFor="country">Country </label>
            <select name="country" id="country" className="input" value={inputs.country} onChange={handleChange}>
                <option value="">(Select one)</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="India">India</option>
            </select>
            <p className="warning" id="country_warning">{errors.country}</p>
            <label htmlFor="email">Email Id </label>
            <input type="email" id="email" name="email" className="input" value={inputs.email} onChange={handleChange}/>
            <p className="warning" id="email_warning">{errors.email}</p>
            <label htmlFor="password">Password </label>
            <input type="password" id="password" name="password" className="input" value={inputs.password} onChange={handleChange}/>
            <p className="warning" id="password_warning">{errors.password}</p>
            <label htmlFor="security">Security Questions</label>
            <select name="security" id="security" className="input" value={inputs.security} onChange={handleChange}>
                <option value="">(Select one)</option>
                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option value="What was the make and model of your first car?">What was the make and model of your first car?</option>
                <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                <option value="In what city were you born?">In what city were you born?</option>
            </select>
            <p className="warning" id="security_warning">{errors.security}</p>
            <label htmlFor="answer">Answer</label>
            <input type="text" id="answer" name="answer" maxLength="20" value={inputs.answer} onChange={handleChange} className="input"/>
            <p className="warning" id="answer_warning">{errors.answer}</p>
            <input type="checkbox" id="subscription" name="subscription" value="subscription" />
            <label htmlFor="subscription">Subscribe to get latest news and promotional offers</label>
            <br/>
            <input type="checkbox" id="terms" name="terms" value="terms" onChange={(e) => {setTerms(e.target.checked); setTouched(true)}}/>
            <label id='tandc' htmlFor="terms" className={touched && !terms ? 'warning' : ''}>Accept terms and conditions</label>
            <br/>
            <button type="reset" onClick={reset} className="button" id="reset">Reset</button>
            <button type="submit" disabled={!can_submit} className="button" id={can_submit ? 'submit' : 'disabled'}>Submit</button>
        </form>
    )
}
export default Form;