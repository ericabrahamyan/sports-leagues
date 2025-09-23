import {
  HStack,
  Input,
  Button,
  Box,
  Text,
  Portal,
  Select,
  createListCollection,
} from '@chakra-ui/react';

type Props = {
  search: string;
  onSearch: (v: string) => void;
  sport: string;
  onSport: (v: string) => void;
  sports: string[];
  total: number;
  isLoading?: boolean;
  onClear: () => void;
};

export default function LeagueFilters({
  search,
  onSearch,
  sport,
  sports,
  total,
  isLoading,
  onSport,
  onClear,
}: Props) {
  const hasFilters = !!search || !!sport;

  const sportCollection = createListCollection({
    items: sports.map((s) => ({ label: s, value: s })),
  });

  return (
    <Box position="sticky" top={{ base: '56px', md: '64px' }} zIndex={10} bg="white" w="100%">
      <Box
        maxW="1400px"
        mx="auto"
        px={{ base: '16px', md: '3%' }}
        py={4}
        boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      >
        <HStack gap={3} align="stretch" mb={2} flexDir={{ base: 'column', md: 'row' }}>
          <Input
            placeholder="Search leagues…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search leagues by name"
            type="search"
            inputMode="search"
            autoComplete="off"
          />

          <Select.Root
            collection={sportCollection}
            value={sport ? [sport] : []}
            onValueChange={(d) => onSport(d.value[0] ?? '')}
            aria-label="Filter by sport"
            w={{ base: '100%', md: 'sm' }}
            deselectable
          >
            <Select.HiddenSelect name="sport" />
            <Select.Label srOnly>Filter by sport</Select.Label>

            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="All sports" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.ClearTrigger />
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>

            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {sportCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Button onClick={onClear} variant="ghost" disabled={!hasFilters} type="button">
            Clear
          </Button>
        </HStack>

        <Text fontSize="sm" opacity={0.7} aria-live="polite" aria-busy={isLoading}>
          {isLoading
            ? 'Loading leagues…'
            : `${new Intl.NumberFormat().format(total)} result${total === 1 ? '' : 's'}`}
        </Text>
      </Box>
    </Box>
  );
}
