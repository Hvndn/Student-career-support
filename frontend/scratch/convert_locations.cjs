const fs = require('fs');
const path = require('path');

const jsonPath = "C:\\Users\\LAPTOP AK\\.gemini\\antigravity\\brain\\48966ca5-09c6-4cff-9ded-c399d6e352d5\\.system_generated\\steps\\984\\content.md";
const targetPath = "d:\\Doan\\Student-career-support\\frontend\\src\\utils\\vietnamLocations.js";

try {
    const rawContent = fs.readFileSync(jsonPath, 'utf8');
    // Remove the Source header and the --- separator
    const jsonStr = rawContent.split('---')[1].trim();
    const data = JSON.parse(jsonStr);

    const formattedData = data.map(province => ({
        id: String(province.code),
        name: province.name.replace('Thành phố ', '').replace('Tỉnh ', ''),
        wards: (province.wards || []).map(ward => ({
            id: String(ward.code),
            name: ward.name
        }))
    }));

    const jsContent = `// Danh sách đầy đủ Tỉnh/Thành phố và Xã/Phường Việt Nam (Cập nhật 2025)
export const vietnamLocations = ${JSON.stringify(formattedData, null, 2)};

export const PROVINCES_LIST = vietnamLocations.map(loc => loc.name);

export const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .trim();
};

export const findProvinceFuzzy = (query) => {
  if (!query) return [];
  const normalizedQuery = normalizeString(query);
  return vietnamLocations.filter(loc => {
    const normalizedName = normalizeString(loc.name);
    return normalizedName.includes(normalizedQuery);
  });
};
`;

    fs.writeFileSync(targetPath, jsContent);
    console.log('Successfully updated vietnamLocations.js with full data.');
} catch (err) {
    console.error('Error processing JSON:', err);
}
