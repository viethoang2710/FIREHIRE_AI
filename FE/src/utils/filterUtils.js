// src/utils/filterUtils.js

/**
 * Utility functions for filtering jobs
 */

export const filterJobs = (jobs, filters) => {
  if (!jobs || jobs.length === 0) return jobs;
  
  let filteredJobs = [...jobs];
  
  // Filter by industry
  if (filters.industry) {
    filteredJobs = filteredJobs.filter(job => 
      job.industry && job.industry.toLowerCase().includes(filters.industry.toLowerCase())
    );
  }
  
  // Filter by location with smart matching
  if (filters.location) {
    filteredJobs = filteredJobs.filter(job => {
      if (!job.location) return false;
      
      const jobLocation = job.location.toLowerCase().trim();
      const searchLocation = filters.location.toLowerCase().trim();
      
      // Multiple matching strategies
      const exactMatch = jobLocation === searchLocation;
      const containsMatch = jobLocation.includes(searchLocation) || searchLocation.includes(jobLocation);
      
      // Special handling for Ho Chi Minh variations
      const isHCMVariation = (
        (jobLocation.includes('hồ chí minh') || jobLocation.includes('ho chi minh') || 
         jobLocation.includes('hcm') || jobLocation.includes('tphcm') || 
         jobLocation.includes('saigon')) &&
        (searchLocation.includes('hồ chí minh') || searchLocation.includes('ho chi minh') || 
         searchLocation.includes('hcm') || searchLocation.includes('tphcm') || 
         searchLocation.includes('saigon'))
      );
      
      return exactMatch || containsMatch || isHCMVariation;
    });
  }
  
  // Filter by salary range
  if (filters.salaryRange) {
    filteredJobs = filteredJobs.filter(job => {
      if (!job.salary) return false;
      
      const salaryValue = extractSalaryValue(job.salary);
      
      switch (filters.salaryRange) {
        case 'under_5m':
          return salaryValue < 5;
        case '5m_10m':
          return salaryValue >= 5 && salaryValue <= 10;
        case '10m_20m':
          return salaryValue >= 10 && salaryValue <= 20;
        case 'over_20m':
          return salaryValue > 20;
        default:
          return true;
      }
    });
  }
  
  return filteredJobs;
};

/**
 * Extract salary value from salary string and convert to millions
 */
export const extractSalaryValue = (salaryString) => {
  if (!salaryString) return 0;
  
  const salaryStr = salaryString.toLowerCase();
  let salaryValue = 0;
  
  // Try to extract number from salary string
  const salaryMatch = salaryStr.match(/(\d+(?:\.\d+)?)/);
  if (salaryMatch) {
    salaryValue = parseFloat(salaryMatch[1]);
    
    // Convert to millions based on units
    if (salaryStr.includes('k') || salaryStr.includes('nghìn')) {
      salaryValue = salaryValue / 1000;
    } else if (salaryStr.includes('triệu') || salaryStr.includes('million')) {
      // Already in millions
    } else if (salaryValue > 1000) {
      // Assume it's in thousands if greater than 1000
      salaryValue = salaryValue / 1000;
    }
  }
  
  return salaryValue;
};

/**
 * Generate filter summary text
 */
export const getFilterSummary = (filters, industryName) => {
  const parts = [];
  
  if (industryName && industryName !== 'Tất cả ngành nghề') {
    parts.push(`trong ngành ${industryName}`);
  }
  
  if (filters.location) {
    parts.push(`tại ${filters.location}`);
  }
  
  if (filters.salaryRange) {
    const salaryText = {
      'under_5m': 'dưới 5 triệu',
      '5m_10m': '5-10 triệu',
      '10m_20m': '10-20 triệu',
      'over_20m': 'trên 20 triệu'
    }[filters.salaryRange];
    parts.push(`mức lương ${salaryText}`);
  }
  
  return parts.length > 0 ? parts.join(', ') : '';
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (filters) => {
  return !!(filters.industry || filters.location || filters.salaryRange);
};

export default {
  filterJobs,
  extractSalaryValue,
  getFilterSummary,
  hasActiveFilters
};
