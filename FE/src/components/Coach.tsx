import { FC, useState, useEffect } from 'react';
import { Box, Spinner, Text, Heading, Stack, HStack } from '@chakra-ui/react';
import CoachDay from './CoachDay';
import axiosInstance from '../services/axiosService';

interface CoachData {
    _id: string;
    name: string;
    timezone: string;
    days: Day[];
}

interface Day {
    _id: string;
    day: string;
    availableAt: string;
    availableUntil: string;
    coach: string;
}

const Coach: FC = () => {
    const [coachData, setCoachData] = useState<CoachData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get<CoachData[]>('api/coach');
                setCoachData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching coach data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Box p={4}>
            {loading ? (
                <Spinner />
            ) : coachData && coachData.length > 0 ? (
                <Box>
                    {coachData.map((coach) => (
                        <Box key={coach._id} p="4" borderWidth="1px" borderRadius="lg" m="2">
                            <Heading size='md'>{coach.name}</Heading>
                            <Stack spacing='4'>
                                <Text pt='2' fontSize='sm'>
                                    {coach.timezone}
                                </Text>
                                <HStack spacing='24px'>
                                    {coach.days.map((day) => (
                                        <CoachDay key={day._id} day={day.day} day_id={day._id} timezone={coach.timezone} availableAt={day.availableAt} />
                                    ))}
                                </HStack>
                            </Stack>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Text>No coach data available.</Text>
            )}
        </Box>
    );
};

export default Coach;
