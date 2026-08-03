# SAVVORA 20-Second Cinematic Promotional Video (Remotion)

This directory contains the complete Remotion project for the SAVVORA e-commerce promotional video.

## Specifications
- **Duration**: 20 seconds (600 frames)
- **FPS**: 30
- **Resolution**: 1920x1080 (Full HD)
- **Format**: MP4 (H.264)
- **Brand Palette**:
  - Dark Luxury Background: `#0B0B10`
  - Electric Blue: `#2563EB`
  - Gold Accent: `#F5B301`
  - Crisp White: `#FFFFFF`

## Structure
- `src/scenes/Scene1LogoIntro.tsx`: SVJ Logo animation, gold particles, light sweep & tagline (0-3s).
- `src/scenes/Scene2HeroShowcase.tsx`: Homepage hero section, animated handcrafted gradient headline, CTAs & 3D floating card (3-8s).
- `src/scenes/Scene3PriceDrop.tsx`: Price strike-through (₹999 → ₹499), SAVE 50% exploding badge & camera zoom (8-11s).
- `src/scenes/Scene4ProductWall.tsx`: 3D parallax floating product wall with categories & status badges (11-16s).
- `src/scenes/Scene5OutroCTA.tsx`: Animated trust badges, website URL reveal (`https://savvora-e-com.onrender.com`), logo reformation & cinematic fade out (16-20s).
- `src/components/`: Reusable animation primitives (`GoldParticles.tsx`, `GlossyCard.tsx`, `LightSweep.tsx`).

## How to Edit & Preview
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start interactive Remotion Studio preview:
   ```bash
   npm run dev
   ```

## How to Render Video
Render the high-definition MP4 output to `out/savvora_promo.mp4`:
```bash
npm run render
```
Or execute the included PowerShell helper script:
```powershell
.\render.ps1
```
