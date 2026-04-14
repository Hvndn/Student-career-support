package com.fivecore.jobportal.service.admin;

import com.fivecore.jobportal.entity.CvTemplate;
import com.fivecore.jobportal.repository.CvTemplateRepository;
import com.fivecore.jobportal.service.common.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CvTemplateService {

    private final CvTemplateRepository cvTemplateRepository;
    private final StorageService storageService;

    public List<CvTemplate> getAllTemplates() {
        return cvTemplateRepository.findAll();
    }

    public List<CvTemplate> getActiveTemplates() {
        return cvTemplateRepository.findByIsActiveTrue();
    }

    public List<CvTemplate> getTemplatesByCategory(String category) {
        return cvTemplateRepository.findByCategory(category);
    }

    public List<CvTemplate> getActivateTemplatesByCategory(String category) {
        return cvTemplateRepository.findByIsActiveTrueAndCategory(category);
    }

    public CvTemplate getTemplateById(Integer id) {
        return cvTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu CV với ID: " + id));
    }

    @Transactional
    public CvTemplate createTemplate(CvTemplate template, MultipartFile thumbnail) {
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String thumbUrl = storageService.saveFile(thumbnail, "cv-templates");
            template.setThumbnailUrl(thumbUrl);
        }
        return cvTemplateRepository.save(template);
    }

    @Transactional
    public CvTemplate updateTemplate(Integer id, CvTemplate templateDetails, MultipartFile thumbnail) {
        CvTemplate template = getTemplateById(id);
        
        template.setName(templateDetails.getName());
        template.setCategory(templateDetails.getCategory());
        template.setLayoutKey(templateDetails.getLayoutKey());
        template.setDescription(templateDetails.getDescription());
        template.setActive(templateDetails.isActive());

        if (thumbnail != null && !thumbnail.isEmpty()) {
            String thumbUrl = storageService.saveFile(thumbnail, "cv-templates");
            template.setThumbnailUrl(thumbUrl);
        }

        return cvTemplateRepository.save(template);
    }

    @Transactional
    public void deleteTemplate(Integer id) {
        CvTemplate template = getTemplateById(id);
        cvTemplateRepository.delete(template);
    }

    @Transactional
    public CvTemplate toggleStatus(Integer id) {
        CvTemplate template = getTemplateById(id);
        template.setActive(!template.isActive());
        return cvTemplateRepository.save(template);
    }
}
