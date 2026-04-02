import React, { useState } from "react";
import { User, Sprout } from "lucide-react";

import ManageProfileTab from "@/pages/profile/tabs/ManageProfileTab";
import ManageOrchardsTab from "@/pages/profile/tabs/ManageOrchardsTab";
import TabButton from "@/components/TabButton";

type ProfileTab = "profile" | "orchards";

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

	return (
		<div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="scrollbar-hide mb-8 flex space-x-2 overflow-x-auto pb-2">
					<TabButton<ProfileTab>
						activeTab={activeTab}
						icon={User}
						id="profile"
						label="ข้อมูลส่วนตัว"
						setActiveTab={setActiveTab}
					/>
					<TabButton<ProfileTab>
						activeTab={activeTab}
						icon={Sprout}
						id="orchards"
						label="ระบบจัดการสวน"
						setActiveTab={setActiveTab}
					/>
				</div>

				<div className="mt-6">
					{activeTab === "profile" && <ManageProfileTab />}
					{activeTab === "orchards" && <ManageOrchardsTab />}
				</div>
			</div>
		</div>
	);
}
