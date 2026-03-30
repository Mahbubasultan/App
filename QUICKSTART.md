# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

### Explore as Member
1. Click "Member" on home page
2. View savings dashboard
3. Try requesting a loan
4. Submit a payment proof

### Explore as Accountant
1. Click "Accountant" on home page
2. Review pending payments
3. Verify or flag submissions
4. Approve loan requests

### Explore as Admin
1. Click "Admin" on home page
2. View group analytics
3. Manage users
4. Run monthly giveaway

## Key Features to Test

### Payment Submission
- Drag & drop image upload
- Form validation
- Toast notifications
- Preview before submit

### Loan Calculator
- Slide to adjust amount
- Select guarantor
- See real-time calculations
- Maximum loan validation

### Giveaway Wheel
- Click "Spin the Wheel"
- Watch 4-second animation
- See winner announcement
- Check history table

## Mock Data

All data is stored in `src/lib/mockData.ts`:
- 6 users (members, accountant, admin)
- 3 pending payments
- 2 loan requests
- 3 past giveaways

## Customization

### Change Colors
Edit `tailwind.config.js` - modify the `colors` section

### Add Pages
1. Create file in `src/app/[role]/[page]/page.tsx`
2. Add link in `src/components/layout/Sidebar.tsx`

### Modify Components
All reusable components are in `src/components/ui/`

## Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check ESLint
npm run lint
```

## Next Steps

1. ✅ Explore all three portals
2. ✅ Test all interactive features
3. ✅ Check mobile responsiveness
4. ✅ Review code structure
5. 🔄 Connect to backend API
6. 🔄 Add authentication
7. 🔄 Deploy to production

## Support

- Check README.md for detailed documentation
- Review component files for implementation details
- Modify mock data for different scenarios

---

**Happy Coding! 🚀**
