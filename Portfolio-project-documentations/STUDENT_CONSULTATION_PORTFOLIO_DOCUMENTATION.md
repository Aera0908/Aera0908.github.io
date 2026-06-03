# Student Consultation System - Portfolio Documentation

> **A modern, full-stack web application for managing student-professor consultations with real-time messaging, scheduling, and comprehensive user management.**

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [API Architecture](#api-architecture)
- [User Interface](#user-interface)
- [Authentication & Security](#authentication--security)
- [File Management](#file-management)
- [Real-Time Features](#real-time-features)
- [Development Process](#development-process)
- [Challenges & Solutions](#challenges--solutions)
- [Installation & Setup](#installation--setup)
- [Future Enhancements](#future-enhancements)

---

## Overview

The **Student Consultation System** is a comprehensive web platform designed to streamline the consultation process between students and professors. It provides separate, role-based interfaces for students and professors, enabling efficient scheduling, communication, and management of academic consultations.

### Purpose
- Eliminate the hassle of scheduling in-person consultations
- Provide a centralized platform for student-professor communication
- Enable professors to manage their availability and consultation requests efficiently
- Give students easy access to view professor schedules and book appointments

### Target Users
- **Students**: Book consultations, view professor availability, communicate via messaging
- **Professors**: Manage schedules, approve/reject consultation requests, communicate with students

---

## Live Demo

### Demo Credentials

**Professor Accounts:**
```
Email: maria.santos@university.edu
Password: password123
```

**Student Accounts:**
```
Email: john.smith@student.edu
Password: password123
```

**Access Points:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

*Note: See `docs/DEMO_CREDENTIALS.md` for complete list of 60 demo accounts (10 professors, 50 students)*

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework with latest concurrent features |
| **TypeScript** | 5.x | Type-safe development |
| **Vite** | 5.x | Fast build tool and dev server |
| **React Router** | 7.9.6 | Client-side routing |
| **Tailwind CSS** | 4.1.17 | Utility-first styling framework |
| **Lucide React** | 0.554.0 | Modern icon library |
| **React Image Crop** | 11.0.10 | Profile photo cropping |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x LTS | Runtime environment |
| **Express** | 5.1.0 | Web application framework |
| **TypeScript** | 5.x | Type-safe backend development |
| **PostgreSQL** | 16.x | Relational database |
| **JWT** | 9.0.2 | Authentication tokens |
| **Bcrypt.js** | 3.0.3 | Password hashing |

### File Handling & Storage
| Technology | Version | Purpose |
|------------|---------|---------|
| **Multer** | 2.0.2 | File upload middleware |
| **Sharp** | 0.34.5 | Image processing and optimization |
| **UUID** | 13.0.0 | Unique file identifiers |

### Development Tools
- **tsx** - TypeScript execution for development
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## Key Features

### Student Features

#### 1. **Professor Discovery**
- Browse all professors grouped by academic program
- View real-time availability status (online/offline)
- Filter by department: BSCE, BSCPE, BSME, MSEE, BSECE, BSIE, BS EnSE, BS Archi
- View professor profiles with specializations and contact information

#### 2. **Consultation Booking**
- Interactive calendar to view professor availability
- Book consultation appointments with preferred date/time
- Choose consultation mode (online or face-to-face)
- Add consultation purpose and detailed description
- Track consultation status (pending, approved, ongoing, completed, rejected)

#### 3. **Consultation Management**
- Dedicated consultations page with 4 status tabs:
  - **Pending**: Awaiting professor approval
  - **Approved**: Confirmed consultations
  - **Ongoing**: Active consultation sessions
  - **History**: Completed and rejected consultations
- Summary statistics dashboard
- View rejection reasons for declined requests
- Color-coded status badges for quick identification

#### 4. **Real-Time Messaging**
- Direct messaging with professors
- File attachments support (images, documents)
- Message read receipts
- Conversation history
- Unread message notifications

#### 5. **Profile Management**
- Upload and crop profile photos
- Update personal information
- View consultation history
- Notification preferences

### Professor Features

#### 1. **Schedule Management**
- Set weekly availability schedules
- Toggle online/offline status
- Block out unavailable time slots
- Visual calendar interface
- Recurring schedule templates

#### 2. **Consultation Request Management**
- View all incoming consultation requests
- Approve requests with one click
- Reject requests with mandatory reason
- View student profiles and consultation details
- Filter by status and date

#### 3. **Dashboard Analytics**
- Total consultation requests
- Pending approvals count
- Completed consultations
- Current online status

#### 4. **Student Communication**
- Real-time messaging with students
- View conversation history
- Send file attachments
- Notification system for new messages

#### 5. **Announcements**
- Post announcements for students
- Department-wide or program-specific
- Edit and delete announcements
- Visibility controls

### Notification System
- Real-time notifications for:
  - New consultation requests (professors)
  - Consultation approvals/rejections (students)
  - New messages
  - Schedule changes
- Notification dropdown with unread count
- Mark as read functionality

---

## System Architecture

### Architecture Pattern
**Three-Tier Architecture**

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│                                         │
│  React Frontend (TypeScript + Vite)    │
│  - Components                           │
│  - Pages                                │
│  - Context (State Management)           │
│  - Routing                              │
└─────────────┬───────────────────────────┘
              │ HTTP/REST API
              │
┌─────────────▼───────────────────────────┐
│         Application Layer               │
│                                         │
│  Express.js Backend (TypeScript)        │
│  - Controllers                          │
│  - Routes                               │
│  - Middleware                           │
│  - Authentication (JWT)                 │
└─────────────┬───────────────────────────┘
              │ SQL Queries
              │
┌─────────────▼───────────────────────────┐
│           Data Layer                    │
│                                         │
│  PostgreSQL Database                    │
│  - Users                                │
│  - Students/Professors                  │
│  - Consultations                        │
│  - Messages                             │
│  - Notifications                        │
└─────────────────────────────────────────┘
```

### Component Structure

```
src/
├── components/              # Reusable UI components
│   ├── CalendarModal.tsx   # Availability calendar
│   ├── MessagesTab.tsx     # Messaging interface
│   ├── ScheduleManagement.tsx  # Schedule editor
│   ├── NotificationDropdown.tsx
│   ├── ProfilePhotoModal.tsx
│   └── ...
├── pages/                   # Route-level components
│   ├── LandingPage.tsx
│   ├── StudentDashboard.tsx
│   ├── ProfessorDashboard.tsx
│   ├── StudentConsultations.tsx
│   └── ...
├── context/                 # Global state management
│   └── AuthContext.tsx     # Authentication state
├── config/                  # Configuration
│   └── api.ts              # API client setup
└── types/                   # TypeScript definitions
    └── index.ts

server/
├── controllers/             # Business logic
│   └── authController.ts
├── routes/                  # API endpoints
│   ├── authRoutes.ts
│   ├── dataRoutes.ts
│   ├── messageRoutes.ts
│   ├── uploadRoutes.ts
│   ├── fileRoutes.ts
│   └── scheduleRoutes.ts
├── middleware/              # Request processors
│   └── fileUpload.ts
├── config/                  # Server configuration
│   └── database.ts
└── database/                # SQL schemas and seeds
```

---

## Database Design

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│    users     │         │   students   │
├──────────────┤         ├──────────────┤
│ id (PK)      │◄────────┤ id (PK)      │
│ email        │         │ user_id (FK) │
│ password     │         │ student_id   │
│ role         │         │ first_name   │
│ created_at   │         │ program      │
└──────┬───────┘         │ year_level   │
       │                 └──────────────┘
       │
       │                 ┌──────────────┐
       │                 │  professors  │
       │                 ├──────────────┤
       └─────────────────┤ id (PK)      │
                         │ user_id (FK) │
                         │ title        │
                         │ department   │
                         │ is_available │
                         └──────┬───────┘
                                │
                                │
        ┌───────────────────────┴───────────────────────┐
        │                                               │
        ▼                                               ▼
┌──────────────────────┐                    ┌────────────────────┐
│ consultation_requests│                    │  notifications     │
├──────────────────────┤                    ├────────────────────┤
│ id (PK)              │                    │ id (PK)            │
│ student_id (FK)      │                    │ user_id (FK)       │
│ professor_id (FK)    │                    │ type               │
│ purpose              │                    │ message            │
│ preferred_date       │                    │ is_read            │
│ status               │                    │ created_at         │
│ rejection_reason     │                    └────────────────────┘
└──────────┬───────────┘
           │
           │                    ┌──────────────────┐
           └────────────────────┤    messages      │
                                ├──────────────────┤
                                │ id (PK)          │
                                │ consultation_id  │
                                │ sender_id (FK)   │
                                │ content          │
                                │ file_path        │
                                │ read_at          │
                                └──────────────────┘
```

### Key Tables

#### 1. **users**
Authentication and user type management
- Stores credentials for both students and professors
- Role-based access control (student/professor)
- Bcrypt password hashing

#### 2. **students** & **professors**
Profile information for each user type
- Extended user data specific to role
- Students: student ID, program, year level
- Professors: title, department, specialization, office room

#### 3. **consultation_requests**
Core consultation management
- Links students and professors
- Tracks consultation lifecycle
- Status flow: pending → approved/rejected → ongoing → completed
- Stores rejection reasons for transparency

#### 4. **messages**
Real-time communication
- Linked to consultation requests
- Supports text and file attachments
- Read receipt tracking
- Timestamp for message ordering

#### 5. **notifications**
User alert system
- Type-based notifications (consultation, message, announcement)
- Read/unread status
- User-specific targeting

#### 6. **professor_schedules**
Availability management
- Day of week scheduling
- Time slot availability
- Recurring schedule support

---

## API Architecture

### RESTful Endpoints

#### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup/student` | Register new student | No |
| POST | `/signup/professor` | Register new professor | No |
| POST | `/login/student` | Student login | No |
| POST | `/login/professor` | Professor login | No |

#### Data Routes (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/professors` | Get all professors | Yes |
| GET | `/professors/:id` | Get professor details | Yes |
| PATCH | `/professors/:id/availability` | Update availability | Yes (Prof) |
| GET | `/students/:id` | Get student details | Yes |
| PATCH | `/students/:id` | Update student profile | Yes (Student) |

#### Consultation Routes (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/consultation-requests` | Create consultation | Yes (Student) |
| GET | `/consultation-requests/student/:id` | Get student's requests | Yes |
| GET | `/consultation-requests/professor/:id` | Get professor's requests | Yes |
| PATCH | `/consultation-requests/:id/status` | Update status | Yes (Prof) |

#### Message Routes (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/messages` | Send message | Yes |
| GET | `/messages/consultation/:id` | Get conversation | Yes |
| PATCH | `/messages/:id/read` | Mark as read | Yes |

#### File Routes (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload/profile` | Upload profile photo | Yes |
| POST | `/upload/message` | Upload message attachment | Yes |
| GET | `/files/:filename` | Retrieve file | Yes |

#### Schedule Routes (`/api`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/schedules/professor/:id` | Get professor schedule | Yes |
| POST | `/schedules` | Create schedule | Yes (Prof) |
| PUT | `/schedules/:id` | Update schedule | Yes (Prof) |
| DELETE | `/schedules/:id` | Delete schedule | Yes (Prof) |

### Request/Response Examples

#### Student Login Request
```json
POST /api/auth/login/student
{
  "email": "john.smith@student.edu",
  "password": "password123"
}
```

#### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.smith@student.edu",
    "role": "student",
    "name": "John Smith",
    "studentId": "2021-00001",
    "program": "BS Computer Science",
    "yearLevel": 3
  }
}
```

#### Create Consultation Request
```json
POST /api/consultation-requests
{
  "studentId": 1,
  "professorId": 3,
  "purpose": "Course Clarification",
  "topic": "Data Structures",
  "description": "Need help understanding binary search trees",
  "preferredMode": "online",
  "preferredDate": "2025-01-15",
  "preferredTime": "14:00"
}
```

---

## User Interface

### Design Principles

1. **Role-Based Interfaces**: Separate, optimized experiences for students and professors
2. **Responsive Design**: Mobile-first approach using Tailwind CSS
3. **Accessibility**: WCAG 2.1 compliant, keyboard navigation support
4. **Visual Hierarchy**: Clear information architecture with status colors
5. **Intuitive Navigation**: Consistent layout across all pages

### Color System

```css
/* Status Colors */
Pending:   #FCD34D (Yellow)
Approved:  #10B981 (Green)
Ongoing:   #3B82F6 (Blue)
Completed: #6B7280 (Gray)
Rejected:  #EF4444 (Red)

/* Primary Colors */
Primary:   #2563EB (Blue)
Secondary: #F97316 (Orange)
Accent:    #8B5CF6 (Purple)

/* Neutral Colors */
Background: #F9FAFB
Text:       #111827
Border:     #E5E7EB
```

### Key UI Components

#### 1. **Calendar Modal**
- Visual weekly schedule display
- Time slot selection
- Available/unavailable indicators
- Mobile-responsive grid

#### 2. **Message Interface**
- Chat-style message display
- File attachment previews
- Read receipts
- Auto-scroll to new messages

#### 3. **Dashboard Cards**
- Statistics overview
- Quick action buttons
- Color-coded status indicators
- Responsive grid layout

#### 4. **Notification Dropdown**
- Badge with unread count
- Scrollable notification list
- Mark all as read option
- Timestamp display

---

## Authentication & Security

### Authentication Flow

```
┌─────────────┐
│   Login     │
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Verify Credentials │
│  - Check email      │
│  - Compare password │
│    (bcrypt)         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Generate JWT Token │
│  - User ID          │
│  - Role             │
│  - Expiration       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Return Token       │
│  + User Data        │
└─────────────────────┘
```

### Security Features

#### 1. **Password Security**
- Bcrypt hashing with salt rounds (10)
- Never stored in plain text
- Password complexity requirements

#### 2. **JWT Authentication**
- Stateless authentication
- Token expiration (24 hours)
- Secure HTTP-only cookies (production)
- Role-based payload

#### 3. **Authorization**
- Route-level protection with ProtectedRoute component
- Role-based access control (RBAC)
- API endpoint authorization middleware

#### 4. **Data Validation**
- Input sanitization
- Type checking with TypeScript
- SQL injection prevention (parameterized queries)

#### 5. **File Upload Security**
- File type validation
- Size limits (5MB for images, 10MB for documents)
- Unique filename generation (UUID)
- Secure file storage outside web root

### Protected Routes Example

```typescript
// Frontend route protection
<Route path="/student/dashboard" element={
  <ProtectedRoute role="student">
    <StudentDashboard />
  </ProtectedRoute>
} />

// Backend middleware
router.patch('/:id/availability', 
  authenticateToken, 
  authorizeRole('professor'),
  updateAvailability
);
```

---

## File Management

### File Upload System

#### Supported File Types
- **Images**: JPG, JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX
- **Spreadsheets**: XLS, XLSX
- **Presentations**: PPT, PPTX

#### Upload Flow

```
┌──────────────────┐
│  Client Selects  │
│  File            │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Validate        │
│  - Type          │
│  - Size          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Multer          │
│  Middleware      │
│  - Memory/Disk   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Sharp (Images)  │
│  - Resize        │
│  - Optimize      │
│  - Format        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Save to Disk    │
│  - UUID filename │
│  - Organized dir │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Store Path in   │
│  Database        │
└──────────────────┘
```

#### Storage Structure
```
server/uploads/
├── profiles/              # Profile photos
│   └── [uuid].jpg
└── messages/              # Message attachments
    └── [uuid].[ext]
```

#### Image Processing
- **Profile Photos**:
  - Resized to 400x400px
  - Compressed to optimize loading
  - Converted to JPEG format
  - Client-side cropping support

- **Message Images**:
  - Max width: 1200px
  - Maintained aspect ratio
  - Optimized quality

---

## Real-Time Features

### Notification System

#### Notification Types
1. **Consultation Notifications**
   - New consultation request (professor)
   - Request approved (student)
   - Request rejected with reason (student)
   - Consultation started (both)
   - Consultation completed (both)

2. **Message Notifications**
   - New message received
   - Unread message count
   - Read receipt confirmation

3. **Schedule Notifications**
   - Schedule changed by professor
   - Upcoming consultation reminder

#### Implementation
- Database-driven notification system
- Polling mechanism for updates (5-second interval)
- WebSocket upgrade path for future enhancement
- Persistent notifications with read/unread status

### Availability Status

#### Real-Time Status Updates
- Professor online/offline toggle
- Instant status propagation to student view
- Visual indicators (green dot = online, gray = offline)
- Last seen timestamp

---

## Development Process

### Development Workflow

1. **Planning & Design**
   - Requirements gathering
   - Database schema design
   - API endpoint planning
   - UI/UX mockups

2. **Backend Development**
   - Database setup (PostgreSQL)
   - Express.js server configuration
   - RESTful API implementation
   - Authentication system
   - File upload handling

3. **Frontend Development**
   - React component architecture
   - TypeScript type definitions
   - Tailwind CSS styling
   - Client-side routing
   - State management (Context API)

4. **Integration**
   - API client setup
   - Authentication flow
   - Real-time features
   - File handling

5. **Testing**
   - Manual testing
   - Demo data creation (60 accounts)
   - Cross-browser testing
   - Mobile responsiveness

6. **Documentation**
   - API documentation
   - User guides
   - Deployment guides
   - Demo credentials

### Code Quality

- **TypeScript**: Strict type checking throughout
- **ESLint**: Code linting and formatting
- **Component Structure**: Modular, reusable components
- **Error Handling**: Comprehensive try-catch blocks
- **Code Comments**: Inline documentation

---

## Challenges & Solutions

### Challenge 1: Real-Time Updates Without WebSockets

**Problem**: Need real-time updates for messages and notifications without complex WebSocket infrastructure.

**Solution**: 
- Implemented polling mechanism with 5-second intervals
- Optimistic UI updates for instant feedback
- Efficient database queries to minimize server load
- Future-ready architecture for WebSocket upgrade

### Challenge 2: Role-Based Access Control

**Problem**: Different user types require distinct interfaces and permissions.

**Solution**:
- Separate authentication flows for students/professors
- Protected routes with role validation
- Role-specific components and data fetching
- JWT tokens with role claims

### Challenge 3: File Upload & Security

**Problem**: Secure file uploads with validation and optimization.

**Solution**:
- Multer middleware for file handling
- Sharp library for image processing
- UUID-based filenames to prevent conflicts
- Type and size validation
- Secure file storage outside public directory

### Challenge 4: Schedule Management Complexity

**Problem**: Flexible scheduling system for professors with conflict detection.

**Solution**:
- Weekly recurring schedule template
- Time slot-based availability
- Visual calendar interface
- Database-driven schedule validation

### Challenge 5: Responsive Design Across Devices

**Problem**: Complex dashboards need to work on mobile and desktop.

**Solution**:
- Mobile-first Tailwind CSS approach
- Responsive grid layouts
- Collapsible sections for mobile
- Touch-friendly UI elements

---

## Installation & Setup

### Quick Start

#### Prerequisites
- **Node.js** v20.x or higher
- **PostgreSQL** 16.x
- **npm** or **yarn**

#### Automated Setup (Windows)

1. **Extract project files** to `C:\Projects\student_consultation_system\`

2. **Run setup script**:
   ```bash
   # Right-click → Run as Administrator
   setup.bat
   ```

3. **Enter database credentials** when prompted

4. **Start the application**:
   ```bash
   # Double-click to start both servers
   start-all.bat
   ```

5. **Access application**: `http://localhost:5173`

#### Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup database
psql -U postgres -d consultation_system -f server/database/schema.sql
psql -U postgres -d consultation_system -f server/database/seed.sql

# 4. Start backend
npm run server

# 5. Start frontend (new terminal)
npm run dev
```

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=consultation_system
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_secret_key_here

# Server Configuration
PORT=3001
```

### Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Backend runs in production mode
NODE_ENV=production npm run server
```

---

## Future Enhancements

### Planned Features

1. **Real-Time Chat with WebSockets**
   - Replace polling with WebSocket connections
   - Instant message delivery
   - Typing indicators
   - Online presence

2. **Video Consultation Integration**
   - WebRTC integration for video calls
   - Screen sharing capability
   - Recording functionality
   - Scheduled video meetings

3. **Advanced Analytics**
   - Consultation statistics
   - Student engagement metrics
   - Professor performance dashboards
   - Time tracking and reports

4. **Email Notifications**
   - Confirmation emails for consultations
   - Reminder emails before appointments
   - Digest emails for updates
   - SMTP integration

5. **Calendar Integration**
   - Export to Google Calendar
   - iCal format support
   - Calendar synchronization
   - Reminder notifications

6. **Mobile Application**
   - React Native mobile app
   - Push notifications
   - Offline support
   - Native camera integration

7. **Enhanced Search & Filters**
   - Advanced professor search
   - Filter by availability
   - Department-based filtering
   - Consultation history search

8. **Rating & Review System**
   - Student feedback on consultations
   - Professor ratings
   - Anonymous reviews
   - Quality assurance metrics

9. **Document Collaboration**
   - Shared document editing
   - Code snippet sharing with syntax highlighting
   - Whiteboard functionality
   - File version control

10. **Administrative Panel**
    - User management
    - System-wide announcements
    - Analytics and reporting
    - Bulk user imports

---

## Project Statistics

- **Total Files**: 100+ source files
- **Lines of Code**: ~15,000+ lines
- **Components**: 20+ React components
- **API Endpoints**: 30+ RESTful endpoints
- **Database Tables**: 8 core tables
- **Demo Accounts**: 60 (10 professors, 50 students)
- **Development Time**: 4-6 weeks
- **Tech Stack**: 15+ technologies

---

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[DEPLOYMENT_AND_SETUP_GUIDE.md](./docs/DEPLOYMENT_AND_SETUP_GUIDE.md)** - Complete setup instructions
- **[API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - API endpoint reference
- **[CONSULTATION_SYSTEM_GUIDE.md](./docs/CONSULTATION_SYSTEM_GUIDE.md)** - Feature documentation
- **[DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)** - Database schema and setup
- **[DEMO_CREDENTIALS.md](./docs/DEMO_CREDENTIALS.md)** - Test account credentials
- **[MESSAGING_SYSTEM.md](./docs/MESSAGING_SYSTEM.md)** - Messaging feature details

---

## Developer Information

**Project Type**: Full-Stack Web Application  
**Repository**: [GitHub Link]  
**License**: MIT  
**Contact**: [Your Contact Information]

---

## Learning Outcomes

This project demonstrates proficiency in:

- **Full-Stack Development**: End-to-end application development
- **Modern React**: Hooks, Context API, TypeScript integration
- **RESTful API Design**: Scalable backend architecture
- **Database Design**: Complex relational database modeling
- **Authentication**: JWT-based secure authentication
- **File Handling**: Upload, processing, and storage
- **Responsive Design**: Mobile-first UI development
- **TypeScript**: Type-safe development practices
- **Version Control**: Git workflow and documentation

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **PostgreSQL** - For the robust database system
- **Express.js** - For the minimalist web framework
- **Open Source Community** - For the incredible libraries and tools

---

## License

MIT License - feel free to use this project for learning purposes.

---

**Built with ❤️ using React, TypeScript, Express, and PostgreSQL**
