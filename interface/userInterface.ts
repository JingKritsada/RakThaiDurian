import { UserRole } from "../utils/enum";

export interface User {
	id: string;
	username?: string;
	email: string;
	name?: string;
	role?: UserRole;
	is_active?: boolean;
}
