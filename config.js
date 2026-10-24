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
      naver: "https://naver.me/GkR3XjYm",
      kakaoNavi: "",  // 비워두면 카카오맵 링크로 연결됩니다
      tmap: ""        // 비워두면 주소 기준으로 티맵 앱이 열립니다
    },
    // 대중교통 이용안내 (펼침 메뉴) - 항목 추가/삭제 가능, 줄바꿈은 \n
    transit: [
      {
        title: "🚇 대중교통 이용안내",
        content: "🚇 지하철\n수원역 하차 (1호선, 수인분당선)\n\n🚌 버스\n수원역 정류장 하차\n\n🚶 도보\n수원역 4번 출구에서 800m\n(교통안전공단 방향으로 약 15분 소요)\n\n🚐 셔틀버스\n수원역 지하상가 13번 출구 앞 정류장 탑승\n- 운행시간 11:10 ~ 14:10\n- 운행간격 5~10분으로 수시운행"
      }
    ]
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

  // ── 안내사항 (오시는 길 하단, 펼침 메뉴) ──
  // items를 추가/삭제/수정하면 메뉴가 자동으로 바뀝니다. (줄바꿈은 \n, 제목에 이모지 사용 가능)
  info: {
    title: "안내사항",
    message: "본 예식장은 단독홀에서 단독 예식으로 진행되며\n참석하시는 모든 분들께서\n뜻깊고 편안한 시간 보내실 수 있도록\n아래와 같이 안내드립니다.",
    items: [
      { title: "🅿️ 주차 안내", content: "최대 700대를 수용할 수 있는 대형 주차장이 마련되어 있으며, 무료 주차가 가능합니다.\n주차요원의 안내에 따라 주차 부탁드립니다." },
      { title: "🏠 예식장 안내", content: "본 예식장은 층별로 다음과 같이 배치되어 있습니다.\n\n1층 로비 : 축의 접수 및 식권 배부\n2층 웨딩홀 : 예식 및 신부대기실\n3층 연회장 : 피로연 및 식사" },
      { title: "🍽️ 식사 안내", content: "연회에서는 남녀노소 누구나 즐기실 수 있는 한정식과 세미뷔페가 준비되어 있습니다.\n한정식 메뉴는 1회 리필이 가능하며, 단 전복·장어·갈비탕은 제외됩니다." }
    ]
  },

  // ── 참석여부 (RSVP) ──
  // 응답을 받는 방법 (둘 중 하나만 설정하면 됩니다)
  //  1) endpoint: 구글 시트로 자동 저장 (rsvp-apps-script.gs 설명 참고) - 추천
  //  2) phone: endpoint가 비어 있으면, 입력 내용이 문자 메시지 작성 화면으로 넘어갑니다
  rsvp: {
    enabled: true,   // false로 하면 참석여부 섹션이 숨겨집니다
    title: "참석여부",
    message: "특별한 날 함께해 주시는 모든 분들을\n한 분 한 분 정성스럽게 맞이할 수 있도록,\n\n하단의 버튼을 통해 신랑 또는 신부에게\n참석 여부를 꼭 전달해 주시기 바랍니다.",
    buttonText: "참석의사 전달하기",
    banner: true,    // 화면 하단에 "참석의사 전달하기" 버튼 고정 표시 (false: 끄기)
    endpoint: "https://script.google.com/macros/s/AKfycbxaHtdyPies_g016xgJBCAMhgyFy1fS_GNlqsQWqUOjqKN9qcUhMIfMe8L8Zq2nTzS2/exec",   // 예: "https://script.google.com/macros/s/XXXX/exec"
    phone: {
      groom: "",     // 신랑측 휴대폰 번호 (예: "01012345678")
      bride: ""      // 신부측 휴대폰 번호
    }
  },

  // ── 마음 전하실 곳 ──
  accounts: {
    // 마음 전하실 곳 상단에 표시되는 안내 문구 (줄바꿈은 \n, 비워두면 표시되지 않음)
    comment: "참석이 어려우신 분들을 위해\n계좌번호를 기재하였습니다.\n너그러운 마음으로 양해 부탁드립니다.",
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
