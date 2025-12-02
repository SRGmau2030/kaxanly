import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock de componentes que podrían necesitar configuración
vi.mock('./components/DeviceList', () => ({
  default: () => <div data-testid="device-list">Device List Mock</div>
}));

vi.mock('./components/Header', () => ({
  default: () => <header data-testid="header">Header Mock</header>
}));

describe('App', () => {
  it('debería renderizar correctamente', () => {
    render(<App />);
    
    // Verificar que la aplicación se renderiza
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('device-list')).toBeInTheDocument();
  });

  it('debería tener el título principal', () => {
    render(<App />);
    
    // Puedes verificar textos específicos si los tienes
    // Por ahora solo verificamos la estructura
    const appElement = screen.getByTestId('header');
    expect(appElement).toBeVisible();
  });
});
