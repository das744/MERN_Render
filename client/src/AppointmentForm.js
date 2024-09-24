import React, { useState } from 'react';
import axios from 'axios';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // assuming formData holds your form values
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Display error messages to the user
        throw new Error(errorData.errors ? errorData.errors.map(err => err.msg).join(', ') : errorData.message);
      }
  
      const data = await response.json();
      alert(data.message); // Show success message
    } catch (error) {
      alert(`Error: ${error.message}`); // Show error message
    }
  };
  

  return (
    <div className="form-container">
      <h1 >Appointment</h1>
      <form onSubmit={handleSubmit}>
      <div className="form-field">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        </div>
    <div className="form-field">
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
    <div className="form-field">
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        </div>
    <div className="form-field">
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
    <div className="form-field">
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message (optional)"></textarea>
        </div>
    <div className="form-field"></div>
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AppointmentForm;
