package com.example.firehire_ai.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminStatsResponse {
    private int total;
    private int pending;
    private int approved;
    private int rejected;
}
