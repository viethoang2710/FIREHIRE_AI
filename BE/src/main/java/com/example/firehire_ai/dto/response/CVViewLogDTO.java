package com.example.firehire_ai.dto.response;

import com.example.firehire_ai.entity.CVViewLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CVViewLogDTO {
    private Integer logId;
    private Integer cvId;
    private String cvTitle;
    private Integer employerId;
    private String companyName;
    private LocalDateTime viewedAt;

    public static CVViewLogDTO fromEntity(CVViewLog viewLog) {
        if (viewLog == null)
            return null;

        return CVViewLogDTO.builder()
                .logId(viewLog.getLogId())
                .cvId(viewLog.getCv().getCvId())
                .cvTitle(viewLog.getCv().getTitle())
                .employerId(viewLog.getEmployer().getEmployerId())
                .companyName(viewLog.getEmployer().getCompanyName())
                .viewedAt(viewLog.getViewedAt())
                .build();
    }
}
