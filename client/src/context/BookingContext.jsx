import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedHookah, setSelectedHookah] = useState(null);
  const [bookingCart, setBookingCart] = useState([]);
  const [eventData, setEventData] = useState({
    eventType: 'House party',
    eventDate: '',
    startTime: '20:00',
    durationHours: 3,
    venueAddress: '',
    guestCount: 15,
    specialNotes: '',
  });

  const selectHookahForBooking = (hookah) => {
    setSelectedHookah(hookah);
    // Add to cart if not already present
    setBookingCart((prev) => {
      const exists = prev.find((item) => item._id === hookah._id);
      if (exists) return prev;
      return [...prev, { ...hookah, quantity: 1 }];
    });
  };

  const removeFromCart = (hookahId) => {
    setBookingCart((prev) => prev.filter((item) => item._id !== hookahId));
  };

  const clearCart = () => {
    setBookingCart([]);
    setSelectedHookah(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedHookah,
        setSelectedHookah,
        bookingCart,
        setBookingCart,
        selectHookahForBooking,
        removeFromCart,
        clearCart,
        eventData,
        setEventData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
