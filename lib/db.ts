// Simple in-memory database for development
// In production, replace this with a real database like PostgreSQL, MongoDB, etc.

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

// In-memory storage (will be reset on server restart)
const users: User[] = [
    // Add some test users for development
    {
        id: 'test_user_1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+1234567890',
        country: 'International',
        password:
            '$2b$12$p2JME4QXjjnRjfYb0GVqnOO/8RORCrm6abxYMzT0bczg9FOweVMdq', // password: test123
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'test_user_2',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+9876543210',
        country: 'India',
        password:
            '$2b$12$p2JME4QXjjnRjfYb0GVqnOO/8RORCrm6abxYMzT0bczg9FOweVMdq', // password: test123
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Initialize database with logging
console.log(
    '🗄️ Database: Initializing with',
    users.length,
    'users'
);

export const db = {
    // User operations
    users: {
        create: (
            user: Omit<
                User,
                'id' | 'createdAt' | 'updatedAt'
            >
        ) => {
            const newUser: User = {
                ...user,
                id: `user_${Date.now()}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            users.push(newUser);
            console.log(
                '✅ Database: User created successfully:',
                {
                    id: newUser.id,
                    email: newUser.email,
                    totalUsers: users.length,
                }
            );
            return newUser;
        },

        findByEmail: (email: string) => {
            console.log(
                '🔍 Database: Searching for user with email:',
                email
            );
            console.log(
                '🔍 Database: Current users count:',
                users.length
            );
            console.log(
                '🔍 Database: Available emails:',
                users.map((u) => u.email)
            );

            const user = users.find(
                (user) => user.email === email
            );

            if (user) {
                console.log('🔍 Database: User found:', {
                    id: user.id,
                    email: user.email,
                });
            } else {
                console.log(
                    '🔍 Database: User not found for email:',
                    email
                );
            }

            return user;
        },

        findById: (id: string) => {
            return users.find((user) => user.id === id);
        },

        update: (id: string, updates: Partial<User>) => {
            const index = users.findIndex(
                (user) => user.id === id
            );
            if (index !== -1) {
                users[index] = {
                    ...users[index],
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };
                return users[index];
            }
            return null;
        },

        delete: (id: string) => {
            const index = users.findIndex(
                (user) => user.id === id
            );
            if (index !== -1) {
                users.splice(index, 1);
                return true;
            }
            return false;
        },

        getAll: () => {
            return users.map((user) => {
                const {
                    password: _password,
                    ...userWithoutPassword
                } = user;
                return userWithoutPassword;
            });
        },

        // For debugging
        getRaw: () => users,

        // Get database status
        getStatus: () => ({
            totalUsers: users.length,
            userEmails: users.map((u) => u.email),
            lastUpdated: new Date().toISOString(),
        }),

        // Add test user (for development)
        addTestUser: (email: string, password: string) => {
            const testUser: User = {
                id: `test_${Date.now()}`,
                firstName: 'Test',
                lastName: 'User',
                email,
                phone: '+1234567890',
                country: 'International',
                password,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            users.push(testUser);
            console.log('🧪 Database: Test user added:', {
                email,
                totalUsers: users.length,
            });
            return testUser;
        },
    },
};
