# Samvad Jharkhand (संवाद झारखंड) 🌾🏛️🎓🏢

> **Citizen-to-Campus Societal Innovation & Civic Problem Resolution Platform for Jharkhand**

Samvad Jharkhand bridges the gap between rural/semi-urban citizens, Higher Education Institutions (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur), industry partners (Tata Steel, MSME clusters), and district administration to solve ground-level societal challenges through a **Quadruple-Helix model**.

---

## 📱 Architecture & Tech Stack

- **Framework:** Expo SDK 57 (React Native 0.86, React 19)
- **Routing:** Expo Router v57 (file-based navigation with native stack fallback)
- **Backend & Auth:** Supabase (PostgreSQL 15+, GoTrue Auth, Storage)
- **Offline & Storage:** `expo-secure-store`, local persistence for drafts and cached supports
- **Device Integrations:**
  - Real GPS Geolocation & Reverse Geocoding (`expo-location`)
  - Camera & Device Photo Library (`expo-image-picker`)
  - Low-bandwidth photo compression (~80% compression for 2G/3G rural networks)
- **Styling & Theming:** Custom Samadhan Theme with High-Contrast mode, dynamic text scaling (0.9x to 1.18x), and Hindi / English bilingual localization

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode or physical Android/iOS device running Expo Go

### 2. Environment Variables
Create `.env.local` in the project root:
```env
EXPO_PUBLIC_SUPABASE_URL=https://iajpmeoqtuqrwwesuvgq.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 3. Installation
```bash
npm install
```

### 4. Run Locally
```bash
# Start development server
npx expo start

# Run on Android device or emulator
npx expo run:android

# Run on Web
npx expo start --web
```

---

## 🗄️ Backend Setup (Supabase)

The complete production database schema, triggers, and Row-Level Security (RLS) policies are in [`supabase/schema.sql`](./supabase/schema.sql).

### 1-Click Database Deployment
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** &rarr; **New Query**.
3. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.

### Applied Tables
| Table | Description |
| :--- | :--- |
| `public.profiles` | User accounts, verified roles, phone numbers, districts, and blocks. |
| `public.challenges` | Societal challenges submitted across Jharkhand with stage tracking. |
| `public.civic_reports` | 6-step citizen grievances with coordinates, urgency, and timelines. |
| `public.challenge_comments` | Moderated collaboration comments between citizens, faculty, and industry. |
| `public.report_comments` | Status updates and feedback on civic reports. |
| `public.challenge_upvotes` | Unique citizen upvotes on challenges (`unique(challenge_id, user_id)`). |
| `public.report_supports` | Endorsements on civic reports (`unique(report_id, user_id)`). |
| `public.notifications` | Realtime status alerts delivered to users. |
| `storage.buckets ('media')` | Publicly accessible bucket for evidence photos and documents. |

---

## 🔒 Security & Row-Level Security (RLS)

All tables have strict Row-Level Security (RLS) enabled:
- **Profiles:** Only authenticated users can view profiles. Users can only update their own profile (`auth.uid() = id`).
- **Challenges:** Viewable by the public. Inserts require an authenticated user. Updates are restricted to the author or verified `university` / `government` roles.
- **Civic Reports:** Viewable by the public. Inserts require authentication. Updates are restricted to the submitter or `government` team.
- **Media Storage:** Publicly viewable for evidence transparency. Uploads strictly require authentication (`auth.role() = 'authenticated'`).
- **Comments & Upvotes:** Strictly restricted so users can only post or upvote under their own `auth.uid()`.

---

## 👥 Quadruple-Helix Role-Based Access Control

The platform enforces 4 distinct personas:
1. **Citizen (`citizen`):** Report local problems, upload evidence, track grievance stages, and upvote community challenges.
2. **University / HEI (`university`):** Review routed challenges in their domain, form student-faculty teams, submit technical proposals, and track milestone progress.
3. **Industry / CSR (`industry`):** Offer funding, mentoring, prototyping, and technology transfer for validated HEI projects.
4. **Government (`government`):** Administrative oversight, district-wise grievance monitoring, and sanctioning of solutions.

---

## 🛡️ Android Permissions Review (`app.json`)

| Permission | Justification |
| :--- | :--- |
| `ACCESS_FINE_LOCATION` | Used by `LocationPicker` to tag grievance GPS coordinates to Panchayat level. |
| `ACCESS_COARSE_LOCATION` | Fallback approximate cell-tower location in low-connectivity rural zones. |
| `CAMERA` | Used by `MediaUploader` to capture real-time photo evidence of broken infrastructure. |
| `RECORD_AUDIO` | Used for voice-based problem input in Hindi/English for low-literacy citizens. |

---

## ✅ Production Release Checklist

Before building release artifacts with EAS:
- [x] Unreferenced legacy folder `my-app/` cleaned up.
- [x] Hardened RLS policies in `supabase/schema.sql` (preventing unauthorized profile scraping and updates).
- [x] Integrated real GPS detection via `expo-location`.
- [x] Integrated real camera & photo library via `expo-image-picker`.
- [x] Offline draft persistence via `local-storage` (`expo-secure-store`).
- [x] Supabase upvotes, comments, and stage transitions persisted to database.
- [x] TypeScript compiler passes with 0 errors (`npx tsc --noEmit`).
- [ ] Build release bundle: `eas build -p android --profile production`.
- [ ] Verify Supabase Auth "Confirm email" toggle setting in project dashboard.
