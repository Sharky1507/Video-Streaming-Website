# RTSP Livestream Overlay API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## Health Check

### Check API Status
Verify that the API server is running and connected to the database.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "RTSP Overlay API is running",
  "database": "connected"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Server is healthy |
| 500 | Server error |

---

## Overlays

### Get All Overlays
Retrieve all overlay configurations from the database.

**Endpoint:** `GET /api/overlays`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "678abc123def456789012345",
      "type": "text",
      "content": "LIVE BROADCAST",
      "position": {
        "x": 50,
        "y": 50
      },
      "size": {
        "width": 200,
        "height": 100
      },
      "style": {
        "fontSize": 24,
        "fontColor": "#ffffff",
        "backgroundColor": "transparent",
        "fontFamily": "Arial",
        "fontWeight": "normal",
        "opacity": 1
      },
      "visible": true,
      "zIndex": 1,
      "createdAt": "2026-01-16T10:00:00.000Z",
      "updatedAt": "2026-01-16T10:05:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Success |
| 500 | Database error |

---

### Create Overlay
Create a new overlay configuration.

**Endpoint:** `POST /api/overlays`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "text",
  "content": "Breaking News",
  "position": {
    "x": 100,
    "y": 50
  },
  "size": {
    "width": 250,
    "height": 80
  },
  "style": {
    "fontSize": 32,
    "fontColor": "#ff0000",
    "backgroundColor": "#000000",
    "fontFamily": "Arial",
    "fontWeight": "bold",
    "opacity": 0.9
  },
  "visible": true,
  "zIndex": 2
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Overlay type: `"text"` or `"image"` |
| `content` | string | Yes | Text content or image URL |
| `position` | object | No | Position coordinates |
| `position.x` | number | No | X coordinate in pixels (default: 50) |
| `position.y` | number | No | Y coordinate in pixels (default: 50) |
| `size` | object | No | Overlay dimensions |
| `size.width` | number | No | Width in pixels (default: 200) |
| `size.height` | number | No | Height in pixels (default: 100) |
| `style` | object | No | Styling options (for text overlays) |
| `style.fontSize` | number | No | Font size in pixels (default: 24) |
| `style.fontColor` | string | No | Text color hex code (default: "#ffffff") |
| `style.backgroundColor` | string | No | Background color (default: "transparent") |
| `style.fontFamily` | string | No | Font family name (default: "Arial") |
| `style.fontWeight` | string | No | Font weight (default: "normal") |
| `style.opacity` | number | No | Opacity 0-1 (default: 1) |
| `visible` | boolean | No | Visibility toggle (default: true) |
| `zIndex` | number | No | Layer order (default: 1) |

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "678abc123def456789012345",
    "type": "text",
    "content": "Breaking News",
    "position": { "x": 100, "y": 50 },
    "size": { "width": 250, "height": 80 },
    "style": {
      "fontSize": 32,
      "fontColor": "#ff0000",
      "backgroundColor": "#000000",
      "fontFamily": "Arial",
      "fontWeight": "bold",
      "opacity": 0.9
    },
    "visible": true,
    "zIndex": 2,
    "createdAt": "2026-01-16T10:00:00.000Z",
    "updatedAt": "2026-01-16T10:00:00.000Z"
  },
  "message": "Overlay created successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid overlay type. Must be one of: ['text', 'image']"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 201 | Overlay created successfully |
| 400 | Invalid request data |
| 500 | Database error |

---

### Get Overlay by ID
Retrieve a specific overlay by its ID.

**Endpoint:** `GET /api/overlays/:id`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the overlay |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "678abc123def456789012345",
    "type": "text",
    "content": "LIVE BROADCAST",
    "position": { "x": 50, "y": 50 },
    "size": { "width": 200, "height": 100 },
    "style": { ... },
    "visible": true,
    "zIndex": 1,
    "createdAt": "2026-01-16T10:00:00.000Z",
    "updatedAt": "2026-01-16T10:05:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Overlay not found"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Invalid overlay ID format |
| 404 | Overlay not found |
| 500 | Database error |

---

### Update Overlay
Update an existing overlay configuration.

**Endpoint:** `PUT /api/overlays/:id`

**Headers:**
```
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the overlay |

**Request Body:**
```json
{
  "content": "Updated Text",
  "position": {
    "x": 150,
    "y": 100
  },
  "style": {
    "fontSize": 36,
    "fontColor": "#00ff00"
  }
}
```

> **Note:** Only include fields you want to update. All fields are optional.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "678abc123def456789012345",
    "type": "text",
    "content": "Updated Text",
    "position": { "x": 150, "y": 100 },
    "size": { "width": 200, "height": 100 },
    "style": {
      "fontSize": 36,
      "fontColor": "#00ff00",
      "backgroundColor": "transparent",
      "fontFamily": "Arial",
      "fontWeight": "normal",
      "opacity": 1
    },
    "visible": true,
    "zIndex": 1,
    "createdAt": "2026-01-16T10:00:00.000Z",
    "updatedAt": "2026-01-16T10:15:00.000Z"
  },
  "message": "Overlay updated successfully"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Overlay updated successfully |
| 400 | Invalid request data or ID |
| 404 | Overlay not found |
| 500 | Database error |

---

### Delete Overlay
Delete an overlay from the database.

**Endpoint:** `DELETE /api/overlays/:id`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the overlay |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Overlay deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Overlay not found"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Overlay deleted successfully |
| 400 | Invalid overlay ID format |
| 404 | Overlay not found |
| 500 | Database error |

---

## Settings

### Get Settings
Retrieve stream settings configuration.

**Endpoint:** `GET /api/settings`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "678def456abc789012345678",
    "streamUrl": "https://example.com/stream.m3u8",
    "volume": 0.8,
    "autoPlay": false,
    "overlaysEnabled": true,
    "updatedAt": "2026-01-16T10:00:00.000Z"
  }
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Success |
| 500 | Database error |

---

### Update Settings
Update stream settings configuration.

**Endpoint:** `PUT /api/settings`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "streamUrl": "https://new-stream.example.com/live.m3u8",
  "volume": 0.5,
  "autoPlay": true,
  "overlaysEnabled": true
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `streamUrl` | string | No | HLS/RTSP stream URL |
| `volume` | number | No | Volume level 0-1 |
| `autoPlay` | boolean | No | Auto-play on page load |
| `overlaysEnabled` | boolean | No | Global overlay toggle |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "678def456abc789012345678",
    "streamUrl": "https://new-stream.example.com/live.m3u8",
    "volume": 0.5,
    "autoPlay": true,
    "overlaysEnabled": true,
    "updatedAt": "2026-01-16T10:10:00.000Z"
  },
  "message": "Settings updated successfully"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| 200 | Settings updated successfully |
| 400 | Invalid request data |
| 500 | Database error |

---

## Example Usage

### cURL Examples

**Get all overlays:**
```bash
curl -X GET http://localhost:5000/api/overlays
```

**Create a text overlay:**
```bash
curl -X POST http://localhost:5000/api/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "content": "LIVE",
    "position": {"x": 20, "y": 20},
    "style": {"fontSize": 48, "fontColor": "#ff0000"}
  }'
```

**Create an image overlay:**
```bash
curl -X POST http://localhost:5000/api/overlays \
  -H "Content-Type: application/json" \
  -d '{
    "type": "image",
    "content": "https://example.com/logo.png",
    "position": {"x": 10, "y": 10},
    "size": {"width": 100, "height": 50}
  }'
```

**Update overlay position:**
```bash
curl -X PUT http://localhost:5000/api/overlays/678abc123def456789012345 \
  -H "Content-Type: application/json" \
  -d '{"position": {"x": 200, "y": 150}}'
```

**Delete an overlay:**
```bash
curl -X DELETE http://localhost:5000/api/overlays/678abc123def456789012345
```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Errors

| Error | Description | Solution |
|-------|-------------|----------|
| `Invalid overlay ID` | The provided ID is not a valid MongoDB ObjectId | Use a valid 24-character hex string |
| `Overlay not found` | No overlay exists with the given ID | Check if the overlay was deleted |
| `No data provided` | Request body is empty or missing | Include a JSON body in the request |
| `Invalid overlay type` | Type must be "text" or "image" | Use only allowed type values |
| `Authentication failed` | MongoDB credentials are incorrect | Check MONGODB_URI in .env file |

---

## Data Models

### Overlay Schema
```javascript
{
  _id: ObjectId,           // MongoDB auto-generated ID
  type: String,            // "text" | "image"
  content: String,         // Text content or image URL
  position: {
    x: Number,             // X coordinate (pixels)
    y: Number              // Y coordinate (pixels)
  },
  size: {
    width: Number,         // Width (pixels)
    height: Number         // Height (pixels)
  },
  style: {
    fontSize: Number,      // Font size (pixels)
    fontColor: String,     // Hex color code
    backgroundColor: String, // Hex color or "transparent"
    fontFamily: String,    // Font family name
    fontWeight: String,    // Font weight
    opacity: Number        // 0-1 opacity value
  },
  visible: Boolean,        // Show/hide toggle
  zIndex: Number,          // Layer order
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

### Settings Schema
```javascript
{
  _id: ObjectId,           // MongoDB auto-generated ID
  streamUrl: String,       // Stream URL
  volume: Number,          // Volume level 0-1
  autoPlay: Boolean,       // Auto-play toggle
  overlaysEnabled: Boolean,// Global overlay toggle
  updatedAt: Date          // Last update timestamp
}
```

---

## Rate Limiting
Currently, there are no rate limits implemented. For production use, consider adding rate limiting to prevent abuse.

---

## CORS Configuration
The API allows requests from the following origins:
- `http://localhost:5173`
- `http://localhost:3000`
- `http://127.0.0.1:5173`

To add additional origins, modify the CORS configuration in `app.py`.
