# Contributing to Access Review System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Access Review System project.

## Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR-USERNAME/access-review-system.git
cd access-review-system
```

### 2. Create a Branch

Create a descriptive branch for your feature or fix:

```bash
# Feature branch
git checkout -b feature/add-email-notifications

# Bug fix branch
git checkout -b fix/review-validation-error

# Documentation branch
git checkout -b docs/update-api-reference
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Make Your Changes

Follow the guidelines below to ensure code quality.

## Development Guidelines

### Code Style

- Use **Prettier** for automatic code formatting
- Run `pnpm format` before committing
- The pre-commit hook will check formatting automatically

### Commit Messages

Write clear, descriptive commit messages:

```bash
# ✅ Good
git commit -m "feat: add accessibility rating filter to review list"
git commit -m "fix: prevent duplicate reviews for same space"
git commit -m "docs: clarify JWT authentication in README"

# ❌ Avoid
git commit -m "update stuff"
git commit -m "fix bug"
git commit -m "changes"
```

**Commit message format:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions or updates
- `refactor:` - Code refactoring without feature changes
- `style:` - Code style changes (formatting, etc.)
- `perf:` - Performance improvements
- `chore:` - Build process, dependencies, etc.

### Testing

Write tests for new features and bug fixes:

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test:unit
pnpm test:integration

# Run with coverage
pnpm test -- --coverage
```

### Testing Guidelines

- **Unit Tests**: Test individual functions and methods in isolation
- **Integration Tests**: Test API endpoints with realistic scenarios
- **Performance Tests**: Test under load for critical features

Test files should be in the same structure as source files:

- Backend tests: `backend/tests/unit/`, `backend/tests/integration/`
- Frontend tests: `frontend/src/__tests__/`

### Code Organization

**Backend:**

- Controllers: Business logic for routes
- Models: Mongoose schemas and validation
- Routes: API endpoint definitions
- Handlers: Error handling and middleware
- Tests: Unit and integration tests

**Frontend:**

- Components: Reusable React components
- Pages: Page-level components
- Services: API client functions
- Types: TypeScript interfaces and types
- Assets: Images, icons, styles

### Error Handling

- Use consistent error responses
- Provide meaningful error messages
- Include proper HTTP status codes
- Log errors appropriately

Backend error response format:

```javascript
{
  "success": false,
  "message": "Clear error description",
  "result": null
}
```

## Submitting Changes

### 1. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 2. Open a Pull Request

On GitHub, create a Pull Request with:

**Title:** Clear, concise description

```
feat: Add email notifications for accessibility review updates
```

**Description:** Include:

- What changes were made
- Why these changes were needed
- Any related issues (use `#123`)
- Screenshots for UI changes
- Testing performed

**Example:**

```markdown
## Description

Adds email notifications when a review receives comments or is updated.

## Related Issue

Closes #234

## Changes

- Add email service integration
- Create email notification job
- Add email preference to user settings
- Update API to trigger notifications

## Testing

- ✅ Unit tests for email service
- ✅ Integration tests for notification triggers
- ✅ Manual testing in development environment

## Screenshots

[Add screenshots if applicable]
```

### 3. Review Process

- Maintainers will review your PR
- Address any requested changes
- Ensure all tests pass
- Once approved, your PR will be merged

## Contributing Documentation

### README Updates

If you make changes affecting:

- Installation process
- Configuration
- API endpoints
- New features

Please update the appropriate README files.

### Code Comments

Comment complex logic:

```javascript
// ✅ Good - explains WHY
// Prevent duplicate active reviews for the same space/user
// by checking for existing reviews in the database
if (existingReview && !existingReview.removed) {
  throw new Error('Review already exists');
}

// ❌ Avoid - states the obvious
// Check if review exists
if (existingReview) {
  // ...
}
```

## Project Structure Reference

```
access-review-system/
├── backend/
│   ├── controllers/     # Add new features here
│   ├── routes/          # Define new API endpoints
│   ├── models/          # Add data schemas
│   ├── tests/           # Add corresponding tests
│   └── docs/            # Update Swagger docs
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Add new components
│   │   ├── pages/       # Add new pages
│   │   └── services/    # Add API clients
│   └── __tests__/       # Add tests
│
└── README.md            # Update as needed
```

## Workflow Example: Adding a Feature

### Example: Add User Preferences Feature

1. **Create branch:**

   ```bash
   git checkout -b feature/user-preferences
   ```

2. **Backend implementation:**
   - Add `preferences` field to User model
   - Create API endpoint: `PATCH /api/user/:id/preferences`
   - Write unit and integration tests
   - Update Swagger documentation

3. **Frontend implementation:**
   - Create `UserPreferences` component
   - Add API service function
   - Write component tests
   - Update user profile page

4. **Documentation:**
   - Update README if user-facing
   - Add code comments for complex logic
   - Update API documentation

5. **Commit and push:**

   ```bash
   git add .
   git commit -m "feat: add user preferences for notifications"
   git push origin feature/user-preferences
   ```

6. **Create PR** with clear description

## Reporting Issues

### Bug Reports

Provide:

- Clear title: "Bug: Login fails with special characters in password"
- Steps to reproduce
- Expected vs. actual behavior
- Environment (OS, Node version, etc.)
- Error messages/logs
- Screenshots if applicable

### Feature Requests

Provide:

- Clear description of the feature
- Why it's needed
- Example use cases
- Possible implementation approach

### Questions/Discussions

Use GitHub Discussions for:

- How-to questions
- Design discussions
- Best practice questions

## Local Development Tips

### MongoDB Setup

**Option 1: Local MongoDB**

```bash
# Install MongoDB and run locally
mongod
```

**Option 2: MongoDB Atlas**

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Add to `backend/.variables.env`

### Hot Reload

Both frontend and backend support hot-reload in development:

```bash
pnpm dev  # Starts both with auto-reload
```

### Debugging

Backend with Node debugger:

```bash
node --inspect backend/server.js
# Then visit: chrome://inspect
```

Frontend with browser DevTools:

- React DevTools Chrome extension
- Vue DevTools for component inspection

### Common Issues

**Issue: Port already in use**

```bash
# Find process using port 8888
lsof -i :8888
# Kill it
kill -9 <PID>
```

**Issue: MongoDB connection error**

- Verify MongoDB is running
- Check connection string in `.variables.env`
- Ensure IP whitelist in MongoDB Atlas (if cloud)

**Issue: Dependencies issues**

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Release Process

(Maintainers only)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag: `git tag v1.2.3`
4. Push changes and tags
5. Create GitHub release with notes

## Getting Help

- 💬 GitHub Issues - For bugs and feature requests
- 💭 GitHub Discussions - For questions and ideas
- 📖 Documentation - See README.md and backend/README.md
- 👥 Team - See maintainers in README.md

## Recognition

Contributors will be:

- Mentioned in CHANGELOG
- Added to contributors list (with permission)
- Thanked in release notes

Thank you for contributing! 🙏

---

**Questions?** Open an issue or reach out to the maintainers.
