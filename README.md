# CertAi - Government Certificate Issuance Platform

## Overview
CertAi is a full-stack web application for online issuance of government certificates (caste, income, residence) with streamlined document verification and certificate generation.

**Website Name:** CertAi  
**Tagline:** Simplifying Certificates & Citizen Services — Apply, Track, Receive, All in One Place

## Technology Stack

### Frontend
- **React.js** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching and state management
- **Shadcn UI** + **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **Lucide React** for icons

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** (Neon-backed) for persistent data storage
- **Passport.js** for authentication (local strategy)
- **Express Session** for session management

## Recent Changes (Oct 26, 2025)

### Database Migration
- **Migrated from in-memory storage to PostgreSQL** for persistent data storage
- All data (users, documents, applications, certificates) now persists in the database
- Database automatically provisioned PostgreSQL service



## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (home, auth, apply, track, certificates)
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/          # Utilities and configuration
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication setup
│   ├── db.ts             # Database connection
│   ├── db-storage.ts     # PostgreSQL storage implementation
│   ├── storage.ts        # Storage interface & in-memory fallback
│   └── vite.ts           # Vite development server setup
├── shared/                # Shared types and schemas
│   └── schema.ts         # Drizzle ORM schema definitions
└── attached_assets/       # Static assets (logo, images)
```

## Database Schema

### Tables
1. **users** - User accounts with authentication
2. **documents** - Uploaded documents with verification status
3. **applications** - Certificate applications with status tracking
4. **certificates** - Issued certificates with validity periods

### Key Features
- Auto-incrementing IDs for all tables
- Timestamp tracking (createdAt, updatedAt, appliedAt, issuedAt)
- JSON fields for flexible data storage (formData, certificateData, verificationResult)
- Unique constraints on usernames and application IDs

## Features

### User Features
- **User Registration & Authentication** - Secure login with Aadhaar-based registration
- **Multi-step Application Form** - Different forms for caste, income, and residence certificates
- **Document Upload** - Support for multiple document types (Aadhaar, PAN, address proof, etc.)
- **Application Tracking** - Real-time status tracking with application ID and mobile number
- **Certificate Download** - Digital certificates with QR code verification
- **Status Timeline** - Visual progress indicator for application stages

### Certificate Types
1. **Caste Certificate** (5 years validity)
2. **Income Certificate** (1 year validity)
3. **Residence Certificate** (3 years validity)

### Application Flow
1. **Pending** - Application submitted
2. **Document Verification** - Documents being verified (auto-approved)
3. **Official Approval** - Awaiting official approval
4. **Completed** - Certificate issued

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents` - Get user's documents

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get specific application
- `POST /api/track-application` - Track application (public)

### Certificates
- `GET /api/certificates` - Get user's certificates
- `GET /api/certificates/:id` - Get specific certificate
- `GET /api/verify-certificate/:id` - Verify certificate (public)

### Admin
- `POST /api/admin/approve-application` - Approve application and generate certificate

## Environment Variables

The following environment variables are automatically set by Replit:
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - PostgreSQL credentials

## Development Commands

```bash
# Start development server
npm run dev

# Push database schema changes
npm run db:push

# Force push database schema (if conflicts)
npm run db:push --force
```

## Current State

✅ **Running successfully** on port 5000  
✅ **Database connected** and schema migrated  
✅ **All features operational** - Registration, applications, certificates working

## Future Enhancements

- Add email notifications for application status updates
- Implement admin dashboard for certificate approvals
- Add digital signature verification
- Export certificates as PDF
- Multi-language support
- Mobile app development
