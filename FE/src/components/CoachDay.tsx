import { FC, useEffect, useState } from 'react';
import { Box, Heading, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, useToast } from '@chakra-ui/react';
import axiosInstance from '../services/axiosService';
import userDetails from '../data/userDetails';
import moment from 'moment-timezone';

interface DayProps {
    day: string;
    day_id: string;
    timezone: string;
    availableAt: string;
}

function removeGMTBracket(timezone: string): string {
    return timezone.includes("US & Canada") ? "US/Central" : timezone.replace(/\(GMT.*?\)/g, '').trim();
}

function convertTimeToLocale(time: string, sourceTimezone: string): string {
    const cleanedSourceTimezone = removeGMTBracket(sourceTimezone);

    const parsedTime = moment.tz(time, 'hh:mm A', cleanedSourceTimezone);

    const localTime = parsedTime.clone().local();

    const localTimeString = localTime.format('hh:mm A');

    return localTimeString;
}

function convertDayToLocale(day: string, time: string, sourceTimezone: string): string {
    const cleanedSourceTimezone = removeGMTBracket(sourceTimezone);

    const currentDayOfWeek = moment().day(day);

    const dateTimeString = `${currentDayOfWeek.format('YYYY-MM-DD')} ${time}`;

    const parsedDateTime = moment.tz(dateTimeString, 'YYYY-MM-DD hh:mm A', cleanedSourceTimezone);

    const localDateTime = parsedDateTime.clone().local();

    const localDateTimeString = localDateTime.format('dddd');

    return localDateTimeString;
}

const CoachDay: FC<DayProps> = ({ day, day_id, timezone, availableAt }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localDay, setLocalDay] = useState(day)
    const [slots, setSlots] = useState<any[]>([]);
    const toast = useToast();

    useEffect(() => {
        const matchDay = convertDayToLocale(day, availableAt, timezone)
        setLocalDay(matchDay)
    }, [])
    useEffect(() => {
        if (isOpen) {
            fetchSlots();
        }
    }, [isOpen]);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const fetchSlots = async () => {
        try {
            const params = {
                day_id: day_id
            };
            const { data } = await axiosInstance.get('/api/slot/', { params });
            const updatedData = data.map((d: { availableAt: any; availableUntil: any; }) => {
                const newAvailableAt = convertTimeToLocale(d.availableAt, timezone);
                const newAvailableUntil = convertTimeToLocale(d.availableUntil, timezone);
                return { ...d, availableAt: newAvailableAt, availableUntil: newAvailableUntil }
            })

            setSlots(updatedData);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    const handleBookSlot = async (slotId: string) => {
        try {
            const response = await axiosInstance.post(`/api/slot/${slotId}`, { email: userDetails.email });
            console.log('Slot booked successfully:', response.data);
            fetchSlots();
            toast({
                title: "Slot Booked",
                description: "Your slot has been successfully booked.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error booking slot:', error);
            toast({
                title: "Error",
                description: "An error occurred while booking the slot. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            onClick={handleOpenModal}
            cursor="pointer"
            p="2"
            borderWidth="1px"
            borderRadius="lg"
            m="2"
            transition="transform 0.2s"
            _hover={{
                transform: "scale(1.05)",
                shadow: "lg",
            }}
        >
            <Heading size='sm' textTransform='uppercase'>
                {localDay}
            </Heading>
            <Modal isOpen={isOpen} onClose={handleCloseModal} scrollBehavior='inside' size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Available Slots for {localDay}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display="flex" flexDirection="row" flexWrap="wrap">
                            {slots.map((slot) => (
                                <Box key={slot._id} p="4" borderWidth="1px" borderRadius="lg" m="2">
                                    <Text fontSize="lg" fontWeight="semibold">
                                        {slot.availableAt} - {slot.availableUntil}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {slot.booked ? "Booked" : "Available"}
                                    </Text>
                                    <Button onClick={() => handleBookSlot(slot._id)} mt="2" colorScheme="blue" size="sm" isDisabled={slot.booked}>
                                        {slot.booked ? "Booked" : "Book Slot"}
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default CoachDay;
