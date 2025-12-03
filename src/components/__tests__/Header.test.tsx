import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../layout/Header';

// Mockear useDevices ya que el componente Header lo usa
vi.mock('../../context/DeviceContext', () => ({
  useDevices: vi.fn(() => ({
    // Se requiere un array vacío o un mock para evitar errores de desestructuración
    devices: [], 
  })),
}));

// Mockear las props requeridas por el componente Header
const mockProps = {
  onAddDevice: vi.fn(),
  onToggleSidebar: vi.fn(),
  onSearch: vi.fn(),
  isHouseScanned: true,
};

describe('Header - Test con componente original sin accesibilidad', () => {
  
  it('debe renderizar el título principal de la aplicación', () => {
    render(<Header {...mockProps} />);
    
    const titleElement = screen.getByText('Kaxanly'); 
    
    expect(titleElement).toBeInTheDocument();
  });

  it('debe renderizar el botón de menú (identificado por posición)', () => {
    render(<Header {...mockProps} />);
    
    const allButtons = screen.getAllByRole('button');
    const menuButton = allButtons[0];
    
    expect(menuButton).toBeInTheDocument();
    
    // Verificación adicional: Confirmamos que se está renderizando el logo también
    expect(screen.getByAltText('Logo Kaxanly')).toBeInTheDocument();
  });
});