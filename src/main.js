import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from './Main.module.css';
import edit from './edit.png';
import rem from './delete.png'

function Main() {
    const employee = {
        empId: '',
        empName: '',
        empDesignation: '',
        empSalary: ''
    }
    const location = useLocation();
    const [menu, setMenu] = useState(true);
    const [account, setAccount] = useState(true);
    const [operation, setOperation] = useState('');
    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState(employee);
    const [errors, setErrors] = useState(employee);
    const [hide, setHide] = useState(true);
    const { userData } = location.state || {};
    const input_fields = Object.keys(employee);
    const can_submit = input_fields.every((input) => inputs[input] !== '')

    const handleChange = (event) => {
        const name = event.target.name;
        const id = event.target.id;
        const value = event.target.value.trim();
        setInputs((values) => { return { ...values, [name]: value } })
        if (value === "") {
            setErrors((err) => { return { ...err, [name]: `${id.toUpperCase()} cannot be empty!` } })
        }
        else {
            setErrors((err) => { return { ...err, [name]: '' } })
        }
    }

    const arrange = (inp) => {
        let sortingData = [...data];
        if (inp === 'empId' || inp === 'empSalary') {
            sortingData.sort((a, b) => a[inp] - b[inp]);
        }
        else {
            sortingData.sort((a, b) => a[inp].localeCompare(b[inp]));
        }
        setData(sortingData);
    }

    const showAll = async () => {
        const info = await fetch('http://localhost:8084/getAll');
        const json = await info.json();
        setData(json);
    }

    const add = (e) => {
        e.preventDefault()
        if (can_submit) {
            fetch('http://localhost:8084/addEmp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            }).then(() => {
                showAll(); setOperation('showAll');
                setInputs(employee);
            }).catch((err) => console.log(err));
        }
        else {
            setErrors((err) => { return { ...err, empId: inputs.empId === '' ? "ID cannot be empty!" : '' } })
            setErrors((err) => { return { ...err, empName: inputs.empName === '' ? "NAME cannot be empty!" : '' } })
            setErrors((err) => { return { ...err, empDesignation: inputs.empDesignation === '' ? "DESIGNATION cannot be empty!" : '' } })
            setErrors((err) => { return { ...err, empSalary: inputs.empSalary === '' ? "SALARY cannot be empty!" : '' } })
        }
    }

    const search = async (e) => {
        e.preventDefault()
        if (inputs.empId === "") {
            setErrors((err) => { return { ...err, empId: "ID cannot be empty!" } })
        }
        else {
            const response = await fetch(`http://localhost:8084/serach/${inputs.empId}`)
            const response_text = await response.text();
            if (response_text) {
                setData([JSON.parse(response_text)]);
                setHide(false);
            }
            else {
                setErrors((err) => { return { ...err, empId: "User dosen't Exist" } });
                setHide(true);
            }
        }
    }

    const update = async (e) => {
        e.preventDefault()
        if (can_submit) {
            await fetch('http://localhost:8084/updateemp', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            })
            showAll();
            setOperation('showAll')
        }
        else {
            setErrors((err) => { return { ...err, empName: inputs.empName === '' ? "NAME cannot be empty!" : '' } })
            setErrors((err) => { return { ...err, empDesignation: inputs.empDesignation === '' ? "DESIGNATION cannot be empty!" : '' } })
            setErrors((err) => { return { ...err, empSalary: inputs.empSalary === '' ? "SALARY cannot be empty!" : '' } })
        }
    }

    const remove = async (id) => {
        await fetch(`http://localhost:8084/deleteemp/${id}`, {
            method: 'DELETE'
        })
        showAll();
        setOperation('showAll');
    }

    const handleEdit = (id) => {
        setInputs((values) => { return { ...values, empId: id } })
        setErrors(employee);
        setOperation('update');
    }

    const handleRemove = (id) => {
        setInputs((values) => { return { ...values, empId: id } });
        remove(id);
    }

    return (
        <section id="main">
            <div onMouseLeave={() => setMenu(true)} id={styles.left} className={menu ? '' : styles.menuBar}>
                <button type="button" onClick={() => setMenu(false)} style={{ float: 'left' }}> Employee Operations</button >
                <div hidden={menu} className={styles.dropDown}>
                    <ul>
                        <li onClick={() => { showAll(); setOperation('showAll') }}>Show All Employees</li>
                        <li onClick={() => { setOperation('add'); setInputs(employee); setErrors(employee) }}> Add Employee</li >
                        <li onClick={() => { setOperation('search'); setInputs(employee); setErrors(employee); setHide(true) }}> Search Employee</li >
                    </ul >
                </div >
            </div >

            <div onMouseLeave={() => setAccount(true)} id={styles.right} className={account ? '' : styles.menuBar}>
                <button type="button" onClick={() => setAccount(false)} style={{ float: 'right' }}>{userData.firstName}</button >
                <div hidden={account} className={styles.dropDown}>
                    <ul>
                        <li><Link className={styles.link} to='/account' state={{ userData: userData }}>Account</Link></li>
                        <li><Link className={styles.link} to='/'>Sign Out</Link></li>
                    </ul>
                </div >
            </div >
            <h3>Employee Management System</h3>
            <div >
                {(() => {
                    switch (operation) {
                        case 'showAll':
                            return (
                                <>
                                    <h4>Employee Data</h4>
                                    <table style={{ width: '80%', margin: 'auto' }}>
                                        <thead>
                                            <tr>
                                                <th className={styles.sorting} onClick={() => arrange('empId')}>Employee Id</th>
                                                <th className={styles.sorting} onClick={() => arrange('empName')}>Employee Name</th>
                                                <th className={styles.sorting} onClick={() => arrange('empDesignation')}>Employee Designation</th>
                                                <th className={styles.sorting} onClick={() => arrange('empSalary')}>Employee Salary</th>
                                                <th>Edit / Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item) => {
                                                return (
                                                    <tr key={item.empId}>
                                                        <td>{item.empId}</td>
                                                        <td>{item.empName}</td>
                                                        <td>{item.empDesignation}</td>
                                                        <td>${item.empSalary}</td>
                                                        <td><img onClick={() => handleEdit(item.empId)} alt="edit icon" src={edit} />
                                                            <img onClick={() => handleRemove(item.empId)} alt="delete icon" src={rem} /></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </>
                            );
                        case 'add':
                            return (
                                <form>
                                    <h4>Add Employee Details</h4>
                                    <label htmlFor="id">Employee Id </label>
                                    <input type="number" id="id" name="empId" value={inputs.empId} onChange={handleChange} className={styles.input} />
                                    <p className={styles.warning} id="empId_warning">{errors.empId}</p>
                                    <label htmlFor="name">Employee Name </label>
                                    <input type="text" id="name" name="empName" value={inputs.empName} onChange={handleChange} maxLength="20" className={styles.input} />
                                    <p className={styles.warning} id="empName_warning">{errors.empName}</p>
                                    <label htmlFor="designation">Employee Designation </label>
                                    <input type="text" id="designation" name="empDesignation" className={styles.input} value={inputs.empDesignation} onChange={handleChange} />
                                    <p className={styles.warning} id="empDesignation_warning">{errors.empDesignation}</p>
                                    <label htmlFor="salary">Employee Salary </label>
                                    <input type="number" id="salary" name="empSalary" className={styles.input} value={inputs.empSalary} onChange={handleChange} />
                                    <p className={styles.warning} id="empSalary_warning">{errors.empSalary}</p>
                                    <button type="button" onClick={add} className={styles.login}>Add</button>
                                </form>
                            );
                        case 'search':
                            return (
                                <>
                                    <form>
                                        <h4>Search Employee Details</h4>
                                        <label htmlFor="id">Employee Id </label>
                                        <input type="number" id="id" name="empId" value={inputs.empId} onChange={handleChange} className={styles.input} />
                                        <p className={styles.warning} id="empId_warning">{errors.empId}</p>
                                        <button type="button" onClick={search} className={styles.login}>Search</button>
                                    </form>
                                    <div hidden={hide}>
                                        <br />
                                        <table style={{ width: '80%', margin: 'auto' }}>
                                            <thead>
                                                <tr>
                                                    <th>Employee Id</th>
                                                    <th>Employee Name</th>
                                                    <th>Employee Designation</th>
                                                    <th>Employee Salary</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item) => {
                                                    return (
                                                        <tr key={item.empId}>
                                                            <td>{item.empId}</td>
                                                            <td>{item.empName}</td>
                                                            <td>{item.empDesignation}</td>
                                                            <td>${item.empSalary}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            );
                        case 'update':
                            return (
                                <form>
                                    <h4>Update Employee Details</h4>
                                    <label htmlFor="id">Employee Id </label>
                                    <input type="number" id="id" name="empId" value={inputs.empId} onChange={handleChange} className={styles.input} disabled />
                                    <p className={styles.warning} id="empId_warning">{errors.empId}</p>
                                    <label htmlFor="name">Employee Name </label>
                                    <input type="text" id="name" name="empName" value={inputs.empName} onChange={handleChange} maxLength="20" className={styles.input} />
                                    <p className={styles.warning} id="empName_warning">{errors.empName}</p>
                                    <label htmlFor="designation">Employee Designation </label>
                                    <input type="text" id="designation" name="empDesignation" className={styles.input} value={inputs.empDesignation} onChange={handleChange} />
                                    <p className={styles.warning} id="empDesignation_warning">{errors.empDesignation}</p>
                                    <label htmlFor="salary">Employee Salary </label>
                                    <input type="number" id="salary" name="empSalary" className={styles.input} value={inputs.empSalary} onChange={handleChange} />
                                    <p className={styles.warning} id="empSalary_warning">{errors.empSalary}</p>
                                    <button type="button" onClick={() => setOperation('showAll')} className={styles.button}>&#8592;  Back</button>
                                    <button type="button" onClick={update} className={styles.button}>Update</button>
                                </form>
                            );
                        default:
                            return <h3>Welcome {userData.firstName}</h3>;
                    }
                })()}
            </div>
        </section>
    )
}

export default Main;