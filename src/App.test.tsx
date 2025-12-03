import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';
// Usamos el alias '@/App' que configuramos en vitest.config.ts
import App from '@/App'; 

// ------------------------------------------
// 1. MOCK DE COMPONENTES NECESARIOS
// ------------------------------------------

// Requerido: Mock de HouseScanner (para que la App cargue el contenido principal)
vi.mock('@/features/home/components/HouseScanner', () => ({
    HouseScanner: ({ onScanComplete }: { onScanComplete: () => void }) => {
        React.useEffect(() => {
            onScanComplete(); 
        }, [onScanComplete]);
        return null;
    },
}));

// ------------------------------------------
// 2. MOCK DEL CONTEXTO (Solución definitiva para el Hoisting)
// La factoría de mock es una función autocontenida que devuelve el stub.
// ------------------------------------------
vi.mock('@/context/DeviceContext', () => ({
    useDevices: vi.fn(() => ({
        // Propiedades mínimas para evitar errores de desestructuración
        devices: [],
        selectedDevice: null,
        homeLayout: { rooms: [] }, 
        loading: false,
        error: null,
        
        // Funciones stubbed para evitar errores de desestructuración en App.tsx
        addDevice: vi.fn(),
        updateDevice: vi.fn(),
        deleteDevice: vi.fn(),
        selectDevice: vi.fn(),
        filterDevices: vi.fn(() => []),
        playSound: vi.fn(),
        isSounding: {},
        refreshDevices: vi.fn(),
    })),
    DeviceProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));


// ------------------------------------------
// 3. TEST SUITE SIMPLE
// ------------------------------------------

describe('App Component - Renderización Básica Segura', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar la cabecera principal y el título de la vista en estado exitoso', () => {
        render(<App />);
        
        // 1. Verifica el título de la cabecera
        expect(screen.getByText('Kaxanly')).toBeInTheDocument();
        
        // 2. Verifica el título de la sección principal (usando getByRole para evitar ambigüedad)
        const mainTitle = screen.getByRole('heading', { name: 'All Devices' });
        expect(mainTitle).toBeInTheDocument();
        
        // 3. Verifica que el estado de carga o error NO se muestra
        expect(screen.queryByText(/Loading devices.../i)).not.toBeInTheDocument();
    });
});