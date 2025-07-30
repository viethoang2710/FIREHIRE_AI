// Debug script để theo dõi API calls trong browser console
// Paste code này vào Console của trình duyệt (F12) để debug

// 1. Check localStorage có employerId không
console.log('🔍 Checking localStorage:');
console.log('- current_employer_id:', localStorage.getItem('current_employer_id'));
console.log('- user_id:', localStorage.getItem('user_id'));
console.log('- role:', localStorage.getItem('role'));

// 2. Test API connection
async function testAPI() {
    console.log('🔗 Testing API connection...');
    
    try {
        // Test backend connection
        const response = await fetch('http://localhost:8080/api/jobs/hot-jobs?limit=1');
        const data = await response.json();
        console.log('✅ Backend connected:', data);
        
        // Test employer jobs endpoint
        const employerId = localStorage.getItem('current_employer_id');
        if (employerId) {
            const jobsResponse = await fetch(`http://localhost:8080/api/recruiter/jobs?employerId=${employerId}`);
            const jobsData = await jobsResponse.json();
            console.log('📋 Employer jobs:', jobsData);
        }
        
    } catch (error) {
        console.error('❌ API Error:', error);
    }
}

// 3. Monitor network requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('🌐 Network Request:', args[0], args[1]?.method || 'GET');
    return originalFetch.apply(this, arguments)
        .then(response => {
            console.log('📡 Response:', response.status, args[0]);
            return response;
        })
        .catch(error => {
            console.error('❌ Network Error:', error, args[0]);
            throw error;
        });
};

// 4. Test job creation
async function testCreateJob() {
    const employerId = localStorage.getItem('current_employer_id');
    if (!employerId) {
        console.error('❌ No employerId in localStorage');
        return;
    }
    
    const testJob = {
        title: 'Test Job from Console',
        location: 'Hà Nội',
        salary: '1000-2000 USD',
        description: 'Test job description',
        requirements: 'Test requirements',
        benefits: 'Test benefits',
        type: 'Full-time',
        employerId: parseInt(employerId),
        status: 'ACTIVE'
    };
    
    try {
        console.log('🔥 Creating test job:', testJob);
        const response = await fetch('http://localhost:8080/api/recruiter/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testJob)
        });
        
        const result = await response.json();
        console.log('✅ Job created:', result);
        
    } catch (error) {
        console.error('❌ Create job error:', error);
    }
}

console.log('🚀 Debug tools loaded! Available functions:');
console.log('- testAPI() - Test API connection');
console.log('- testCreateJob() - Create test job');

// Auto run API test
testAPI();
