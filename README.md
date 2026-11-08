# EventsHive

# 🎵 GigSync — Role-Based Platform for Local Musicians

**GigSync** is a responsive, role-based web application that centralizes core music records (live gigs, studio sessions, jams, and workshops), musician slot applications, approval workflows, and real-time status reporting.

---

## 🔐 Default Login Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin / Studio Director** | `admin@lpu.in` | `1234` | Full CRUD on gigs/sessions, approve/decline musician slots, view KPI analytics, and approve new Band Leader/Manager accounts. |
| **Local Musician (Default User)** | `user@lpu.in` | `1234` | Search/filter sessions, view technical riders, submit custom bio pitches, and track slot application statuses. |

> **Note on New Registrations:**
> * Registering as a **Musician / Artist** grants immediate login access.
> * Registering as a **Band Leader / Studio Manager** sets the account to `Pending` until approved by `admin@lpu.in`.

---

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Dynamically adapts the navigation bar, dashboards, and card actions based on whether a user is a Musician, Manager, or Super Admin.
* **Centralized Core Records (CRUD):** Managers can create, edit, and delete music sessions, upload cover artwork from their device (`FileReader` API), and specify technical riders.
* **Musician Pitch & Lineup Workflow:** Musicians include a brief note about their instrument, gear, or experience when applying for a slot, which is displayed in the Manager's review table.
* **Live Status Reporting:** Real-time KPI cards and a category-level analytics table tracking active records, roster capacity, confirmed musicians, and total session fees.

---

## 🚀 How to Run

1. Download or clone the project folder containing `index.html`, `style.css`, and `script.js`.
2. Open `index.html` directly in any modern web browser (or launch via VS Code **Live Server**).