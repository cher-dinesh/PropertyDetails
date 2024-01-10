import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Image from '../assets/property-images/property.jpg';
import EnquiryPopup from './EnquiryPopup';
import '../Styles/PropertyDetails.css';

const PropertyDetails = (props) => {
  const location = useLocation();
  const [propertyData, setPropertyData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef(null);

  const fetchData = async () => {
    try {
      if (location.state && location.state.propertyId) {
        const propertyId = location.state?.propertyId?.value;
        const apiUrl = `http://13.234.238.86/api/getpropertydetails?ids=[${propertyId}]`;

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
          price: rawData[0].price,
          type: rawData[0].type,
          location: rawData[0].location.value,
          imgext: rawData[0].imgext || 'N/A',
        };
        const locationResponse = await axios.post(`http://13.234.238.86/api/getlocationsbyids?ids=[${transformedData.location}]`);
        const imageUrl =`http://13.234.238.86/media/prop/${propertyId}_1.jpeg`;
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
      } else {
        console.error("Invalid propertyId in state");
      }
    } catch (error) {
      console.error('Error fetching data from API:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateImageUrls = () => {
    const { id, imgext } = propertyData;

    if (imgext) {
      const imageVector = imgext.split(',').map((_, index) => index + 1);

      if (imageVector.length > 1) {
        // If there are multiple images, generate URLs for the slider
        return imageVector.map((index) => `http://13.234.238.86/media/prop/${id}_${index}.jpeg`);
      } else {
        // If there's only one image, use the single image URL
        return [`http://13.234.238.86/media/prop/${id}.jpeg`];
      }
    }

    return [Image];
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + generateImageUrls().length) % generateImageUrls().length);
    sliderRef.current.scrollBy(-sliderRef.current.offsetWidth, 0);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % generateImageUrls().length);
    sliderRef.current.scrollBy(sliderRef.current.offsetWidth, 0);
  };

  const handleEnquireClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Navbar/>
      {propertyData ? (
        <div className="property-listing">
          <div className="container">
            <div className="sub-container">
              <h1 className='heading'>{propertyData.name}</h1>
              <div className="details-container">
                {generateImageUrls().length > 1 ? (
                  <div className="image-slider-container">
                    <button className="prev" onClick={handlePrevImage}>&#10094;</button>
                    <div className="image-slider" ref={sliderRef}>
                      {generateImageUrls().map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          className={`image ${index === currentImageIndex ? 'active' : ''}`}
                          alt={`Image Not Found`}
                        />
                      ))}
                    </div>
                    <button className="next" onClick={handleNextImage}>&#10095;</button>
                  </div>
                ) : (
                  <img
                    src={generateImageUrls()[0]}
                    className="single-image"
                    alt={`Image Not Found`}
                  />
                )}
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
        <EnquiryPopup onClose={closePopup} propertyId={propertyData.id} />
      )}
    </div>
  );
};

export default PropertyDetails;
