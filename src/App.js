import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import NameEntry from './components/NameEntry';
import Bingo from './components/Bingo';
import BingoChecker from './components/BingoChecker';
import Leaderboard from './components/Leaderboard';

function App() {
  const [name, setName] = useState(localStorage.getItem('name') ?? '');

  const pathname = window.location.pathname;
  const isStartPage = pathname === '/';
  const isBingoPage = pathname === '/bingo';
  const isLeaderboardPage = pathname === '/leaderboard';
  const isSharedPage = pathname.startsWith('/shared/');

  if (isStartPage && !name && !localStorage.getItem('name')) {
    return (
      <ChakraProvider>
        <NameEntry onSaveName={stringName => (setName(stringName))} />
      </ChakraProvider>
    );
  }

  if (isBingoPage || (isStartPage && localStorage.getItem('name'))) {
    return (
      <ChakraProvider>
        <Bingo />
      </ChakraProvider>
    );
  }

  if (isLeaderboardPage) {
    return (
      <ChakraProvider>
        <Leaderboard />
      </ChakraProvider>
    );
  }

  if (isSharedPage) {
    const markings = pathname.substring('/shared/'.length);
    return (
      <ChakraProvider>
        <BingoChecker markings={markings} />
      </ChakraProvider>
    );
  }

  return <div>Page not found</div>;
}

export default App;
