import { Box, Container, Image } from '@chakra-ui/react';

export function Header() {
  return (
    <Box
      as="header"
      role="banner"
      bg="red.500"
      h={{ base: '56px', md: '64px' }}
      display="flex"
      alignItems="center"
      w="100%"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Container maxW="1400px" px={{ base: '16px', md: '3%' }} display="flex" alignItems="center">
        <Image
          src="/sporty-logo.png"
          alt="Sporty logo"
          h={{ base: '24px', md: '30px' }}
          w="auto"
          objectFit="contain"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          draggable={false}
        />
      </Container>
    </Box>
  );
}
