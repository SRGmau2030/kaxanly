import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export const useDeviceIcon = (iconName: string) => {
  const [Icon, setIcon] = useState<any>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const icons = await import('lucide-react');
        setIcon(() => icons[iconName] || icons.HelpCircle);
      } catch (e) {
        console.error("Failed to load icon", e);
        setIcon(() => HelpCircle);
      }
    };

    loadIcon();
  }, [iconName]);

  return Icon;
};
