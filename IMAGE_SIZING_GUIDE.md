# AERA.DEV — Asset Image Sizing Guide

This reference outlines the required dimensions and target aspect ratios for all visual assets utilized across the portfolio system.

---

## 1. Notable Projects (The Vault)
- **Location**: Notable project cards displayed in the home view (`src/components/sections/Projects.tsx` -> `src/components/ui/VaultCard.tsx`).
- **Aspect Ratio**: **3:4 (Portrait)**
- **Dimensions**:
  - *Recommended Minimum*: **600 x 800 px**
  - *Recommended Quality*: **750 x 1000 px**
- **Format**: `.png` or `.webp` (ensure file sizes are optimized under 200 KB).

---

## 2. Project Archive (The Gallery)
- **Location**: Full systems list displayed in the scrollable Project Archive overlay (`src/components/ui/ProjectGallery.tsx`).
- **Aspect Ratio**: **16:9 (Widescreen)**
- **Dimensions**:
  - *Recommended Minimum*: **1280 x 720 px**
  - *Recommended Quality*: **1920 x 1080 px**
- **Format**: `.png` or `.webp`.

---

## 3. Case Study Banners
- **Location**: Top header banner in individual project case studies (`src/app/projects/[slug]/page.tsx`).
- **Aspect Ratio**: **21:9 (Ultrawide)**
- **Dimensions**:
  - *Recommended Minimum*: **1680 x 720 px**
  - *Recommended Quality*: **2560 x 1080 px** (or 1920 x 822 px)
- **Format**: `.png` or `.webp`.

---

## 4. Operator Portrait (Hero Profile)
- **Location**: Main profile portrait nested inside the collapsible card in the Hero section (`src/components/sections/Hero.tsx`).
- **Aspect Ratio**: **3:4 (Portrait)**
- **Dimensions**:
  - *Recommended Minimum*: **600 x 800 px**
  - *Recommended Quality*: **750 x 1000 px**
- **Filename**: `/kpr_portrait.png` (placed in the `/public` root directory).
- **Format**: `.png` or `.webp` (transparent backgrounds work well if blending with underlying grid backgrounds is required).

---

## 5. Certification Previews
- **Location**: Popups in the Credentials terminal section (`src/components/sections/Credentials.tsx`).
- **Dimensions / Format**:
  - For PDF certificates: Standard document dimensions (US Letter or A4).
  - For image certificates: **4:3** or **16:10** landscape aspect ratio.
  - *Recommended Quality*: **1200 x 900 px** (to ensure text readability).
  - **Location**: `/public/CERTIFICATE-PREVIEWS/...`
