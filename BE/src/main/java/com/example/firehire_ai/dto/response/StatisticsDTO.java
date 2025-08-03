package com.example.firehire_ai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatisticsDTO {
    private Overview overview;
    private UserGrowthData userGrowth;
    private JobStatisticsData jobStatistics;
    private ApplicationStatsData applicationStats;
    private TopCompaniesData topCompanies;
    private CategoryDistributionData categoryDistribution;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Overview {
        private Long totalUsers;
        private Long totalJobs;
        private Long totalCompanies;
        private Long totalApplications;
        private Long activeUsers;
        private Long newUsersToday;
        private Long jobsPostedToday;
        private Long applicationsToday;
        private Double userGrowthRate;
        private Double jobGrowthRate;
        private Double applicationGrowthRate;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UserGrowthData {
        private List<UserGrowthPoint> data;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class UserGrowthPoint {
        private String date;
        private Long users;
        private Long newUsers;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class JobStatisticsData {
        private List<JobStatPoint> data;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class JobStatPoint {
        private String month;
        private Long posted;
        private Long approved;
        private Long rejected;
        private Long active;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ApplicationStatsData {
        private List<ApplicationStatPoint> data;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ApplicationStatPoint {
        private String date;
        private Long applications;
        private Long pending;
        private Long accepted;
        private Long rejected;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class TopCompaniesData {
        private List<CompanyStatPoint> data;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CompanyStatPoint {
        private String name;
        private Long jobs;
        private Long applications;
        private String logo;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CategoryDistributionData {
        private List<CategoryPoint> data;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CategoryPoint {
        private String name;
        private Long value;
        private String color;
        private Double percentage;
    }
}
