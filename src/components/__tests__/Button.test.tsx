import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('debería renderizar el texto del botón', () => {
    render(<Button>Haz clic aquí</Button>);
    
    expect(screen.getByText('Haz clic aquí')).toBeInTheDocument();
  });

  it('debería ejecutar onClick cuando se hace clic', () => {
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería estar deshabilitado cuando disabled es true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  it('debería aplicar clases CSS correctamente', () => {
    render(<Button className="custom-class">Styled Button</Button>);
    
    const button = screen.getByText('Styled Button');
    expect(button).toHaveClass('custom-class');
  });
});
