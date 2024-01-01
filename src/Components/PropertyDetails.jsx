import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PropertyDetails.css';
import image from '../Assets/PD.jpg';

const PropertyDetails = () => {
  const [propertyData, setPropertyData] = useState({});

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get('https://13.234.238.86/api/getpropertydetails?ids=[1]');

        if (!response.data || !response.data.length) {
          throw new Error('No data received from the API');
        }
        
        const [data] = response.data;
        const transformedData = {
          id: data.id.value,
          name: data.name,
          description: data.description,
          price: data.price,
          type: data.type,
          location: data.location.value,
          imgext: data.imgext,
        };

        setPropertyData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        const dummyData = {
          id: 1,
          name: 'Sample Property',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          price: 95,
          type: '2BHK/3BHK',
          location: 'Hanspal',
          imgext: 'jpg',
        };

        setPropertyData(dummyData);
      }
    };

    fetchPropertyData();
  }, []);

  return (
    <div className="property-listing">
      <nav className="nav-container">
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-global-navigation-bar-1174857.png"
          className="nav-icon"
          alt="navigation icon"
        />
      </nav>
      <div className="container">
        <div className="sub-container">
          <div className="details-container">
            <div className="image-slider">
              <img src={image} className="image" alt="property" />
            </div>
            <div className="details">
              <div className="description">
                <p>{propertyData.type}</p>
                <p>{propertyData.location}</p>
                <p>{propertyData.price} lacs</p>
              </div>
              <div className="additional-details">
                <p>Premium property at Surekha Vatika, Haspal</p>
                <p>24x7 Water, Air</p>
                <p>24x7 Water, Air</p>
                <p>24x7 Water, Air</p>
              </div>
            </div>
          </div>
          <div className="btn-container">
            <button className="enquire-btn">Enquire Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
