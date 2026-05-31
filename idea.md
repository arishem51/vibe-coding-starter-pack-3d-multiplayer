Bạn hãy đóng vai đồng thời là:
Senior Game Designer
Senior Product Designer
UX/UI Designer
Full-stack Game Developer
Backend Realtime Architect
Unity/Three.js Game Engineer
Chuyên gia Gamification giáo dục
Giảng viên chấm sản phẩm sáng tạo môn Chủ nghĩa xã hội khoa học
Hãy thiết kế và phát triển một game học tập 3D online multiplayer có tên:
Animal Theory Royale – Vòng Bo Tri Thức 3D
1. Mục tiêu game
Game là một chế độ học tập tương tác dành cho sinh viên học môn Chủ nghĩa xã hội khoa học.
Thay vì học lý thuyết khô khan, người chơi sẽ tham gia vào một trận đấu 3D realtime nhiều người chơi, di chuyển trên bản đồ, chọn nhân vật động vật, né vòng bo, nhặt trái cây hồi HP, dùng súng năng lượng tri thức, đi đến các vùng phát sáng để trả lời câu hỏi và kiếm điểm.
Game phải tạo cảm giác:
Vui
Cạnh tranh
Có chiến thuật
Có tính sinh tồn
Có yếu tố học tập rõ ràng
Không biến thành game bắn nhau thuần túy
Vẫn giữ đúng tinh thần học thuật
Thông điệp chính:
Đây là game sinh tồn bằng tri thức. Người chơi muốn thắng phải trả lời đúng câu hỏi, hiểu kiến thức và biết chọn chiến thuật phù hợp.

2. Thông tin tổng quan
Tên game: Animal Theory Royale – Vòng Bo Tri Thức 3D
Thể loại:
3D low-poly multiplayer
Battle royale học tập
Quiz game realtime
Educational gamification
Classroom game
Số người chơi:
Tối đa: 50 người / room
Tối thiểu để bắt đầu: 2 người
Phù hợp demo: 10–30 người
Thời lượng trận:
Admin/Host có thể set
Tối thiểu: 10 phút
Gợi ý: 10, 12, 15, 20 phút
Không cho set dưới 10 phút
Nền tảng:
Web browser
Có thể chạy trên laptop
Người chơi có thể vào bằng điện thoại nếu tối ưu sau
MVP ưu tiên desktop/laptop

3. Công nghệ đề xuất
Hãy đề xuất kiến trúc theo hướng dễ làm cho nhóm sinh viên IT.
Frontend:
React hoặc Next.js
React Three Fiber hoặc Three.js để làm 3D
Tailwind CSS cho UI
Framer Motion cho animation UI
SignalR Client nếu backend dùng .NET
Hoặc Socket.IO Client nếu backend dùng Node.js
Backend ưu tiên:
ASP.NET Core Web API
SignalR cho realtime multiplayer
Entity Framework Core
SQL Server hoặc PostgreSQL
Triển khai:
Frontend deploy lên Vercel
Backend deploy lên Render, Railway hoặc Azure App Service
Database dùng Supabase PostgreSQL, SQL Server hoặc PostgreSQL cloud
Kiến trúc:
Frontend 3D Game Client
→ kết nối WebSocket/SignalR
→ Backend Realtime Game Server
→ Database lưu câu hỏi, room, kết quả
Server phải là trọng tài chính. Client chỉ hiển thị và gửi input, không tự quyết định điểm, HP, đáp án đúng/sai, sát thương, item hay kết quả trận.

4. Vai trò người dùng
4.1 Host / Admin
Host có thể:
Tạo phòng chơi
Chọn thời lượng trận
Chọn số người tối đa
Chọn chủ đề câu hỏi
Chọn độ khó
Bật/tắt súng năng lượng
Bật/tắt trái cây hồi HP
Bật/tắt vật phẩm đặc biệt
Chọn tốc độ vòng bo
Bắt đầu trận
Kết thúc trận
Xem leaderboard
Xem kết quả sau trận
4.2 Player
Player có thể:
Nhập mã phòng
Quét QR để vào phòng
Nhập nickname
Chọn nhân vật động vật
Xem chỉ số nhân vật
Bấm Ready
Vào map 3D
Di chuyển
Nhặt trái cây
Nhặt năng lượng
Dùng súng năng lượng
Dùng skill nhân vật
Vào vùng phát sáng để trả lời câu hỏi
Nhận điểm/thưởng nếu đúng
Bị trừ HP/phạt nếu sai
Xem leaderboard realtime
4.3 Spectator
Nếu player bị loại hoặc vào muộn:
Có thể xem trận đấu
Xem leaderboard
Không được di chuyển
Không được trả lời câu hỏi
Không ảnh hưởng kết quả

5. Luồng trải nghiệm người dùng
5.1 Luồng tạo phòng
Host vào trang game.
Bấm Create Room.
Host cấu hình trận:
Game Duration
Max Players
Topic
Difficulty
Enable Weapon
Enable Fruits
Enable Items
Safe Zone Speed
Hệ thống tạo room code, ví dụ: A7K2Q.
Hệ thống tạo QR code.
Host chia sẻ mã phòng cho cả lớp.
5.2 Luồng tham gia phòng
Player vào website.
Chọn Join Room.
Nhập room code.
Nhập nickname.
Chọn nhân vật động vật.
Bấm Ready.
Vào lobby chờ host start.
5.3 Luồng bắt đầu trận
Host bấm Start.
Server chuyển room sang trạng thái Countdown.
Hiện đếm ngược 3 giây.
Tất cả player spawn ngẫu nhiên trong vùng an toàn.
Bản đồ xuất hiện:
Vùng phát sáng câu hỏi
Trái cây hồi HP
Ammo năng lượng
Vật phẩm đặc biệt
Vòng bo ban đầu
Trận bắt đầu.

6. Thiết kế nhân vật động vật 3D
Game có hệ thống chọn nhân vật động vật. Mỗi con vật có chỉ số, tốc độ, HP, kích thước và kỹ năng riêng.
Phong cách nhân vật:
Low-poly
Cartoon
Dễ thương
Không bạo lực
Có màu sắc rõ ràng
Dễ phân biệt trên bản đồ
6.1 Nhân vật MVP bắt buộc
1. Voi – Tanker
Vai trò: Trâu máu, chịu đòn tốt.
Chỉ số:
HP: 150
Speed: 60%
Hitbox: lớn
Ammo ban đầu: 10
Ưu điểm: sống lâu, chịu sát thương tốt
Nhược điểm: chậm, dễ bị bắn, khó né bo
Skill:
Lá Chắn Đại Ngàn
Giảm 50% sát thương trong 5 giây
Cooldown: 30 giây
2. Thỏ – Speedster
Vai trò: Di chuyển nhanh, tranh vùng câu hỏi.
Chỉ số:
HP: 80
Speed: 130%
Hitbox: nhỏ
Ammo ban đầu: 8
Ưu điểm: chạy nhanh, né tốt, chiếm vùng câu hỏi nhanh
Nhược điểm: máu thấp, trả lời sai dễ nguy hiểm
Skill:
Bứt Tốc
Tăng tốc thêm 50% trong 3 giây
Cooldown: 25 giây
3. Cáo – Strategist
Vai trò: Cân bằng, mạnh về trả lời câu hỏi.
Chỉ số:
HP: 100
Speed: 110%
Hitbox: nhỏ/trung bình
Ammo ban đầu: 10
Ưu điểm: có lợi thế học tập
Nhược điểm: không quá mạnh về máu hoặc chiến đấu
Skill:
Mưu Trí
Loại bỏ 1 đáp án sai trong câu hỏi tiếp theo
Cooldown: 45 giây
4. Rùa – Defender
Vai trò: Phòng thủ, an toàn.
Chỉ số:
HP: 130
Speed: 65%
Hitbox: trung bình
Ammo ban đầu: 8
Ưu điểm: phòng thủ tốt, an toàn khi tranh vùng câu hỏi
Nhược điểm: chậm, khó đi xa
Skill:
Mai Rùa Bảo Vệ
Miễn sát thương trong 3 giây
Trong thời gian dùng skill không được bắn
Cooldown: 35 giây
6.2 Nhân vật mở rộng sau MVP
Có thể thêm:
Sói: nhanh, thiên về tấn công
Gấu: trâu, có kỹ năng đẩy lùi
Khỉ: linh hoạt, tạo bản sao
Chim Ưng: nhìn thấy vùng câu hỏi xa hơn
Mèo: né nhanh, hitbox nhỏ
MVP chỉ cần làm 4 nhân vật: Voi, Thỏ, Cáo, Rùa.

7. Thiết kế bản đồ 3D
Bản đồ là một đấu trường học tập 3D low-poly.
Tên map:
Civic Arena – Đấu trường Tri Thức
Các khu vực chính:
Quảng trường Giai cấp
Cầu Quá Độ
Nhà Dân Chủ
Trung tâm Nhà nước
Làng Đoàn Kết
Trạm Tương Lai
Mỗi khu vực tương ứng với một nhóm kiến thức trong môn Chủ nghĩa xã hội khoa học.
Yêu cầu map:
Không quá rộng để 50 người vẫn gặp nhau
Có địa hình đơn giản
Có cây, đá, công trình thấp làm vật cản
Có đường đi rõ ràng
Có cột sáng câu hỏi
Có trái cây đặt rải rác
Có vòng bo phát sáng
Có minimap ở góc màn hình
Kích thước gợi ý:
MapWidth: 2000 units
MapHeight: 2000 units
PlayerSize: tùy model
QuestionZoneRadius: 60 units
ItemPickupRadius: 35 units
Camera:
Camera góc nhìn thứ ba hoặc top-down 3D
Ưu tiên camera isometric/third-person đơn giản
Không cần xoay camera phức tạp ở MVP
Người chơi điều khiển bằng WASD hoặc phím mũi tên

8. Vòng bo tri thức
Tên trong game:
Vùng An Toàn Tri Thức
Không gọi là vòng bo PUBG trong UI chính.
Logic:
Vòng bo thu nhỏ theo thời gian
Người chơi ngoài bo bị mất HP mỗi giây
Càng về cuối trận, bo càng nhỏ và sát thương càng cao
Vòng bo tạo áp lực di chuyển và khiến trận đấu không bị nhàm chán
Với trận 10 phút:
Phase 1:
0:00–2:00
Bo lớn 100%
Damage ngoài bo: 0 HP/s
Phase 2:
2:00–4:00
Bo còn 75%
Damage ngoài bo: 3 HP/s
Phase 3:
4:00–6:00
Bo còn 55%
Damage ngoài bo: 5 HP/s
Phase 4:
6:00–8:00
Bo còn 35%
Damage ngoài bo: 7 HP/s
Final Phase:
8:00–10:00
Bo còn 20%
Damage ngoài bo: 10 HP/s
Yêu cầu animation:
Bo phải thu nhỏ mượt, không giật
Client animate theo dữ liệu server gửi
Server gửi thông tin bán kính và tâm bo mỗi phase
Thông báo UI:
“Vùng An Toàn Tri Thức sắp thu hẹp!”
“Bạn đang ở ngoài vùng an toàn, quay lại ngay!”
“Bo cuối đang bắt đầu!”

9. HP và trạng thái người chơi
Mỗi player có HP.
Nguồn mất HP:
Trả lời sai câu dễ: -10 HP
Trả lời sai câu trung bình: -20 HP
Trả lời sai câu khó: -30 HP
Bị súng năng lượng bắn trúng: -8 HP
Đứng ngoài bo: trừ theo phase
Hết thời gian trả lời câu hỏi: tính là sai
Nguồn hồi HP:
Nhặt trái cây
Trả lời đúng câu trung bình: +5 HP
Trả lời đúng câu khó: +10 HP
Vật phẩm hồi phục đặc biệt
Rule:
HP không vượt quá MaxHP của nhân vật
HP về 0 thì player bị knock hoặc respawn tùy mode
Mode đề xuất cho lớp học:
Casual Learning Mode
HP = 0 thì player bị knock 8 giây
Sau đó respawn với 60% HP tối đa
Trừ 100 điểm
Reset combo
Không loại hẳn để người chơi không bị chán
Mode phụ:
Survival Mode
HP = 0 thì bị loại
Chuyển sang spectator
MVP nên dùng Casual Learning Mode.

10. Súng năng lượng tri thức
Tên:
Knowledge Blaster – Súng Năng Lượng Tri Thức
Yêu cầu:
Không dùng súng thật
Không có máu me
Không có hiệu ứng bạo lực
Không có âm thanh súng thật
Bắn ra tia sáng năng lượng
Mục tiêu là tạo cạnh tranh nhẹ, không phải bạo lực
Thông số MVP:
Damage: 8 HP/hit
Cooldown: 0.7 giây
Ammo cost: 1
Initial ammo tùy nhân vật
Max ammo: 30
Range: 350 units
Projectile speed: 600 units/s
Điểm chiến đấu:
Bắn trúng: +5 điểm
Knock/hạ đối thủ: +50 điểm
Nhưng điểm từ câu hỏi phải cao hơn nhiều:
Câu dễ: +100
Câu trung bình: +200
Câu khó: +350
Tỷ lệ điểm mong muốn:
70% từ câu hỏi
15% từ combo
10% từ sinh tồn
5% từ chiến đấu
Rule quan trọng:
Người chơi đang trả lời câu hỏi được bật Question Shield:
Không nhận sát thương từ súng
Không được bắn người khác
Không di chuyển
Sau khi trả lời xong, shield kéo dài thêm 2 giây rồi tắt

11. Trái cây và vật phẩm
11.1 Trái cây hồi HP
Các loại trái cây:
Táo Đỏ
Hồi 15 HP
Spawn rate: 40%
Chuối Năng Lượng
Hồi 10 HP
Tăng tốc 5 giây
Spawn rate: 25%
Dưa Hấu
Hồi 25 HP
Spawn rate: 20%
Nho Tri Thức
Hồi 5 HP
Cộng 50 điểm
Spawn rate: 10%
Quả Sao May Mắn
Random hồi HP, ammo hoặc shield
Spawn rate: 5%
11.2 Vật phẩm đặc biệt
Shield Tri Thức
Chặn sát thương 5 giây
Gợi Ý Lý Luận
Loại bỏ 1 đáp án sai trong câu hỏi tiếp theo
X2 Điểm
Câu tiếp theo đúng được nhân đôi điểm
Radar Tri Thức
Hiện vị trí Knowledge Zone gần nhất
Bình Tĩnh
Cộng thêm 5 giây khi trả lời câu hỏi
Năng Lượng
+10 ammo
Spawn logic:
Max fruits on map: 25
Max special items: 10
Max ammo packs: 15
Item respawn interval: 20 giây
Item expire time: 90 giây
Không spawn item quá sát player
Không spawn item ngoài bo ở phase cuối
Không spawn item trong vật cản

12. Knowledge Zone – Vùng phát sáng câu hỏi
Vùng phát sáng là nơi người chơi trả lời câu hỏi.
Tên:
Knowledge Zone – Vùng Tri Thức
Hiển thị:
Một cột sáng màu xanh/vàng
Có icon dấu hỏi
Có vòng tròn phát sáng dưới mặt đất
Có nhãn chủ đề, ví dụ: “Dân chủ XHCN”, “Giai cấp công nhân”
Số lượng:
Active question zones: 12–16 vùng cùng lúc
Respawn interval: 15 giây
Cooldown zone: 20 giây
Độ khó:
Dễ: 45%
Trung bình: 40%
Khó: 15%
Càng về cuối trận, tăng câu trung bình và khó.
Luồng trả lời:
Player đi vào Knowledge Zone.
Server kiểm tra zone còn active không.
Server đánh dấu zone là InUse.
Player bị khóa di chuyển.
Bật Question Shield.
Popup câu hỏi hiện lên.
Player trả lời trong thời gian quy định.
Server chấm đáp án.
Nếu đúng: cộng điểm, combo, có thể hồi HP/thưởng item.
Nếu sai: trừ HP, reset combo.
Hiện giải thích ngắn.
Tắt popup.
Sau 2 giây tắt Question Shield.
Zone biến mất hoặc vào cooldown.
Thời gian trả lời:
Câu dễ: 15 giây
Câu trung bình: 20 giây
Câu khó: 30 giây
Thưởng/phạt:
Dễ: đúng +100 điểm, sai -10 HP
Trung bình: đúng +200 điểm +5 HP, sai -20 HP
Khó: đúng +350 điểm +10 HP, sai -30 HP
Nếu hết giờ:
Tính là sai
Sau mỗi câu hỏi phải có giải thích ngắn để đảm bảo học thuật.

13. Chống camp và tối ưu công bằng
Vấn đề: người chơi có thể đứng chờ vùng câu hỏi để farm điểm.
Cách xử lý:
Cooldown cá nhân:
Mỗi player chỉ được trả lời 1 câu tại cùng khu vực trong 45 giây
Zone spawn ngẫu nhiên:
Knowledge Zone không đứng cố định hoàn toàn
Khoảng cách tối thiểu:
Khoảng cách giữa 2 zone ít nhất 180 units
Không spawn sát player:
Tránh người chơi đứng yên mà zone xuất hiện ngay dưới chân
Cảnh báo đứng yên:
Nếu player đứng gần zone quá 20 giây nhưng không trả lời, hiện cảnh báo:
“Hãy di chuyển để tìm vùng tri thức mới!”

14. Hệ thống điểm và combo
Công thức điểm cuối trận:
FinalScore = QuestionScore + ComboBonus + SurvivalBonus + CombatBonus + ItemBonus - Penalty
Nguồn điểm:
Trả lời câu hỏi
Combo đúng liên tiếp
Sống sót
Nhặt item điểm
Bắn trúng hoặc knock người khác
Combo:
2 câu đúng liên tiếp: x1.2
3 câu đúng liên tiếp: x1.5
5 câu đúng liên tiếp: x2
Sai 1 câu: reset về x1
Survival bonus:
+10 điểm mỗi phút còn sống
Combat bonus:
Bắn trúng: +5 điểm
Knock đối thủ: +50 điểm
Penalty:
Knock/respawn: -100 điểm
Thoát trận giữa chừng: không tính kết quả
Trả lời sai: trừ HP, không trừ điểm trực tiếp
Leaderboard xếp theo:
Player còn hoạt động
FinalScore
CorrectCount
MaxCombo
SurvivalTime
HP còn lại

15. Giao diện UI/UX
15.1 Màn hình Landing
Có:
Logo game
Slogan
Nút Create Room
Nút Join Room
Hướng dẫn chơi
Hình động vật 3D
Mô tả: “Sinh tồn bằng tri thức”
Slogan:
Chạy nhanh chưa đủ, muốn thắng phải hiểu đúng.
15.2 Màn hình Create Room
Form gồm:
Room name
Game duration
Max players
Topic
Difficulty
Enable weapon
Enable fruits
Enable special items
Safe zone speed
Respawn mode
Create button
15.3 Màn hình Join Room
Có:
Nhập room code
Nhập nickname
Chọn avatar/nhân vật
Nút Join
15.4 Màn hình chọn nhân vật
Hiển thị 4 nhân vật 3D:
Voi
Thỏ
Cáo
Rùa
Mỗi nhân vật có:
Model 3D preview
HP bar
Speed bar
Skill name
Skill description
Ưu điểm
Nhược điểm
Nút Select
15.5 Lobby
Hiển thị:
Room code
QR code
Danh sách player
Nhân vật từng người chọn
Trạng thái Ready
Setting trận
Nút Start cho host
15.6 Game HUD
Góc trái:
HP
Score
Combo
Ammo
Skill cooldown
Góc phải:
Timer
Bo thu sau bao lâu
Minimap
Bên phải:
Leaderboard realtime top 5
Dưới màn hình:
Thông báo item
Cảnh báo bo
Cảnh báo bị bắn
Cảnh báo combo
15.7 Popup câu hỏi
Gồm:
Chủ đề
Độ khó
Câu hỏi
4 đáp án
Countdown
Nút chọn đáp án
Kết quả đúng/sai
Giải thích ngắn
15.8 Màn hình kết quả
Hiển thị:
Top 3
Điểm từng player
Số câu đúng
Số câu sai
Max combo
Survival time
Nhân vật đã chọn
Danh hiệu vui:
Nhà lý luận tốc độ
Bậc thầy combo
Người sống sót bền bỉ
Chiến lược gia tri thức

16. Thiết kế âm thanh và hiệu ứng
Âm thanh:
Nhạc nền nhẹ, vui, không căng thẳng quá
Nhặt trái cây: âm thanh “pop”
Trả lời đúng: “ding”
Trả lời sai: âm trầm nhẹ
Combo: âm tăng năng lượng
Bo thu: âm cảnh báo nhẹ
Bắn năng lượng: âm sci-fi nhẹ, không giống súng thật
Hiệu ứng:
Knowledge Zone phát sáng
Skill nhân vật có aura riêng
Trái cây xoay nhẹ
Khi đúng câu hỏi có hiệu ứng ánh sáng
Khi sai có hiệu ứng rung nhẹ
Khi bo thu có viền sáng đỏ/cam

17. Backend realtime logic
Dùng SignalR hoặc Socket.IO.
Server quản lý:
Rooms
Players
GameState
SafeZone
QuestionZones
Items
Projectiles
Scores
Leaderboard
Character stats
Skill cooldown
Answer validation
Server phải kiểm tra:
Player có trong room không
Room đã full chưa
Host mới được start game
Player không được đổi nhân vật khi trận đã bắt đầu
Player không được tự sửa HP
Player không được tự sửa điểm
Player không được bắn khi hết ammo
Player không được spam bắn vượt cooldown
Player không được teleport
Player không được nhặt item ở xa
Player không được trả lời 1 câu nhiều lần
Realtime events cần có:
Room events:
createRoom
roomCreated
joinRoom
playerJoined
playerLeft
updateLobby
playerReady
startGame
gameStarted
endGame
gameEnded
Gameplay events:
playerInput
playerMoved
useSkill
skillActivated
skillCooldownUpdated
playerShoot
projectileSpawned
playerHit
itemSpawned
itemPicked
questionZoneSpawned
questionOpened
submitAnswer
answerResult
scoreUpdated
hpUpdated
comboUpdated
safeZoneUpdated
leaderboardUpdated
playerKnocked
playerRespawned
Tần suất update:
Player movement: 5–10 lần/giây
Safe zone: 1 lần/giây hoặc theo phase
Leaderboard: khi điểm thay đổi hoặc mỗi 3 giây
HP ngoài bo: 1 lần/giây
Item/question: theo event
Client dùng interpolation để chuyển động mượt.

18. Database schema đề xuất
Tạo các bảng sau.
Users
UserId
DisplayName
Email
Role
CreatedAt
Characters
CharacterId
CharacterName
AnimalType
MaxHP
MoveSpeed
HitboxSize
InitialAmmo
SkillName
SkillDescription
SkillCooldown
SkillDuration
ModelPath
IconPath
Topics
TopicId
TopicName
Description
Questions
QuestionId
TopicId
QuestionType
Difficulty
QuestionText
CorrectAnswer
Explanation
BaseScore
TimeLimit
QuestionOptions
OptionId
QuestionId
OptionLabel
OptionText
IsCorrect
Rooms
RoomId
RoomCode
HostId
Status
MaxPlayers
GameDuration
CreatedAt
StartedAt
EndedAt
RoomSettings
RoomSettingId
RoomId
QuestionTopic
DifficultyMode
EnableWeapon
EnableFruits
EnableItems
SafeZoneMode
RespawnMode
RoomPlayers
RoomPlayerId
RoomId
PlayerName
CharacterId
ConnectionId
IsReady
JoinedAt
GameResults
ResultId
RoomId
PlayerName
CharacterId
FinalScore
CorrectCount
WrongCount
MaxCombo
SurvivalTime
Rank
CreatedAt
AnswerLogs
AnswerLogId
RoomId
PlayerName
QuestionId
SelectedAnswer
IsCorrect
ScoreEarned
CreatedAt

19. Dữ liệu câu hỏi mẫu
Tạo sẵn ngân hàng câu hỏi về môn Chủ nghĩa xã hội khoa học. Mỗi câu hỏi cần có:
Topic
Difficulty
Type
Question
Options
CorrectAnswer
Explanation
BaseScore
PenaltyHP
Ví dụ câu hỏi:
Question 1:
Topic: Sự ra đời của CNXH khoa học
Difficulty: Easy
Type: Multiple Choice
Question: Chủ nghĩa xã hội khoa học do ai sáng lập?
A. Adam Smith và David Ricardo
B. C. Mác và Ph. Ăngghen
C. V.I. Lênin và Stalin
D. Hêghen và Phoiơbắc
CorrectAnswer: B
Explanation: Chủ nghĩa xã hội khoa học do C. Mác và Ph. Ăngghen sáng lập, là một trong ba bộ phận cấu thành của chủ nghĩa Mác - Lênin.
BaseScore: 100
PenaltyHP: 10
Question 2:
Topic: Giai cấp công nhân
Difficulty: Easy
Type: Multiple Choice
Question: Theo chủ nghĩa Mác - Lênin, giai cấp nào có sứ mệnh lịch sử trong việc xóa bỏ chủ nghĩa tư bản và xây dựng xã hội mới?
A. Giai cấp tư sản
B. Giai cấp công nhân
C. Địa chủ phong kiến
D. Tầng lớp quý tộc
CorrectAnswer: B
Explanation: Giai cấp công nhân được xem là lực lượng có sứ mệnh lịch sử do gắn với nền sản xuất hiện đại và đại diện cho phương thức sản xuất tiến bộ.
BaseScore: 100
PenaltyHP: 10
Question 3:
Topic: Thời kỳ quá độ
Difficulty: Medium
Type: Multiple Choice
Question: Thời kỳ quá độ lên chủ nghĩa xã hội là gì?
A. Giai đoạn chuyển biến từ xã hội cũ sang xã hội xã hội chủ nghĩa
B. Giai đoạn xã hội đã hoàn thiện tuyệt đối
C. Giai đoạn không còn tồn tại mâu thuẫn nào
D. Giai đoạn chỉ phát triển kinh tế, không cần chính trị
CorrectAnswer: A
Explanation: Thời kỳ quá độ là giai đoạn cải biến cách mạng lâu dài, trong đó xã hội cũ và các yếu tố mới cùng tồn tại, đấu tranh và chuyển hóa.
BaseScore: 200
PenaltyHP: 20
Question 4:
Topic: Dân chủ XHCN
Difficulty: Easy
Type: Multiple Choice
Question: Bản chất của dân chủ xã hội chủ nghĩa là gì?
A. Quyền lực thuộc về nhân dân
B. Quyền lực thuộc về một cá nhân
C. Quyền lực thuộc về tầng lớp bóc lột
D. Nhân dân không tham gia quản lý xã hội
CorrectAnswer: A
Explanation: Dân chủ xã hội chủ nghĩa nhấn mạnh quyền lực thuộc về nhân dân và nhân dân tham gia quản lý nhà nước, xã hội.
BaseScore: 100
PenaltyHP: 10
Question 5:
Topic: Nhà nước XHCN
Difficulty: Medium
Type: Multiple Choice
Question: Chức năng quan trọng của nhà nước xã hội chủ nghĩa là gì?
A. Tổ chức, quản lý xã hội và bảo vệ quyền làm chủ của nhân dân
B. Chỉ thu thuế mà không quản lý xã hội
C. Không cần pháp luật
D. Không cần bảo vệ lợi ích nhân dân
CorrectAnswer: A
Explanation: Nhà nước xã hội chủ nghĩa có chức năng tổ chức, quản lý, xây dựng xã hội mới và bảo vệ quyền, lợi ích chính đáng của nhân dân.
BaseScore: 200
PenaltyHP: 20
Question 6:
Topic: Dân tộc và tôn giáo
Difficulty: Medium
Type: Multiple Choice
Question: Quan điểm phù hợp trong giải quyết vấn đề tôn giáo là gì?
A. Tôn trọng quyền tự do tín ngưỡng, tôn giáo và bảo đảm sinh hoạt tôn giáo đúng pháp luật
B. Cấm tuyệt đối mọi tín ngưỡng
C. Lợi dụng tôn giáo để chia rẽ xã hội
D. Không cần phân biệt tín ngưỡng và mê tín
CorrectAnswer: A
Explanation: Cần tôn trọng quyền tự do tín ngưỡng, tôn giáo của nhân dân, đồng thời đấu tranh với việc lợi dụng tôn giáo để vi phạm pháp luật.
BaseScore: 200
PenaltyHP: 20
Question 7:
Topic: Gia đình
Difficulty: Easy
Type: Multiple Choice
Question: Gia đình thường được xem là gì trong xã hội?
A. Tế bào của xã hội
B. Một tổ chức không liên quan xã hội
C. Chỉ là nơi tiêu dùng
D. Một nhóm không có vai trò giáo dục
CorrectAnswer: A
Explanation: Gia đình là tế bào của xã hội, có vai trò quan trọng trong tái sản xuất con người, giáo dục và hình thành nhân cách.
BaseScore: 100
PenaltyHP: 10
Question 8:
Topic: Liên hệ thực tiễn
Difficulty: Hard
Type: Situation Choice
Question: Khi tiếp nhận thông tin chính trị - xã hội trên mạng, sinh viên nên làm gì?
A. Tin ngay mọi thông tin thấy đầu tiên
B. Kiểm chứng nguồn, đọc đa chiều và tránh chia sẻ thông tin sai lệch
C. Chia sẻ càng nhanh càng tốt dù chưa kiểm chứng
D. Chỉ đọc tiêu đề rồi kết luận
CorrectAnswer: B
Explanation: Công dân số cần có tư duy phản biện, kiểm chứng thông tin và có trách nhiệm khi tham gia không gian mạng.
BaseScore: 350
PenaltyHP: 30
Hãy tạo thêm ít nhất 50 câu hỏi đầy đủ theo các chủ đề:
Sự ra đời của CNXH khoa học
Giai cấp công nhân và sứ mệnh lịch sử
Đảng Cộng sản
Chủ nghĩa xã hội và thời kỳ quá độ
Dân chủ xã hội chủ nghĩa
Nhà nước xã hội chủ nghĩa
Cơ cấu xã hội và liên minh giai cấp
Dân tộc và tôn giáo
Gia đình trong thời kỳ quá độ
Liên hệ thực tiễn Việt Nam và thời đại số

20. Cách gắn câu hỏi với map
Mỗi Knowledge Zone có:
ZoneId
TopicId
Difficulty
Position
Radius
Status
Cooldown
RewardType
Khi player vào zone:
Server lấy topic của zone.
Server chọn câu hỏi theo topic và difficulty.
Ưu tiên câu hỏi player chưa trả lời trong trận.
Nếu hết câu hỏi mới random lại.
Nếu câu hỏi bị lặp, giảm 50% điểm.
Ví dụ:
Player vào “Nhà Dân Chủ”
Server chọn câu về Dân chủ XHCN
Difficulty Medium
Hiện câu Q022 hoặc tương tự

21. Yêu cầu chống gian lận
Server phải xử lý:
Không cho client tự sửa HP
Không cho client tự sửa điểm
Không cho client tự sửa ammo
Không cho client tự sửa cooldown skill
Không cho teleport bất thường
Không cho bắn nhanh hơn cooldown
Không cho dùng skill khi cooldown chưa xong
Không cho nhặt item ở xa
Không cho trả lời cùng câu nhiều lần
Không cho host giả nếu không đúng quyền
Không cho join room đã full
Không cho đổi nhân vật khi game đã bắt đầu

22. Yêu cầu hiệu năng
Với tối đa 50 người/room:
Movement update: 5–10 lần/giây
Server gửi snapshot vị trí: 5 lần/giây
Leaderboard update khi điểm thay đổi hoặc mỗi 3 giây
Safe zone update mỗi giây hoặc theo phase
HP ngoài bo tính mỗi giây
Game state lưu trong RAM khi trận đang chạy
Database chỉ lưu câu hỏi, room, answer logs và kết quả cuối trận
Không lưu vị trí player vào database liên tục
Client dùng interpolation để di chuyển mượt

23. MVP bắt buộc
Hãy ưu tiên xây MVP theo thứ tự:
Landing page
Create room
Join room
Lobby realtime
Chọn nhân vật động vật
Map 3D low-poly
Di chuyển nhân vật
HP và score
Knowledge Zone
Popup câu hỏi
Server chấm đúng/sai
Cộng điểm/trừ HP
Leaderboard realtime
Vòng bo thu nhỏ
Trái cây hồi HP
Súng năng lượng cơ bản
Skill nhân vật
Result screen
Không làm quá nhiều tính năng phụ trước khi hoàn thành gameplay chính.

24. Tính năng để sau MVP
Không làm ngay:
Voice chat
Skin shop
Nhiều loại súng
Map quá lớn
3D realistic
Ranking toàn trường
AI tạo câu hỏi realtime
Replay trận đấu
Team mode phức tạp
Mobile optimization hoàn chỉnh

25. Acceptance Criteria
Game được xem là đạt MVP nếu:
Host tạo room được.
Player join room bằng code được.
Tối đa 50 người có thể ở cùng room.
Lobby cập nhật realtime.
Player chọn được nhân vật.
Host start game được.
Player vào map 3D.
Player di chuyển được.
Các nhân vật có chỉ số khác nhau.
Skill nhân vật hoạt động và có cooldown.
Knowledge Zone xuất hiện trên map.
Player vào zone mở câu hỏi được.
Server chấm đáp án đúng/sai.
Trả lời đúng cộng điểm.
Trả lời sai trừ HP.
Có giải thích sau câu hỏi.
Trái cây hồi HP hoạt động.
Súng năng lượng hoạt động.
Player đang trả lời câu hỏi được bảo vệ khỏi sát thương.
Vòng bo thu nhỏ theo thời gian.
Player ngoài bo bị trừ HP.
Leaderboard cập nhật realtime.
Player HP = 0 bị knock và respawn theo Casual Mode.
Game kết thúc đúng thời gian host set.
Màn hình kết quả hiển thị top 3 và thống kê.

26. Output mong muốn từ bạn
Hãy tạo cho tôi:
Bản mô tả game hoàn chỉnh
Game Design Document chi tiết
System Requirement Specification
Luồng user flow
Wireframe mô tả các màn hình
Database schema
Danh sách API
Danh sách realtime events
Data model cho Characters, Players, Rooms, Questions
Logic vòng bo
Logic combat
Logic câu hỏi
Logic item
Logic skill nhân vật
Logic leaderboard
Pseudocode backend
Pseudocode frontend
Folder structure đề xuất
Danh sách task chia cho team
MVP roadmap
Danh sách câu hỏi mẫu cho môn Chủ nghĩa xã hội khoa học
Gợi ý UI/UX style
Gợi ý animation, âm thanh
Cách demo game khi thuyết trình trước lớp
Hãy trình bày rõ ràng, có bảng, có bullet, có logic đủ chi tiết để một nhóm sinh viên IT có thể đọc và bắt tay vào code prototype.

