# Background Video Setup

## 📁 Folder Structure
```
public/
├── videos/
│   ├── hero-background.mp4    (Add your video here)
│   └── hero-background.webm   (Optional: WebM format)
└── images/
    └── hero-poster.jpg        (Optional: Poster image)
```

## 🎥 How to Add Your Video

### Step 1: Download a Video
Download a high-quality video from these free sources:

**Recommended Sites:**
- **Pexels**: https://www.pexels.com/videos/
- **Pixabay**: https://pixabay.com/videos/
- **Coverr**: https://coverr.co/
- **Videvo**: https://www.videvo.net/

**Search Terms:**
- "african business"
- "mobile money"
- "fintech"
- "office teamwork"
- "community savings"
- "financial planning"

### Step 2: Prepare Your Video
1. Download the video (preferably 1080p or 4K)
2. Rename it to: `hero-background.mp4`
3. (Optional) Convert to WebM for better compression

### Step 3: Add to Project
1. Copy `hero-background.mp4` to: `c:\Users\Mahbuba\Desktop\App\public\videos\`
2. (Optional) Add poster image to: `c:\Users\Mahbuba\Desktop\App\public\images\hero-poster.jpg`

### Step 4: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

## 📝 Video Specifications

**Recommended:**
- Format: MP4 (H.264)
- Resolution: 1920x1080 (1080p) or higher
- Duration: 10-30 seconds (will loop)
- File Size: Under 10MB for fast loading
- Aspect Ratio: 16:9

**Optimization Tips:**
- Use HandBrake to compress large videos
- Target bitrate: 2-5 Mbps
- Remove audio (not needed for background)

## 🔄 Current Setup

The Hero component will try to load videos in this order:
1. `/videos/hero-background.mp4` (Your local video)
2. `/videos/hero-background.webm` (WebM fallback)
3. Online fallback video (if local files not found)

## 🎨 Optional: Add Poster Image

A poster image shows while the video loads:
1. Take a screenshot from your video
2. Save as: `public/images/hero-poster.jpg`
3. Already configured in Hero component

## ✅ Verification

After adding your video:
1. Visit: http://localhost:3000/landing
2. Video should autoplay in the background
3. Check browser console for any errors

## 🐛 Troubleshooting

**Video not playing?**
- Check file path: `public/videos/hero-background.mp4`
- Check file format (must be MP4)
- Check browser console for errors
- Try a different browser

**Video too large?**
- Compress using HandBrake or online tools
- Target file size: 5-10MB
- Lower resolution to 720p if needed

**Video not looping?**
- Already configured with `loop` attribute
- Check browser autoplay policies

## 🌐 Using Online Video (Current Fallback)

If you don't add a local video, it will use:
```
https://cdn.coverr.co/videos/coverr-business-people-working-together-in-office-5607/1080p.mp4
```

This is a professional business video that works well for fintech themes.
