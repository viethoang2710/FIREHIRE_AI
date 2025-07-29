package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.request.JobPostingRequest;
import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.JobPostingDTO;
import com.example.firehire_ai.service.JobPostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller đặc biệt cho các API liên quan đến nhà tuyển dụng
 */
@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "*")
public class RecruiterController {

    @Autowired
    private JobPostingService jobPostingService;

    /**
     * API để nhà tuyển dụng tạo tin tuyển dụng mới
     */
    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<JobPostingDTO>> createJobPosting(
            @RequestBody JobPostingRequest request) {
        return ResponseEntity.ok(jobPostingService.createJobPosting(request));
    }

    /**
     * API để nhà tuyển dụng lấy danh sách tin tuyển dụng của họ
     */
    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobPostingDTO>>> getRecruiterJobs(
            @RequestParam(required = false) Integer employerId) {
        // Nếu employerId được truyền vào, sử dụng nó
        // Trong thực tế, employerId nên được lấy từ JWT token thay vì tham số
        if (employerId != null) {
            return ResponseEntity.ok(jobPostingService.getJobPostingsByEmployer(employerId));
        } else {
            // Trả về danh sách rỗng hoặc báo lỗi tùy theo yêu cầu
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Thiếu thông tin nhà tuyển dụng", null));
        }
    }

    /**
     * API để nhà tuyển dụng cập nhật tin tuyển dụng
     */
    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<ApiResponse<JobPostingDTO>> updateJobPosting(
            @PathVariable Integer jobId,
            @RequestBody JobPostingRequest request) {
        // Thêm logic kiểm tra quyền sở hữu tin tuyển dụng
        return ResponseEntity.ok(jobPostingService.updateJobPosting(jobId, request));
    }

    /**
     * API để nhà tuyển dụng xóa tin tuyển dụng
     */
    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<ApiResponse<Void>> deleteJobPosting(@PathVariable Integer jobId) {
        // Thêm logic kiểm tra quyền sở hữu tin tuyển dụng
        return ResponseEntity.ok(jobPostingService.deleteJobPosting(jobId));
    }

    /**
     * API để nhà tuyển dụng xem chi tiết tin tuyển dụng
     */
    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<ApiResponse<JobPostingDTO>> getJobDetails(@PathVariable Integer jobId) {
        return ResponseEntity.ok(jobPostingService.getJobPostingById(jobId));
    }

    /**
     * API để nhà tuyển dụng xem danh sách ứng viên đã ứng tuyển vào một tin
     */
    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<ApiResponse<List<Object>>> getJobApplicants(@PathVariable Integer jobId) {
        // Cần triển khai service method cho chức năng này
        // Tạm thời trả về thông báo chưa triển khai
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Chức năng đang được phát triển", null));
    }

    /**
     * API để nhà tuyển dụng cập nhật trạng thái ứng viên
     */
    @PatchMapping("/jobs/{jobId}/applicants/{applicantId}")
    public ResponseEntity<ApiResponse<Object>> updateApplicantStatus(
            @PathVariable Integer jobId,
            @PathVariable Integer applicantId,
            @RequestParam String status) {
        // Cần triển khai service method cho chức năng này
        // Tạm thời trả về thông báo chưa triển khai
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Chức năng đang được phát triển", null));
    }
}
