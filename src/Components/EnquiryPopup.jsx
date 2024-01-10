import React, { useState } from 'react';
import '../Styles/EnquiryPopup.css';

const EnquiryPopup = ({ onClose, propertyId }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [purposeError, setPurposeError] = useState('');

  const handleFieldError = (field, value, setError,length) => {
    if (!value) {
      setError(`* ${field} is required`);
    } else {
      setError('');
    }
  };
  const handleFieldErrorPhone = (field, value, setError, length) => {
    if (!value) {
      setError(`* ${field} is required`);
    }
    else if(value.length !== length) {
      setError(`* ${field} should be ${length} digits`);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    handleFieldError('Name', name, setNameError);
    handleFieldErrorPhone('Phone Number', phone, setPhoneError, 10);
    handleFieldError('Purpose', purpose, setPurposeError);
  
    if (!name || !phone || !purpose || phone.length !== 10) {
      return;
    }
  
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('name', name);
    formData.append('purpose', purpose);
    formData.append('propertyID', propertyId);
  
    const apiUrl = `http://13.234.238.86/api/addinterest?phone=${encodeURIComponent(
      phone
    )}&name=${encodeURIComponent(name)}&purpose=${encodeURIComponent(
      purpose
    )}&prop_id=${encodeURIComponent(propertyId)}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log('Enquiry submitted successfully:', responseData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting enquiry:', error.message);
    }
  };
  
  const resetForm = () => {
    setName('');
    setPhone('');
    setPurpose('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className={`enquiry-popup ${submitted && 'thank-you'}`}>
        <div>
          {submitted ? (
            <>
              <h2 className='heading'>Thank You!</h2>
              <p>Your enquiry has been submitted successfully.</p>
              <div className='ok-btn'>
                <button className='submit-btn' onClick={resetForm}>OK</button>
              </div>
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
                <div className="investment-dropdown">
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className={purposeError ? 'error' : ''}
                  >
                    <option value="">Select Purpose</option>
                    <option value="0">Investment</option>
                    <option value="1">Residential</option>
                    <option value="2">Other</option>
                  </select>
                  {purposeError && <p className="error-message">{purposeError}</p>}
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
  );
};

export default EnquiryPopup;
