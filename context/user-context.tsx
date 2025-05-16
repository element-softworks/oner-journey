'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
	name: string;
	email: string;
}

interface UserContextType {
	userData: UserData;
	updateName: (name: string) => void;
	updateEmail: (email: string) => void;
}

const initialUserData: UserData = {
	name: '',
	email: '',
};

const UserContext = createContext<UserContextType>({
	userData: initialUserData,
	updateName: () => {},
	updateEmail: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
	const [userData, setUserData] = useState<UserData>(initialUserData);

	const updateName = (name: string) => {
		setUserData((prev) => ({ ...prev, name }));
	};

	const updateEmail = (email: string) => {
		setUserData((prev) => ({ ...prev, email }));
	};

	return (
		<UserContext.Provider value={{ userData, updateName, updateEmail }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	return context;
}
