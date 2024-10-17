import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from './Account.module.css'

function Account() {
    const values = {
        answer: '',
        password: '',
        confirmPassword: ''
    }
    const location = useLocation();
    const navigate = useNavigate();
    const { userData } = location.state || {};
    const [content, setContent] = useState('');
    const [inputs, setInputs] = useState(values);
    const [errors, setErrors] = useState(values);
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({
        id: '',
        text: "",
        options: [],
        correctAnswer: ""
    });
    const [answers, setAnswers] = useState({});
    const [time, setTime] = useState(15);
    const [next, setNext] = useState(-1);
    const [hide, setHide] = useState([false, false]);
    const [score, setScore] = useState(0);
    const input_fields = Object.keys(values);
    const can_submit = input_fields.every((input) => inputs[input] !== '');

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

    const change = () => {
        if (can_submit) {
            if (inputs.answer === userData.answer) {
                if (inputs.password === inputs.confirmPassword) {
                    const postData = {
                        email: userData.email,
                        firstName: userData.firstName,
                        password: inputs.password,
                        security: userData.security,
                        answer: userData.answer
                    }
                    fetch('http://localhost:8084/updateAccount', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(postData)
                    }).then(() => {
                        alert('Password changed Successfully');
                        setInputs(values);
                    }).catch((err) => console.log(err));
                }
                else {
                    setErrors((err) => { return { ...err, confirmPassword: "Passwords doesn't match" } })
                }
            }
            else {
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
    }

    const remove = async () => {
        const response = await fetch(`http://localhost:8084/account/${userData.email}`, {
            method: 'DELETE'
        })
        const response_text = await response.text();
        if (response_text) {
            alert('Account Deleted Successfully');
            navigate('/');
        }
    }

    const start = () => {
        fetch('http://localhost:8084/quiz/getAll').then((response) => response.json())
            .then((response) => {
                setQuestions(response);
                setHide([true, false]);
                setNext(0);
            })
    }

    const setAnswer = (e) => {
        setAnswers((ans) => { return { ...ans, [question.id]: e.target.value } });
    }
    let timer;
    useEffect(() => {
        if (hide[0] && next < questions.length) {
            setQuestion(questions[next]);
            setTime(15);
            timer = setInterval(() => {
                setTime((prev) => {
                    if (prev === 0) {
                        clearInterval(timer);
                        setNext((val) => val + 0.5);
                        return 15;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        else if (next === questions.length){
            Object.keys(answers).forEach((answer) => {
                if (answers[answer] === questions[answer - 1].correctAnswer) {
                    setScore((val) => val + 1);
                }
            })
            setHide([true,true]);
        }
        return () => clearInterval(timer);
    }, [next]);

    const changeQuestion = () => {
        if (next < questions.length - 1) {
            setNext((val) => val + 1);
        }
        else {
            Object.keys(answers).forEach((answer) => {
                if (answers[answer] === questions[answer - 1].correctAnswer) {
                    setScore((val) => val + 1);
                }
            })
            setHide([true,true]);
        }
    }

    return (
        <>
            <div className={styles.accountContainer}>
                <nav className={styles.sideNav}>
                    <ul>
                        <li><Link to='/main' state={{ userData: userData }} style={{ textDecoration: 'none', color: 'white' }}>&#8592;  Back</Link></li>
                        <li onClick={() => { setContent('quiz'); setHide([false, false]); setNext(-1); setScore(0) }}>Quiz</li>
                        <li onClick={() => { setContent('change'); setInputs(values); setErrors(values); setScore(0) }}>Change Password</li>
                        <li onClick={() => {setContent('remove'); setScore(0)}}>Delete Account</li>
                    </ul>
                </nav >
                <div className={styles.content}>
                    {(() => {
                        switch (content) {
                            case 'quiz':
                                return (
                                    <>
                                        <h3>Quiz</h3>
                                        <div hidden={hide[0]}>
                                            <p>Hi {userData.firstName} do want to know how much you know about this Company.</p>
                                            <p>Take this short Quiz to test your Knowledge.</p>
                                            <p>This Quiz contains <strong>5 Questions</strong> and you will be given <strong>15 seconds</strong> to answer each question.</p>
                                            <p>Once you run out of time you will be redirected to next question.</p>
                                            <p><strong>Click</strong> on <strong>Start</strong> to begin the Quiz. All the best.</p>
                                            <button type="button" className={styles.button} id={styles.submit} onClick={start}>Start</button>
                                        </div>
                                        <div hidden={!hide[0]}>
                                            <form>
                                                <div hidden={hide[1]}>
                                                    <div className={styles.quizHeader}>
                                                        <h4>Question {question.id}</h4>
                                                        <h4>Remaining Time: {time}sec</h4>
                                                    </div>
                                                    <p className={styles.questionText}>{question.text}</p>
                                                    <div className={styles.optionsContainer}>
                                                        {question.options.map((option) => <label key={option} className={styles.optionLabel}><input type="radio" name="ans" value={option} onClick={setAnswer} />{option}</label>)}
                                                    </div>
                                                    <button type="button" className={styles.login} onClick={changeQuestion}>{next < questions.length - 1 ? 'Next' : 'Submit'}</button>
                                                </div>
                                                <div style={{textAlign: 'center'}} hidden={!hide[1]}>
                                                    <p>Congratulations</p>
                                                    <p>Your Score is <strong>{score}</strong> out of <strong>5</strong></p>
                                                </div>
                                            </form>
                                        </div>
                                    </>
                                );
                            case 'change':
                                return (
                                    <>
                                        <h3>Change Password</h3>
                                        <p style={{ color: '#007bff' }}>{userData.security}</p>
                                        <label htmlFor="answer">Answer</label>
                                        <input type="text" id="answer" name="answer" maxLength="20" value={inputs.answer} onChange={handleChange} className={styles.input} />
                                        <p className={styles.warning} id="answer_warning">{errors.answer}</p>
                                        <label htmlFor="password">New Password </label>
                                        <input type="password" id="password" name="password" className={styles.input} value={inputs.password} onChange={handleChange} />
                                        <p className={styles.warning} id="password_warning">{errors.password}</p>
                                        <label htmlFor="confirmPassword">Confirm Password </label>
                                        <input type="password" id="password" name="confirmPassword" className={styles.input} value={inputs.confirmPassword} onChange={handleChange} />
                                        <p className={styles.warning} id="confirmPassword_warning">{errors.confirmPassword}</p>
                                        <button className={styles.button} id={styles.submit} onClick={change}>Submit</button>
                                    </>
                                );
                            case 'remove':
                                return (
                                    <>
                                        <h3>Delete Account</h3>
                                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                                        <button type="button" className={styles.button} id={styles.submit} onClick={remove}  > Delete Account</button >
                                    </>
                                );
                            default:
                                return (
                                <>
                                <h2>Welcome {userData.firstName}</h2>
                                <br/>
                                <br/>
                                <div style={{textAlign: 'center'}}>
                                <h3>Quiz</h3>
                                <p>Test your knowledge and learn more about our company! Engage with fun and informative quizzes that cover our history, values, and key initiatives.
                                 It’s a great way to deepen your understanding and connection with our brand.</p>
                                 <h3>Change Password</h3>
                                <p>Your security is our priority. Easily update your password to keep your account safe.
                                 Simply navigate here to create a stronger password and ensure your personal information remains protected.</p>
                                 <h3>Delete account</h3>
                                <p>If you decide to part ways with us, you can initiate the account deletion process here.
                                 We’re sorry to see you go, but we respect your choice. This option ensures your data is handled securely according to our privacy policies.</p>
                                 </div>
                                </>
                                );
                        }
                    })()}
                </div >
            </div >

        </>
    )
}

export default Account;