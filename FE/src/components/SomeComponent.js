import React from 'react';
import { useNavigation } from './Navigation/NavigationProvider';

function SomeComponent() {
  const { goTo } = useNavigation();
  
  return (
    <button onClick={() => goTo('/some-path')}>Go somewhere</button>
  );
}