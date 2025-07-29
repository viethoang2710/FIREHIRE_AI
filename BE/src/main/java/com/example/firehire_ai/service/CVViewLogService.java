package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.request.CVViewLogRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.CVViewLogDTO;
import com.example.firehire_ai.entity.CV;
import com.example.firehire_ai.entity.CVViewLog;
import com.example.firehire_ai.entity.Employer;
import com.example.firehire_ai.repository.CVRepository;
import com.example.firehire_ai.repository.CVViewLogRepository;
import com.example.firehire_ai.repository.EmployerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CVViewLogService {

    @Autowired
    private CVViewLogRepository cvViewLogRepository;

    @Autowired
    private CVRepository cvRepository;

    @Autowired
    private EmployerRepository employerRepository;

    public ApiResponse<CVViewLogDTO> logCVView(CVViewLogRequest request) {
        try {
            // Find CV
            Optional<CV> cvOptional = cvRepository.findById(request.getCvId());
            if (cvOptional.isEmpty()) {
                return ApiResponse.<CVViewLogDTO>error("CV not found");
            }

            // Find employer
            Optional<Employer> employerOptional = employerRepository.findById(request.getEmployerId());
            if (employerOptional.isEmpty()) {
                return ApiResponse.<CVViewLogDTO>error("Employer not found");
            }

            CV cv = cvOptional.get();
            Employer employer = employerOptional.get();

            // Create log entry
            CVViewLog viewLog = CVViewLog.builder()
                    .cv(cv)
                    .employer(employer)
                    .build();

            viewLog = cvViewLogRepository.save(viewLog);

            return ApiResponse.success("CV view logged successfully", CVViewLogDTO.fromEntity(viewLog));
        } catch (Exception e) {
            return ApiResponse.<CVViewLogDTO>error("Failed to log CV view: " + e.getMessage());
        }
    }

    public ApiResponse<List<CVViewLogDTO>> getCVViewLogsByCV(Integer cvId) {
        // Verify CV exists
        if (!cvRepository.existsById(cvId)) {
            return ApiResponse.<List<CVViewLogDTO>>error("CV not found");
        }

        List<CVViewLog> viewLogs = cvViewLogRepository.findByCv_CvId(cvId);
        List<CVViewLogDTO> viewLogDTOs = viewLogs.stream()
                .map(CVViewLogDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(viewLogDTOs);
    }

    public ApiResponse<List<CVViewLogDTO>> getCVViewLogsByEmployer(Integer employerId) {
        // Verify employer exists
        if (!employerRepository.existsById(employerId)) {
            return ApiResponse.<List<CVViewLogDTO>>error("Employer not found");
        }

        List<CVViewLog> viewLogs = cvViewLogRepository.findByEmployer_EmployerId(employerId);
        List<CVViewLogDTO> viewLogDTOs = viewLogs.stream()
                .map(CVViewLogDTO::fromEntity)
                .collect(Collectors.toList());

        return ApiResponse.success(viewLogDTOs);
    }
}
