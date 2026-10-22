// Nguồn ảnh dùng trong video 1. Chỉ dùng ảnh public domain hoặc CC trên Wikimedia Commons.
export type Credit = {author: string; license: string; file: string};

export const CREDITS: Record<string, Credit> = {
	genghis: {author: 'Album chân dung hoàng đế nhà Nguyên, Bảo tàng Cố cung Đài Bắc', license: 'Public domain', file: 'YuanEmperorAlbumGenghisPortrait (cropped).jpg'},
	kublai: {author: 'Araniko (được cho là), Bảo tàng Cố cung Đài Bắc', license: 'Public domain', file: 'YuanEmperorAlbumKhubilaiPortrait.jpg'},
	kublai_full: {author: 'Album chân dung hoàng đế nhà Nguyên, Bảo tàng Cố cung Đài Bắc', license: 'Public domain', file: 'YuanEmperorAlbumKhubilaiFull.jpg'},
	baghdad: {author: 'Khuyết danh, bản chép tay thế kỷ 15', license: 'Public domain', file: 'Mongol Conquest of Baghdad.jpg'},
	mongol_china1211: {author: 'Sayf al-Vâhidî, Herat, khoảng 1430', license: 'Public domain', file: 'Bataille entre mongols & chinois (1211).jpeg'},
	mongol_valiyan: {author: 'Sayf al-Vâhidî, Herat, khoảng 1430', license: 'Public domain', file: 'Bataille de vâliyân (1221).jpeg'},
	qingming: {author: 'Trương Trạch Đoan (Zhang Zeduan)', license: 'Public domain', file: 'Along the River During the Qingming Festival (detail of original).jpg'},
	moko1: {author: 'Mōko Shūrai Ekotoba, khoảng 1293', license: 'Public domain', file: 'Mōko Shūrai Ekotoba.jpg'},
	moko_boarding: {author: 'Mōko Shūrai Ekotoba, khoảng 1293', license: 'Public domain', file: 'Mōko Shūrai Ekotoba, Scroll 2, Detail Boarding.jpg'},
	moko_mitsui: {author: 'Tosa Nagataka chép lại Mōko Shūrai Ekotoba', license: 'Public domain', file: 'Mōko Shūrai Ekotoba Mongol Invasion Mitsui Sukenaga.jpg'},
	kikuchi: {author: 'Kikuchi Yōsai, 1847, Bảo tàng Quốc gia Tokyo', license: 'Public domain', file: 'Kikuchi Yoosai - Mongol Invasion (mōko shūrai) - Tokyo National Museum.jpg'},
	stakes3: {author: 'Bình Giang', license: 'Public domain', file: 'Cọc nhọn Bạch Đằng 1288.JPG'},
	thd_temple: {author: 'Gary Todd', license: 'CC0', file: 'Tran Hung Dao Temple (9982025783).jpg'},
	kiepbac: {author: 'Handyhuy', license: 'CC BY 3.0', file: 'Den kiep bac.jpg'},
	kiepbac1904: {author: 'André Salles', license: 'Public domain', file: 'Kiếp Bạc temple in 1904.jpg'},
	tran_brick: {author: 'Gary Todd', license: 'CC0', file: 'Tran Dynasty Ceramic Brick (9980668973).jpg'},
	tran_lion: {author: 'Gary Todd', license: 'CC0', file: 'Tran Dynasty Stone Lion (9980684273).jpg'},
	tran_cer1: {author: 'Gary Todd', license: 'CC0', file: 'Tran Dynasty Ceramics (9980542605).jpg'},
	tran_cer2: {author: 'Gary Todd', license: 'CC0', file: 'Tran Dynasty Ceramics (9980558364).jpg'},
};
