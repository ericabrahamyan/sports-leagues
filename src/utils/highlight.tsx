import { Fragment } from 'react';

import { Mark } from '@chakra-ui/react';

export function highlightText(text: string, searchTerm: string) {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Mark key={index} bg="yellow.200" color="inherit" rounded="sm">
            {part}
          </Mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}
