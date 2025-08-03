package com.example.firehire_ai.service;

import com.example.firehire_ai.dto.response.ApiResponse;
import com.example.firehire_ai.dto.response.StatisticsDTO;
import com.example.firehire_ai.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class StatisticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EmployerRepository employerRepository;

    public ApiResponse<StatisticsDTO> getSystemStatistics(Integer days) {
        try {
            StatisticsDTO statistics = StatisticsDTO.builder()
                    .overview(getOverviewStatistics().getData())
                    .userGrowth(getUserGrowthData(days).getData())
                    .jobStatistics(getJobStatistics(6).getData())
                    .applicationStats(getApplicationStatistics(6).getData())
                    .topCompanies(getTopCompanies(5).getData())
                    .categoryDistribution(getCategoryDistribution().getData())
                    .build();

            return ApiResponse.success(statistics);
        } catch (Exception e) {
            return ApiResponse.error("Failed to load statistics: " + e.getMessage());
        }
    }

    public ApiResponse<StatisticsDTO.Overview> getOverviewStatistics() {
        try {
            LocalDateTime today = LocalDate.now().atStartOfDay();
            LocalDateTime tomorrow = today.plusDays(1);
            LocalDateTime yesterday = today.minusDays(1);

            // Get current totals
            Long totalUsers = userRepository.count();
            Long totalJobs = jobPostingRepository.count();
            Long totalCompanies = employerRepository.count();
            Long totalApplications = applicationRepository.count();

            // Get today's counts
            Long newUsersToday = userRepository.countByCreatedAtBetween(today, tomorrow);
            Long jobsPostedToday = jobPostingRepository.countByCreatedAtBetween(today, tomorrow);
            Long applicationsToday = applicationRepository.countByAppliedAtBetween(today, tomorrow);

            // Get yesterday's counts for growth calculation
            Long newUsersYesterday = userRepository.countByCreatedAtBetween(yesterday, today);
            Long jobsPostedYesterday = jobPostingRepository.countByCreatedAtBetween(yesterday, today);
            Long applicationsYesterday = applicationRepository.countByAppliedAtBetween(yesterday, today);

            // Calculate growth rates
            Double userGrowthRate = calculateGrowthRate(newUsersToday, newUsersYesterday);
            Double jobGrowthRate = calculateGrowthRate(jobsPostedToday, jobsPostedYesterday);
            Double applicationGrowthRate = calculateGrowthRate(applicationsToday, applicationsYesterday);

            // Active users (users who have logged in in the last 7 days)
            LocalDateTime weekAgo = today.minusDays(7);
            Long activeUsers = userRepository.countByLastLoginAfter(weekAgo);

            StatisticsDTO.Overview overview = StatisticsDTO.Overview.builder()
                    .totalUsers(totalUsers)
                    .totalJobs(totalJobs)
                    .totalCompanies(totalCompanies)
                    .totalApplications(totalApplications)
                    .activeUsers(activeUsers)
                    .newUsersToday(newUsersToday)
                    .jobsPostedToday(jobsPostedToday)
                    .applicationsToday(applicationsToday)
                    .userGrowthRate(userGrowthRate)
                    .jobGrowthRate(jobGrowthRate)
                    .applicationGrowthRate(applicationGrowthRate)
                    .build();

            return ApiResponse.success(overview);
        } catch (Exception e) {
            return ApiResponse.error("Failed to load overview statistics: " + e.getMessage());
        }
    }

    public ApiResponse<StatisticsDTO.UserGrowthData> getUserGrowthData(Integer days) {
        try {
            List<StatisticsDTO.UserGrowthPoint> growthData = new ArrayList<>();
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = endDate.minusDays(days);

            for (int i = 0; i < days; i++) {
                LocalDate currentDate = startDate.plusDays(i);
                LocalDateTime dayStart = currentDate.atStartOfDay();
                LocalDateTime dayEnd = dayStart.plusDays(1);

                Long newUsersOnDay = userRepository.countByCreatedAtBetween(dayStart, dayEnd);
                Long totalUsersUpToDay = userRepository.countByCreatedAtBefore(dayEnd);

                StatisticsDTO.UserGrowthPoint point = StatisticsDTO.UserGrowthPoint.builder()
                        .date(currentDate.toString())
                        .users(totalUsersUpToDay)
                        .newUsers(newUsersOnDay)
                        .build();

                growthData.add(point);
            }

            StatisticsDTO.UserGrowthData data = StatisticsDTO.UserGrowthData.builder()
                    .data(growthData)
                    .build();

            return ApiResponse.success(data);
        } catch (Exception e) {
            return ApiResponse.error("Failed to load user growth data: " + e.getMessage());
        }
    }

    public ApiResponse<StatisticsDTO.JobStatisticsData> getJobStatistics(Integer months) {
        try {
            List<StatisticsDTO.JobStatPoint> jobStats = new ArrayList<>();
            LocalDate endDate = LocalDate.now();

            for (int i = months - 1; i >= 0; i--) {
                LocalDate monthDate = endDate.minusMonths(i);
                LocalDateTime monthStart = monthDate.withDayOfMonth(1).atStartOfDay();
                LocalDateTime monthEnd = monthStart.plusMonths(1);

                Long posted = jobPostingRepository.countByCreatedAtBetween(monthStart, monthEnd);
                Long approved = jobPostingRepository.countByCreatedAtBetweenAndStatus(monthStart, monthEnd, "ACTIVE");
                Long rejected = jobPostingRepository.countByCreatedAtBetweenAndStatus(monthStart, monthEnd, "INACTIVE");
                Long active = jobPostingRepository.countByStatus("ACTIVE");

                String monthLabel = "T" + monthDate.getMonthValue();

                StatisticsDTO.JobStatPoint point = StatisticsDTO.JobStatPoint.builder()
                        .month(monthLabel)
                        .posted(posted)
                        .approved(approved)
                        .rejected(rejected)
                        .active(active)
                        .build();

                jobStats.add(point);
            }

            StatisticsDTO.JobStatisticsData data = StatisticsDTO.JobStatisticsData.builder()
                    .data(jobStats)
                    .build();

            return ApiResponse.success(data);
        } catch (Exception e) {
            return ApiResponse.error("Failed to load job statistics: " + e.getMessage());
        }
    }

    public ApiResponse<StatisticsDTO.ApplicationStatsData> getApplicationStatistics(Integer months) {
        try {
            List<StatisticsDTO.ApplicationStatPoint> applicationStats = new ArrayList<>();
            LocalDate endDate = LocalDate.now();

            for (int i = months - 1; i >= 0; i--) {
                LocalDate monthDate = endDate.minusMonths(i);
                LocalDateTime monthStart = monthDate.withDayOfMonth(1).atStartOfDay();
                LocalDateTime monthEnd = monthStart.plusMonths(1);

                Long applications = applicationRepository.countByAppliedAtBetween(monthStart, monthEnd);
                Long pending = applicationRepository.countByAppliedAtBetweenAndStatus(monthStart, monthEnd, "pending");
                Long accepted = applicationRepository.countByAppliedAtBetweenAndStatus(monthStart, monthEnd,
                        "accepted");
                Long rejected = applicationRepository.countByAppliedAtBetweenAndStatus(monthStart, monthEnd,
                        "rejected");

                String monthLabel = monthDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));

                StatisticsDTO.ApplicationStatPoint point = StatisticsDTO.ApplicationStatPoint.builder()
                        .date(monthLabel)
                        .applications(applications)
                        .pending(pending)
                        .accepted(accepted)
                        .rejected(rejected)
                        .build();

                applicationStats.add(point);
            }

            StatisticsDTO.ApplicationStatsData data = StatisticsDTO.ApplicationStatsData.builder()
                    .data(applicationStats)
                    .build();

            return ApiResponse.success(data);
        } catch (Exception e) {
            return ApiResponse.error("Failed to load application statistics: " + e.getMessage());
        }
    }

    public ApiResponse<StatisticsDTO.TopCompaniesData> getTopCompanies(Integer limit) {
        try {
            Pageable pageable = PageRequest.of(0, limit);
            List<Object[]> topCompaniesData = employerRepository.findTopCompaniesByJobCount(pageable);
            List<StatisticsDTO.CompanyStatPoint> companies = new ArrayList<>();

            for (Object[] row : topCompaniesData) {
                String companyName = (String) row[0];
                Long jobCount = ((Number) row[1]).longValue();
                Long applicationCount = ((Number) row[2]).longValue();

                StatisticsDTO.CompanyStatPoint point = StatisticsDTO.CompanyStatPoint.builder()
                        .name(companyName)
                        .jobs(jobCount)
                        .applications(applicationCount)
                        .logo("https://via.placeholder.com/40") // Default placeholder
                        .build();

                companies.add(point);
            }

            StatisticsDTO.TopCompaniesData data = StatisticsDTO.TopCompaniesData.builder()
                    .data(companies)
                    .build();

            return ApiResponse.success(data);
        } catch (Exception e) {
            return ApiResponse.error("Failed to load top companies: " + e.getMessage());
        }
    }

    public ApiResponse<StatisticsDTO.CategoryDistributionData> getCategoryDistribution() {
        try {
            List<Object[]> categoryData = jobPostingRepository.findCategoryDistribution();
            List<StatisticsDTO.CategoryPoint> categories = new ArrayList<>();

            String[] colors = { "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6B7280", "#EC4899",
                    "#14B8A6" };

            Long totalJobs = jobPostingRepository.count();

            for (int i = 0; i < categoryData.size(); i++) {
                Object[] row = categoryData.get(i);
                String categoryName = (String) row[0];
                Long count = ((Number) row[1]).longValue();
                Double percentage = (count.doubleValue() / totalJobs.doubleValue()) * 100;

                StatisticsDTO.CategoryPoint point = StatisticsDTO.CategoryPoint.builder()
                        .name(categoryName != null ? categoryName : "Không xác định")
                        .value(count)
                        .percentage(Math.round(percentage * 10.0) / 10.0)
                        .color(colors[i % colors.length])
                        .build();

                categories.add(point);
            }

            StatisticsDTO.CategoryDistributionData data = StatisticsDTO.CategoryDistributionData.builder()
                    .data(categories)
                    .build();

            return ApiResponse.success(data);
        } catch (Exception e) {
            return ApiResponse.error("Failed to load category distribution: " + e.getMessage());
        }
    }

    private Double calculateGrowthRate(Long current, Long previous) {
        if (previous == null || previous == 0) {
            return current != null && current > 0 ? 100.0 : 0.0;
        }
        if (current == null) {
            return -100.0;
        }
        return ((current.doubleValue() - previous.doubleValue()) / previous.doubleValue()) * 100.0;
    }
}
