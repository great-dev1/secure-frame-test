import { FC, useState } from 'react';
import { Box, Container, Text, Heading, Button } from '@chakra-ui/react';
import Coach from '../components/Coach';
import userDetails from '../data/userDetails';
import BookingModal from '../components/BookingModal';
import axiosInstance from '../services/axiosService';

const Home: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingData, setBookingData] = useState<any>([]);
  const fetchBookingData = async () => {
    try {
      setIsOpen(true);
      const params = {
        email_id: userDetails.email
      };
      const response = await axiosInstance.get('/api/booking/',{params});
      setBookingData(response.data);
    } catch (error) {
      console.error('Error fetching booking data:', error);
    }
  };
  return (
    <Box p={4} bgGradient="linear(to-r, teal.500, cyan.500)" minH="100vh">
      <Container maxW="container.xl" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" bg="white">
        <Box p={6} borderBottomWidth="1px" borderColor="gray.200">
          <Heading fontSize="xl" mb={4}>User Details</Heading>
          <Box display="flex">
            <Text fontSize="lg" m={2}>Name: {userDetails.name}</Text>
            <Text fontSize="lg" m={2}>Email: {userDetails.email}</Text>
            <Text fontSize="lg" m={2}>Age: {userDetails.age}</Text>
            <Text fontSize="lg" m={2}>Location: {userDetails.location}</Text>
          </Box>
        </Box>
        <Box p={6}>
          <Heading fontSize="xl" mb={4}>Book a Coaching Session</Heading>
          <Coach />
          <Button onClick={fetchBookingData}>Bookings</Button>
        </Box>
        <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} bookingData={bookingData} />
      </Container>
    </Box>
  );
};

export default Home;
