# 🧪 API Documentation & Testing

Complete guide to the Visual Component Editor API endpoints, request/response formats, and testing examples.

⸻

## 📋 Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [GET /api/component/:id](#get-apicomponentid)
   - [PUT /api/component/:id](#put-apicomponentid)
   - [POST /api/component/reset/:id](#post-apicomponentresetid)
4. [Testing with cURL](#testing-with-curl)
5. [Testing with JavaScript](#testing-with-javascript)
6. [Error Handling](#error-handling)
7. [Response Codes](#response-codes)

⸻

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

⸻

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

⸻

## Endpoints

### GET /api/component/:id

Fetches a component's JSX code from Redis storage.

#### Path Parameters

| Parameter | Type   | Required | Description                                        |
| --------- | ------ | -------- | -------------------------------------------------- |
| `id`      | string | Yes      | Component identifier (e.g., "hero", "signup-form") |

#### Response

**Success (200 OK)**

```json
{
  "id": "hero",
  "code": "function Component() {\n  return (\n    <>\n      <h1>Hello World</h1>\n    </>\n  );\n}"
}
```

**Error (404 Not Found)**

```json
{
  "error": "Not found"
}
```

#### Example Request

```bash
curl http://localhost:3000/api/component/hero
```

#### Example Response

```json
{
  "id": "hero",
  "code": "function Component() {\n  return (\n    <>\n      <div className=\"flex flex-col items-center justify-center min-h-screen\">\n        <h1 className=\"text-4xl font-bold\">Welcome</h1>\n      </div>\n    </>\n  );\n}"
}
```

⸻

### PUT /api/component/:id

Updates a component's JSX code in Redis storage.

#### Path Parameters

| Parameter | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| `id`      | string | Yes      | Component identifier |

#### Request Body

```json
{
  "code": "function Component() {\n  return (\n    <>\n      <h1>Updated Content</h1>\n    </>\n  );\n}"
}
```

| Field  | Type   | Required | Description                   |
| ------ | ------ | -------- | ----------------------------- |
| `code` | string | Yes      | Complete JSX code as a string |

#### Response

**Success (200 OK)**

```json
{
  "message": "Component updated successfully",
  "code": "function Component() {\n  return (\n    <>\n      <h1>Updated Content</h1>\n    </>\n  );\n}"
}
```

**Error (400 Bad Request)**

```json
{
  "error": "Missing JSX code"
}
```

**Error (500 Internal Server Error)**

```json
{
  "error": "Failed to update component"
}
```

#### Example Request

```bash
curl -X PUT http://localhost:3000/api/component/hero \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function Component() {\n  return (\n    <>\n      <h1 className=\"text-4xl font-bold text-blue-500\">Updated Title</h1>\n    </>\n  );\n}"
  }'
```

⸻

### POST /api/component/reset/:id

Restores a component to its original version from the backup stored in Redis.

#### Path Parameters

| Parameter | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| `id`      | string | Yes      | Component identifier |

#### Response

**Success (200 OK)**

```json
{
  "id": "hero",
  "message": "Component 'hero' successfully reset to original.",
  "code": "function Component() {\n  return (\n    <>\n      <h1>Original Content</h1>\n    </>\n  );\n}"
}
```

**Error (400 Bad Request)**

```json
{
  "error": "Component ID is required."
}
```

**Error (404 Not Found)**

```json
{
  "error": "Component 'hero' does not exist."
}
```

or

```json
{
  "error": "Original version for 'hero' not found."
}
```

**Error (500 Internal Server Error)**

```json
{
  "error": "Failed to reset component.",
  "details": "Error message details"
}
```

#### Example Request

```bash
curl -X POST http://localhost:3000/api/component/reset/hero
```

⸻

## Testing with cURL

### Setup

Make sure your development server is running:

```bash
pnpm dev
```

### Test Cases

#### 1. Fetch a Component

```bash
curl http://localhost:3000/api/component/hero
```

**Expected**: Returns component JSX code

#### 2. Update a Component

```bash
curl -X PUT http://localhost:3000/api/component/hero \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function Component() {\n  return (\n    <>\n      <h1>Test Update</h1>\n    </>\n  );\n}"
  }'
```

**Expected**: Returns success message with updated code

#### 3. Reset a Component

```bash
curl -X POST http://localhost:3000/api/component/reset/hero
```

**Expected**: Returns original component code

#### 4. Test Error Handling

```bash
# Test non-existent component
curl http://localhost:3000/api/component/nonexistent

# Test invalid PUT request (missing code)
curl -X PUT http://localhost:3000/api/component/hero \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected**: Appropriate error responses

### Pretty Print JSON Responses

Add `| jq` to format JSON responses:

```bash
curl http://localhost:3000/api/component/hero | jq
```

⸻

## Testing with JavaScript

### Using Fetch API

#### Load Component

```javascript
async function loadComponent(id) {
  try {
    const response = await fetch(`/api/component/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Component loaded:", data);
    return data;
  } catch (error) {
    console.error("Failed to load component:", error);
    throw error;
  }
}

// Usage
loadComponent("hero").then((data) => {
  console.log("Component code:", data.code);
});
```

#### Save Component

```javascript
async function saveComponent(id, jsxCode) {
  try {
    const response = await fetch(`/api/component/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: jsxCode }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save");
    }

    const data = await response.json();
    console.log("Component saved:", data);
    return data;
  } catch (error) {
    console.error("Failed to save component:", error);
    throw error;
  }
}

// Usage
const jsxCode = `function Component() {
  return (
    <>
      <h1>Updated Content</h1>
    </>
  );
}`;

saveComponent("hero", jsxCode);
```

#### Reset Component

```javascript
async function resetComponent(id) {
  try {
    const response = await fetch(`/api/component/reset/${id}`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to reset");
    }

    const data = await response.json();
    console.log("Component reset:", data);
    return data;
  } catch (error) {
    console.error("Failed to reset component:", error);
    throw error;
  }
}

// Usage
resetComponent("hero").then((data) => {
  console.log("Restored code:", data.code);
});
```

### Using Axios

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Load component
const loadComponent = async (id) => {
  const { data } = await api.get(`/api/component/${id}`);
  return data;
};

// Save component
const saveComponent = async (id, code) => {
  const { data } = await api.put(`/api/component/${id}`, { code });
  return data;
};

// Reset component
const resetComponent = async (id) => {
  const { data } = await api.post(`/api/component/reset/${id}`);
  return data;
};
```

⸻

## Testing with Postman

### Collection Setup

1. Create a new collection: "Component Editor API"
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:3000`

### Requests

#### 1. GET Component

- **Method**: GET
- **URL**: `{{baseUrl}}/api/component/hero`
- **Headers**: None required

#### 2. PUT Update Component

- **Method**: PUT
- **URL**: `{{baseUrl}}/api/component/hero`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "code": "function Component() {\n  return (\n    <>\n      <h1>Updated</h1>\n    </>\n  );\n}"
}
```

#### 3. POST Reset Component

- **Method**: POST
- **URL**: `{{baseUrl}}/api/component/reset/hero`
- **Headers**: None required

⸻

## Error Handling

### Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error message",
  "details": "Optional detailed error message"
}
```

### Common Errors

| Status Code | Error Message                            | Description                      |
| ----------- | ---------------------------------------- | -------------------------------- |
| 400         | "Component ID is required."              | Missing or invalid ID parameter  |
| 400         | "Missing JSX code"                       | PUT request missing `code` field |
| 404         | "Not found"                              | Component doesn't exist          |
| 404         | "Component '{id}' does not exist."       | Main component not found         |
| 404         | "Original version for '{id}' not found." | Original backup not found        |
| 500         | "Failed to update component"             | Redis write error                |
| 500         | "Failed to reset component."             | Redis operation error            |

### Error Handling Example

```javascript
async function handleApiCall(apiCall) {
  try {
    const response = await apiCall();
    return { success: true, data: response };
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        success: false,
        error: data.error || "Unknown error",
        status,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: "Network error - no response from server",
      };
    } else {
      // Error setting up request
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
```

⸻

## Response Codes

| Code | Meaning               | Usage                              |
| ---- | --------------------- | ---------------------------------- |
| 200  | OK                    | Successful GET, PUT, or POST       |
| 400  | Bad Request           | Invalid request parameters or body |
| 404  | Not Found             | Component doesn't exist            |
| 500  | Internal Server Error | Server/Redis error                 |

⸻

## Redis Storage Structure

### Key Patterns

```
component:{id}              # Current/edited version
component:{id}:original     # Original backup version
```

### Example Keys

```
component:hero
component:hero:original
component:signup-form
component:signup-form:original
```

### Data Format

All values stored in Redis are strings containing JSX code:

```
"function Component() {\n  return (\n    <>\n      <h1>Content</h1>\n    </>\n  );\n}"
```

⸻

## Best Practices

### 1. Always Check Response Status

```javascript
const response = await fetch("/api/component/hero");
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

### 2. Handle Errors Gracefully

```javascript
try {
  const data = await loadComponent("hero");
} catch (error) {
  // Show user-friendly error message
  console.error("Failed to load:", error);
}
```

### 3. Validate Data Before Sending

```javascript
if (!code || typeof code !== "string") {
  throw new Error("Invalid JSX code");
}
```

### 4. Use Proper Content-Type Headers

```javascript
headers: {
  'Content-Type': 'application/json',
}
```

⸻

## Testing Checklist

- [ ] GET request returns valid component
- [ ] GET request handles non-existent component
- [ ] PUT request updates component successfully
- [ ] PUT request validates required fields
- [ ] POST reset restores original version
- [ ] POST reset handles missing original
- [ ] All endpoints return proper status codes
- [ ] Error responses are properly formatted
- [ ] Network errors are handled gracefully

⸻

## Troubleshooting

### Component Not Found

**Issue**: GET returns 404

**Solutions**:

1. Verify component ID is correct
2. Check Redis connection
3. Ensure component exists in Redis

### Save Fails

**Issue**: PUT returns 500

**Solutions**:

1. Check Redis credentials
2. Verify Redis connection
3. Check request body format
4. Ensure `code` field is a string

### Reset Fails

**Issue**: POST reset returns 404

**Solutions**:

1. Verify original backup exists
2. Check Redis key format: `component:{id}:original`
3. Ensure main component exists first

⸻

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md) - System architecture
- [README.md](./README.md) - Project setup and overview
