import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('should render footer with current year on normal pages', () => {
        render(
            <MemoryRouter initialEntries={['/jobs']}>
                <Footer />
            </MemoryRouter>
        );
        const year = new Date().getFullYear();
        expect(screen.getByText(new RegExp(year.toString(), 'i'))).toBeInTheDocument();
        expect(screen.getByText(/Nexus Talent|JobPortal/i)).toBeInTheDocument();
        expect(screen.getByText('Ứng viên')).toBeInTheDocument();
    });

    test('should not render on /login page', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/login']}>
                <Footer />
            </MemoryRouter>
        );
        expect(container).toBeEmptyDOMElement();
    });

    test('should not render on student profile page', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/student/profile']}>
                <Footer />
            </MemoryRouter>
        );
        expect(container).toBeEmptyDOMElement();
    });
});
