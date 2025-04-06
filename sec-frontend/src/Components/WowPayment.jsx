import React, { useEffect,useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [user, setUser] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
            const response = await axios.post('http://localhost:3001/makePayment', 
            { user, am: amount },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.respCode === 'SUCCESS' && response.data.payInfo) {
                setPaymentUrl(response.data.payInfo);
                window.location.href = response.data.payInfo;
            } else {
                alert('Payment request failed. Please try again Or Wrong Details.');
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server Error:', error.response.data);
                console.error('Status Code:', error.response.status);
                console.error('Response Headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message);
            }
            alert('Payment request failed. Please try again Or Wrong Details.');
        }
    };
  

  const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Your request body here
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            setPaymentStatus(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="User" value={user} onChange={(e) => setUser(e.target.value)} />
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <button type="submit">Pay</button>
            </form>
            {paymentUrl && <a href={paymentUrl}>Proceed to Payment</a>}
            <div>
            <h1>Payment Status</h1>
            {paymentStatus ? <p>{paymentStatus}</p> : <p>Loading...</p>}
        </div>
        </div>
    );
};

export default PaymentForm;
