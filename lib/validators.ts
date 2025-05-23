export function validateName(name: string): boolean {
	return name.trim().length >= 2;
}

export function validateLastName(lastName: string): boolean {
	return lastName.trim().length >= 2;
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
