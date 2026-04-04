/**
 * ISSUE REPORTING SYSTEM - BACKEND ENDPOINTS DOCUMENTATION
 *
 * Base URL: http://localhost:8888/api/issue
 *
 * All endpoints (except create) require JWT authentication via x-auth-token header
 */

/**
 * ============================================================================
 * PUBLIC ENDPOINTS (No Authentication Required)
 * ============================================================================
 */

/**
 * CREATE NEW ISSUE REPORT
 * POST /api/issue/create
 *
 * Description: Create a new accessibility issue report. Users can report issues
 *              without authentication.
 *
 * Request Headers:
 *   Content-Type: application/json
 *   x-auth-token: (optional) User's JWT token if authenticated
 *
 * Request Body:
 * {
 *   "title": "Wheelchair access blocked",              // Required, 5-200 chars
 *   "location": "City Mall - Main Entrance",           // Required, max 300 chars
 *   "description": "The main entrance has a broken...", // Required, 20-2000 chars
 *   "category": "Mobility Access",                     // Optional, enum below
 *   "severity": "High",                                // Optional, default: Medium
 *   "reporter": "John Doe",                            // Required, max 100 chars
 *   "reporterEmail": "john@example.com"                // Optional, valid email
 * }
 *
 * Category Options:
 *   - Mobility Access
 *   - Visual Access
 *   - Hearing Access
 *   - Parking
 *   - Restrooms
 *   - Signage
 *   - Elevators
 *   - Other
 *
 * Severity Options:
 *   - Low
 *   - Medium (default)
 *   - High
 *   - Critical
 *
 * Response (201 Created):
 * {
 *   "success": true,
 *   "result": {
 *     "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
 *     "title": "Wheelchair access blocked",
 *     "location": "City Mall - Main Entrance",
 *     "description": "...",
 *     "category": "Mobility Access",
 *     "severity": "High",
 *     "status": "Open",
 *     "reporter": "John Doe",
 *     "reporterEmail": "john@example.com",
 *     "adminNotes": "",
 *     "userId": null,
 *     "createdAt": "2024-04-04T14:26:11.397Z",
 *     "updatedAt": "2024-04-04T14:26:11.397Z"
 *   },
 *   "message": "Issue report created successfully."
 * }
 */

/**
 * ============================================================================
 * ADMIN ENDPOINTS (Authentication Required)
 * ============================================================================
 */

/**
 * GET ALL ISSUES (WITH PAGINATION & FILTERING)
 * GET /api/issue/admin/all
 *
 * Description: Retrieve all issues with pagination and filtering options.
 *              Admin only endpoint.
 *
 * Request Headers:
 *   x-auth-token: User's JWT token (required)
 *
 * Query Parameters:
 *   page: integer (default: 1)
 *     - Page number for pagination
 *   items: integer (default: 10, max: 100)
 *     - Number of items per page
 *   status: string (optional)
 *     - Filter by status: "Open", "In Progress", "Resolved"
 *   severity: string (optional)
 *     - Filter by severity: "Low", "Medium", "High", "Critical"
 *   category: string (optional)
 *     - Filter by category
 *   search: string (optional)
 *     - Search in title, location, description, reporter
 *
 * Example URL:
 *   GET /api/issue/admin/all?page=1&items=10&status=Open&severity=High&search=wheelchair
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "result": {
 *     "data": [
 *       {
 *         "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
 *         "title": "Wheelchair access blocked",
 *         "location": "City Mall - Main Entrance",
 *         "description": "...",
 *         "category": "Mobility Access",
 *         "severity": "High",
 *         "status": "Open",
 *         "reporter": "John Doe",
 *         "adminNotes": "",
 *         "userId": {
 *           "_id": "...",
 *           "name": "...",
 *           "surname": "...",
 *           "email": "...",
 *           "userType": "user"
 *         },
 *         "createdAt": "2024-04-04T14:26:11.397Z",
 *         "updatedAt": "2024-04-04T14:26:11.397Z"
 *       }
 *     ],
 *     "pagination": {
 *       "page": 1,
 *       "limit": 10,
 *       "total": 24,
 *       "pages": 3
 *     }
 *   },
 *   "message": "Issues retrieved successfully."
 * }
 */

/**
 * GET DASHBOARD STATISTICS
 * GET /api/issue/admin/stats
 *
 * Description: Get statistics about issues for the dashboard.
 *              Includes counts by status, severity, category, and response times.
 *
 * Request Headers:
 *   x-auth-token: User's JWT token (required)
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "result": {
 *     "summary": {
 *       "total": 24,
 *       "open": 12,
 *       "inProgress": 8,
 *       "resolved": 4
 *     },
 *     "byStatus": [
 *       { "status": "Open", "count": 12 },
 *       { "status": "In Progress", "count": 8 },
 *       { "status": "Resolved", "count": 4 }
 *     ],
 *     "bySeverity": [
 *       { "severity": "Critical", "count": 1 },
 *       { "severity": "High", "count": 6 },
 *       { "severity": "Medium", "count": 12 },
 *       { "severity": "Low", "count": 5 }
 *     ],
 *     "byCategory": [
 *       { "category": "Mobility Access", "count": 8 },
 *       { "category": "Visual Access", "count": 5 },
 *       { "category": "Other", "count": 11 }
 *     ],
 *     "responseTime": {
 *       "avgMs": 3600000,
 *       "minMs": 1800000,
 *       "maxMs": 7200000
 *     }
 *   },
 *   "message": "Statistics retrieved successfully."
 * }
 */

/**
 * GET SINGLE ISSUE
 * GET /api/issue/admin/{id}
 *
 * Description: Retrieve a single issue by its ID.
 *
 * Request Headers:
 *   x-auth-token: User's JWT token (required)
 *
 * Path Parameters:
 *   id: string (MongoDB ObjectId)
 *     - The issue's unique identifier
 *
 * Example URL:
 *   GET /api/issue/admin/60f7b3b3b3b3b3b3b3b3b3b3
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "result": {
 *     "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
 *     "title": "Wheelchair access blocked",
 *     "location": "City Mall - Main Entrance",
 *     "description": "The main entrance has a broken wheelchair ramp...",
 *     "category": "Mobility Access",
 *     "severity": "High",
 *     "status": "Open",
 *     "reporter": "John Doe",
 *     "reporterEmail": "john@example.com",
 *     "userId": {
 *       "_id": "...",
 *       "name": "...",
 *       "surname": "...",
 *       "email": "...",
 *       "userType": "user"
 *     },
 *     "adminNotes": "",
 *     "responseTime": null,
 *     "resolutionTime": null,
 *     "createdAt": "2024-04-04T14:26:11.397Z",
 *     "updatedAt": "2024-04-04T14:26:11.397Z"
 *   },
 *   "message": "Issue retrieved successfully."
 * }
 *
 * Error Response (404 Not Found):
 * {
 *   "success": false,
 *   "result": null,
 *   "message": "Issue not found."
 * }
 */

/**
 * UPDATE ISSUE
 * PATCH /api/issue/admin/{id}
 *
 * Description: Update an issue's status, severity, and/or admin notes.
 *              Automatically tracks response and resolution times.
 *
 * Request Headers:
 *   x-auth-token: User's JWT token (required)
 *   Content-Type: application/json
 *
 * Path Parameters:
 *   id: string (MongoDB ObjectId)
 *
 * Request Body (all fields optional):
 * {
 *   "status": "In Progress",           // "Open", "In Progress", "Resolved"
 *   "severity": "Critical",             // "Low", "Medium", "High", "Critical"
 *   "adminNotes": "Being investigated" // max 2000 chars
 * }
 *
 * Automatic Behavior:
 *   - When status changes from "Open" to "In Progress":
 *     → Sets responseTime to current timestamp
 *   - When status changes to "Resolved":
 *     → Sets resolutionTime to current timestamp
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "result": {
 *     "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
 *     "title": "Wheelchair access blocked",
 *     "location": "City Mall - Main Entrance",
 *     "description": "...",
 *     "category": "Mobility Access",
 *     "severity": "Critical",
 *     "status": "In Progress",
 *     "reporter": "John Doe",
 *     "adminNotes": "Being investigated",
 *     "userId": {...},
 *     "responseTime": "2024-04-04T15:00:00.000Z",
 *     "resolutionTime": null,
 *     "createdAt": "2024-04-04T14:26:11.397Z",
 *     "updatedAt": "2024-04-04T15:00:00.000Z"
 *   },
 *   "message": "Issue updated successfully."
 * }
 */

/**
 * DELETE ISSUE (Soft Delete)
 * DELETE /api/issue/admin/{id}
 *
 * Description: Delete (soft delete) an issue. The issue is marked as removed
 *              but data is preserved in the database.
 *
 * Request Headers:
 *   x-auth-token: User's JWT token (required)
 *
 * Path Parameters:
 *   id: string (MongoDB ObjectId)
 *
 * Example URL:
 *   DELETE /api/issue/admin/60f7b3b3b3b3b3b3b3b3b3b3
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "result": {
 *     "_id": "60f7b3b3b3b3b3b3b3b3b3b3"
 *   },
 *   "message": "Issue deleted successfully."
 * }
 */

/**
 * ============================================================================
 * USER ENDPOINTS (Authentication Required)
 * ============================================================================
 */

/**
 * GET USER'S OWN ISSUES
 * GET /api/issue/user/my-issues
 *
 * Description: Retrieve all issues reported by the authenticated user.
 *
 * Request Headers:
 *   x-auth-token: User's JWT token (required)
 *
 * Query Parameters:
 *   page: integer (default: 1)
 *   items: integer (default: 10, max: 100)
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "result": {
 *     "data": [
 *       {
 *         "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
 *         "title": "Wheelchair access blocked",
 *         "location": "City Mall - Main Entrance",
 *         "description": "...",
 *         "category": "Mobility Access",
 *         "severity": "High",
 *         "status": "In Progress",
 *         "reporter": "John Doe",
 *         "createdAt": "2024-04-04T14:26:11.397Z",
 *         "updatedAt": "2024-04-04T15:00:00.000Z"
 *       }
 *     ],
 *     "pagination": {
 *       "page": 1,
 *       "limit": 10,
 *       "total": 2,
 *       "pages": 1
 *     }
 *   },
 *   "message": "User issues retrieved successfully."
 * }
 */

/**
 * ============================================================================
 * CURL EXAMPLES
 * ============================================================================
 */

/**
 * 1. CREATE ISSUE (No Auth Required)
 * curl -X POST http://localhost:8888/api/issue/create \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "title": "Wheelchair access blocked",
 *     "location": "City Mall - Main Entrance",
 *     "description": "The main entrance has a broken wheelchair ramp...",
 *     "category": "Mobility Access",
 *     "severity": "High",
 *     "reporter": "John Doe",
 *     "reporterEmail": "john@example.com"
 *   }'
 */

/**
 * 2. GET ALL ISSUES (Admin - With Auth)
 * curl -X GET "http://localhost:8888/api/issue/admin/all?page=1&items=10&status=Open" \
 *   -H "x-auth-token: YOUR_JWT_TOKEN"
 */

/**
 * 3. GET STATISTICS
 * curl -X GET http://localhost:8888/api/issue/admin/stats \
 *   -H "x-auth-token: YOUR_JWT_TOKEN"
 */

/**
 * 4. UPDATE ISSUE
 * curl -X PATCH http://localhost:8888/api/issue/admin/60f7b3b3b3b3b3b3b3b3b3b3 \
 *   -H "x-auth-token: YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "status": "In Progress",
 *     "severity": "Critical",
 *     "adminNotes": "Being investigated"
 *   }'
 */

/**
 * 5. DELETE ISSUE
 * curl -X DELETE http://localhost:8888/api/issue/admin/60f7b3b3b3b3b3b3b3b3b3b3 \
 *   -H "x-auth-token: YOUR_JWT_TOKEN"
 */

/**
 * 6. GET USER'S ISSUES
 * curl -X GET "http://localhost:8888/api/issue/user/my-issues?page=1&items=10" \
 *   -H "x-auth-token: YOUR_JWT_TOKEN"
 */

/**
 * ============================================================================
 * ERROR RESPONSES
 * ============================================================================
 */

/**
 * Validation Error (400 Bad Request):
 * {
 *   "success": false,
 *   "result": null,
 *   "message": "title, location, description, and reporter are required fields."
 * }
 */

/**
 * Unauthorized (401 Unauthorized):
 * {
 *   "success": false,
 *   "message": "No token, authorization denied"
 * }
 */

/**
 * Not Found (404 Not Found):
 * {
 *   "success": false,
 *   "result": null,
 *   "message": "Issue not found."
 * }
 */

/**
 * Server Error (500 Internal Server Error):
 * {
 *   "success": false,
 *   "result": null,
 *   "message": "Database connection error"
 * }
 */

/**
 * ============================================================================
 * INTEGRATION WITH FRONTEND
 * ============================================================================
 *
 * Frontend Endpoints Needed:
 *
 * 1. Report Issue Page (/report-issue)
 *    POST /api/issue/create
 *    - No auth required
 *    - Used by public form
 *
 * 2. Admin Dashboard Summary Cards
 *    GET /api/issue/admin/stats
 *    - Auth required (admin)
 *    - Returns total, open, in progress, resolved counts
 *
 * 3. Admin Issues Table
 *    GET /api/issue/admin/all?page=1&items=10
 *    - Auth required (admin)
 *    - Supports filtering by status, severity, category
 *    - Supports search
 *
 * 4. View Issue Modal
 *    GET /api/issue/admin/{id}
 *    - Auth required (admin)
 *    - Returns full issue details
 *
 * 5. Edit Issue Modal
 *    PATCH /api/issue/admin/{id}
 *    - Auth required (admin)
 *    - Updates status, severity, admin notes
 *
 * 6. Delete Issue Modal
 *    DELETE /api/issue/admin/{id}
 *    - Auth required (admin)
 *    - Soft deletes the issue
 *
 * ============================================================================
 */

module.exports = 'API Documentation';
