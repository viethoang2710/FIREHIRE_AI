package com.example.firehire_ai.controller;

import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.StatisticsDTO;
import com.example.firehire_ai.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<ApiResponse<StatisticsDTO>> getSystemStatistics(
            @RequestParam(defaultValue = "30") Integer days) {

        ApiResponse<StatisticsDTO> response = statisticsService.getSystemStatistics(days);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<StatisticsDTO> getDashboardStatistics(
            @RequestParam(defaultValue = "30") Integer days) {

        // Trả về dữ liệu trực tiếp không có wrapper ApiResponse
        ApiResponse<StatisticsDTO> response = statisticsService.getSystemStatistics(days);
        return ResponseEntity.ok(response.getData());
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<StatisticsDTO.Overview>> getOverviewStatistics() {
        ApiResponse<StatisticsDTO.Overview> response = statisticsService.getOverviewStatistics();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-growth")
    public ResponseEntity<ApiResponse<StatisticsDTO.UserGrowthData>> getUserGrowthData(
            @RequestParam(defaultValue = "30") Integer days) {

        ApiResponse<StatisticsDTO.UserGrowthData> response = statisticsService.getUserGrowthData(days);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/job-statistics")
    public ResponseEntity<ApiResponse<StatisticsDTO.JobStatisticsData>> getJobStatistics(
            @RequestParam(defaultValue = "6") Integer months) {

        ApiResponse<StatisticsDTO.JobStatisticsData> response = statisticsService.getJobStatistics(months);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/application-stats")
    public ResponseEntity<ApiResponse<StatisticsDTO.ApplicationStatsData>> getApplicationStatistics(
            @RequestParam(defaultValue = "6") Integer months) {

        ApiResponse<StatisticsDTO.ApplicationStatsData> response = statisticsService.getApplicationStatistics(months);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-companies")
    public ResponseEntity<ApiResponse<StatisticsDTO.TopCompaniesData>> getTopCompanies(
            @RequestParam(defaultValue = "5") Integer limit) {

        ApiResponse<StatisticsDTO.TopCompaniesData> response = statisticsService.getTopCompanies(limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category-distribution")
    public ResponseEntity<ApiResponse<StatisticsDTO.CategoryDistributionData>> getCategoryDistribution() {
        ApiResponse<StatisticsDTO.CategoryDistributionData> response = statisticsService.getCategoryDistribution();
        return ResponseEntity.ok(response);
    }
}
