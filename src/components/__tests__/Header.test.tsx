// srgmau2030/kaxanly/kaxanly-3d0b60dde7eca3b157237542fd22b47666ed06ec/src/components/__tests__/Header.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../layout/Header';

// Mockear useDevices para aislar el componente Header
vi.mock('../../context/DeviceContext', () => ({
  useDevices: vi.fn(() => ({
    // El componente Header solo necesita 'devices' para su lógica (aunque no la use directamente)
    devices: [], 
  })),
}));

// Mockear las props requeridas por el componente Header
const mockProps = {
  onAddDevice: vi.fn(),
  onToggleSidebar: vi.fn(),
  onSearch: vi.fn(),
  isHouseScanned: true, // Estado por defecto para la mayoría de las pruebas
};

describe('Header - Accesibilidad y Funcionalidad', () => {
  
  it('debe renderizar el título, el logo y los botones principales', () => {
    render(<Header {...mockProps} />);
    
    // 1. Título principal
    expect(screen.getByText('Kaxanly')).toBeInTheDocument();
    
    // 2. Logo (verificado por alt text)
    expect(screen.getByAltText('Logo Kaxanly')).toBeInTheDocument();
    
    // 3. Botón de menú (verificado por aria-label - ¡ahora accesible!)
    const toggleSidebarButton = screen.getByRole('button', { name: /Toggle Sidebar/i });
    expect(toggleSidebarButton).toBeInTheDocument();
    
    // 4. Botón de búsqueda (verificado por aria-label)
    const searchButton = screen.getByRole('button', { name: /Search/i });
    expect(searchButton).toBeInTheDocument();
    
    // 5. Botón para añadir dispositivo (verificado por aria-label)
    const addButton = screen.getByRole('button', { name: /Add Device/i });
    expect(addButton).toBeInTheDocument();
  });

  it('debe llamar a onToggleSidebar al hacer clic en el botón de menú', () => {
    render(<Header {...mockProps} />);
    
    const toggleSidebarButton = screen.getByRole('button', { name: /Toggle Sidebar/i });
    fireEvent.click(toggleSidebarButton);
    
    expect(mockProps.onToggleSidebar).toHaveBeenCalledTimes(1);
  });

  describe('Funcionalidad de Búsqueda', () => {
    it('debe cambiar al modo de búsqueda al hacer clic en el icono de Search', () => {
      render(<Header {...mockProps} />);
      
      const searchButton = screen.getByRole('button', { name: /Search/i });
      fireEvent.click(searchButton);
      
      // Tras el clic, el botón de búsqueda se reemplaza por un input y el botón de cerrar
      const searchInput = screen.getByPlaceholderText('Search devices...');
      expect(searchInput).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Clear Search/i })).toBeInTheDocument();
    });

    it('debe llamar a onSearch al escribir en el campo de búsqueda', () => {
      render(<Header {...mockProps} />);
      fireEvent.click(screen.getByRole('button', { name: /Search/i }));
      
      const searchInput = screen.getByPlaceholderText('Search devices...');
      fireEvent.change(searchInput, { target: { value: 'iPhone' } });
      
      expect(mockProps.onSearch).toHaveBeenCalledWith('iPhone');
      expect(mockProps.onSearch).toHaveBeenCalledTimes(1);
    });

    it('debe volver al modo normal al hacer clic en el botón Clear Search', () => {
      render(<Header {...mockProps} />);
      
      // 1. Entrar en modo búsqueda
      fireEvent.click(screen.getByRole('button', { name: /Search/i }));
      
      // 2. Hacer clic en el botón de borrar
      fireEvent.click(screen.getByRole('button', { name: /Clear Search/i }));
      
      // 3. Verificar que el input ya no está y el botón de búsqueda original sí
      expect(screen.queryByPlaceholderText('Search devices...')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
      
      // 4. Verificar que se limpió la búsqueda (onSearch con string vacío)
      expect(mockProps.onSearch).toHaveBeenCalledWith('');
    });
  });

  describe('Botón Añadir Dispositivo', () => {
    it('debe estar habilitado y llamar a onAddDevice si isHouseScanned es true', () => {
      render(<Header {...mockProps} isHouseScanned={true} />);
      
      const addButton = screen.getByRole('button', { name: /Add Device/i });
      
      expect(addButton).not.toBeDisabled();
      fireEvent.click(addButton);
      
      expect(mockProps.onAddDevice).toHaveBeenCalledTimes(1);
    });

    it('debe estar deshabilitado y no llamar a onAddDevice si isHouseScanned es false', () => {
      const mockOnAddDevice = vi.fn();
      render(<Header {...mockProps} onAddDevice={mockOnAddDevice} isHouseScanned={false} />);
      
      const addButton = screen.getByRole('button', { name: /Add Device/i });
      
      expect(addButton).toBeDisabled();
      fireEvent.click(addButton); // Intenta hacer clic, pero no debería ejecutarse por estar deshabilitado
      
      expect(mockOnAddDevice).not.toHaveBeenCalled();
    });
  });
});