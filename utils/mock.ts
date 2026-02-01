import { Orchard } from "../interface/orchardInterface";
import { User } from "../interface/userInterface";
import { CropOption, ServiceTypeResponse, StatusResponse } from "../interface/dropdownInterface";

import { DurianStatus, OrchardType, CropCategory } from "./enum";

export const MOCK_OWNER: User = {
	id: "owner1",
	email: "owner@durian.com",
	username: "ลุงดำ เจ้าของสวน",
};

export const MOCK_SERVICE_TYPES: ServiceTypeResponse[] = Object.values(OrchardType).map((type) => ({
	id: type,
}));

export const MOCK_STATUSES: StatusResponse[] = Object.values(DurianStatus).map((status) => ({
	id: status,
}));

export const MOCK_CROPS: CropOption[] = [
	// --- FRUITS (ผลไม้) ---
	{ id: "f01", value: "mangosteen", label: "มังคุด (Mangosteen)", category: CropCategory.FRUIT },
	{ id: "f02", value: "rambutan", label: "เงาะ (Rambutan)", category: CropCategory.FRUIT },
	{ id: "f03", value: "longan", label: "ลำไย (Longan)", category: CropCategory.FRUIT },
	{
		id: "f04",
		value: "banana_namwa",
		label: "กล้วยน้ำว้า (Namwa Banana)",
		category: CropCategory.FRUIT,
	},
	{
		id: "f05",
		value: "banana_hom",
		label: "กล้วยหอม (Cavendish Banana)",
		category: CropCategory.FRUIT,
	},
	{ id: "f06", value: "papaya", label: "มะละกอ (Papaya)", category: CropCategory.FRUIT },
	{ id: "f07", value: "mango", label: "มะม่วง (Mango)", category: CropCategory.FRUIT },
	{ id: "f08", value: "coconut", label: "มะพร้าว (Coconut)", category: CropCategory.FRUIT },
	{ id: "f09", value: "pineapple", label: "สับปะรด (Pineapple)", category: CropCategory.FRUIT },
	{ id: "f10", value: "salak", label: "สละ (Salak)", category: CropCategory.FRUIT },
	{ id: "f11", value: "longkong", label: "ลองกอง (Longkong)", category: CropCategory.FRUIT },
	{ id: "f12", value: "roseapple", label: "ชมพู่ (Rose Apple)", category: CropCategory.FRUIT },
	{
		id: "f13",
		value: "dragonFRUIT",
		label: "แก้วมังกร (Dragon FRUIT)",
		category: CropCategory.FRUIT,
	},
	{ id: "f14", value: "guava", label: "ฝรั่ง (Guava)", category: CropCategory.FRUIT },
	{ id: "f15", value: "lychee", label: "ลิ้นจี่ (Lychee)", category: CropCategory.FRUIT },
	{ id: "f16", value: "tamarind", label: "มะขาม (Tamarind)", category: CropCategory.FRUIT },
	{ id: "f17", value: "pomelo", label: "ส้มโอ (Pomelo)", category: CropCategory.FRUIT },
	{ id: "f18", value: "santol", label: "กระท้อน (Santol)", category: CropCategory.FRUIT },
	{
		id: "f19",
		value: "marian_plum",
		label: "มะยงชิด (Marian Plum)",
		category: CropCategory.FRUIT,
	},
	{ id: "f20", value: "sapodilla", label: "ละมุด (Sapodilla)", category: CropCategory.FRUIT },

	// --- VEGETABLES (ผัก) ---
	{ id: "v01", value: "chili", label: "พริก (Chili)", category: CropCategory.VEGETABLE },
	{ id: "v02", value: "corn", label: "ข้าวโพด (Corn)", category: CropCategory.VEGETABLE },
	{ id: "v03", value: "kale", label: "คะน้า (Kale)", category: CropCategory.VEGETABLE },
	{ id: "v04", value: "eggplant", label: "มะเขือ (Eggplant)", category: CropCategory.VEGETABLE },
	{ id: "v05", value: "lime", label: "มะนาว (Lime)", category: CropCategory.VEGETABLE },
	{ id: "v06", value: "cucumber", label: "แตงกวา (Cucumber)", category: CropCategory.VEGETABLE },
	{
		id: "v07",
		value: "morningglory",
		label: "ผักบุ้ง (Morning Glory)",
		category: CropCategory.VEGETABLE,
	},
	{ id: "v08", value: "cabbage", label: "กะหล่ำปลี (Cabbage)", category: CropCategory.VEGETABLE },
	{
		id: "v09",
		value: "chinese_cabbage",
		label: "ผักกาดขาว (Chinese Cabbage)",
		category: CropCategory.VEGETABLE,
	},
	{ id: "v10", value: "tomato", label: "มะเขือเทศ (Tomato)", category: CropCategory.VEGETABLE },
	{
		id: "v11",
		value: "yardlong_bean",
		label: "ถั่วฝักยาว (Yardlong Bean)",
		category: CropCategory.VEGETABLE,
	},
	{ id: "v12", value: "pumpkin", label: "ฟักทอง (Pumpkin)", category: CropCategory.VEGETABLE },
	{ id: "v13", value: "garlic", label: "กระเทียม (Garlic)", category: CropCategory.VEGETABLE },
	{ id: "v14", value: "shallot", label: "หอมแดง (Shallot)", category: CropCategory.VEGETABLE },
	{ id: "v15", value: "ginger", label: "ขิง (Ginger)", category: CropCategory.VEGETABLE },
	{
		id: "v16",
		value: "bitter_gourd",
		label: "มะระ (Bitter Gourd)",
		category: CropCategory.VEGETABLE,
	},
	{ id: "v17", value: "mushroom", label: "เห็ด (Mushroom)", category: CropCategory.VEGETABLE },
	{
		id: "v18",
		value: "broccoli",
		label: "บรอกโคลี (Broccoli)",
		category: CropCategory.VEGETABLE,
	},
	{
		id: "v19",
		value: "cauliflower",
		label: "กะหล่ำดอก (Cauliflower)",
		category: CropCategory.VEGETABLE,
	},
	{ id: "v20", value: "coriander", label: "ผักชี (Coriander)", category: CropCategory.VEGETABLE },

	// --- MIXED GARDEN / HERBS (พืชสวนผสม/สมุนไพร) ---
	// ใช้ CropCategory.Mixed หรือตามที่คุณกำหนดไว้ใน Enum
	{ id: "m01", value: "holy_basil", label: "กะเพรา (Holy Basil)", category: CropCategory.HERBS },
	{ id: "m02", value: "thai_basil", label: "โหระพา (Thai Basil)", category: CropCategory.HERBS },
	{ id: "m03", value: "lemongrass", label: "ตะไคร้ (Lemongrass)", category: CropCategory.HERBS },
	{ id: "m04", value: "galangal", label: "ข่า (Galangal)", category: CropCategory.HERBS },
	{
		id: "m05",
		value: "kaffir_lime",
		label: "มะกรูด (Kaffir Lime)",
		category: CropCategory.HERBS,
	},
	{ id: "m06", value: "turmeric", label: "ขมิ้น (Turmeric)", category: CropCategory.HERBS },
	{ id: "m07", value: "pandan", label: "ใบเตย (Pandan)", category: CropCategory.HERBS },
	{ id: "m08", value: "fingerroot", label: "กระชาย (Fingerroot)", category: CropCategory.HERBS },
	{
		id: "m09",
		value: "climbing_wattle",
		label: "ชะอม (Climbing Wattle)",
		category: CropCategory.HERBS,
	},
	{
		id: "m10",
		value: "aloe_vera",
		label: "ว่านหางจระเข้ (Aloe Vera)",
		category: CropCategory.HERBS,
	},
];

export const MOCK_ORCHARDS: Orchard[] = [
	{
		id: 1,
		name: "สวนดีมีชัย",
		description: "ทุเรียนหมอนทองแท้ อร่อย หวานมัน รับประกันคุณภาพจากสวน",
		history:
			"สวนทุเรียนลุงดำก่อตั้งขึ้นเมื่อปี พ.ศ. 2535 โดยคุณลุงดำ ผู้มีความรักในการปลูกทุเรียน เริ่มต้นจากพื้นที่เพียง 10 ไร่ ปัจจุบันขยายเป็น 50 ไร่ ด้วยความใส่ใจในการดูแลแบบเกษตรอินทรีย์ ทำให้ได้ผลผลิตที่มีคุณภาพและรสชาติเป็นเอกลักษณ์",
		types: [OrchardType.SELL, OrchardType.TOUR, OrchardType.STAY],
		status: DurianStatus.AVAILABLE,
		lat: 13.123,
		lng: 101.456,
		ownerId: "owner1",
		address:
			"268 ตึก CU I House ห้อง 1440 จุฬาลงกรณ์ ซอย 9 ถนนจรัสเมือง แขวงวังใหม่ เขตปทุมวัน จังหวัดกรุงเทพฯ 10330 ",
		additionalCrops: ["f01", "f02", "v01", "v03", "m01"],
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
