import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

function LoginPage({ showAlert }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      
      // Debug logging - chi tiết hơn
      console.log("=== LOGIN DEBUG DETAIL ===");
      console.log("Full response:", res.data);
      console.log("Full response type:", typeof res.data);
      console.log("Role value:", res.data.role);
      console.log("Role type:", typeof res.data.role);
      console.log("All response keys:", Object.keys(res.data));
      
      // Kiểm tra nếu role nằm trong một key khác
      if (!res.data.role && res.data.user) {
        console.log("User object found:", res.data.user);
        console.log("User role:", res.data.user.role);
      }
      console.log("===================");
      
      // Xác định role từ response (có thể nằm ở res.data.role hoặc res.data.user.role)
      let userRole = res.data.role;
      
      // Nếu role nằm trong user object
      if (!userRole && res.data.user && res.data.user.role) {
        userRole = res.data.user.role;
        console.log("Found role in user object:", userRole);
      }
      
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("token", res.data.token);
      
      // Kiểm tra kỹ và xử lý role
      console.log("🔍 ROLE ANALYSIS BEFORE SAVING:");
      console.log("- Original userRole:", userRole);
      console.log("- Role in response.data.role:", res.data.role);
      console.log("- Role in response.data.user?.role:", res.data.user?.role);
      console.log("- Type of original userRole:", typeof userRole);
      
      // Thêm kiểm tra nếu role là một mảng hoặc đối tượng
      if (typeof userRole === 'object' && userRole !== null) {
        console.log("⚠️ userRole is an object:", JSON.stringify(userRole));
        if (Array.isArray(userRole) && userRole.length > 0) {
          userRole = userRole[0]; // Lấy phần tử đầu tiên nếu là mảng
          console.log("⚠️ Using first element of array:", userRole);
        } else if (userRole.roleName) {
          userRole = userRole.roleName; // Lấy thuộc tính roleName nếu có
          console.log("⚠️ Using roleName property:", userRole);
        } else if (userRole.name) {
          userRole = userRole.name; // Lấy thuộc tính name nếu có
          console.log("⚠️ Using name property:", userRole);
        }
      }
      
      // Nếu sau tất cả các bước kiểm tra mà role vẫn null, gán mặc định là CANDIDATE
      if (userRole === null || userRole === undefined) {
        userRole = "CANDIDATE";
        console.log("⚠️ Role is null/undefined, defaulting to:", userRole);
      }
      
      console.log("✅ Final role to save:", userRole);
      localStorage.setItem("role", userRole); // Lưu với role đã xác định và xử lý
      localStorage.setItem("userId", res.data.userId || (res.data.user && res.data.user.id));
      localStorage.setItem("fullName", res.data.fullName || (res.data.user && res.data.user.fullName));
      localStorage.setItem("email", res.data.email || form.email);
      
      if (showAlert) {
        showAlert("Đăng nhập thành công!", "success");
      }
      
      // Thêm debug chi tiết về vai trò
      console.log("===== ROLE DEBUGGING =====");
      console.log("Final role for redirect:", userRole);
      console.log("Role type:", typeof userRole);
      console.log("Role uppercase:", userRole?.toUpperCase());
      console.log("Role lowercase:", userRole?.toLowerCase());
      console.log("=========================");
      
      // Gọi login từ AuthContext để đảm bảo trạng thái toàn cục được cập nhật
      try {
        // Đảm bảo login được thực hiện để cập nhật global state
        await auth.login({ email: form.email, password: form.password });
        
        // Đây là một cách đơn giản và trực tiếp hơn để xử lý chuyển hướng
        console.log("� SIMPLIFIED REDIRECT APPROACH:");
        
        // 1. Lấy email người dùng để kiểm tra
        const userEmail = form.email.toLowerCase();
        console.log("📧 User email:", userEmail);
        
        // 2. Kiểm tra xem email có chứa các từ khóa liên quan đến admin hoặc employer không
        const isAdmin = userEmail.includes('admin');
        const isEmployer = userEmail.includes('hr') || 
                          userEmail.includes('recruit') || 
                          userEmail.includes('employer') || 
                          userEmail.includes('company');
        
        console.log("👑 Is admin by email:", isAdmin);
        console.log("💼 Is employer by email:", isEmployer);
        
        // 3. Xác định role cuối cùng dựa trên nhiều nguồn
        let finalRole = "CANDIDATE"; // Mặc định là ứng viên
        
        // Ưu tiên 1: Kiểm tra role từ phản hồi API
        if (userRole) {
          const upperRole = userRole.toUpperCase();
          if (upperRole.includes('ADMIN')) finalRole = 'ADMIN';
          else if (upperRole.includes('EMPLOY') || upperRole.includes('RECRUI') || 
                  upperRole.includes('HR')) finalRole = 'EMPLOYER';
          console.log("🏷️ Role determined from API response:", finalRole);
        }
        // Ưu tiên 2: Kiểm tra từ email nếu không xác định được từ API
        else if (isAdmin) {
          finalRole = 'ADMIN';
          console.log("🏷️ Role determined from email as ADMIN");
        }
        else if (isEmployer) {
          finalRole = 'EMPLOYER';
          console.log("🏷️ Role determined from email as EMPLOYER");
        }
        
        // 4. Lưu role đã xác định vào localStorage
        console.log("💾 Saving final role to localStorage:", finalRole);
        localStorage.setItem("final_role", finalRole);
        
        // 5. Chuyển hướng tức thì dựa trên role đã xác định
        console.log("🚀 DIRECT REDIRECT based on role:", finalRole);
        
        if (finalRole === 'ADMIN') {
          console.log("🔀 Redirecting directly to admin dashboard");
          window.location.href = "/admin-dashboard"; // Sử dụng window.location thay vì navigate để đảm bảo trang được tải lại
        } else if (finalRole === 'EMPLOYER') {
          console.log("🔀 Redirecting directly to recruiter dashboard");
          window.location.href = "/recruiter-dashboard";
        } else {
          console.log("🔀 Redirecting directly to home page");
          window.location.href = "/";
        }
      } catch (authError) {
        console.error("Error updating auth context:", authError);
        // Fallback về trang chủ nếu có lỗi
        setTimeout(() => navigate("/", { replace: true }), 100);
      }
    } catch (err) {
      setError("Sai email hoặc mật khẩu.");
    }
  };

  // ✅ CSS nội tuyến (inline style)
  const styles = {
    container: {
      maxWidth: "420px",
      margin: "80px auto",
      padding: "35px 40px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #ddd",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    heading: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#333",
      fontSize: "24px",
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      marginBottom: "18px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "15px",
    },
    button: {
      width: "100%",
      padding: "12px 14px",
      backgroundColor: "#007bff",
      color: "#fff",
      fontSize: "16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.25s ease-in-out",
    },
    error: {
      color: "#e63946",
      marginBottom: "16px",
      fontSize: "14px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Đăng nhập</button>
      </form>
    </div>
  );
}

export default LoginPage;