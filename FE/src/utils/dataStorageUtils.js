/**
 * Utility functions for working with persistent data storage
 */

/**
 * Chuyển đổi dữ liệu từ key chung sang key riêng theo userId
 * @param {String} userId - ID của người dùng hiện tại
 */
export const migrateJobsToUserStorage = (userId) => {
  if (!userId) {
    console.error('migrateJobsToUserStorage: userId is required');
    return false;
  }
  
  try {
    // Định nghĩa key chung và key riêng
    const commonKey = 'recruiterJobs';
    const userSpecificKey = `recruiterJobs_${userId}`;
    
    // Lấy dữ liệu từ key chung
    const commonData = localStorage.getItem(commonKey);
    
    // Nếu không có dữ liệu ở key chung, không cần chuyển đổi
    if (!commonData) {
      console.log(`No common data found in ${commonKey}`);
      return false;
    }
    
    // Lấy dữ liệu từ key riêng (nếu có)
    const userData = localStorage.getItem(userSpecificKey);
    
    // Nếu đã có dữ liệu ở key riêng, kiểm tra xem có cần hợp nhất không
    if (userData) {
      console.log(`User ${userId} already has data, merging with common data`);
      try {
        // Parse dữ liệu
        const commonJobs = JSON.parse(commonData);
        const userJobs = JSON.parse(userData);
        
        if (!Array.isArray(commonJobs) || !Array.isArray(userJobs)) {
          throw new Error('Data is not in expected array format');
        }
        
        // Tạo map của các job đã có trong dữ liệu người dùng
        const userJobMap = new Map(userJobs.map(job => [job.id, job]));
        
        // Thêm job từ dữ liệu chung nếu chưa có trong dữ liệu người dùng
        let hasNewJobs = false;
        for (const job of commonJobs) {
          if (job.id && !userJobMap.has(job.id)) {
            userJobs.push(job);
            hasNewJobs = true;
          }
        }
        
        // Nếu có job mới, lưu lại dữ liệu đã hợp nhất
        if (hasNewJobs) {
          localStorage.setItem(userSpecificKey, JSON.stringify(userJobs));
          console.log(`Merged ${commonJobs.length} common jobs with ${userJobs.length} user jobs`);
          return true;
        } else {
          console.log('No new jobs to merge');
          return false;
        }
      } catch (error) {
        console.error('Error merging job data:', error);
        // Nếu có lỗi khi hợp nhất, sao chép dữ liệu chung sang key riêng
        localStorage.setItem(userSpecificKey, commonData);
        console.log(`Failed to merge, copied common data to user storage for ${userId}`);
        return true;
      }
    } else {
      // Nếu chưa có dữ liệu ở key riêng, sao chép từ key chung
      localStorage.setItem(userSpecificKey, commonData);
      console.log(`Migrated job data for user ${userId}`);
      return true;
    }
  } catch (error) {
    console.error('Error in migrateJobsToUserStorage:', error);
    return false;
  }
};

/**
 * Kiểm tra xem dữ liệu tin tuyển dụng đã được lưu cho user hiện tại chưa
 * @param {String} userId - ID của người dùng hiện tại
 * @returns {Boolean} - true nếu đã có dữ liệu, false nếu chưa
 */
export const hasUserJobData = (userId) => {
  if (!userId) return false;
  
  try {
    const userSpecificKey = `recruiterJobs_${userId}`;
    const userData = localStorage.getItem(userSpecificKey);
    
    if (!userData) return false;
    
    const jobs = JSON.parse(userData);
    return Array.isArray(jobs) && jobs.length > 0;
  } catch (error) {
    console.error('Error checking user job data:', error);
    return false;
  }
};

/**
 * Lấy dữ liệu tin tuyển dụng của một user cụ thể
 * @param {String} userId - ID của người dùng
 * @returns {Array|null} - Mảng các tin tuyển dụng hoặc null nếu không có
 */
export const getUserJobData = (userId) => {
  if (!userId) return null;
  
  try {
    const userSpecificKey = `recruiterJobs_${userId}`;
    const userData = localStorage.getItem(userSpecificKey);
    
    if (!userData) return null;
    
    const jobs = JSON.parse(userData);
    return Array.isArray(jobs) ? jobs : null;
  } catch (error) {
    console.error('Error getting user job data:', error);
    return null;
  }
};

/**
 * Kiểm tra tính toàn vẹn của dữ liệu và khôi phục nếu cần
 * Gọi hàm này khi khởi động ứng dụng
 */
export const verifyDataIntegrity = () => {
  try {
    // Lấy danh sách user ID đã biết
    const knownUsersString = localStorage.getItem('known_employer_ids');
    if (!knownUsersString) return;
    
    const knownUsers = JSON.parse(knownUsersString);
    if (!Array.isArray(knownUsers) || knownUsers.length === 0) return;
    
    console.log(`Verifying data integrity for ${knownUsers.length} known users`);
    
    // Kiểm tra từng user ID
    knownUsers.forEach(userId => {
      if (!userId) return;
      
      const userSpecificKey = `recruiterJobs_${userId}`;
      const userData = localStorage.getItem(userSpecificKey);
      
      // Nếu không có dữ liệu user cụ thể, thử chuyển đổi từ dữ liệu chung
      if (!userData) {
        migrateJobsToUserStorage(userId);
      }
    });
    
    console.log('Data integrity verification completed');
  } catch (error) {
    console.error('Error verifying data integrity:', error);
  }
};

export default {
  migrateJobsToUserStorage,
  hasUserJobData,
  getUserJobData,
  verifyDataIntegrity
};
