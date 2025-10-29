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
  
    //Gán avatar mặc định theo role
    let avatarPath = localStorage.getItem("TriplyAvatar");
    if (!avatarPath) {
         if (role === "admin") {
             avatarPath = "img/admin-avatar.jpg"; // Default admin avatar
         } else {
             avatarPath = "img/user-avatar.jpg"; // Default user avatar
         }
    }
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

// Hiển thị Register / Login khi CHƯA đăng nhập
  function updateTopbarForGuest() {
    const topbarContainer = document.querySelector(".col-lg-4.text-center.text-lg-end .d-inline-flex.align-items-center");
    if (!topbarContainer) return;

    topbarContainer.innerHTML = `
      <a href="register.html" style="text-decoration:none;">
        <small class="me-3 text-light">
          <i class="fa fa-user me-2"></i>Register
        </small>
      </a>
      <a href="login.html" style="text-decoration:none;">
        <small class="me-3 text-light">
          <i class="fa fa-sign-in-alt me-2"></i>Login
        </small>
      </a>
    `;
  }

// Logout
  function logout() {
    localStorage.removeItem("TriplyLoggedIn");
    localStorage.removeItem("TriplyRole");
    localStorage.removeItem("TriplyAvatar");
    localStorage.removeItem("TriplyDisplayName");
    alert("Logged out successfully!");
    window.location.href = "index.html";
  }

  function getComments() {
    return JSON.parse(localStorage.getItem("TriplyComments") || "[]");
  }

  function saveComments(comments) {
    localStorage.setItem("TriplyComments", JSON.stringify(comments));
  }

// ---- render toàn bộ comment cho trang hiện tại ----
  function renderComments() {
    const page = window.location.pathname.split("/").pop();
    const currentUser = localStorage.getItem("TriplyLoggedIn");
    const comments = getComments().filter(c => c.page === page);

    const container = document.getElementById("comment-list");
    if (!container) return;

    if (comments.length === 0) {
      container.innerHTML = "<p style='color:gray;'>No comments yet. Be the first!</p>";
      return;
    }

    container.innerHTML = comments
      .map((c, idx) => {
        const isOwner = c.username === currentUser;
        return `
          <div style="display:flex;align-items:flex-start;margin-bottom:18px;border-bottom:1px solid #eee;padding-bottom:12px;">
            <img src="${c.avatar || "img/avatar2.png"}" width="40" height="40"
                style="border-radius:50%;margin-right:10px;object-fit:cover;">
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <strong>${c.username}</strong>
                  <small style="color:gray;"> • ${c.time}</small>
                </div>

                ${
                  isOwner
                  ? `<div style="font-size:13px;">
                      <button onclick="startEditComment(${idx})"
                        style="border:none;background:none;color:#0b7dda;cursor:pointer;padding:0 6px;">
                        Edit
                      </button>
                    </div>`
                  : ""
                }
              </div>

              <div id="comment-text-${idx}" style="font-size:14px;line-height:1.4;margin-top:6px;white-space:pre-line;">
                ${c.content}
              </div>

              <!-- khu vực chỉnh sửa (ẩn mặc định) -->
              <div id="edit-area-${idx}" style="display:none; margin-top:10px;">
                <textarea id="edit-input-${idx}" rows="3"
                  style="width:100%;padding:10px;border-radius:6px;border:1px solid #ccc;resize:none;">${c.content}</textarea>
                <div style="text-align:right;margin-top:8px;">
                  <button onclick="saveEditComment(${idx})"
                    style="background:#0b7dda;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:13px;">
                    Save
                  </button>
                  <button onclick="cancelEditComment(${idx})"
                    style="background:#999;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:13px;margin-left:6px;">
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </div>
        `;
      })
      .join("");
  }

// ---- post comment mới ----
  function postComment() {
    const user = localStorage.getItem("TriplyLoggedIn");
    const avatar = localStorage.getItem("TriplyAvatar") || "img/user-avatar.png";

    // chưa login thì chuyển sang login.html và nhớ trang hiện tại
    if (!user) {
      alert("Please login first.");
      localStorage.setItem("TriplyReturnURL", window.location.href);
      window.location.href = "login.html";
      return;
    }

    const textarea = document.getElementById("comment-input");
    if (!textarea) return;

    const content = textarea.value.trim();
    if (content === "") {
      alert("Comment cannot be empty!");
      return;
    }

    const comments = getComments();
    const page = window.location.pathname.split("/").pop();

    comments.push({
      page: page,
      username: user,
      avatar: avatar,
      content: content,
      time: new Date().toLocaleString()
    });

    saveComments(comments);
    textarea.value = "";
    renderComments();
  }

// ---- bắt đầu sửa comment ----
  function startEditComment(indexOnPage) {
    // indexOnPage là index trong danh sách comment của TRANG NÀY
    const page = window.location.pathname.split("/").pop();
    // lấy ALL comments global:
    const all = getComments();
    // build danh sách comment của trang hiện tại để map index -> index thực
    const indicesForThisPage = all
      .map((c, realIndex) => ({ ...c, realIndex }))
      .filter(c => c.page === page);

    const realIndex = indicesForThisPage[indexOnPage].realIndex;

    const currentUser = localStorage.getItem("TriplyLoggedIn");
    if (!currentUser || all[realIndex].username !== currentUser) return;

    // ẩn text, show editor
    const textDiv = document.getElementById(`comment-text-${indexOnPage}`);
    const editArea = document.getElementById(`edit-area-${indexOnPage}`);
    if (textDiv && editArea) {
      textDiv.style.display = "none";
      editArea.style.display = "block";
    }

    // lưu lại index thực để dùng khi save
    editArea.setAttribute("data-real-index", realIndex);
  }

// ---- lưu comment sau khi sửa ----
  function saveEditComment(indexOnPage) {
    const editArea = document.getElementById(`edit-area-${indexOnPage}`);
    if (!editArea) return;

    const realIndex = editArea.getAttribute("data-real-index");
    if (realIndex === null) return;

    const textarea = document.getElementById(`edit-input-${indexOnPage}`);
    if (!textarea) return;

    const newText = textarea.value.trim();
    if (newText === "") {
      alert("Comment cannot be empty.");
      return;
    }

    const all = getComments();
    const currentUser = localStorage.getItem("TriplyLoggedIn");
    if (!currentUser || all[realIndex].username !== currentUser) {
      alert("You can only edit your own comment.");
      cancelEditComment(indexOnPage);
      return;
    }

    all[realIndex].content = newText;
    all[realIndex].time = new Date().toLocaleString() + " (edited)";
    saveComments(all);

    renderComments();
  }

// ---- hủy sửa ----
  function cancelEditComment(indexOnPage) {
    const textDiv = document.getElementById(`comment-text-${indexOnPage}`);
    const editArea = document.getElementById(`edit-area-${indexOnPage}`);
    if (textDiv && editArea) {
      textDiv.style.display = "block";
      editArea.style.display = "none";
    }
  }

// render bình luận khi trang load
document.addEventListener("DOMContentLoaded", checkLoginStatus);
document.addEventListener("DOMContentLoaded", renderComments);

