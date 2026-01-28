import { Orchard } from "../interface/orchardInterface";
import { User } from "../interface/userInterface";
import { ServiceTypeResponse, StatusResponse, CropOption } from "../interface/dropdownInterface";

import { DurianStatus, OrchardType, UserRole, CropCategory } from "./enum";

export const MOCK_OWNER: User = {
	id: "owner1",
	email: "owner@durian.com",
	name: "ลุงดำ เจ้าของสวน",
	role: UserRole.Owner,
};

export const MOCK_SERVICE_TYPES: ServiceTypeResponse[] = Object.values(OrchardType).map((type) => ({
	id: type,
}));

export const MOCK_STATUSES: StatusResponse[] = Object.values(DurianStatus).map((status) => ({
	id: status,
}));

export const MOCK_CROPS: CropOption[] = [
	{ id: "mangosteen", label: "มังคุด (Mangosteen)", category: CropCategory.Fruit },
	{ id: "rambutan", label: "เงาะ (Rambutan)", category: CropCategory.Fruit },
	{ id: "longan", label: "ลำไย (Longan)", category: CropCategory.Fruit },
	{ id: "banana", label: "กล้วย (Banana)", category: CropCategory.Fruit },
	{ id: "papaya", label: "มะละกอ (Papaya)", category: CropCategory.Fruit },
	{ id: "chili", label: "พริก (Chili)", category: CropCategory.Vegetable },
	{ id: "corn", label: "ข้าวโพด (Corn)", category: CropCategory.Vegetable },
	{ id: "kale", label: "คะน้า (Kale)", category: CropCategory.Vegetable },
	{ id: "eggplant", label: "มะเขือ (Eggplant)", category: CropCategory.Vegetable },
];

export const MOCK_ORCHARDS: Orchard[] = [
	// Eastern (Existing)
	{
		id: 1,
		name: "สวนดีมีชัย",
		description: "ทุเรียนหมอนทองแท้ อร่อย หวานมัน รับประกันคุณภาพจากสวน",
		history:
			"สวนทุเรียนลุงดำก่อตั้งขึ้นเมื่อปี พ.ศ. 2535 โดยคุณลุงดำ ผู้มีความรักในการปลูกทุเรียน เริ่มต้นจากพื้นที่เพียง 10 ไร่ ปัจจุบันขยายเป็น 50 ไร่ ด้วยความใส่ใจในการดูแลแบบเกษตรอินทรีย์ ทำให้ได้ผลผลิตที่มีคุณภาพและรสชาติเป็นเอกลักษณ์",
		types: [OrchardType.Sell, OrchardType.Tour, OrchardType.Cafe, OrchardType.Stay],
		status: DurianStatus.Available,
		lat: 13.123,
		lng: 101.456,
		ownerId: "owner1",
		address:
			"268 ตึก CU I House ห้อง 1440 จุฬาลงกรณ์ ซอย 9 ถนนจรัสเมือง แขวงวังใหม่ เขตปทุมวัน จังหวัดกรุงเทพฯ 10330 ",
		isMixedAgro: true,
		additionalCrops: ["mangosteen", "rambutan"],
		socialMedia: {
			facebook: "https://facebook.com/thejing.jerry",
			instagram: "https://instagram.com/thejing.jerry",
			line: "https://line.me/ti/p/~jing.jerry",
			tiktok: "https://www.tiktok.com/@_j.ksd_",
			youtube: "https://www.youtube.com/@kritsadalimsripraphan788",
		},
		images: [
			"https://picsum.photos/400/300?random=1",
			"https://picsum.photos/400/300?random=11",
			"https://picsum.photos/400/300?random=21",
			"https://picsum.photos/400/300?random=31",
			"https://picsum.photos/400/300?random=41",
			"https://picsum.photos/400/300?random=51",
			"https://picsum.photos/400/300?random=61",
			"https://picsum.photos/400/300?random=71",
			"https://picsum.photos/400/300?random=81",
			"https://picsum.photos/400/300?random=91",
			"https://picsum.photos/400/300?random=101",
			"https://picsum.photos/400/300?random=111",
			"https://picsum.photos/400/300?random=121",
			"https://picsum.photos/400/300?random=131",
			"https://picsum.photos/400/300?random=141",
			"https://picsum.photos/400/300?random=151",
		],
		videos: [
			"https://youtu.be/IAMyWV6Fo6c?si=NU71SdfYXyy9eY9g",
			"https://youtu.be/ZGgFzQXfvmY?si=yfzec32taKKH_a3J",
			"https://youtu.be/2_vIml6LTAw?si=zxgSmv8SsW923Die",
		],
		hasPackage: true,
		packages: [
			{
				id: "pkg1",
				name: "บุฟเฟต์ทุเรียน อิ่มไม่อั้น",
				price: 399,
				duration: 2,
				includes:
					"ทานทุเรียนหมอนทอง, ชะนี, ก้านยาว ได้ไม่อั้น พร้อมผลไม้ตามฤดูกาลอื่นๆ น้ำดื่มสมุนไพรฟรี",
				startDate: "2024-04-01",
				endDate: "2024-06-30",
				images: ["https://picsum.photos/400/300?random=101"],
			},
			{
				id: "pkg2",
				name: "บุฟเฟต์ทุเรียน",
				price: 299,
				duration: 4,
				includes:
					"ทานทุเรียนหมอนทอง, ชะนี, ก้านยาว ได้ไม่อั้น พร้อมผลไม้ตามฤดูกาลอื่นๆ น้ำดื่มสมุนไพรฟรี",
				startDate: "2025-04-01",
				endDate: "2025-06-30",
				images: ["https://picsum.photos/400/300?random=101"],
			},
		],
		hasAccommodation: true,
		accommodations: [
			{
				id: "acc1",
				name: "บ้านพักริมคลอง (2 ท่าน)",
				price: 1200,
				quantity: 3,
				images: ["https://picsum.photos/400/300?random=22"],
			},
			{
				id: "acc2",
				name: "บ้านครอบครัวใหญ่ (6 ท่าน)",
				price: 3500,
				quantity: 1,
				images: ["https://picsum.photos/400/300?random=23"],
			},
		],
	},
];
