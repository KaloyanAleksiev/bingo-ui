import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Heading, Table, Thead, Tbody, Tr, Th, Td, useToast } from '@chakra-ui/react';
import { fetchLeaderboardData } from '../API';
function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLeaderboardData();
        if (data.hasOwnProperty('ranking')) {
          setLeaderboardData(data.ranking);
          setIsLoading(false);
        }
        if (data.hasOwnProperty('error')) {
          toast({
            title: 'Score Validation or Store Failed',
            description: data.error,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }

      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ChakraProvider>
      <Box p="4">
        <Heading as="h1" size="xl" mb="4">Leaderboard</Heading>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Rank</Th>
                <Th>Name</Th>
                <Th>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leaderboardData.map((entry, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{entry.name}</Td>
                  <Td>{entry.score}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default LeaderboardPage;

