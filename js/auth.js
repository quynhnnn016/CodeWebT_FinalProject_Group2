/**
 * Triply Auth & Topbar Control
 * Description: Reusable login/logout and topbar updater for all pages
 */

function checkLoginStatus() {
    const loggedInUser = localStorage.getItem("TriplyLoggedIn");
    const userRole = localStorage.getItem("TriplyRole");
  
    if (loggedInUser) {
      updateTopbarForLoggedInUser(loggedInUser, userRole);
    } else {
      updateTopbarForGuest();
    }
  }
  
  function updateTopbarForLoggedInUser(username, role) {
    const topbarContainer = document.querySelector(".col-lg-4.text-center.text-lg-end .d-inline-flex.align-items-center");
    if (!topbarContainer) return;
  
    // Xóa nội dung cũ (nếu có)
    topbarContainer.innerHTML = "";
  
   // Tạo dropdown user
    const dropdownHTML = `
    <div class="dropdown">
      <a href="#" class="dropdown-toggle text-light" data-bs-toggle="dropdown">
        <small><i class="fa fa-user me-2"></i>${username}</small>
      </a>
      <div class="dropdown-menu rounded shadow-sm mt-2">
        <a href="profile.html" class="dropdown-item">
          <i class="fas fa-user-alt me-2"></i>My Profile
        </a>

        ${role === "user" ? `
          <a href="profile.html#bookings" class="dropdown-item">
            <i class="fas fa-suitcase-rolling me-2"></i>My Bookings
          </a>
        ` : ""}

        <a href="#" class="dropdown-item">
          <i class="fas fa-bell me-2"></i>Notifications
        </a>

        <a href="profile.html#settings" class="dropdown-item">
          <i class="fas fa-cog me-2"></i>Account Settings
        </a>

        ${role === "admin" ? `
          <div class="dropdown-divider"></div>
          <a href="adminsite.html" class="dropdown-item">
            <i class="fas fa-comment-alt me-2"></i>Admin Site
          </a>
          <a href="management.html" class="dropdown-item">
            <i class="fas fa-tools me-2"></i>Packages Management
          </a>
          <a href="booking-management.html" class="dropdown-item">
            <i class="fas fa-chart-bar me-2"></i>Booking Management
          </a>
          <a href="user-management.html" class="dropdown-item">
            <i class="fas fa-users me-2"></i>User Management
          </a>
        ` : ""}

        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item text-danger" onclick="logout()">
          <i class="fas fa-power-off me-2"></i>Log Out
        </a>
      </div>
    </div>
    `;

    topbarContainer.innerHTML = dropdownHTML;
  }
  
  function updateTopbarForGuest() {
    const topbarContainer = document.querySelector(".col-lg-4.text-center.text-lg-end .d-inline-flex.align-items-center");
    if (!topbarContainer) return;
  
    // Hiển thị lại Register/Login mặc định
    topbarContainer.innerHTML = `
      <a href="register.html">
        <small class="me-3 text-light"><i class="fa fa-user me-2"></i>Register</small>
      </a>
      <a href="login.html">
        <small class="me-3 text-light"><i class="fa fa-sign-in-alt me-2"></i>Login</small>
      </a>
    `;
  }
  
  function logout() {
    localStorage.removeItem("TriplyLoggedIn");
    localStorage.removeItem("TriplyRole");
    alert("Logged out successfully!");
    window.location.href = "index.html";
  }
  
  // Auto-run when page loads
  document.addEventListener("DOMContentLoaded", checkLoginStatus);
  function updateTopbarForLoggedInUser(username, role) {
    const topbarContainer = document.querySelector(".col-lg-4.text-center.text-lg-end .d-inline-flex.align-items-center");
    if (!topbarContainer) return;
  
    // ✅ Gán avatar mặc định theo role
    let avatarPath = "img/avatar2.png"; // Mặc định user
    if (role === "admin") avatarPath = "img/avatar.jpg";
    localStorage.setItem("TriplyAvatar", avatarPath);
  
    // Xóa nội dung cũ (nếu có)
    topbarContainer.innerHTML = "";
    
    // (phần dropdownHTML giữ nguyên)
    const dropdownHTML = `
      <div class="dropdown">
        <a href="#" class="dropdown-toggle text-light" data-bs-toggle="dropdown">
          <img src="${avatarPath}" class="rounded-circle me-2" width="24" height="24" style="object-fit: cover;">
          <small>${username}</small>
        </a>
        <div class="dropdown-menu rounded shadow-sm mt-2">
          <a href="profile.html" class="dropdown-item"><i class="fas fa-user-alt me-2"></i>My Profile</a>
  
          ${role === "user" ? `
            <a href="profile.html#bookings" class="dropdown-item">
              <i class="fas fa-suitcase-rolling me-2"></i>My Bookings
            </a>
          ` : ""}
  
          <a href="#" class="dropdown-item"><i class="fas fa-bell me-2"></i>Notifications</a>
          <a href="profile.html#settings" class="dropdown-item"><i class="fas fa-cog me-2"></i>Account Settings</a>
  
          ${role === "admin" ? `
            <div class="dropdown-divider"></div>
            <a href="adminsite.html" class="dropdown-item"><i class="fas fa-comment-alt me-2"></i>Admin Site</a>
            <a href="management.html" class="dropdown-item"><i class="fas fa-tools me-2"></i>Packages Management</a>
            <a href="booking-management.html" class="dropdown-item"><i class="fas fa-chart-bar me-2"></i>Booking Management</a>
            <a href="user-management.html" class="dropdown-item"><i class="fas fa-users me-2"></i>User Management</a>
          ` : ""}
  
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item text-danger" onclick="logout()">
            <i class="fas fa-power-off me-2"></i>Log Out
          </a>
        </div>
      </div>
    `;
  
    topbarContainer.innerHTML = dropdownHTML;
  }
  