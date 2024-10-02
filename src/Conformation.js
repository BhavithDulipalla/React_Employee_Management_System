import styles from './Form.module.css'
import { useLocation, Link } from 'react-router-dom';

function Conformation() {
    const location = useLocation();
    const { userName, email } = location.state || {};
    return (
        <section id={styles.conformationPage}>
            <p id="welcome">Congratulations {userName}</p>
            <p id="message">Your account was successfully created</p>
            <p id="verificationLink">A verification link was sent to your registered email address {email} </p>
            <p id="details">Click here to <Link to='/'>SignIn</Link></p>
        </section>
    )
}

export default Conformation;