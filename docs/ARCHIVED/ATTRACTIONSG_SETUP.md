# AttractionsSG Integration Setup

## 🔐 Credential Configuration

**IMPORTANT**: AttractionsSG credentials are **confidential and PDPA protected**. Store them securely.

### Environment Variables

Add these to your `.env` file:

```bash
# AttractionsSG Reseller Credentials
ATTRACTIONSG_EMAIL=enjoytravelticket@gmail.com
ATTRACTIONSG_PASSWORD=Truc1@3456101112
```

### Production Security

⚠️ **For production deployment:**
1. Never commit `.env` files to version control
2. Use secure secret management (AWS Secrets Manager, Vercel Environment Variables, etc.)
3. Rotate credentials periodically
4. Monitor access logs

## 🎯 Features

### Implemented

✅ **Server API** (`/api/attractionsg/tickets`)
- Automated login with credentials
- Playwright-based scraping
- Ticket data extraction
- Search functionality
- Error handling

✅ **User Interface** (`/attractionsg`)
- Professional hero section
- Search functionality
- Responsive card layout
- Loading states
- Error handling
- Empty states

✅ **Navigation**
- Added to main navigation bar
- Added to homepage
- Integrated with activity tracking

### Data Structure

The API returns tickets with the following structure:

```typescript
interface TicketData {
  id?: string
  title: string
  description?: string
  price?: string
  originalPrice?: string
  image?: string
  category?: string
  location?: string
  rating?: number
  link?: string
}
```

## 🧪 Testing

### Local Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the page:**
   ```
   http://localhost:3000/attractionsg
   ```

3. **Test the API directly:**
   ```bash
   curl -X POST http://localhost:3000/api/attractionsg/tickets \
     -H "Content-Type: application/json" \
     -d '{"search": "Universal Studios"}'
   ```

### Production Testing

⚠️ **Before deploying:**
1. Verify credentials work
2. Test scraping performance
3. Monitor error logs
4. Check data accuracy
5. Validate pricing information

## 📊 Architecture

### Flow

```
User → /attractionsg page
     ↓
Calls /api/attractionsg/tickets
     ↓
Playwright automates browser
     ↓
Logs into AttractionsSG
     ↓
Scrapes ticket data
     ↓
Returns structured JSON
     ↓
Displays in UI
```

### Security Considerations

1. **Credential Management**
   - Server-side only
   - Never exposed to client
   - Encrypted in transit

2. **Rate Limiting**
   - Consider implementing request throttling
   - Monitor for abuse

3. **Error Handling**
   - Graceful degradation
   - User-friendly error messages
   - Detailed logging for debugging

## 🔄 Future Enhancements

### Planned Features

- [ ] Category filtering
- [ ] Price sorting
- [ ] Pagination
- [ ] Caching layer
- [ ] Real-time availability
- [ ] Booking integration
- [ ] Admin dashboard
- [ ] Analytics

### API Improvements

- [ ] Session management
- [ ] Connection pooling
- [ ] Retry logic
- [ ] Cache invalidation
- [ ] Webhook support

## 📝 Notes

### Current Limitations

1. **Scraper Dependency**: Requires Playwright browser automation
2. **Page Structure**: Depends on AttractionsSG's HTML structure
3. **Performance**: Scraping is slower than API calls
4. **Reliability**: May break if AttractionsSG changes their site

### Best Practices

1. **Respect robots.txt**: Check AttractionsSG's scraping policy
2. **Rate Limiting**: Don't overload their servers
3. **Data Freshness**: Cache results appropriately
4. **Monitoring**: Track success/failure rates

## 🆘 Troubleshooting

### Common Issues

**Issue**: Login fails
- Check credentials in `.env`
- Verify AttractionsSG site is accessible
- Check for CAPTCHA requirements

**Issue**: No tickets returned
- Verify page structure hasn't changed
- Check browser console for errors
- Review Playwright logs

**Issue**: Timeout errors
- Increase timeout in API
- Check network connectivity
- Consider using headless mode

## 📚 References

- [AttractionsSG Mobile Site](https://mobile.attractionsg.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Cheerio Documentation](https://cheerio.js.org/)

---

**Last Updated**: January 2025  
**Status**: ✅ Production Ready  
**Maintainer**: GoTravelNha Team
