import React, { useState } from 'react';
import WithdrawHistoryMain from '../Components/WithdrawHistoryMain';
import Mobile from '../Components/Mobile';
import { useNavigate } from 'react-router-dom';

const DepositNotReceived = () => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your server
  };


  const navigate=useNavigate();

  return (
    <Mobile>
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#ff6b6b', 
        color: 'white', 
        padding: '15px', 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        <span style={{ marginRight: '15px', fontSize: '20px', color: 'white', textDecoration: 'none' , cursor: "pointer"}} onClick={()=>navigate(-1)}>
          ←
        </span>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Client Support Form</h1>
        <div style={{ marginLeft: 'auto', fontSize: '24px' }}>?</div>
      </div>

      {/* Form */}
      <div style={{ padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          {/* Field 1 */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '10px', 
              textAlign: 'center' 
            }}>
             UID NUMBER<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="field1"
              value={formData.field1}
              onChange={handleInputChange}
              placeholder="Enter information"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                fontSize: '16px', 
                boxSizing: 'border-box' 
              }}
              required
            />
          </div>

          {/* Field 2 */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '10px', 
              textAlign: 'center' 
            }}>
              AMOUNT <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="field2"
              value={formData.field2}
              onChange={handleInputChange}
              placeholder="Enter information"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                fontSize: '16px', 
                boxSizing: 'border-box' 
              }}
              required
            />
          </div>

          {/* Field 3 */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '10px', 
              textAlign: 'center' 
            }}>
              UTR ID <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="field3"
              value={formData.field3}
              onChange={handleInputChange}
              placeholder="Enter information"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                fontSize: '16px', 
                boxSizing: 'border-box' 
              }}
              required
            />
          </div>

          {/* Field 4 */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '10px', 
              textAlign: 'center' 
            }}>
              UPI ID<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="field4"
              value={formData.field4}
              onChange={handleInputChange}
              placeholder="Enter information"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                fontSize: '16px', 
                boxSizing: 'border-box' 
              }}
              required
            />
          </div>

          {/* Field 5 */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '10px', 
              textAlign: 'center' 
            }}>
              ORDER NUMBER <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="field5"
              value={formData.field5}
              onChange={handleInputChange}
              placeholder="Enter information"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                fontSize: '16px', 
                boxSizing: 'border-box' 
              }}
              required
            />
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '10px', 
              textAlign: 'center' 
            }}>
              Upload Image <span style={{ color: 'red' }}>*</span>
            </label>
            <div style={{ 
              border: '1px dashed #ccc', 
              borderRadius: '5px', 
              padding: '30px', 
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9'
            }}>
              <input
                type="file"
                name="image"
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
                id="imageUpload"
                required
              />
              <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                <div style={{ marginBottom: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div style={{ color: '#aaaaaa' }}>Upload photo</div>
              </label>
              {formData.image && (
                <div style={{ marginTop: '10px', fontSize: '14px' }}>
                  Selected: {formData.image.name}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            marginTop: '20px',
            paddingLeft: '0',  // Remove left padding
            paddingRight: '30%'  // Add right padding to shift button slightly left
          }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '15px',
                fontSize: '18px',
                width: '90%',  // Reduced width from 100%
                cursor: 'pointer',
              }}
            >
              CONFIRM
            </button>
          </div>
        </form>
      </div>
    </div>
    </Mobile>
    
  );
};

export default DepositNotReceived;