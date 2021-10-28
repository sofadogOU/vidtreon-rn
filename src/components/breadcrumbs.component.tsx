import React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

export const Breadcrumbs = () => {
  return (
    <Container>
      <Breadcrumb>
        <Indicator selected>
          <InidicatorLabel selected>1</InidicatorLabel>
        </Indicator>
        <Label selected>Upload</Label>
      </Breadcrumb>
      <Breadcrumb>
        <Indicator>
          <InidicatorLabel>2</InidicatorLabel>
        </Indicator>
        <Label>Details</Label>
      </Breadcrumb>
      <Breadcrumb>
        <Indicator>
          <InidicatorLabel>3</InidicatorLabel>
        </Indicator>
        <Label>Settings</Label>
      </Breadcrumb>
    </Container>
  )
}

const Container = styled.View`
  ${tw(`flex-row py-4 my-4 rounded-lg`)};
  /* border-width: 1px; */
  border-color: #cbd5e0;
`
const Breadcrumb = styled.View`
  ${tw(`flex-row items-center justify-center flex-1`)}
`
const Indicator = styled.View<{ selected?: boolean }>`
  ${tw(
    `h-8 w-8 mr-2 items-center justify-center 
    rounded-full border`
  )};
  border-color: ${({ theme, selected }) =>
    selected ? theme.primary.tint : '#cbd5e0'};
  background-color: ${({ theme, selected }) =>
    selected ? theme.primary.tint : theme.background};
`
const InidicatorLabel = styled.Text<{ selected?: boolean }>`
  color: ${({ theme, selected }) =>
    selected ? theme.white : theme.text.muted};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`
const Label = styled.Text<{ selected?: boolean }>`
  color: ${({ theme, selected }) =>
    selected ? theme.primary.tint : theme.text.muted};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`
