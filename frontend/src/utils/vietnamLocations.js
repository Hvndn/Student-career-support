// Dữ liệu mẫu Tỉnh/Thành phố và Quận/Huyện cho Modal Đăng tin
export const vietnamLocations = [
  {
    id: "01",
    name: "Hà Nội",
    districts: [
      { id: "001", name: "Quận Ba Đình" },
      { id: "002", name: "Quận Hoàn Kiếm" },
      { id: "003", name: "Quận Tây Hồ" },
      { id: "004", name: "Quận Long Biên" },
      { id: "005", name: "Quận Cầu Giấy" },
      { id: "006", name: "Quận Đống Đa" },
      { id: "007", name: "Quận Hai Bà Trưng" },
      { id: "008", name: "Quận Hoàng Mai" },
      { id: "009", name: "Quận Thanh Xuân" },
    ]
  },
  {
    id: "79",
    name: "Thành phố Hồ Chí Minh",
    districts: [
      { id: "760", name: "Quận 1" },
      { id: "761", name: "Quận 12" },
      { id: "764", name: "Quận Gò Vấp" },
      { id: "765", name: "Quận Bình Thạnh" },
      { id: "766", name: "Quận Tân Bình" },
      { id: "767", name: "Quận Tân Phú" },
      { id: "768", name: "Quận Phú Nhuận" },
      { id: "769", name: "Thành phố Thủ Đức" },
      { id: "770", name: "Quận 3" },
      { id: "771", name: "Quận 10" },
      { id: "772", name: "Quận 11" },
      { id: "773", name: "Quận 4" },
      { id: "774", name: "Quận 5" },
      { id: "775", name: "Quận 6" },
      { id: "776", name: "Quận 8" },
      { id: "777", name: "Quận Bình Tân" },
      { id: "778", name: "Quận 7" },
    ]
  },
  {
    id: "48",
    name: "Đà Nẵng",
    districts: [
      { id: "490", name: "Quận Liên Chiểu" },
      { id: "491", name: "Quận Thanh Khê" },
      { id: "492", name: "Quận Hải Châu" },
      { id: "493", name: "Quận Sơn Trà" },
      { id: "494", name: "Quận Ngũ Hành Sơn" },
      { id: "495", name: "Quận Cẩm Lệ" },
    ]
  },
  {
    id: "31",
    name: "Hải Phòng",
    districts: [
      { id: "303", name: "Quận Hồng Bàng" },
      { id: "304", name: "Quận Ngô Quyền" },
      { id: "305", name: "Quận Lê Chân" },
      { id: "306", name: "Quận Hải An" },
      { id: "307", name: "Quận Kiến An" },
      { id: "308", name: "Quận Đồ Sơn" },
      { id: "309", name: "Quận Dương Kinh" },
    ]
  },
  {
    id: "92",
    name: "Cần Thơ",
    districts: [
      { id: "916", name: "Quận Ninh Kiều" },
      { id: "917", name: "Quận Ô Môn" },
      { id: "918", name: "Quận Bình Thuỷ" },
      { id: "919", name: "Quận Cái Răng" },
      { id: "923", name: "Quận Thốt Nốt" },
    ]
  }
];

// Fallback list of provinces if flat structure is needed
export const PROVINCES_LIST = vietnamLocations.map(loc => loc.name);
