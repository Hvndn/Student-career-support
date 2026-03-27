import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../../../pages/student/Profile';
import { studentApi } from '../../../api';
import { vi } from 'vitest';

vi.mock('../../../api', () => ({
    studentApi: {
        getProfile: vi.fn(),
    },
}));

vi.mock('react-quill-new', () => {
    return {
        default: () => <div data-testid="react-quill">Mocked React Quill</div>
    };
});

describe('Student Profile Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockProfile = {
        fullName: 'Nguyen Van A',
        major: 'Software Engineering',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        address: 'Hanoi',
        bio: '<p>My career goal</p>',
        educations: [],
        experiences: [],
        projects: [],
        skills: [],
        certifications: [],
        languages: [],
        activities: [],
        gpa: 3.8,
        totalCredits: 150,
        earnedCredits: 120,
    };

    test('should show loading initially and then render profile data', async () => {
        studentApi.getProfile.mockResolvedValueOnce({
            data: { status: 'success', data: mockProfile }
        });

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        // Ban đầu phải có chữ "Đang tải"
        expect(screen.getByText('Đang tải hồ sơ...')).toBeInTheDocument();

        // Đợi api call xong và render data
        await waitFor(() => {
            expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
        });

        expect(screen.getByText('Software Engineering')).toBeInTheDocument();
        expect(screen.getByText('nguyenvana@example.com')).toBeInTheDocument();
        expect(screen.getByText(/3.8 \/ 4.0/i)).toBeInTheDocument();
    });

    test('should show error if profile not found', async () => {
        studentApi.getProfile.mockRejectedValueOnce(new Error('Network error'));

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Không tìm thấy hồ sơ!')).toBeInTheDocument();
        });
    });
});
