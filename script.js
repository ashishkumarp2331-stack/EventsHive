// Core Users & Role-Based Access Records
const users = [
  { id: 1, name: "Studio Director", email: "admin@lpu.in", password: "1234", role: "Manager", status: "Approved" },
  { id: 2, name: "Karan aujla (Guitarist)", email: "user@lpu.in", password: "1234", role: "Musician", status: "Approved" }
];

let currentUser = null;
let expandedEventIds = [];

const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80";

// Centralized Core Music Records (Gigs, Studio Sessions, Jams, Workshops)
let eventsData = [
  {
    id: 101,
    title: "Acoustic Indie Rooftop Showcase",
    category: "Live Gig",
    date: "2026-11-20",
    location: "Open Air Amphitheater",
    price: 0,
    capacity: 8,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
    description: "Seeking acoustic guitarists, cajon percussionists, and indie vocalists for a 90-minute evening showcase. PA system, Shure SM58 mics, and DI boxes provided on stage."
  },
  {
    id: 102,
    title: "Multi-Track Band Recording Session",
    category: "Studio Session",
    date: "2026-11-22",
    location: "SoundLab Studio A",
    price: 350,
    capacity: 6,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80",
    description: "Full analog-digital hybrid tracking session for local original compositions. Includes sound engineer, isolated drum booth, and basic stem mixing."
  },
  {
    id: 103,
    title: "Friday Night Funk & Jazz Fusion Jam",
    category: "Jam & Rehearsal",
    date: "2026-11-25",
    location: "Rehearsal Room 204",
    price: 0,
    capacity: 15,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80",
    description: "Collaborative improvisation workflow for brass players, bassists, keys, and drummers. Standard real-book lead sheets and 5-piece drum kit available."
  },
  {
    id: 104,
    title: "Live Sound Mixing & Pedalboard Clinic",
    category: "Music Workshop",
    date: "2026-11-28",
    location: "Audio Production Lab",
    price: 150,
    capacity: 25,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    description: "Hands-on clinic for local musicians covering gain staging, stage monitor routing, EQ sculpting, and eliminating ground-loop hum on live pedalboards."
  }
];

// Centralized User Interactions & Workflow Status Records
let bookingsData = [
  { id: 5001, eventId: 102, attendeeEmail: "user@lpu.in", attendeeName: "Karan aujla (Guitarist)", status: "Booked" },
  { id: 5002, eventId: 101, attendeeEmail: "user@lpu.in", attendeeName: "Karan aujla (Guitarist)", status: "Pending" }
];

function showNotification(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// 1. KEYFRAME ANIMATED SWITCH BETWEEN LOGIN & SIGN UP
const authBox = document.getElementById("auth-box");
const loginView = document.getElementById("login-view");
const signupView = document.getElementById("signup-view");

function triggerAuthSwitchAnimation(showSignup) {
  authBox.classList.remove("animate-auth-switch");
  void authBox.offsetWidth;
  authBox.classList.add("animate-auth-switch");

  if (showSignup) {
    loginView.classList.add("hidden");
    signupView.classList.remove("hidden");
  } else {
    signupView.classList.add("hidden");
    loginView.classList.remove("hidden");
  }
}

document.getElementById("show-signup-btn").addEventListener("click", () => triggerAuthSwitchAnimation(true));
document.getElementById("show-login-btn").addEventListener("click", () => triggerAuthSwitchAnimation(false));

// 2. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (With admin@lpu.in Approval Gate)
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const pass = document.getElementById("login-password").value;

  const foundUser = users.find(u => u.email.toLowerCase() === email && u.password === pass);
  if (!foundUser) {
    showNotification("Invalid email or password.");
    return;
  }

  if (foundUser.status === "Pending") {
    showNotification("Your Band Leader / Manager account is pending approval from admin@lpu.in.");
    return;
  }
  if (foundUser.status === "Rejected") {
    showNotification("Your Band Leader / Manager request was rejected by admin@lpu.in.");
    return;
  }

  this.reset();
  setSession(foundUser);
});

document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  if (users.some(u => u.email === email)) {
    showNotification("A musician record with this email already exists.");
    return;
  }

  const accountStatus = role === "Manager" ? "Pending" : "Approved";
  const newUser = { id: users.length + 1, name, email, password, role, status: accountStatus };
  users.push(newUser);
  this.reset();

  if (role === "Manager") {
    triggerAuthSwitchAnimation(false);
    showNotification("Band Leader / Manager request submitted! Log in once admin@lpu.in approves your role.");
  } else {
    setSession(newUser);
    showNotification(`Musician profile registered as ${name}.`);
  }
});

function setSession(user) {
  currentUser = user;
  const isManager = user.role === "Manager" && user.status === "Approved";
  const isSuperAdmin = user.email.toLowerCase() === "admin@lpu.in";
  const roleLabel = isSuperAdmin
    ? "Super Admin / Studio Director"
    : isManager
    ? "Band Leader / Manager"
    : "Local Musician";

  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("app-content").classList.remove("hidden");
  document.getElementById("main-nav").classList.remove("hidden");
  document.getElementById("logout-btn").classList.remove("hidden");
  document.getElementById("current-user-badge").textContent = `${user.name} (${roleLabel})`;

  document.getElementById("dashboard-section").classList.toggle("hidden", !isManager);
  document.getElementById("nav-dashboard-link").classList.toggle("hidden", !isManager);
  document.getElementById("crud-section").classList.toggle("hidden", !isManager);
  document.getElementById("nav-crud-link").classList.toggle("hidden", !isManager);

  // Only admin@lpu.in sees the Band Leader / Studio Manager Approval Card
  document.getElementById("organizer-approval-card").classList.toggle("hidden", !isSuperAdmin);

  if (isManager) {
    document.getElementById("welcome-text").textContent = `Signed in as ${user.name} (${roleLabel}) — Monitoring centralized records, lineup workflows, and status metrics.`;
  }

  document.getElementById("bookings-heading").textContent = isManager
    ? "Manager Workflow Tab: Review Musician Lineup & Slot Requests"
    : "Musician Workflow Tab: My Lineup Applications & Slot Status";

  document.getElementById("bookings-subtext").textContent = isManager
    ? "Approve or reject incoming musician slot requests to update live lineup statuses."
    : "Track your submitted gig and studio slot requests in real time.";

  showNotification(`Signed in as ${user.name} (${roleLabel}).`);
  refreshAllViews();
}

document.getElementById("logout-btn").addEventListener("click", function () {
  currentUser = null;
  expandedEventIds = [];

  document.getElementById("app-content").classList.add("hidden");
  document.getElementById("main-nav").classList.add("hidden");
  document.getElementById("dashboard-section").classList.add("hidden");
  document.getElementById("crud-section").classList.add("hidden");
  document.getElementById("logout-btn").classList.add("hidden");

  document.getElementById("events-grid").innerHTML = "";
  document.getElementById("bookings-table-body").innerHTML = "";
  document.getElementById("report-table-body").innerHTML = "";
  document.getElementById("organizer-approvals-body").innerHTML = "";

  triggerAuthSwitchAnimation(false);
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("current-user-badge").textContent = "Not Logged In";
  showNotification("Signed out of GigSync.");
});

// SUPER ADMIN (admin@lpu.in) ROLE APPROVAL WORKFLOW
function updateOrganizerApproval(userId, newStatus) {
  if (!currentUser || currentUser.email.toLowerCase() !== "admin@lpu.in") {
    showNotification("Access Denied: Only admin@lpu.in can approve Band Leaders / Managers.");
    return;
  }

  const targetUser = users.find(u => u.id === userId);
  if (!targetUser) return;

  targetUser.status = newStatus;
  showNotification(`Manager role request (${targetUser.email}) updated to ${newStatus}.`);
  renderOrganizerApprovals();
}

function renderOrganizerApprovals() {
  if (!currentUser || currentUser.email.toLowerCase() !== "admin@lpu.in") return;

  const tbody = document.getElementById("organizer-approvals-body");
  tbody.innerHTML = "";

  const managerRequests = users.filter(
    u => u.role === "Manager" && u.email.toLowerCase() !== "admin@lpu.in"
  );

  if (managerRequests.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>No pending Band Leader / Studio Manager role requests.</td></tr>";
    return;
  }

  managerRequests.forEach(u => {
    const badgeClass = u.status === "Approved" ? "Confirmed" : u.status;
    const actions = u.status === "Pending"
      ? `<button class="btn-success" onclick="updateOrganizerApproval(${u.id}, 'Approved')">Approve</button>
         <button class="btn-danger" onclick="updateOrganizerApproval(${u.id}, 'Rejected')">Reject</button>`
      : `<span class="text-muted">${u.status}</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>Band Leader / Manager</td>
      <td><span class="badge status-${badgeClass}">${u.status}</span></td>
      <td>${actions}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 3. CENTRALIZED CORE RECORDS CRUD OPERATIONS
let uploadedDeviceImage = "";

document.getElementById("event-image-file").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) {
    uploadedDeviceImage = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = function (event) {
    uploadedDeviceImage = event.target.result;
    document.getElementById("event-image").value = file.name;
    showNotification(`Loaded cover image "${file.name}" from device.`);
  };
  reader.readAsDataURL(file);
});

document.getElementById("event-image").addEventListener("input", function () {
  uploadedDeviceImage = "";
  document.getElementById("event-image-file").value = "";
});

document.getElementById("event-crud-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!currentUser || currentUser.role !== "Manager") return;

  const editId = document.getElementById("edit-event-id").value;
  const title = document.getElementById("event-title").value.trim();
  const category = document.getElementById("event-category").value;
  const date = document.getElementById("event-date").value;
  const location = document.getElementById("event-location").value.trim();
  const price = Number(document.getElementById("event-price").value);
  const capacity = Number(document.getElementById("event-capacity").value);
  const imageInput = document.getElementById("event-image").value.trim();
  const image = uploadedDeviceImage || imageInput || DEFAULT_THUMBNAIL;
  const description = document.getElementById("event-description").value.trim();

  if (editId) {
    const idx = eventsData.findIndex(ev => ev.id === Number(editId));
    if (idx !== -1) {
      eventsData[idx] = { id: Number(editId), title, category, date, location, price, capacity, image, description };
      showNotification(`Updated core music record "${title}".`);
    }
  } else {
    const newId = eventsData.length > 0 ? Math.max(...eventsData.map(ev => ev.id)) + 1 : 101;
    eventsData.push({ id: newId, title, category, date, location, price, capacity, image, description });
    showNotification(`Published new music record "${title}".`);
  }

  resetCrudForm();
  refreshAllViews();
});

function startEditEvent(eventId) {
  if (!currentUser || currentUser.role !== "Manager") return;
  const ev = eventsData.find(item => item.id === eventId);
  if (!ev) return;

  document.getElementById("edit-event-id").value = ev.id;
  document.getElementById("event-title").value = ev.title;
  document.getElementById("event-category").value = ev.category;
  document.getElementById("event-date").value = ev.date;
  document.getElementById("event-location").value = ev.location;
  document.getElementById("event-price").value = ev.price;
  document.getElementById("event-capacity").value = ev.capacity;

  const isDataUrl = (ev.image || "").startsWith("data:image");
  document.getElementById("event-image").value = isDataUrl ? "Current uploaded device image" : (ev.image || "");
  document.getElementById("event-image-file").value = "";
  uploadedDeviceImage = isDataUrl ? ev.image : "";

  document.getElementById("event-description").value = ev.description || "";

  document.getElementById("crud-form-title").textContent = `Edit Music Record #${ev.id}: ${ev.title}`;
  document.getElementById("save-event-btn").textContent = "Update Record";
  document.getElementById("cancel-edit-btn").classList.remove("hidden");
  document.getElementById("crud-section").scrollIntoView({ behavior: "smooth" });
}

function deleteEvent(eventId) {
  if (!currentUser || currentUser.role !== "Manager") return;
  const ev = eventsData.find(item => item.id === eventId);
  if (!ev) return;

  eventsData = eventsData.filter(item => item.id !== eventId);
  bookingsData = bookingsData.filter(b => b.eventId !== eventId);
  expandedEventIds = expandedEventIds.filter(id => id !== eventId);
  showNotification(`Deleted music record "${ev.title}".`);
  refreshAllViews();
}

function resetCrudForm() {
  document.getElementById("event-crud-form").reset();
  document.getElementById("edit-event-id").value = "";
  uploadedDeviceImage = "";
  document.getElementById("crud-form-title").textContent = "Centralized Core Records: Add Gig / Session (Manager Only)";
  document.getElementById("save-event-btn").textContent = "Save Record";
  document.getElementById("cancel-edit-btn").classList.add("hidden");
}

document.getElementById("cancel-edit-btn").addEventListener("click", resetCrudForm);

function toggleExpandEvent(eventId) {
  if (expandedEventIds.includes(eventId)) {
    expandedEventIds = expandedEventIds.filter(id => id !== eventId);
  } else {
    expandedEventIds.push(eventId);
  }
  renderEvents();
}

// 4. MUSICIAN SLOT APPLICATION & APPROVAL WORKFLOW
function requestBooking(eventId) {
  if (!currentUser) return;
  const ev = eventsData.find(item => item.id === eventId);
  const bookedCount = bookingsData.filter(b => b.eventId === eventId && b.status === "Booked").length;

  if (bookedCount >= ev.capacity) {
    showNotification("All musician roster slots for this session are full.");
    return;
  }

  const duplicate = bookingsData.find(
    b => b.eventId === eventId && b.attendeeEmail === currentUser.email && b.status !== "Cancelled"
  );
  if (duplicate) {
    showNotification(`You already have an active slot application for "${ev.title}".`);
    return;
  }

  const newBooking = {
    id: Math.floor(1000 + Math.random() * 9000),
    eventId: ev.id,
    attendeeEmail: currentUser.email,
    attendeeName: currentUser.name,
    status: "Pending"
  };

  bookingsData.push(newBooking);
  showNotification(`Slot application #${newBooking.id} submitted for Manager review.`);
  refreshAllViews();
}

function updateBookingStatus(bookingId, newStatus) {
  const booking = bookingsData.find(b => b.id === bookingId);
  if (!booking) return;

  if ((newStatus === "Booked" || newStatus === "Rejected") && (!currentUser || currentUser.role !== "Manager")) {
    return;
  }

  booking.status = newStatus;
  showNotification(
    newStatus === "Booked"
      ? `Application #${booking.id} approved! Status is now "Slot Confirmed".`
      : `Application #${booking.id} status updated to ${newStatus}.`
  );
  refreshAllViews();
}

// 5. RENDERING VIEWS & STATUS REPORTS
function renderEvents() {
  if (!currentUser) return;

  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const category = document.getElementById("category-select").value;
  const freeOnly = document.getElementById("free-only").checked;
  const grid = document.getElementById("events-grid");
  grid.innerHTML = "";

  const filtered = eventsData.filter(ev => {
    const matchText =
      ev.title.toLowerCase().includes(query) ||
      ev.location.toLowerCase().includes(query) ||
      (ev.description || "").toLowerCase().includes(query);
    const matchCat = category === "All" || ev.category === category;
    const matchFree = !freeOnly || ev.price === 0;
    return matchText && matchCat && matchFree;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "<p class='text-muted'>No matching gigs or studio sessions found.</p>";
    return;
  }

  filtered.forEach(ev => {
    const bookedSeats = bookingsData.filter(b => b.eventId === ev.id && b.status === "Booked").length;
    const pendingRequests = bookingsData.filter(b => b.eventId === ev.id && b.status === "Pending").length;
    const seatsLeft = Math.max(0, ev.capacity - bookedSeats);
    const priceLabel = ev.price === 0 ? "OPEN / FREE" : `₹${ev.price}`;
    const isExpanded = expandedEventIds.includes(ev.id);

    let actionButtons = "";
    if (currentUser.role === "Manager") {
      actionButtons = `
        <button class="btn-outline" onclick="event.stopPropagation(); startEditEvent(${ev.id})">Edit Record</button>
        <button class="btn-danger" onclick="event.stopPropagation(); deleteEvent(${ev.id})">Remove</button>
      `;
    } else {
      const userBooking = bookingsData.find(
        b => b.eventId === ev.id && b.attendeeEmail === currentUser.email && b.status !== "Cancelled"
      );
      if (userBooking && userBooking.status === "Booked") {
        actionButtons = `<span class="badge status-Confirmed">Slot Confirmed</span>`;
      } else if (userBooking && userBooking.status === "Pending") {
        actionButtons = `<span class="badge status-Pending">Pending Review</span>`;
      } else {
        actionButtons = `<button class="btn-primary" onclick="event.stopPropagation(); requestBooking(${ev.id})">Apply for Slot</button>`;
      }
    }

    const card = document.createElement("article");
    card.className = `event-card ${isExpanded ? "expanded" : ""}`;
    card.onclick = () => toggleExpandEvent(ev.id);

    card.innerHTML = `
      <div>
        <div class="thumbnail-wrapper">
          <img src="${ev.image || DEFAULT_THUMBNAIL}" alt="${ev.title}" class="event-thumbnail" loading="lazy">
          <span class="thumbnail-category">${ev.category}</span>
          <span class="thumbnail-price">${priceLabel}</span>
        </div>
        <div class="card-body">
          <div>
            <h3 class="card-title">${ev.title}</h3>
            <p class="card-meta"><strong>Date:</strong> ${ev.date} • <strong>Studio / Stage:</strong> ${ev.location}</p>
            <p class="card-meta"><strong>Open Roster Slots:</strong> ${seatsLeft} of ${ev.capacity} musicians</p>
            <p class="expand-hint">${isExpanded ? "▲ Hide technical rider & status" : "▼ View technical rider, gear & roster status"}</p>

            <div class="event-details-panel ${isExpanded ? "" : "hidden"}">
              <p><strong>Technical Rider & Notes:</strong> ${ev.description}</p>
              <p><strong>Record ID:</strong> #${ev.id} | <strong>Session Type:</strong> ${ev.category}</p>
              <p><strong>Roster Status:</strong> ${bookedSeats} Confirmed • ${pendingRequests} In Review • ${seatsLeft} Open</p>
              <p><strong>Managed By:</strong> GigSync Collective</p>
            </div>
          </div>
          <div class="card-actions">${actionButtons}</div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderBookingsTable() {
  if (!currentUser) return;

  const tbody = document.getElementById("bookings-table-body");
  tbody.innerHTML = "";

  const visibleBookings = currentUser.role === "Musician"
    ? bookingsData.filter(b => b.attendeeEmail === currentUser.email)
    : bookingsData;

  if (visibleBookings.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>No musician workflow records found.</td></tr>";
    return;
  }

  visibleBookings.forEach(b => {
    const ev = eventsData.find(item => item.id === b.eventId) || { title: "Archived Session", price: 0 };

    const statusBadge = b.status === "Booked"
      ? `<span class="badge status-Confirmed">Slot Confirmed</span>`
      : b.status === "Pending"
      ? `<span class="badge status-Pending">Pending Review</span>`
      : `<span class="badge status-${b.status}">${b.status}</span>`;

    let actions = "";
    if (currentUser.role === "Manager") {
      actions = b.status === "Pending"
        ? `<button class="btn-success" onclick="updateBookingStatus(${b.id}, 'Booked')">Approve Slot</button>
           <button class="btn-danger" onclick="updateBookingStatus(${b.id}, 'Rejected')">Decline</button>`
        : `<span class="text-muted">${b.status === "Booked" ? "Slot Confirmed" : b.status}</span>`;
    } else {
      actions = b.status === "Booked"
        ? `<strong style="color: var(--success);">✓ Slot Confirmed</strong>`
        : b.status === "Pending"
        ? `<button class="btn-secondary" onclick="updateBookingStatus(${b.id}, 'Cancelled')">Withdraw</button>`
        : `<span class="text-muted">Closed</span>`;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${b.id}</td>
      <td>${ev.title}</td>
      <td>${b.attendeeName}</td>
      <td>${ev.price === 0 ? "FREE" : "₹" + ev.price}</td>
      <td>${statusBadge}</td>
      <td>${actions}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDashboardAndReports() {
  if (!currentUser || currentUser.role !== "Manager") return;

  const bookedList = bookingsData.filter(b => b.status === "Booked");
  const totalRevenue = bookedList.reduce((sum, b) => {
    const ev = eventsData.find(e => e.id === b.eventId);
    return sum + (ev ? ev.price : 0);
  }, 0);

  document.getElementById("stat-total-events").textContent = eventsData.length;
  document.getElementById("stat-total-bookings").textContent = bookingsData.length;
  document.getElementById("stat-confirmed-bookings").textContent = bookedList.length;
  document.getElementById("stat-revenue").textContent = `₹${totalRevenue}`;

  const categories = ["Live Gig", "Studio Session", "Jam & Rehearsal", "Music Workshop"];
  const reportBody = document.getElementById("report-table-body");
  reportBody.innerHTML = "";

  categories.forEach(cat => {
    const catEvents = eventsData.filter(e => e.category === cat);
    const catCapacity = catEvents.reduce((sum, e) => sum + e.capacity, 0);
    const catBooked = bookedList.filter(b => {
      const ev = eventsData.find(e => e.id === b.eventId);
      return ev && ev.category === cat;
    });
    const catRevenue = catBooked.reduce((sum, b) => {
      const ev = eventsData.find(e => e.id === b.eventId);
      return sum + (ev ? ev.price : 0);
    }, 0);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${cat}</strong></td>
      <td>${catEvents.length}</td>
      <td>${catCapacity} slots</td>
      <td>${catBooked.length}</td>
      <td>₹${catRevenue}</td>
    `;
    reportBody.appendChild(row);
  });
}

function refreshAllViews() {
  if (!currentUser) return;
  if (currentUser.role === "Manager") {
    renderDashboardAndReports();
    if (currentUser.email.toLowerCase() === "admin@lpu.in") {
      renderOrganizerApprovals();
    }
  }
  renderEvents();
  renderBookingsTable();
}

document.getElementById("search-input").addEventListener("input", renderEvents);
document.getElementById("category-select").addEventListener("change", renderEvents);
document.getElementById("free-only").addEventListener("change", renderEvents);