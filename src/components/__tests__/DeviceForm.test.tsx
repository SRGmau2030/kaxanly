import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeviceForm from '../devices/DeviceForm';
import { Device, DeviceType } from '../../types';

// Mockeamos el hook useDevices, ya que DeviceForm lo utiliza para obtener el homeLayout
// y generar coordenadas de ubicación.
const mockHomeLayout = {
  id: 'home-1',
  name: 'My Home',
  // Proporcionamos al menos una habitación para que la lógica de ubicación aleatoria no falle
  rooms: [{ id: 'living-room', name: 'Living Room', floor: 1, width: 100, height: 100, x: 0, y: 0 }],
};

vi.mock('../../context/DeviceContext', () => ({
  useDevices: vi.fn(() => ({
    devices: [],
    selectedDevice: null,
    homeLayout: mockHomeLayout, // Se proporciona el layout mockeado
    selectDevice: vi.fn(),
  })),
}));

describe('DeviceForm - Add Mode (Creación)', () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el título "Add New Device" y el botón de envío "Add Device"', () => {
    render(<DeviceForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    expect(screen.getByRole('heading', { name: /Add New Device/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Device/i })).toBeInTheDocument();
  });

  it('debe actualizar el campo Device Name correctamente', async () => {
    render(<DeviceForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    // Consulta corregida: El label en el componente es "Device Name"
    const nameInput = screen.getByLabelText(/Device Name/i);
    const testName = 'Mi Nuevo Sensor';

    await user.type(nameInput, testName);
    
    // Verifica que el valor del input se actualiza
    expect(nameInput).toHaveValue(testName);
    
    // Verifica que el elemento de aserción incorrecto NO existe
    expect(screen.queryByText(/Entrada actual/i)).not.toBeInTheDocument();
  });
  
  it('debe enviar el formulario con los datos de dispositivo válidos', async () => {
    render(<DeviceForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    const nameInput = screen.getByLabelText(/Device Name/i);
    const typeSelect = screen.getByLabelText(/Device Type/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const submitButton = screen.getByRole('button', { name: /Add Device/i });

    // 1. Rellenar el formulario
    await user.type(nameInput, 'Mi Nuevo Teléfono');
    fireEvent.change(typeSelect, { target: { value: 'phone' as DeviceType } });
    fireEvent.change(statusSelect, { target: { value: 'online' } });

    // 2. Enviar
    await user.click(submitButton);

    // 3. Verificar la llamada y los datos
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    
    const submittedData = mockOnSubmit.mock.calls[0][0];
    
    expect(submittedData.name).toBe('Mi Nuevo Teléfono');
    expect(submittedData.type).toBe('phone');
    expect(submittedData.status).toBe('online');
    // Verifica que se generaron los campos requeridos por el tipo `Omit<Device, 'id'>`
    expect(submittedData).toHaveProperty('location');
    expect(submittedData).toHaveProperty('battery');
    expect(submittedData).toHaveProperty('icon', 'Smartphone');
  });

  it('debe llamar a onClose al hacer clic en el botón de cerrar', async () => {
    render(<DeviceForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    
    // El botón de cerrar usa aria-label="Close"
    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

// --- Separador de Funcionalidad ---

describe('DeviceForm - Edit Mode (Edición)', () => {
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();
  
  // Datos de un dispositivo para simular la edición
  const mockEditDevice: Device = {
    id: 'test-id-123',
    name: 'Old Device Name',
    type: 'laptop',
    location: { roomId: 'office', x: 100, y: 50 },
    status: 'offline',
    battery: 100,
    lastSeen: new Date(),
    icon: 'Laptop',
    color: '#8B5CF6',
  };
  
  const user = userEvent.setup();

  it('debe renderizar el título "Edit Device" y el botón de envío "Update Device"', () => {
    render(
      <DeviceForm 
        onSubmit={mockOnSubmit} 
        onClose={mockOnClose} 
        editDevice={mockEditDevice} 
      />
    );
    
    expect(screen.getByRole('heading', { name: /Edit Device/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Device/i })).toBeInTheDocument();
  });
  
  it('debe precargar los valores del dispositivo a editar', () => {
    render(
      <DeviceForm 
        onSubmit={mockOnSubmit} 
        onClose={mockOnClose} 
        editDevice={mockEditDevice} 
      />
    );
    
    // Verificar que los inputs están precargados con los valores del mock
    expect(screen.getByLabelText(/Device Name/i)).toHaveValue('Old Device Name');
    expect(screen.getByLabelText(/Device Type/i)).toHaveValue('laptop');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('offline');
  });

  it('debe enviar el formulario con los valores actualizados', async () => {
    render(
      <DeviceForm 
        onSubmit={mockOnSubmit} 
        onClose={mockOnClose} 
        editDevice={mockEditDevice} 
      />
    );
    
    const nameInput = screen.getByLabelText(/Device Name/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const submitButton = screen.getByRole('button', { name: /Update Device/i });

    // 1. Actualizar campos
    await user.clear(nameInput);
    await user.type(nameInput, 'New Name for Laptop');
    fireEvent.change(statusSelect, { target: { value: 'online' } });

    // 2. Enviar
    await user.click(submitButton);

    // 3. Verificar que onSubmit fue llamado y contiene los valores actualizados
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    
    const submittedData = mockOnSubmit.mock.calls[0][0];
    
    expect(submittedData.name).toBe('New Name for Laptop');
    expect(submittedData.status).toBe('online');
    
    // Se mantiene el tipo y la ubicación original del dispositivo editado (comportamiento del hook useEffect)
    expect(submittedData.type).toBe(mockEditDevice.type); 
    expect(submittedData.location).toEqual(mockEditDevice.location);
  });
});