import type { UserRole } from "@/utils/enum";

export interface User {
	id: string;
	username?: string;
	email: string;
	name?: string;
	role?: typeof UserRole;
	is_active?: boolean;
}
