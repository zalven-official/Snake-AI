import { useState, useEffect } from 'react';

function getSavedValue(key: string, value: string) {
  const saved: string = JSON.parse(`${localStorage.getItem(key)}`);
  if (saved) return saved;
  return value;
}
function useChangeTheme(key: string, value: string) {
  const [theme, changeTheme] = useState(() => getSavedValue(key, value));
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(theme || 'dark'));
  });
  return [theme, changeTheme] as const;
}

export default useChangeTheme;
