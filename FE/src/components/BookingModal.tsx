import { FC } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Box } from '@chakra-ui/react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: any[];
}

const BookingModal: FC<BookingModalProps> = ({ isOpen, onClose, bookingData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Booking Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {bookingData && bookingData.length > 0 ? (
            <Box display="flex" flexDirection="row" flexWrap="wrap">
              {bookingData.map((booking) => (
                <Box key={booking._id} p="4" borderWidth="1px" borderRadius="lg" m="2">
                  <Text fontSize="lg" fontWeight="semibold">{booking.coach.name}</Text>
                  <Text fontSize="sm">{booking.day.day}</Text>
                  <Text fontSize="sm">{booking.slot.availableAt}-{booking.slot.availableUntil}</Text>
                </Box>
              ))}
            </Box>
          ) : (
            <Text>No bookings available.</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BookingModal;
