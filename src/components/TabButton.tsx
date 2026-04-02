import React from "react";

import { Button } from "@/components/Button";

interface TabButtonProps<T extends string> {
	id: T;
	label: string;
	icon: React.ElementType;
	activeTab: T;
	setActiveTab: (id: T) => void;
}

export default function TabButton<T extends string>({
	id,
	label,
	icon: Icon,
	activeTab,
	setActiveTab,
}: TabButtonProps<T>) {
	return (
		<Button
			className="px-4!"
			size="lg"
			type="button"
			variant={activeTab === id ? "secondary" : "outline"}
			onClick={() => setActiveTab(id)}
		>
			<Icon size={18} />
			{activeTab === id ? <span>{label}</span> : null}
		</Button>
	);
}
