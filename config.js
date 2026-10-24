/**
 * Modern Minimal Wedding Invitation Configuration
 *
 * Edit the values below to customize your wedding invitation.
 * Image files should be placed in the corresponding images/ subfolders
 * using sequential filenames (1.jpg, 2.jpg, ...).
 * The code auto-detects images by trying sequential filenames.
 *
 * Image folder conventions:
 *   images/hero/1.jpg       - Main wedding photo (single file)
 *   images/story/1.jpg, ... - Story section photos (auto-detected)
 *   images/gallery/1.jpg, . - Gallery photos (auto-detected)
 *   images/location/1.jpg   - Venue/map image (single file)
 *   images/og/1.jpg         - Kakao share thumbnail (single file)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "김정현",
    nameEn: "김정현",
    father: "김동주",
    mother: "윤미숙",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "변소현",
    nameEn: "변소현",
    father: "변태양",
    mother: "박춘경",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2027-03-06",
    time: "12:10",
    venue: "수원 파티웨딩유",
    hall: "2층 아모르홀",
    address: "경기 수원시 권선구 세화로 218",
    tel: "031-297-1000",
    mapLinks: {
      kakao: "https://place.map.kakao.com/18152810",
      naver: "https://naver.me/GkR3XjYm"
    }
  },

  // ── 인사말 ──
  invitation: {
    title: "소중한 분들을 초대합니다",
    message: "8년의 시간을 함께 걸어온 두 사람이\n이제 부부라는 이름으로 새로운 시작을 합니다.\n\n소중한 분들을 모시고\n그 시작을 함께 나누고 싶습니다.\n\n귀한 걸음으로 축복해 주시면 감사하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "같은 학교에서 같은 교복을 입고 처음 만나\n함께 웃고, 맛있는 것을 먹으러 다니며\n소소한 일상을 나누어 온 저희가\n어느덧 서로의 가장 가까운 사람이 되었습니다.\n\n즐거운 날에는 함께 웃고,\n평범한 날에는 작은 행복을 나누며\n오랜 시간 서로의 곁을 지켜왔습니다.\n\n이제는 같은 집에서 하루를 마무리하고,\n함께 앉은 식탁에서 소소한 행복을 나누며\n앞으로의 수많은 날들을 함께하려 합니다.\n\n귀한 걸음으로 함께해 주시어\n따뜻한 축복을 보내 주시면 감사하겠습니다."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "김정현", bank: "농협은행", number: "351-0506-2445-33" },
      { role: "아버지", name: "김동주", bank: "농협은행", number: "260-02-077563" },
      { role: "어머니", name: "윤미숙", bank: "농협은행", number: "335064-51-011473" }
    ],
    bride: [
      { role: "신부", name: "변소현", bank: "농협은행", number: "335090-51-031352" },
      { role: "아버지", name: "변태양", bank: "농협은행", number: "351-0674-3682-33" },
      { role: "어머니", name: "박춘경", bank: "농협은행", number: "351-0574-9589-93" }
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  kakaoShare: {
    jsKey: "",
    title: "정현♥소현 결혼식에 초대합니다",
    description: ""
  }
};
