import { Box, Heading, Text, type BoxProps } from '@chakra-ui/react';

type HeroProps = BoxProps & {
  title: string;
  subtitle?: string;
};

export function Hero({ title, subtitle, ...boxProps }: HeroProps) {
  return (
    <Box px={{ base: '16px', md: '3%' }} pt={6} pb={2} maxW="1400px" mx="auto" {...boxProps}>
      <Heading size={{ base: '2xl', md: '3xl' }} mb={2}>
        {title}
      </Heading>
      {subtitle && (
        <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600">
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
