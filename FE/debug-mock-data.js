const { featuredJobsData } = require('./src/data/mockData');

console.log('=== MOCK DATA TEST ===');
console.log('Total jobs in mock data:', featuredJobsData.length);

console.log('\n=== ALL JOB LOCATIONS ===');
featuredJobsData.forEach(job => {
  console.log(`ID: ${job.id}, Title: ${job.title}, Location: ${job.location}`);
});

console.log('\n=== HO CHI MINH FILTERING TEST ===');
const locationVariations = ['Ho Chi Minh City', 'TP. Hồ Chí Minh', 'Ho Chi Minh', 'Hồ Chí Minh', 'TPHCM', 'HCM', 'Saigon'];

const filteredJobs = featuredJobsData.filter(job => {
  if (!job.location) return false;
  
  return locationVariations.some(loc => {
    const jobLocation = job.location.toLowerCase();
    const searchLocation = loc.toLowerCase();
    
    return jobLocation === searchLocation || 
           jobLocation.includes(searchLocation) ||
           searchLocation.includes(jobLocation);
  });
});

console.log(`Found ${filteredJobs.length} Ho Chi Minh jobs:`);
filteredJobs.forEach(job => {
  console.log(`- ${job.title} at ${job.location}`);
});
