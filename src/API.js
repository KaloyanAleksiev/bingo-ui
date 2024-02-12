import { apiUrl } from './Config';

export const validateNumber = async (number) => {
  try {
    const response = await fetch(`${apiUrl}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error validating number:', error);
    return { errors: { general: 'Error validating number' } };
  }
};

export const submitScore = async (name, numbers) => {
  try {
    const response = await fetch(`${apiUrl}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, numbers }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting score:', error);
    return { errors: { general: 'Error submitting score' } };
  }
};

export const fetchLeaderboardData = async () => {
  try {
    const response = await fetch(`${apiUrl}/leaderboard`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
};