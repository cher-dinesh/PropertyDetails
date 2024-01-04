import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import Image from '../Assets/PD.jpg';
import './PropertyDetails.css';
import EnquiryPopup from './EnquiryPopup';

const PropertyDetails = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const apiUrl = 'http://13.234.238.86/api/getpropertydetails?ids=[3]';
  const locationApiUrl = 'http://13.234.238.86/api/getlocationsbyids';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(apiUrl);

        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          throw new Error('No valid data received from the API');
        }

        const rawData = response.data[0];

        if (!rawData[0] || !rawData[1]) {
          throw new Error('Incomplete data received from the API');
        }

        const transformedData = {
          id: rawData[0].id.value,
          name: rawData[0].name,
          description: rawData[0].description,
          price: (rawData[0].price / 100000).toFixed(2),
          type: rawData[0].type,
          location: rawData[0].location.value,
          imgext: rawData[0].imgext || 'N/A',
        };
        const locationResponse = await axios.post(`${locationApiUrl}?ids=[${transformedData.location}]`);

        if (!locationResponse.data || locationResponse.data.length === 0) {
          throw new Error('No valid location data received from the API');
        }

        const locationData = locationResponse.data[0];
        const locationName = locationData.name || 'N/A';

        const additionalData = {
          prop_id: rawData[1].prop_id,
          details: rawData[1].details,
          locationName: locationName,
        };

        setPropertyData({ ...transformedData, ...additionalData });
      } catch (error) {
        console.error('Error fetching data from API:', error.message);
      }
    };
    fetchData();
  }, [locationApiUrl]);

  const generateImageUrl = () => {
    const { id, imgext } = propertyData;
    const len = imgext.length;
    return len > 1 ? `http://13.234.238.86/media/prop/${id}_2.jpeg` : `http://13.234.238.86/media/prop/${id}.jpeg`;
  };

  const handleEnquireClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {propertyData ? (
        <div className="property-listing">
          <Navbar />
          <div className="container">
            <div className="sub-container">
              <h1 className='heading'>{propertyData.name}</h1>
              <div className="details-container">
                <div className="image-slider">
                  <img src={generateImageUrl()} className="image" alt={Image} />
                </div>
                <div className="details">
                  <div className="description">
                    <p>{propertyData.type} BHK</p>
                    <p>{propertyData.locationName}</p>
                    <p>{propertyData.price} lacs</p>
                  </div>
                  <div className="additional-details">
                    <p>{propertyData.description}</p>
                    <p>{propertyData.details}</p>
                  </div>
                </div>
              </div>
              <div className="btn-container">
                <button className="enquire-btn" onClick={handleEnquireClick} type='submit'>Enquire Now</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {showPopup && (
        <EnquiryPopup onClose={closePopup} locationId={propertyData.location} />
      )}
    </div>
  );
};

export default PropertyDetails;
