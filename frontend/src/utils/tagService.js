/**
 * TagService - Quản lý thẻ ứng viên phía Frontend sử dụng localStorage
 */

const STORAGE_KEYS = {
    TAG_DEFINITIONS: 'company_tag_definitions',
    CANDIDATE_TAGS: 'company_candidate_tags_mapping'
};

// Dữ liệu mẫu ban đầu nếu localStorage trống
const DEFAULT_TAGS = [
    { id: 1, name: 'Ứng viên tiềm năng', color: '#7c3aed', auto: 'Kinh nghiệm > 3 năm', status: true },
    { id: 2, name: 'Phỏng vấn đạt', color: '#10b981', auto: 'Không có', status: true },
    { id: 3, name: 'Cần cân nhắc', color: '#f59e0b', auto: 'Kỹ năng chưa đủ', status: false },
    { id: 4, name: 'Blacklist', color: '#ef4444', auto: 'Không đến phỏng vấn', status: true },
];

export const tagService = {
    // --- Quản lý Định nghĩa Thẻ ---
    
    getTags: () => {
        const stored = localStorage.getItem(STORAGE_KEYS.TAG_DEFINITIONS);
        if (!stored) {
            localStorage.setItem(STORAGE_KEYS.TAG_DEFINITIONS, JSON.stringify(DEFAULT_TAGS));
            return DEFAULT_TAGS;
        }
        return JSON.parse(stored);
    },

    saveTags: (tags) => {
        localStorage.setItem(STORAGE_KEYS.TAG_DEFINITIONS, JSON.stringify(tags));
    },

    addTag: (tag) => {
        const tags = tagService.getTags();
        const newTag = {
            ...tag,
            id: Date.now(), // Unique ID simple
            count: 0
        };
        tags.push(newTag);
        tagService.saveTags(tags);
        return newTag;
    },

    updateTag: (updatedTag) => {
        const tags = tagService.getTags();
        const index = tags.findIndex(t => t.id === updatedTag.id);
        if (index !== -1) {
            tags[index] = updatedTag;
            tagService.saveTags(tags);
        }
    },

    deleteTag: (tagId) => {
        const tags = tagService.getTags();
        const filtered = tags.filter(t => t.id !== tagId);
        tagService.saveTags(filtered);
        
        // Dọn dẹp cả mapping của ứng viên
        const mappings = tagService.getAllMappings();
        Object.keys(mappings).forEach(studentId => {
            mappings[studentId] = mappings[studentId].filter(id => id !== tagId);
        });
        localStorage.setItem(STORAGE_KEYS.CANDIDATE_TAGS, JSON.stringify(mappings));
    },

    // --- Quản lý Gắn thẻ cho Ứng viên ---

    getAllMappings: () => {
        const stored = localStorage.getItem(STORAGE_KEYS.CANDIDATE_TAGS);
        return stored ? JSON.parse(stored) : {};
    },

    getCandidateTags: (studentId) => {
        const mappings = tagService.getAllMappings();
        const tagIds = mappings[studentId] || [];
        const allTags = tagService.getTags();
        return allTags.filter(t => tagIds.includes(t.id));
    },

    attachTag: (studentId, tagId) => {
        const mappings = tagService.getAllMappings();
        if (!mappings[studentId]) mappings[studentId] = [];
        if (!mappings[studentId].includes(tagId)) {
            mappings[studentId].push(tagId);
            localStorage.setItem(STORAGE_KEYS.CANDIDATE_TAGS, JSON.stringify(mappings));
        }
    },

    detachTag: (studentId, tagId) => {
        const mappings = tagService.getAllMappings();
        if (mappings[studentId]) {
            mappings[studentId] = mappings[studentId].filter(id => id !== tagId);
            localStorage.setItem(STORAGE_KEYS.CANDIDATE_TAGS, JSON.stringify(mappings));
        }
    },

    toggleTag: (studentId, tagId) => {
        const mappings = tagService.getAllMappings();
        if (!mappings[studentId]) mappings[studentId] = [];
        
        const index = mappings[studentId].indexOf(tagId);
        if (index === -1) {
            mappings[studentId].push(tagId);
        } else {
            mappings[studentId].splice(index, 1);
        }
        localStorage.setItem(STORAGE_KEYS.CANDIDATE_TAGS, JSON.stringify(mappings));
    },

    // Lấy số lượng ứng viên đã gắn của một thẻ
    getTagUsageCount: (tagId) => {
        const mappings = tagService.getAllMappings();
        let count = 0;
        Object.values(mappings).forEach(tagIds => {
            if (tagIds.includes(tagId)) count++;
        });
        return count;
    }
};
