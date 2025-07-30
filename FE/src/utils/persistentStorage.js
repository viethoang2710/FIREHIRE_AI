// utils/persistentStorage.js - Cơ chế lưu trữ persistent cho jobs

const PERSISTENT_JOBS_KEY = 'firehire_persistent_jobs';
const USER_JOBS_PREFIX = 'firehire_jobs_user_';

/**
 * Lưu job vào persistent storage (IndexedDB hoặc localStorage backup)
 */
export const saveJobToPersistentStorage = (job, userId) => {
  try {
    // Tạo key cho user cụ thể
    const userJobsKey = `${USER_JOBS_PREFIX}${userId}`;
    
    // Lấy jobs hiện tại của user
    let existingJobs = [];
    const storedJobs = localStorage.getItem(userJobsKey);
    if (storedJobs) {
      existingJobs = JSON.parse(storedJobs);
    }
    
    // Thêm job mới hoặc cập nhật job cũ
    const jobIndex = existingJobs.findIndex(existingJob => existingJob.id === job.id);
    if (jobIndex >= 0) {
      existingJobs[jobIndex] = job;
      console.log(`Updated job ${job.id} in persistent storage for user ${userId}`);
    } else {
      existingJobs.unshift(job); // Thêm vào đầu danh sách
      console.log(`Added new job ${job.id} to persistent storage for user ${userId}`);
    }
    
    // Lưu lại vào localStorage
    localStorage.setItem(userJobsKey, JSON.stringify(existingJobs));
    
    // Backup vào key chung (cho tương thích ngược)
    localStorage.setItem(PERSISTENT_JOBS_KEY, JSON.stringify(existingJobs));
    
    return true;
  } catch (error) {
    console.error('Error saving job to persistent storage:', error);
    return false;
  }
};

/**
 * Lấy tất cả jobs của user từ persistent storage
 */
export const getJobsFromPersistentStorage = (userId) => {
  try {
    const userJobsKey = `${USER_JOBS_PREFIX}${userId}`;
    
    // Thử lấy từ key user cụ thể trước
    let storedJobs = localStorage.getItem(userJobsKey);
    
    // Nếu không có, thử lấy từ key chung
    if (!storedJobs) {
      storedJobs = localStorage.getItem(PERSISTENT_JOBS_KEY);
    }
    
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      console.log(`Retrieved ${jobs.length} jobs from persistent storage for user ${userId}`);
      return Array.isArray(jobs) ? jobs : [];
    }
    
    return [];
  } catch (error) {
    console.error('Error retrieving jobs from persistent storage:', error);
    return [];
  }
};

/**
 * Xóa job khỏi persistent storage
 */
export const deleteJobFromPersistentStorage = (jobId, userId) => {
  try {
    const userJobsKey = `${USER_JOBS_PREFIX}${userId}`;
    
    // Lấy jobs hiện tại
    const existingJobs = getJobsFromPersistentStorage(userId);
    
    // Lọc bỏ job cần xóa
    const updatedJobs = existingJobs.filter(job => job.id !== jobId);
    
    // Lưu lại
    localStorage.setItem(userJobsKey, JSON.stringify(updatedJobs));
    localStorage.setItem(PERSISTENT_JOBS_KEY, JSON.stringify(updatedJobs));
    
    console.log(`Deleted job ${jobId} from persistent storage for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting job from persistent storage:', error);
    return false;
  }
};

/**
 * Migrate jobs từ key chung sang key user cụ thể
 */
export const migrateJobsToUserStorage = (userId) => {
  try {
    const userJobsKey = `${USER_JOBS_PREFIX}${userId}`;
    
    // Nếu đã có jobs cho user này, không cần migrate
    if (localStorage.getItem(userJobsKey)) {
      return;
    }
    
    // Lấy jobs từ key chung
    const generalJobs = localStorage.getItem(PERSISTENT_JOBS_KEY);
    if (generalJobs) {
      // Copy sang key user cụ thể
      localStorage.setItem(userJobsKey, generalJobs);
      console.log(`Migrated jobs to user-specific storage for user ${userId}`);
    }
  } catch (error) {
    console.error('Error migrating jobs to user storage:', error);
  }
};

/**
 * Clear tất cả jobs của user
 */
export const clearUserJobs = (userId) => {
  try {
    const userJobsKey = `${USER_JOBS_PREFIX}${userId}`;
    localStorage.removeItem(userJobsKey);
    console.log(`Cleared jobs for user ${userId}`);
  } catch (error) {
    console.error('Error clearing user jobs:', error);
  }
};

/**
 * Sync jobs giữa database và localStorage
 */
export const syncJobsWithDatabase = async (userId, apiJobs) => {
  try {
    // Lấy jobs từ localStorage
    const localJobs = getJobsFromPersistentStorage(userId);
    
    // Combine API jobs with local jobs (API priority)
    const combinedJobs = [...apiJobs];
    
    // Thêm các jobs local chưa có trong API
    localJobs.forEach(localJob => {
      const existsInApi = apiJobs.find(apiJob => apiJob.id === localJob.id);
      if (!existsInApi) {
        combinedJobs.push(localJob);
      }
    });
    
    // Lưu kết quả kết hợp vào localStorage
    const userJobsKey = `${USER_JOBS_PREFIX}${userId}`;
    localStorage.setItem(userJobsKey, JSON.stringify(combinedJobs));
    
    console.log(`Synced ${combinedJobs.length} jobs for user ${userId}`);
    return combinedJobs;
  } catch (error) {
    console.error('Error syncing jobs with database:', error);
    return apiJobs; // Fallback to API jobs only
  }
};
