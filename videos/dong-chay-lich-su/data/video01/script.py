# -*- coding: utf-8 -*-
"""Kịch bản video 1: Vì sao đế chế Mông Cổ 3 lần thất bại ở Đại Việt?

Mỗi đoạn (segment) gồm lời đọc và hình minh họa. Chạy file này để xuất segments.json.
Nguồn kiểm chứng chính: Đại Việt sử ký toàn thư (bản dịch Viện KHXH, ghi tắt "Toàn thư"),
Wikipedia tiếng Anh "Mongol invasions of Vietnam", "Mongol invasion of Java",
Wikipedia tiếng Việt "Trận Bạch Đằng (1288)", báo chí về khảo cổ bãi cọc. Xem sources.md.
"""
import json, os

S = []


def seg(text, visual, pause=0.35):
    S.append({"text": text.strip(), "visual": visual, "pause": pause})


def title(kicker, t, sub=""):
    return {"type": "title", "kicker": kicker, "title": t, "sub": sub}


def img(src, caption, kb="in", focus=(0.5, 0.5), tag="Tư liệu"):
    return {"type": "image", "src": src, "caption": caption, "kb": kb, "focus": list(focus), "tag": tag}


def mp(view, frm=None, regions=(), arrows=(), markers=(), labels=(), note=True, year=None, rivers=True):
    return {"type": "map", "view": view, "from": frm or view, "regions": list(regions), "arrows": list(arrows),
            "markers": list(markers), "labels": list(labels), "note": note, "year": year, "rivers": rivers}


def arrow(path, color="mongol", dashed=False):
    return {"path": path, "color": color, "dashed": dashed}


def quote(text, who, src="Đại Việt sử ký toàn thư"):
    return {"type": "quote", "text": text, "who": who, "src": src}


def timeline(active, items=None):
    items = items or [["1258", "Lần thứ nhất"], ["1285", "Lần thứ hai"], ["1288", "Lần thứ ba"]]
    return {"type": "timeline", "items": items, "active": active}


def fact(big, text, sub=""):
    return {"type": "fact", "big": big, "text": text, "sub": sub}


def cards(items, active, heading=""):
    return {"type": "cards", "items": items, "active": active, "heading": heading}


REASONS = [
    ["1", "Bỏ thành, giữ quân"],
    ["2", "Đánh vào đường lương"],
    ["3", "Biến thiên nhiên thành vũ khí"],
]

# ───────────────────────── MỞ ĐẦU ─────────────────────────
seg("Thế kỷ mười ba, có một đế chế khiến cả thế giới run sợ.",
    mp("world", regions=["mongol_1259"], year="Thế kỷ 13"))
seg("Từ thảo nguyên Mông Cổ, vó ngựa của họ tràn tới tận Ba Lan và Hungary, xóa sổ nhà Kim ở phương Bắc, "
    "và từng bước dồn ép nhà Tống giàu có nhất phương Đông.",
    mp("world", regions=["mongol_1259"], arrows=[arrow("karakorum>poland"), arrow("karakorum>zhongdu"), arrow("karakorum>baghdad")]))
seg("Đầu năm 1258, quân Mông Cổ phá thành Baghdad, kinh đô của nhà Abbas gần năm thế kỷ.",
    img("baghdad", "Quân Mông Cổ vây Baghdad, tranh minh họa trong một bản chép tay thế kỷ 15", kb="in", focus=(0.5, 0.4)))
seg("Cũng chính trong những tuần đó, ở tận phương Nam, một đạo quân Mông Cổ khác đã tiến vào một vương quốc nhỏ tên là Đại Việt.",
    mp("eastasia", frm="world", markers=["thanglong"], arrows=[arrow("kunming>thanglong")]))
seg("Vương quốc ấy đã ba lần đối đầu với đế chế này: năm 1258, năm 1285 và năm 1288.", timeline(-1))
seg("Ba lần kinh thành Thăng Long bị bỏ trống. Ba lần kẻ xâm lược tưởng như đã thắng. Và cả ba lần, họ không thể ở lại.",
    timeline(2))
seg("Đại Việt đã làm điều đó bằng cách nào? Vì sao đế chế từng khuất phục cả một vùng Á Âu rộng lớn lại không khuất phục được mảnh đất này?",
    img("bachdang_art", "Trận Bạch Đằng 1288, tranh minh họa do kênh tự vẽ", kb="in", focus=(0.62, 0.55), tag="Minh họa"))
seg("Đây là Dòng Chảy Lịch Sử. Hôm nay, chúng ta sẽ đi từ năm 1258 cho đến tận ngày nay, bám theo những gì sử sách còn ghi lại.",
    {"type": "brand"}, pause=0.6)

# ───────────────────────── CHƯƠNG 1: HAI THẾ GIỚI ─────────────────────────
seg("Để hiểu cuộc chiến này, hãy lùi lại vài chục năm.", title("Chương 1", "Hai thế giới", "Thảo nguyên và đồng bằng sông Hồng"))
seg("Năm 1206, Thiết Mộc Chân thống nhất các bộ lạc trên thảo nguyên và được tôn làm Thành Cát Tư Hãn.",
    img("genghis", "Chân dung Thành Cát Tư Hãn, album hoàng đế nhà Nguyên, thế kỷ 14", kb="in", focus=(0.5, 0.35)))
seg("Trong vài chục năm sau đó, quân Mông Cổ đánh xuống Trung Á, sang Ba Tư, lên nước Nga rồi tới tận Ba Lan và Hungary.",
    mp("world", regions=["mongol_1259"], arrows=[arrow("karakorum>samarkand"), arrow("samarkand>baghdad"), arrow("karakorum>kyiv"), arrow("kyiv>poland")]))
seg("Họ có đội kỵ binh cơ động bậc nhất thời đó, có thợ công thành giỏi, và một hệ thống trạm ngựa nối liền hàng nghìn dặm.",
    img("mongol_china1211", "Kỵ binh Mông Cổ giao chiến, tranh minh họa sách sử Ba Tư, thế kỷ 15", kb="left"))
seg("Cùng thời gian đó, ở phương Nam, năm 1226, nhà Trần thay nhà Lý, mở ra một triều đại mới ở Đại Việt.",
    mp("region", frm="eastasia", regions=["daiviet", "champa", "song", "dali"], markers=["thanglong"]))
seg("Đại Việt khi ấy gồm đồng bằng sông Hồng và dải đất ven biển kéo vào tới khoảng Quảng Bình, Quảng Trị ngày nay. Kinh đô là Thăng Long, chính là Hà Nội bây giờ.",
    mp("daiviet", frm="region", regions=["daiviet", "champa"], markers=["thanglong"]))
seg("Phía nam là vương quốc Chăm Pa. Phía bắc là nhà Tống, một đế quốc giàu có nhưng đang bị Mông Cổ dồn ép từng bước.",
    img("qingming", "Thanh Minh thượng hà đồ, tranh thời Tống của Trương Trạch Đoan (chi tiết)", kb="right", focus=(0.5, 0.5)))
seg("Và đây là điểm mấu chốt. Muốn nuốt trọn nhà Tống, Mông Cổ cần mở thêm một mũi tấn công từ phía tây nam.",
    mp("eastasia", frm="region", regions=["mongol_1259", "song", "dali"], arrows=[arrow("karakorum>chengdu"), arrow("chengdu>dali")]))
seg("Năm 1253, họ đánh chiếm vương quốc Đại Lý ở Vân Nam. Từ đó, biên giới của đế chế chạm thẳng vào Đại Việt.",
    mp("region", frm="eastasia", regions=["mongol_1259", "song", "daiviet", "champa"], markers=["dali", "kunming", "thanglong"]))
seg("Đại Việt bỗng nằm đúng trên con đường vòng mà quân Mông Cổ muốn đi, để đánh vào sau lưng nhà Tống.",
    mp("region", regions=["mongol_1259", "song", "daiviet", "champa"], arrows=[arrow("kunming>thanglong"), arrow("thanglong>guangxi")], markers=["thanglong"]), pause=0.6)

# ───────────────────────── CHƯƠNG 2: LẦN THỨ NHẤT 1258 ─────────────────────────
seg("Lần thứ nhất. Năm 1258.", title("Chương 2", "Lần thứ nhất", "1258"))
seg("Mùa thu năm 1257, sứ giả Mông Cổ từ Vân Nam đến Thăng Long, đòi Đại Việt quy phục và mở đường cho quân Mông Cổ đi đánh Tống.",
    mp("region", regions=["mongol_1259", "song", "daiviet"], arrows=[arrow("kunming>thanglong", color="neutral", dashed=True)], markers=["kunming", "thanglong"], year="1257"))
seg("Vua Trần Thái Tông không chấp nhận. Sứ giả bị bắt giam, triều đình ra lệnh giữ biên giới và truyền cho cả nước sắm sửa vũ khí.",
    img("tran_brick", "Gạch trang trí thời Trần", kb="in"))
seg("Toàn thư chép rằng quân giữ biên giới khi ấy đặt dưới sự tiết chế của Trần Quốc Tuấn, người ba mươi năm sau sẽ khiến cả triều Nguyên phải kiêng dè.",
    img("thd_temple", "Tượng Trần Hưng Đạo tại đền thờ ở Thành phố Hồ Chí Minh", kb="in", focus=(0.5, 0.35)))
seg("Tháng Chạp năm Đinh Tỵ, tức tháng 1 năm 1258, tướng Ngột Lương Hợp Thai, con trai danh tướng Tốc Bất Đài, dẫn quân từ Vân Nam tràn xuống Bình Lệ Nguyên, thuộc vùng Vĩnh Phúc ngày nay.",
    mp("daiviet", frm="region", regions=["daiviet"], arrows=[arrow("kunming>binhle")], markers=["binhle", "thanglong"], year="1258"))
seg("Quân số đạo quân này đến nay vẫn còn tranh cãi. Có học giả ước chỉ khoảng ba nghìn kỵ binh Mông Cổ cùng một vạn quân người Di ở Vân Nam. Sử Việt thì chép con số lớn hơn nhiều.",
    fact("3.000 – 30.000+", "Ước tính quân Mông Cổ năm 1258 rất khác nhau", "Học giả phương Tây ước thấp; sử Việt chép cao hơn"))
seg("Vua Trần Thái Tông đích thân đốc chiến, xông pha giữa làn tên đạn. Theo sử liệu phía Nguyên, quân Trần còn dùng cả voi chiến.",
    img("mongol_valiyan", "Trận đánh của quân Mông Cổ, tranh minh họa sách sử Ba Tư, thế kỷ 15", kb="right"))
seg("Tướng Mông Cổ ra lệnh bắn tên vào chân voi. Voi hoảng loạn quay đầu, đội hình quân Trần rối loạn.",
    img("mongol_china1211", "Kỵ binh và cung thủ Mông Cổ, tranh minh họa thế kỷ 15", kb="in", focus=(0.3, 0.5)))
seg("Giữa trận, võ tướng Lê Phụ Trần một mình một ngựa ra vào trận giặc, rồi khuyên vua tạm lánh. Khi quân giặc bắn loạn xạ, ông lấy ván thuyền che tên cho vua.",
    quote("Nay thì bệ hạ chỉ đánh một ván dốc túi thôi! Hãy nên tạm lánh chúng.", "Lê Phụ Trần can vua, năm 1258"))
seg("Quân Trần lui về giữ sông Thiên Mạc. Vua ghé thuyền hỏi kế Thái úy Trần Nhật Hiệu. Nhật Hiệu không nói gì, chỉ lấy ngón tay chấm nước, viết lên mạn thuyền hai chữ: nhập Tống, nghĩa là chạy sang nước Tống nương nhờ.",
    {"type": "word", "big": "入宋", "small": "“Nhập Tống” – chạy sang nước Tống", "src": "Theo Đại Việt sử ký toàn thư"})
seg("Vua lại đến hỏi Thái sư Trần Thủ Độ. Câu trả lời đã đi vào sử sách.",
    img("tran_lion", "Sư tử đá thời Trần", kb="in"))
seg("Đầu thần chưa rơi xuống đất, bệ hạ đừng lo gì khác.",
    quote("Đầu thần chưa rơi xuống đất, bệ hạ đừng lo gì khác.", "Thái sư Trần Thủ Độ, năm 1258"), pause=0.7)
seg("Quân Mông Cổ tiến vào Thăng Long. Họ tìm thấy các sứ giả của mình trong ngục, một người đã chết. Theo sử liệu phía Nguyên, quân Mông Cổ đã trả thù bằng cách tàn sát cư dân trong thành.",
    mp("delta", frm="daiviet", regions=["daiviet"], arrows=[arrow("binhle>thanglong")], markers=["thanglong"], year="1/1258"))
seg("Nhưng chiếm được kinh thành không có nghĩa là chiếm được đất nước. Chưa đầy mười ngày sau, quân Mông Cổ đã rời Thăng Long.",
    mp("delta", regions=["daiviet"], markers=["thanglong"], arrows=[arrow("thanglong>binhle", color="mongol", dashed=True)]))
seg("Toàn thư chép rằng ngày 24 tháng Chạp, vua và thái tử ngự lâu thuyền tiến đến Đông Bộ Đầu, đánh tan quân giặc. Trên đường rút, quân Mông Cổ còn bị chủ trại Quy Hóa là Hà Bổng dẫn dân binh miền núi chặn đánh.",
    mp("daiviet", frm="delta", regions=["daiviet"], markers=["dongbodau", "quyhoa"], arrows=[arrow("thanglong>quyhoa", color="mongol", dashed=True), arrow("thienmac>dongbodau", color="viet")]))
seg("Vì cánh quân ấy rút đi mà không có ý chiếm đất, người đương thời gọi họ là giặc Phật.",
    {"type": "word", "big": "Giặc Phật", "small": "Cách gọi của người đương thời, theo Toàn thư", "src": "Đại Việt sử ký toàn thư"})
seg("Có một góc nhìn khác ít được kể. Nhiều nhà nghiên cứu nước ngoài cho rằng Ngột Lương Hợp Thai rời đi chủ yếu vì nhiệm vụ chính của ông là đánh Tống, chứ không phải ở lại chiếm Đại Việt.",
    mp("region", frm="daiviet", regions=["mongol_1259", "song", "daiviet"], arrows=[arrow("thanglong>guangxi"), arrow("guangxi>tanzhou")]))
seg("Sau trận này, nhà Trần chủ động sai sứ giao hảo và chấp nhận triều cống, đổi lấy hòa bình. Đánh khi buộc phải đánh, mềm mỏng về ngoại giao để giữ yên đất nước.",
    img("tran_cer1", "Đồ gốm thời Trần", kb="left"))
seg("Lần đầu tiên, quân Mông Cổ chiếm được kinh thành nhưng không ở lại được. Bài học đầu tiên của nhà Trần đã thành hình: kinh thành có thể bỏ, nhưng quân đội và lòng người thì phải giữ.",
    cards(REASONS, 0, "Bài học thứ nhất"), pause=0.7)

# ───────────────────────── CHƯƠNG 3: KHOẢNG LẶNG ─────────────────────────
seg("Khoảng lặng trước giông bão.", title("Chương 3", "Khoảng lặng trước giông bão", "1259 – 1284"))
seg("Năm 1259, Đại hãn Mông Kha qua đời khi đang đánh Tống. Em ông là Hốt Tất Liệt về sau giành được ngôi Đại hãn.",
    img("kublai", "Chân dung Hốt Tất Liệt, album hoàng đế nhà Nguyên", kb="in", focus=(0.5, 0.35)))
seg("Năm 1271, Hốt Tất Liệt lập ra nhà Nguyên. Năm 1279, nhà Tống chính thức diệt vong. Cả Trung Hoa nằm trong tay người Mông Cổ.",
    mp("eastasia", frm="region", regions=["yuan_1280", "daiviet", "champa"], markers=["dadu", "linan"], year="1279"))
seg("Giờ đây, Hốt Tất Liệt quay sang phương Nam với những đòi hỏi ngày càng nặng: vua Đại Việt phải sang chầu, phải nộp sổ hộ khẩu, chịu thuế, và chấp nhận quan giám trị của nhà Nguyên.",
    cards([["!", "Vua phải sang chầu"], ["!", "Nộp sổ hộ khẩu, chịu thuế"], ["!", "Nhận quan giám trị"]], -1, "Đòi hỏi của nhà Nguyên"))
seg("Nhà Trần tìm đủ cách từ chối mà không gây chiến: cử sứ, gửi lễ vật, viện đủ mọi lý do.",
    img("tran_cer2", "Đồ gốm thời Trần", kb="right"))
seg("Năm 1281, sứ Nguyên là Sài Xuân sang Thăng Long. Viên sứ này ngạo mạn cưỡi ngựa đi thẳng vào cửa cung, dùng roi quất lính canh bị thương ở đầu.",
    img("kublai_full", "Album chân dung Hốt Tất Liệt, thế kỷ 14", kb="left"))
seg("Khi Trần Quang Khải đến sứ quán tiếp, Sài Xuân vẫn nằm khểnh không dậy. Nhưng khi Trần Quốc Tuấn đến, cạo tóc, mặc áo vải như một nhà sư phương Bắc, Sài Xuân lại đứng dậy vái chào. Tên lính hầu của hắn dùng tên chọc vào đầu ông đến chảy máu, sắc mặt Quốc Tuấn vẫn không hề thay đổi.",
    quote("Người hầu của Xuân cầm cái tên đứng sau Quốc Tuấn, chọc vào đầu đến chảy máu, nhưng sắc mặt Quốc Tuấn vẫn không hề thay đổi.", "Toàn thư chép việc năm 1281"))
seg("Năm 1282, vua Trần Nhân Tông họp vương hầu, bá quan ở Bình Than, bàn kế đánh và giữ, chia nhau trấn giữ những nơi hiểm yếu.",
    mp("delta", frm="daiviet", regions=["daiviet"], markers=["binhthan", "thanglong", "vankiep"], year="1282"))
seg("Hoài Văn hầu Trần Quốc Toản vì còn nhỏ tuổi nên không được dự bàn. Uất ức, cậu bóp nát quả cam trong tay lúc nào không biết, rồi về nhà tập hợp hơn nghìn gia nô và thân thuộc, giương cờ sáu chữ: Phá cường địch, báo hoàng ân.",
    {"type": "word", "big": "Phá cường địch\nbáo hoàng ân", "small": "Phá giặc mạnh, báo ơn vua", "src": "Cờ của Trần Quốc Toản, theo Toàn thư"})
seg("Cuối năm 1282, nhà Nguyên sai Toa Đô đem quân vượt biển đánh Chăm Pa. Đại Việt giờ có nguy cơ bị kẹp từ cả phía bắc lẫn phía nam.",
    mp("region", frm="delta", regions=["yuan_1280", "daiviet", "champa"], arrows=[arrow("guangzhou>vijaya")], markers=["vijaya", "thanglong"], year="1282–1283"))
seg("Năm 1283, vua phong Trần Quốc Tuấn làm Quốc công tiết chế, thống lĩnh quân đội cả nước.",
    img("thd_temple", "Tượng Trần Hưng Đạo tại đền thờ ở Thành phố Hồ Chí Minh", kb="out", focus=(0.5, 0.3)))
seg("Cuối năm 1284, Thượng hoàng Trần Thánh Tông mời các bô lão trong nước về thềm điện Diên Hồng, ban yến và hỏi kế đánh giặc. Các bô lão đều nói đánh. Muôn người cùng hô một tiếng, như bật ra từ một miệng.",
    {"type": "word", "big": "Đánh!", "small": "Hội nghị Diên Hồng, cuối năm 1284", "src": "Theo Đại Việt sử ký toàn thư"})
seg("Quân sĩ khắp nơi thích lên cánh tay hai chữ Sát Thát, nghĩa là giết giặc Thát Đát, tức quân Mông Cổ.",
    {"type": "word", "big": "殺韃", "small": "“Sát Thát” – giết giặc Mông Cổ", "src": "Chữ quân Trần thích trên tay, theo Toàn thư"})
seg("Theo nhiều nhà nghiên cứu, bài Hịch tướng sĩ nổi tiếng của Trần Quốc Tuấn cũng ra đời trong giai đoạn chuẩn bị này.",
    img("kiepbac", "Cổng đền Kiếp Bạc, nơi thờ Trần Hưng Đạo", kb="in"), pause=0.7)

# ───────────────────────── CHƯƠNG 4: LẦN THỨ HAI 1285 ─────────────────────────
seg("Lần thứ hai. Năm 1285.", title("Chương 4", "Lần thứ hai", "1285"))
seg("Đầu năm 1285, quân Nguyên do Trấn Nam vương Thoát Hoan, con trai Hốt Tất Liệt, chỉ huy, ồ ạt tràn qua biên giới. Họ lấy cớ mượn đường đi đánh Chăm Pa.",
    mp("daiviet", frm="region", regions=["yuan_1280", "daiviet", "champa"], arrows=[arrow("tuminh>noibang"), arrow("noibang>vankiep")], markers=["vankiep", "thanglong"], year="1285"))
seg("Sử Việt chép quân Nguyên có tới năm mươi vạn. Các nhà nghiên cứu ngày nay thường ước thấp hơn, nhưng dù tính theo cách nào, đây vẫn là một đạo quân khổng lồ.",
    fact("50 vạn?", "Con số Toàn thư chép cho quân Nguyên năm 1285", "Ước tính hiện đại thấp hơn và còn tranh luận"))
seg("Cùng lúc, cánh quân của Toa Đô từ Chăm Pa đánh ngược lên qua Nghệ An, Thanh Hóa. Hai gọng kìm từ bắc và nam cùng siết lại.",
    mp("daiviet", regions=["daiviet", "champa"], arrows=[arrow("tuminh>vankiep"), arrow("vijaya>nghean"), arrow("nghean>thanhhoa")], markers=["thanglong", "thanhhoa"]))
seg("Quân Trần thua ở các ải biên giới, lui về Vạn Kiếp. Rồi Vạn Kiếp cũng vỡ.",
    mp("delta", frm="daiviet", regions=["daiviet"], arrows=[arrow("noibang>vankiep")], markers=["vankiep", "thanglong"]))
seg("Bắt được lính Trần, quân Nguyên thấy trên tay ai cũng thích hai chữ Sát Thát. Chúng tức giận, giết hại rất nhiều.",
    img("moko_boarding", "Binh lính nhà Nguyên, cuộn tranh Mông Cổ xâm lược Nhật Bản, khoảng năm 1293", kb="left"))
seg("Giữa lúc nguy cấp, một viên quan nhỏ là Đỗ Khắc Chung xin vào trại giặc. Tướng Nguyên Ô Mã Nhi chất vấn về hai chữ Sát Thát. Đỗ Khắc Chung bình thản đáp: chó nhà cắn người lạ, đâu phải lỗi của chủ. Đó là lòng trung phẫn của quân sĩ, nhà vua không hề hay biết.",
    quote("Chó nhà cắn người lạ không phải tại chủ nó. Vì lòng trung phẫn mà họ tự thích chữ thôi.", "Đỗ Khắc Chung đáp Ô Mã Nhi, năm 1285"))
seg("Khi ông về rồi, Ô Mã Nhi nói với các tướng: nước này còn có người giỏi, chưa dễ mưu tính được.",
    quote("Nước nó còn có người giỏi, chưa dễ mưu tính được.", "Ô Mã Nhi, theo Toàn thư"))
seg("Nhưng thế giặc vẫn rất mạnh. Thăng Long lại bị bỏ trống. Quân Nguyên vào kinh thành, chỉ thấy cung điện không người, còn lương thực đã được mang đi hết.",
    mp("delta", regions=["daiviet"], arrows=[arrow("vankiep>thanglong")], markers=["thanglong"]))
seg("Tướng Trần Bình Trọng bị bắt ở bãi Đà Mạc. Giặc dụ hàng, hỏi ông có muốn làm vương đất Bắc không. Ông thét lớn.",
    img("moko_mitsui", "Lính nhà Nguyên, bản chép lại đời sau của cuộn tranh Mông Cổ xâm lược Nhật Bản", kb="right", focus=(0.7, 0.5)))
seg("Ta thà làm ma nước Nam chứ không thèm làm vương đất Bắc.",
    quote("Ta thà làm ma nước Nam chứ không thèm làm vương đất Bắc.", "Trần Bình Trọng, năm 1285"), pause=0.7)
seg("Không phải ai cũng kiên cường như vậy. Một số tôn thất nhà Trần ra hàng, trong đó có Chiêu Quốc vương Trần Ích Tắc, em trai của Thượng hoàng.",
    img("tran_cer1", "Đồ gốm thời Trần", kb="out"))
seg("Hai vua Trần phải đi thuyền nhỏ, có lúc bỏ thuyền đi bộ, rồi vượt biển vào Thanh Hóa để tránh mũi nhọn của giặc.",
    mp("daiviet", frm="delta", regions=["daiviet"], arrows=[arrow("thanglong>thientruong", color="viet", dashed=True), arrow("thientruong>thanhhoa", color="viet", dashed=True)], markers=["thanhhoa", "thientruong"]))
seg("Trong hoàn cảnh ấy, ta mới hiểu vì sao Toàn thư ghi lại một cuộc đối đáp. Thượng hoàng Trần Thánh Tông vờ bảo Trần Quốc Tuấn: thế giặc như vậy, ta phải hàng thôi. Quốc Tuấn trả lời.",
    quote("Thế giặc như vậy, ta phải hàng thôi.", "Thượng hoàng Trần Thánh Tông vờ hỏi"))
seg("Bệ hạ chém đầu tôi trước rồi hãy hàng.",
    quote("[Bệ hạ] chém đầu tôi trước rồi hãy hàng.", "Trần Quốc Tuấn"), pause=0.8)
seg("Vậy chiến lược của nhà Trần là gì? Toàn thư chép lời vua Nhân Tông bàn với bầy tôi.",
    title("Chiến lược", "Lấy nhàn chống mệt", ""))
seg("Giặc nhiều năm phải đi xa, lương thảo chuyên chở hàng vạn dặm, thế tất mỏi mệt. Lấy nhàn chống mệt, trước hết hãy làm chúng nhụt chí, thì ắt là đánh bại được chúng.",
    quote("Lấy nhàn chống mệt, trước hết hãy làm chúng nhụt chí, thì ắt là đánh bại được chúng.", "Vua Trần Nhân Tông, năm 1285"))
seg("Nói cách khác, không đối đầu trực diện khi giặc đang mạnh. Rút lui, giữ quân, để kẻ thù tự hao mòn vì thiếu lương, vì nắng nóng và bệnh tật.",
    mp("daiviet", regions=["daiviet"], markers=["thanglong", "thanhhoa", "thientruong"], arrows=[arrow("tuminh>thanglong")], labels=[{"at": "thanglong", "text": "Thiếu lương · nắng nóng · dịch bệnh", "dy": -70}]))
seg("Và đúng như vậy. Đến khoảng tháng 5 năm 1285, quân Nguyên bắt đầu đuối sức. Đường tiếp tế kéo quá dài, mùa hè oi bức, dịch bệnh lan trong doanh trại.",
    img("moko1", "Cuộn tranh Mông Cổ xâm lược Nhật Bản, khoảng năm 1293", kb="left"))
seg("Nhà Trần phản công. Ở cửa Hàm Tử, quân của Chiêu Văn vương Trần Nhật Duật, trong đó có cả những người Tống lưu vong mặc áo Tống, đánh bại quân Nguyên. Quân Nguyên tưởng nhà Tống sang cứu, hoảng sợ bỏ chạy.",
    mp("delta", frm="daiviet", regions=["daiviet"], markers=["hamtu"], arrows=[arrow("thientruong>hamtu", color="viet")]))
seg("Ở bến Chương Dương, Thượng tướng Trần Quang Khải cùng Trần Quốc Toản và các tướng đánh tan quân giặc, mở đường giành lại kinh thành.",
    mp("delta", regions=["daiviet"], markers=["chuongduong", "thanglong"], arrows=[arrow("chuongduong>thanglong", color="viet")]))
seg("Ở Tây Kết, quân Trần đánh bại đạo quân phía nam. Nguyên soái Toa Đô tử trận. Theo Toàn thư, vua Nhân Tông nhìn thủ cấp của Toa Đô, thương hại nói: người làm tôi phải nên như thế này. Rồi vua cởi áo ngự, sai đem liệm chôn.",
    mp("delta", regions=["daiviet"], markers=["tayket"], arrows=[arrow("thientruong>tayket", color="viet")]))
seg("Thoát Hoan tháo chạy về phương Bắc. Tướng Lý Hằng hộ vệ ông ta trúng tên độc mà chết. Toàn thư còn chép một chi tiết khó quên: quân Nguyên phải giấu Thoát Hoan vào trong một đồ vật bằng đồng để chạy thoát về Tư Minh.",
    mp("daiviet", frm="delta", regions=["daiviet"], arrows=[arrow("vankiep>tuminh", dashed=True)], markers=["tuminh", "vankiep"]))
seg("Tháng 6 âm lịch năm ấy, hai vua Trần trở về kinh sư. Thượng tướng Trần Quang Khải làm bài thơ còn truyền đến hôm nay.",
    img("tran_cer2", "Đồ gốm thời Trần", kb="in"))
seg("Chương Dương cướp giáo giặc, Hàm Tử bắt quân thù. Thái bình nên gắng sức, non nước ấy ngàn thu.",
    quote("Chương Dương cướp giáo giặc,\nHàm Tử bắt quân thù.\nThái bình nên gắng sức,\nNon nước ấy ngàn thu.", "Trần Quang Khải, bản dịch của Trần Trọng Kim", src="Tụng giá hoàn kinh sư"), pause=0.7)
seg("Cuộc kháng chiến lần thứ hai kết thúc. Bài học thứ hai: lấy nhàn chống mệt, đánh vào lúc kẻ thù yếu nhất.",
    cards(REASONS, 1, "Bài học thứ hai"), pause=0.7)

# ───────────────────────── CHƯƠNG 5: LẦN THỨ BA 1287–1288 ─────────────────────────
seg("Lần thứ ba. Năm 1287 đến 1288.", title("Chương 5", "Lần thứ ba", "1287 – 1288"))
seg("Thua đau, Hốt Tất Liệt nổi giận. Ông hoãn cả kế hoạch đánh Nhật Bản lần thứ ba để dồn sức cho phương Nam.",
    img("kublai", "Chân dung Hốt Tất Liệt, album hoàng đế nhà Nguyên", kb="out", focus=(0.5, 0.3)))
seg("Lần này, nhà Nguyên còn có một quân bài chính trị: họ phong Trần Ích Tắc, người đã đầu hàng, làm An Nam quốc vương, định đưa về để thay nhà Trần.",
    {"type": "word", "big": "An Nam quốc vương", "small": "Tước nhà Nguyên phong cho Trần Ích Tắc", "src": "Theo Toàn thư và các tài liệu về nhà Nguyên"})
seg("Vua hỏi Trần Quốc Tuấn: thế giặc năm nay thế nào? Ông đáp rằng quân ta nay đã quen chiến trận, còn quân giặc sợ phải đi xa, lại nơm nớp vì thất bại năm trước. Phá được chúng là điều chắc chắn.",
    quote("Theo như thần thấy, phá được chúng là điều chắc chắn.", "Trần Quốc Tuấn, năm 1286"))
seg("Khi có quan xin bắt thêm trai tráng cho đông quân, ông nói.",
    img("stakes3", "Cọc gỗ được cho là dùng trong trận Bạch Đằng 1288, Bảo tàng Lịch sử Việt Nam", kb="up"))
seg("Quân quý ở tinh nhuệ, không quý ở số đông.",
    quote("Quân quý ở tinh nhuệ, không quý ở số đông.", "Trần Quốc Tuấn, năm 1287"), pause=0.7)
seg("Cuối năm 1287, quân Nguyên lại kéo sang, cả đường bộ từ Quảng Tây, Vân Nam lẫn đường biển từ Khâm Châu. Theo con số nhiều tài liệu dẫn lại, tổng quân số khoảng mười bảy vạn người.",
    mp("region", frm="daiviet", regions=["yuan_1280", "daiviet", "champa"], arrows=[arrow("tuminh>vankiep"), arrow("kunming>thanglong"), arrow("qinzhou>vandon")], markers=["vankiep", "vandon"], year="1287"))
seg("Đi sau là một đoàn thuyền lương lớn do Trương Văn Hổ chỉ huy, chở hàng chục vạn thạch lương thực. Đó chính là mạch sống của đạo quân viễn chinh.",
    mp("daiviet", frm="region", regions=["daiviet"], arrows=[arrow("qinzhou>vandon", color="supply", dashed=True)], markers=["qinzhou", "vandon"], labels=[{"at": "qinzhou", "text": "Thuyền lương Trương Văn Hổ", "dy": -60}]))
seg("Được hỏi về tình hình, Trần Quốc Tuấn chỉ đáp ngắn gọn.",
    img("kiepbac1904", "Đền Kiếp Bạc năm 1904, ảnh của André Salles", kb="in"))
seg("Năm nay đánh giặc nhàn.",
    quote("Năm nay đánh giặc nhàn.", "Trần Quốc Tuấn, cuối năm 1287"), pause=0.7)
seg("Thủy quân Nguyên của Ô Mã Nhi đi trước, vượt qua vùng biển Vân Đồn. Phó tướng Trần Khánh Dư không chặn nổi, bị Thượng hoàng sai người xiềng giải về kinh.",
    mp("delta", frm="daiviet", regions=["daiviet"], arrows=[arrow("vandon>bachdang"), arrow("bachdang>vankiep")], markers=["vandon", "vankiep"]))
seg("Khánh Dư xin khất vài ngày để lập công chuộc tội. Ông đoán rằng chiến thuyền giặc đã qua, thì thuyền chở lương tất sẽ theo sau.",
    quote("Lấy quân pháp mà xử, tôi cam chịu tội, nhưng xin khất hai, ba ngày, để mưu lập công rồi về chịu tội.", "Trần Khánh Dư, theo Toàn thư"))
seg("Và ông đoán đúng. Đoàn thuyền lương của Trương Văn Hổ kéo đến và bị quân Khánh Dư đánh tan. Lương thực, khí giới, phần bị thu, phần chìm xuống biển.",
    mp("delta", regions=["daiviet"], arrows=[arrow("qinzhou>vandon", color="supply", dashed=True)], markers=["vandon"], labels=[{"at": "vandon", "text": "Trận Vân Đồn", "dy": -60}], year="cuối 1287 – đầu 1288"))
seg("Thượng hoàng tha tội cho Khánh Dư và nói: chỗ trông cậy của quân Nguyên là lương thảo khí giới, nay đã bị ta bắt được. Ông còn thả tù binh về trại giặc để báo tin, đánh thẳng vào tinh thần quân Nguyên.",
    quote("Chỗ trông cậy của quân Nguyên là lương thảo khí giới, nay đã bị ta bắt được.", "Thượng hoàng Trần Thánh Tông"))
seg("Quân Nguyên vẫn chiếm được một Thăng Long trống rỗng, nhưng giờ họ lâm vào cảnh đói. Họ đi cướp lương khắp nơi, thậm chí đào phá lăng vua Trần Thái Tông ở Long Hưng.",
    mp("delta", regions=["daiviet"], markers=["thanglong", "longhung"], arrows=[arrow("vankiep>longhung")]))
seg("Đến tháng 3 năm 1288, Thoát Hoan quyết định rút quân. Bộ binh rút theo đường Lạng Sơn. Thủy quân của Ô Mã Nhi rút theo sông Bạch Đằng ra biển.",
    mp("daiviet", frm="delta", regions=["daiviet"], arrows=[arrow("vankiep>tuminh", dashed=True), arrow("vankiep>bachdang", dashed=True)], markers=["vankiep", "bachdang"], year="3/1288"))
seg("Trần Quốc Tuấn đã chờ sẵn ở đó.", mp("delta", frm="daiviet", regions=["daiviet"], markers=["bachdang"]), pause=0.8)
seg("Bạch Đằng không phải dòng sông xa lạ. Năm 938, chính tại đây, Ngô Quyền đã dùng trận địa cọc đánh tan quân Nam Hán.",
    timeline(-1, [["938", "Ngô Quyền"], ["981", "Lê Hoàn"], ["1288", "Trần Hưng Đạo"]]))
seg("Hơn ba thế kỷ sau, Trần Quốc Tuấn dùng lại cách đánh ấy. Gỗ lim, gỗ táu được đẽo nhọn, cắm xuống lòng sông ở những đoạn hiểm yếu, phủ cỏ lên trên. Khi nước triều lên, bãi cọc chìm kín dưới mặt nước.",
    {"type": "tide", "phase": "high"})
seg("Kế hoạch dựa vào thủy triều. Đánh nhử khi nước lên để địch đuổi vào sâu, rồi chờ nước rút, để chính dòng sông biến thành vũ khí.",
    {"type": "tide", "phase": "lure"})
seg("Ngày 8 tháng 3 năm Mậu Tý, tức ngày 9 tháng 4 năm 1288, đoàn thuyền của Ô Mã Nhi tiến vào sông Bạch Đằng.",
    mp("bachdang", frm="delta", markers=["bachdang"], year="9/4/1288", rivers=False))
seg("Lúc nước triều lên, quân Trần ra khiêu chiến rồi giả thua chạy. Quân Nguyên đuổi theo.",
    {"type": "tide", "phase": "lure"})
seg("Rồi nước triều bắt đầu rút. Những chiến thuyền lớn của quân Nguyên lần lượt mắc cọc, nghiêng đổ, vỡ toang.",
    {"type": "tide", "phase": "low"})
seg("Từ hai bên bờ, quân mai phục đổ ra. Hai vua Trần dẫn quân tiếp ứng. Toàn thư chép quân Nguyên chết đuối nhiều không kể xiết, nước sông vì thế đỏ ngầu.",
    {"type": "tide", "phase": "attack"})
seg("Đại Việt bắt được bốn trăm chiến thuyền. Ô Mã Nhi bị bắt sống.",
    fact("400", "chiến thuyền quân Nguyên bị bắt", "Theo Đại Việt sử ký toàn thư"))
seg("Trên bộ, Thoát Hoan bị truy kích ráo riết, phải bỏ đường lớn, len lỏi qua rừng núi mới thoát về được Tư Minh. Cuộc xâm lược lần thứ ba sụp đổ hoàn toàn.",
    mp("daiviet", frm="delta", regions=["daiviet"], arrows=[arrow("vankiep>tuminh", dashed=True)], markers=["tuminh"]))
seg("Có một chi tiết ít được nhắc tới. Năm sau, khi trao trả tù binh, nhà Trần dùng kế của Hưng Đạo vương, cho người giỏi bơi lặn dùi thủng thuyền chở Ô Mã Nhi, khiến ông ta chết đuối. Chính sử gia Ngô Sĩ Liên về sau đã phê phán việc này là thất tín.",
    quote("Đã nói là đưa về nước lại dùng mưu kế để giết đi, thì thực quỷ quyệt quá lắm.", "Sử thần Ngô Sĩ Liên bình về việc năm 1289"))
seg("Lịch sử thật luôn có những góc khuất như vậy. Còn bài học thứ ba: đánh vào chỗ yếu nhất của kẻ thù là đường tiếp tế, và chọn chiến trường mà mình hiểu rõ hơn đối phương.",
    cards(REASONS, 2, "Bài học thứ ba"), pause=0.7)

# ───────────────────────── CHƯƠNG 6: SAU CUỘC CHIẾN ─────────────────────────
seg("Sau cuộc chiến.", title("Chương 6", "Sau cuộc chiến", "Đại Việt và thế giới"))
seg("Thắng trận, nhưng nhà Trần không kiêu ngạo. Họ nhanh chóng sai sứ sang nhà Nguyên, giữ quan hệ triều cống để tránh thêm một cuộc chiến.",
    img("tran_cer1", "Đồ gốm thời Trần", kb="right"))
seg("Vì cái giá của chiến tranh quá đắt. Cung điện ở kinh thành bị đốt phá, nhiều chùa chiền bị hủy hoại. Những năm 1290 đến 1292, nạn đói hoành hành.",
    fact("1290 – 1292", "Nạn đói sau chiến tranh", "Cái giá của ba lần kháng chiến"))
seg("Hốt Tất Liệt vẫn chưa nguôi. Theo các tài liệu tổng hợp, ông còn tính tới một cuộc tấn công lần thứ tư, nhưng kế hoạch dừng lại khi ông qua đời đầu năm 1294. Vua mới của nhà Nguyên cho bãi binh.",
    img("kublai_full", "Album chân dung Hốt Tất Liệt, thế kỷ 14", kb="right"))
seg("Đặt cạnh bức tranh lớn, chiến thắng của Đại Việt càng đáng chú ý.",
    mp("seas", frm="daiviet", regions=["yuan_1280", "daiviet"], markers=["hakata", "java", "thanglong"]))
seg("Năm 1274 và năm 1281, nhà Nguyên hai lần vượt biển đánh Nhật Bản. Cả hai lần, hạm đội gặp bão lớn và thất bại. Người Nhật gọi những cơn bão ấy là kamikaze, nghĩa là thần phong.",
    img("kikuchi", "Hạm đội Mông Cổ gặp bão, tranh của Kikuchi Yōsai, năm 1847", kb="up"))
seg("Năm 1293, nhà Nguyên đánh Java. Ban đầu họ thắng, nhưng rồi bị chính đồng minh tại chỗ là Raden Wijaya quay lại đánh, phải rút về. Từ đó, vương quốc Majapahit trỗi dậy.",
    mp("seas", regions=["yuan_1280"], arrows=[arrow("quanzhou>java")], markers=["java"], year="1293"))
seg("Nhật Bản có bão. Java có một cuộc trở cờ. Còn Đại Việt, qua ba lần đối đầu, dựa chủ yếu vào sức người: chiến lược, sự đồng lòng, và hiểu biết về chính mảnh đất của mình.",
    {"type": "compare", "items": [["Nhật Bản", "1274 · 1281", "Bão lớn – “thần phong”"], ["Java", "1293", "Đồng minh trở cờ"], ["Đại Việt", "1258 · 1285 · 1288", "Chiến lược và lòng người"]]}, pause=0.7)

# ───────────────────────── CHƯƠNG 7: BA LÝ DO ─────────────────────────
seg("Vậy tóm lại, vì sao Đại Việt làm được điều đó? Có ba lý do lớn.", cards(REASONS, -1, "Ba lý do"))
seg("Một: dám bỏ kinh thành để giữ lực lượng. Kẻ địch chiếm được những tòa thành trống, nhưng không tìm thấy đội quân chủ lực để tiêu diệt, cũng không tìm thấy lương thực.",
    cards(REASONS, 0, "Ba lý do"))
seg("Hai: đánh vào đường tiếp tế. Một đạo quân viễn chinh dù mạnh đến đâu cũng phải ăn. Trận Vân Đồn đã bẻ gãy chỗ dựa ấy.",
    cards(REASONS, 1, "Ba lý do"))
seg("Ba: biến thiên nhiên thành vũ khí. Nắng nóng và dịch bệnh bào mòn sức giặc, còn thủy triều sông Bạch Đằng khép lại cuộc chiến.",
    cards(REASONS, 2, "Ba lý do"))
seg("Và phía sau cả ba là con người: những người lính thích chữ Sát Thát, những bô lão ở Diên Hồng, và một vị tướng dám nói: chém đầu tôi trước rồi hãy hàng.",
    img("thd_temple", "Tượng Trần Hưng Đạo tại đền thờ ở Thành phố Hồ Chí Minh", kb="in", focus=(0.5, 0.3)), pause=0.8)

# ───────────────────────── CHƯƠNG 8: HÔM NAY ─────────────────────────
seg("Dấu vết còn lại hôm nay.", title("Chương 7", "Dấu vết hôm nay", "Từ 1300 đến nay"))
seg("Năm 1300, Hưng Đạo vương Trần Quốc Tuấn qua đời tại Vạn Kiếp. Trước khi mất, ông dặn con phải hỏa táng, chôn kín, san phẳng đất và trồng cây như cũ, vì lo sau này giặc đến đào mả trả thù.",
    img("kiepbac1904", "Đền Kiếp Bạc năm 1904, ảnh của André Salles", kb="out"))
seg("Ngày nay, đền Kiếp Bạc ở Chí Linh là nơi thờ ông. Lễ hội đền diễn ra hằng năm vào tháng Tám âm lịch, đúng dịp ngày giỗ.",
    img("kiepbac", "Cổng đền Kiếp Bạc ngày nay", kb="in"))
seg("Năm 1953, khi đắp đê ở vùng Yên Giang, Quảng Yên, người dân phát hiện một bãi cọc gỗ lớn nằm sâu dưới bùn. Sau đó, các nhà khảo cổ còn tìm thấy những bãi cọc ở đồng Vạn Muối, đồng Má Ngựa.",
    mp("bachdang", frm="delta", markers=["yengiang", "vanmuoi", "mangua"], rivers=False, year="1953 · 2005 · 2010"))
seg("Phân tích carbon phóng xạ trên nhiều mẫu cọc cho kết quả tập trung vào khoảng thế kỷ mười ba, phù hợp với trận đánh năm 1288.",
    img("stakes3", "Cọc gỗ được cho là dùng trong trận Bạch Đằng 1288, Bảo tàng Lịch sử Việt Nam", kb="in"))
seg("Năm 2012, Khu di tích lịch sử chiến thắng Bạch Đằng được xếp hạng di tích quốc gia đặc biệt.",
    fact("2012", "Khu di tích chiến thắng Bạch Đằng", "Được xếp hạng di tích quốc gia đặc biệt"))
seg("Cuối năm 2019, ở Cao Quỳ, Hải Phòng, người ta phát hiện thêm một bãi cọc. Các nhà khoa học vẫn còn tranh luận nó có thuộc trận Bạch Đằng năm 1288 hay không. Lịch sử, vì thế, vẫn đang được viết tiếp.",
    mp("bachdang", markers=["caoquy", "yengiang"], rivers=False, year="2019"))
seg("Năm 2025, quần thể di tích và danh thắng Yên Tử, Vĩnh Nghiêm, Côn Sơn, Kiếp Bạc, gắn liền với nhà Trần và Thiền phái Trúc Lâm, được UNESCO ghi danh là Di sản Thế giới.",
    fact("2025", "Yên Tử – Vĩnh Nghiêm – Côn Sơn, Kiếp Bạc", "Được UNESCO ghi danh Di sản Thế giới"))
seg("Hơn bảy trăm năm đã trôi qua, những cây cọc ấy vẫn nằm đó, như một lời nhắc: một đất nước nhỏ không có nghĩa là một đất nước yếu.",
    img("bachdang_art", "Trận Bạch Đằng 1288, tranh minh họa do kênh tự vẽ", kb="out", focus=(0.62, 0.55), tag="Minh họa"), pause=0.9)

# ───────────────────────── KẾT ─────────────────────────
seg("Ở video sau, chúng ta sẽ theo hạm đội Mông Cổ sang Nhật Bản, để xem vì sao người Nhật tin rằng thần linh đã cứu họ. Cùng một đế chế, nhưng hai cách thất bại rất khác nhau.",
    img("moko1", "Cuộn tranh Mông Cổ xâm lược Nhật Bản, khoảng năm 1293", kb="right"))
seg("Theo bạn, trong ba lý do vừa rồi, lý do nào quan trọng nhất? Hãy để lại ý kiến ở phần bình luận. Nếu thấy video hữu ích, hãy đăng ký Dòng Chảy Lịch Sử để cùng đi tiếp dòng chảy này. Nguồn tư liệu và hình ảnh được ghi đầy đủ trong phần mô tả.",
    {"type": "outro"}, pause=1.5)

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "segments.json")
    for i, s in enumerate(S):
        s["id"] = f"s{i:03d}"
    json.dump(S, open(out, "w"), ensure_ascii=False, indent=1)
    words = sum(len(s["text"].split()) for s in S)
    print(len(S), "segments,", words, "âm tiết, ước", round(words / 3.5 / 60, 1), "phút lời đọc")
