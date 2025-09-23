import { Box } from '@chakra-ui/react';

import { Header } from './components/Header';
import { Leagues } from './components/Leagues';

function App() {
  return (
    <Box minH="100vh">
      <Header />
      <Leagues />
    </Box>
  );
}

export default App;
