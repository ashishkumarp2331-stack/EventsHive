// Unit IV: Variables, Constants, Arrays, and Objects
const users = [
  { id: 1, name: "user", email: "admin@lpu.in", password: "1234", role: "Organizer", status: "Approved" },
  { id: 2, name: "user", email: "user@lpu.in", password: "1234", role: "Attendee", status: "Approved" }
];

let currentUser = null;
let expandedEventIds = [];

const DEFAULT_THUMBNAIL = "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80";

let eventsData = [
  {
    id: 101,
    title: "Full-Stack Web Dev Summit",
    category: "Tech",
    date: "2026-11-20",
    location: "Main Seminar Hall",
    price: 0,
    capacity: 40,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    description: "Hands-on coding bootcamp covering HTML5 semantics, modern CSS Grid/Flexbox layouts, and JavaScript ES6 fundamentals. Bring your laptop for live project building."
  },
  {
    id: 102,
    title: "Acoustic Indie Night",
    category: "Music",
    date: "2026-11-22",
    location: "Open Air Amphitheater",
    price: 250,
    capacity: 60,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
    description: "An evening of live unplugged performances by campus bands and solo indie artists. Entry includes complimentary refreshments and backstage Q&A access."
  },
  {
    id: 103,
    title: "Artisan Street Food Fest",
    category: "Food",
    date: "2026-11-25",
    location: "Campus Quadrangle",
    price: 150,
    capacity: 100,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    description: "Explore over 20 regional culinary stalls, live chef demonstrations, and tasting sessions curated by local food artisans."
  },
  {
    id: 104,
    title: "Digital Illustration Workshop",
    category: "Art",
    date: "2026-11-28",
    location: "Design Studio B",
    price: 0,
    capacity: 25,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
    description: "Beginner-friendly workshop on vector graphics, SVG artwork, color theory, and digital character design led by industry illustrators."
  }
];

let bookingsData = [
  { id: 5001, eventId: 102, attendeeEmail: "user@lpu.in", attendeeName: "user", status: "Booked" },
  { id: 5002, eventId: 101, attendeeEmail: "user@lpu.in", attendeeName: "user", status: "Pending" }
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
  void authBox.offsetWidth; // Force reflow so keyframe animation replays cleanly
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
    showNotification("Your Organizer account is pending approval from admin@lpu.in.");
    return;
  }
  if (foundUser.status === "Rejected") {
    showNotification("Your Organizer account request was rejected by admin@lpu.in.");
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
    showNotification("An account with this email already exists.");
    return;
  }

  const accountStatus = role === "Organizer" ? "Pending" : "Approved";
  const newUser = { id: users.length + 1, name, email, password, role, status: accountStatus };
  users.push(newUser);
  this.reset();

  if (role === "Organizer") {
    triggerAuthSwitchAnimation(false);
    showNotification("Organizer request sent! You can log in once admin@lpu.in approves your account.");
  } else {
    setSession(newUser);
    showNotification(`Account registered as ${name} (${role}).`);
  }
});

function setSession(user) {
  currentUser = user;
  const isOrganizer = user.role === "Organizer" && user.status === "Approved";
  const isSuperAdmin = user.email.toLowerCase() === "admin@lpu.in";
  const roleLabel = isSuperAdmin
    ? "Super Admin"
    : isOrganizer
    ? "Organizer / Admin"
    : "Attendee / User";

  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("app-content").classList.remove("hidden");
  document.getElementById("main-nav").classList.remove("hidden");
  document.getElementById("logout-btn").classList.remove("hidden");
  document.getElementById("current-user-badge").textContent = `${user.name} (${roleLabel})`;

  document.getElementById("dashboard-section").classList.toggle("hidden", !isOrganizer);
  document.getElementById("nav-dashboard-link").classList.toggle("hidden", !isOrganizer);
  document.getElementById("crud-section").classList.toggle("hidden", !isOrganizer);
  document.getElementById("nav-crud-link").classList.toggle("hidden", !isOrganizer);

  // Only admin@lpu.in sees the Organizer Account Approval Card
  document.getElementById("organizer-approval-card").classList.toggle("hidden", !isSuperAdmin);

  if (isOrganizer) {
    document.getElementById("welcome-text").textContent = `Signed in as ${user.name} (${roleLabel})`;
  }

  document.getElementById("bookings-heading").textContent = isOrganizer
    ? "Admin / Organizer Tab: Manage Booking Requests"
    : "User Tab: My Tickets & Booking Status";

  document.getElementById("bookings-subtext").textContent = isOrganizer
    ? "Review and accept or reject incoming attendee booking requests."
    : "Track your requested tickets. Accepted requests display 'Ticket is Booked'.";

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
  showNotification("Signed out successfully.");
});

// SUPER ADMIN (admin@lpu.in) ORGANIZER APPROVAL WORKFLOW
function updateOrganizerApproval(userId, newStatus) {
  if (!currentUser || currentUser.email.toLowerCase() !== "admin@lpu.in") {
    showNotification("Access Denied: Only admin@lpu.in can approve Organizers.");
    return;
  }

  const targetUser = users.find(u => u.id === userId);
  if (!targetUser) return;

  targetUser.status = newStatus;
  showNotification(`Organizer account (${targetUser.email}) status set to ${newStatus}.`);
  renderOrganizerApprovals();
}

function renderOrganizerApprovals() {
  if (!currentUser || currentUser.email.toLowerCase() !== "admin@lpu.in") return;

  const tbody = document.getElementById("organizer-approvals-body");
  tbody.innerHTML = "";

  const organizerRequests = users.filter(
    u => u.role === "Organizer" && u.email.toLowerCase() !== "admin@lpu.in"
  );

  if (organizerRequests.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>No new Organizer registration requests.</td></tr>";
    return;
  }

  organizerRequests.forEach(u => {
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
      <td>${u.role}</td>
      <td><span class="badge status-${badgeClass}">${u.status}</span></td>
      <td>${actions}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 3. ADMIN EVENT CRUD OPERATIONS
document.getElementById("event-crud-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!currentUser || currentUser.role !== "Organizer") return;

  const editId = document.getElementById("edit-event-id").value;
  const title = document.getElementById("event-title").value.trim();
  const category = document.getElementById("event-category").value;
  const date = document.getElementById("event-date").value;
  const location = document.getElementById("event-location").value.trim();
  const price = Number(document.getElementById("event-price").value);
  const capacity = Number(document.getElementById("event-capacity").value);
  const image = document.getElementById("event-image").value.trim() || DEFAULT_THUMBNAIL;
  const description = document.getElementById("event-description").value.trim();

  if (editId) {
    const idx = eventsData.findIndex(ev => ev.id === Number(editId));
    if (idx !== -1) {
      eventsData[idx] = { id: Number(editId), title, category, date, location, price, capacity, image, description };
      showNotification(`Updated event "${title}".`);
    }
  } else {
    const newId = eventsData.length > 0 ? Math.max(...eventsData.map(ev => ev.id)) + 1 : 101;
    eventsData.push({ id: newId, title, category, date, location, price, capacity, image, description });
    showNotification(`Created event "${title}".`);
  }

  resetCrudForm();
  refreshAllViews();
});

function startEditEvent(eventId) {
  if (!currentUser || currentUser.role !== "Organizer") return;
  const ev = eventsData.find(item => item.id === eventId);
  if (!ev) return;

  document.getElementById("edit-event-id").value = ev.id;
  document.getElementById("event-title").value = ev.title;
  document.getElementById("event-category").value = ev.category;
  document.getElementById("event-date").value = ev.date;
  document.getElementById("event-location").value = ev.location;
  document.getElementById("event-price").value = ev.price;
  document.getElementById("event-capacity").value = ev.capacity;
  document.getElementById("event-image").value = ev.image || "";
  document.getElementById("event-description").value = ev.description || "";

  document.getElementById("crud-form-title").textContent = `Edit Event #${ev.id}: ${ev.title}`;
  document.getElementById("save-event-btn").textContent = "Update Event";
  document.getElementById("cancel-edit-btn").classList.remove("hidden");
  document.getElementById("crud-section").scrollIntoView({ behavior: "smooth" });
}

function deleteEvent(eventId) {
  if (!currentUser || currentUser.role !== "Organizer") return;
  const ev = eventsData.find(item => item.id === eventId);
  if (!ev) return;

  eventsData = eventsData.filter(item => item.id !== eventId);
  bookingsData = bookingsData.filter(b => b.eventId !== eventId);
  expandedEventIds = expandedEventIds.filter(id => id !== eventId);
  showNotification(`Removed event "${ev.title}".`);
  refreshAllViews();
}

function resetCrudForm() {
  document.getElementById("event-crud-form").reset();
  document.getElementById("edit-event-id").value = "";
  document.getElementById("crud-form-title").textContent = "Add New Event (Organizer / Admin Only)";
  document.getElementById("save-event-btn").textContent = "Save Event";
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

// 4. BOOKING WORKFLOW
function requestBooking(eventId) {
  if (!currentUser) return;
  const ev = eventsData.find(item => item.id === eventId);
  const bookedCount = bookingsData.filter(b => b.eventId === eventId && b.status === "Booked").length;

  if (bookedCount >= ev.capacity) {
    showNotification("This event has reached full capacity.");
    return;
  }

  const duplicate = bookingsData.find(
    b => b.eventId === eventId && b.attendeeEmail === currentUser.email && b.status !== "Cancelled"
  );
  if (duplicate) {
    showNotification(`You already have a request for "${ev.title}".`);
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
  showNotification(`Ticket request #${newBooking.id} submitted for Admin approval.`);
  refreshAllViews();
}

function updateBookingStatus(bookingId, newStatus) {
  const booking = bookingsData.find(b => b.id === bookingId);
  if (!booking) return;

  if ((newStatus === "Booked" || newStatus === "Rejected") && (!currentUser || currentUser.role !== "Organizer")) {
    return;
  }

  booking.status = newStatus;
  showNotification(
    newStatus === "Booked"
      ? `Request #${booking.id} accepted! Status is now "Ticket is Booked".`
      : `Request #${booking.id} updated to ${newStatus}.`
  );
  refreshAllViews();
}

// 5. RENDERING VIEWS
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
    grid.innerHTML = "<p class='text-muted'>No matching events found.</p>";
    return;
  }

  filtered.forEach(ev => {
    const bookedSeats = bookingsData.filter(b => b.eventId === ev.id && b.status === "Booked").length;
    const pendingRequests = bookingsData.filter(b => b.eventId === ev.id && b.status === "Pending").length;
    const seatsLeft = Math.max(0, ev.capacity - bookedSeats);
    const priceLabel = ev.price === 0 ? "FREE" : `₹${ev.price}`;
    const isExpanded = expandedEventIds.includes(ev.id);

    let actionButtons = "";
    if (currentUser.role === "Organizer") {
      actionButtons = `
        <button class="btn-outline" onclick="event.stopPropagation(); startEditEvent(${ev.id})">Edit</button>
        <button class="btn-danger" onclick="event.stopPropagation(); deleteEvent(${ev.id})">Remove</button>
      `;
    } else {
      const userBooking = bookingsData.find(
        b => b.eventId === ev.id && b.attendeeEmail === currentUser.email && b.status !== "Cancelled"
      );
      if (userBooking && userBooking.status === "Booked") {
        actionButtons = `<span class="badge status-Confirmed">Ticket is Booked</span>`;
      } else if (userBooking && userBooking.status === "Pending") {
        actionButtons = `<span class="badge status-Pending">Pending Approval</span>`;
      } else {
        actionButtons = `<button class="btn-primary" onclick="event.stopPropagation(); requestBooking(${ev.id})">Request Ticket</button>`;
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
            <p class="card-meta"><strong>Date:</strong> ${ev.date} • <strong>Venue:</strong> ${ev.location}</p>
            <p class="card-meta"><strong>Seats Available:</strong> ${seatsLeft} of ${ev.capacity}</p>
            <p class="expand-hint">${isExpanded ? "▲ Hide event details" : "▼ Click to view full description & details"}</p>

            <div class="event-details-panel ${isExpanded ? "" : "hidden"}">
              <p><strong>Description:</strong> ${ev.description}</p>
              <p><strong>Event ID:</strong> #${ev.id} | <strong>Category:</strong> ${ev.category}</p>
              <p><strong>Capacity Status:</strong> ${bookedSeats} Booked • ${pendingRequests} Pending • ${seatsLeft} Left</p>
              <p><strong>Organizer:</strong> lpu event orginizers</p>
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

  const visibleBookings = currentUser.role === "Attendee"
    ? bookingsData.filter(b => b.attendeeEmail === currentUser.email)
    : bookingsData;

  if (visibleBookings.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>No booking records found.</td></tr>";
    return;
  }

  visibleBookings.forEach(b => {
    const ev = eventsData.find(item => item.id === b.eventId) || { title: "Removed Event", price: 0 };

    const statusBadge = b.status === "Booked"
      ? `<span class="badge status-Confirmed">Ticket is Booked</span>`
      : b.status === "Pending"
      ? `<span class="badge status-Pending">Pending Approval</span>`
      : `<span class="badge status-${b.status}">${b.status}</span>`;

    let actions = "";
    if (currentUser.role === "Organizer") {
      actions = b.status === "Pending"
        ? `<button class="btn-success" onclick="updateBookingStatus(${b.id}, 'Booked')">Accept</button>
           <button class="btn-danger" onclick="updateBookingStatus(${b.id}, 'Rejected')">Reject</button>`
        : `<span class="text-muted">${b.status === "Booked" ? "Ticket is Booked" : b.status}</span>`;
    } else {
      actions = b.status === "Booked"
        ? `<strong style="color: var(--success);">✓ Ticket is Booked</strong>`
        : b.status === "Pending"
        ? `<button class="btn-secondary" onclick="updateBookingStatus(${b.id}, 'Cancelled')">Cancel</button>`
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
  if (!currentUser || currentUser.role !== "Organizer") return;

  const bookedList = bookingsData.filter(b => b.status === "Booked");
  const totalRevenue = bookedList.reduce((sum, b) => {
    const ev = eventsData.find(e => e.id === b.eventId);
    return sum + (ev ? ev.price : 0);
  }, 0);

  document.getElementById("stat-total-events").textContent = eventsData.length;
  document.getElementById("stat-total-bookings").textContent = bookingsData.length;
  document.getElementById("stat-confirmed-bookings").textContent = bookedList.length;
  document.getElementById("stat-revenue").textContent = `₹${totalRevenue}`;

  const categories = ["Tech", "Music", "Food", "Art"];
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
      <td>${catCapacity} seats</td>
      <td>${catBooked.length}</td>
      <td>₹${catRevenue}</td>
    `;
    reportBody.appendChild(row);
  });
}

function refreshAllViews() {
  if (!currentUser) return;
  if (currentUser.role === "Organizer") {
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
document.getElementById("free-only").addEventListener("change", renderEvents);s