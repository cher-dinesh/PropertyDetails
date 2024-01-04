// EnquiryPopup.js
import React, { useState } from 'react';
import './EnquiryPopup.css';
import axios from 'axios';

const EnquiryPopup = ({ onClose, locationId }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
        setNameError('* Name is required');
      } else {
        setNameError('');
      }
  
      if (!phone) {
        setPhoneError('* Phone Number is required');
      } else {
        setPhoneError('');
      }
  
      if (!name || !phone) {
        return;
      }

    const formData = new URLSearchParams({
      name: name,
      phone: phone,
      purpose: 'investment',
      locationID: locationId,
    });

    const apiUrl = `http://13.234.238.86/api/addbuyerreq?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}&req=request`;

    try {
      const response = await axios.post(apiUrl);
      console.log('Enquiry submitted successfully:', response.data);
      console.log(formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting enquiry:', error.message);
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className={`enquiry-popup ${submitted ? 'thank-you' : ''}`}>
     <div className="overlay">
      <div className="enquiry-popup">
        
        {submitted ? (
          <>
            <h2 className='heading'>Thank You!</h2>
            <p>Your enquiry has been submitted successfully.</p>
            <button className='submit-btn' onClick={resetForm}>OK</button>
          </>
        ) : (
            <>
              <div className="close-btn" onClick={onClose}>X</div>
              <h2 className='heading'>Enquiry Form</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={nameError ? 'error' : ''}
                  />
                  {nameError && <p className="error-message">{nameError}</p>}
                </div>
                <div>
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={phoneError ? 'error' : ''}
                  />
                  {phoneError && <p className="error-message">{phoneError}</p>}
                </div>
                <p>We will contact you with more information about the property through this phone number</p>
                <div className='btn-container'>
                  <button type="submit" className='submit-btn'>Submit</button>
                </div>
              </form>
            </>
        )}
      </div>
     </div>
    </div>
  );
};

export default EnquiryPopup;
