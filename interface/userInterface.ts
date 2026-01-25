import { UserRole } from "../utils/enum";

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
}
