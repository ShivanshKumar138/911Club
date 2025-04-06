import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [user, setUser] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = "your_token_here";
            const response = await axios.post(' http://localhost:3003/deposit', {
                withCredentials: true, // Include credentials with the request
                headers: {
                  Authorization: `Bearer ${token}`, // Add the Bearer token in the header
                },
                user: user,
                am: amount
            });
            console.log(response);
            if (response.status === 200) {
                window.location.href = response.data;
            } else {
                setMessage(response.data || 'Error occurred');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };
    return (
        <div>
            <h1>Payment Gateway Test</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="user">User Token:</label>
                <input type="text" id="user" value={user} onChange={(e) => setUser(e.target.value)} required />
                <br /><br />
                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <br /><br />
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PaymentForm;
