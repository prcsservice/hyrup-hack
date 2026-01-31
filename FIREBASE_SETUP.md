# Firebase Setup Guide for FixForward Engagement Features

This document outlines the Firebase configuration changes needed to support the new engagement features.

## 1. Firestore Security Rules

Add the following rules to your **Firestore Rules** in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Existing rules...
    
    // ============================================
    // ACTIVITIES COLLECTION (Activity Feed)
    // ============================================
    match /activities/{activityId} {
      // Anyone can read activities (public feed)
      allow read: if true;
      
      // Only logged-in users can create activities
      allow create: if request.auth != null;
      
      // No one can update or delete (immutable log)
      allow update, delete: if false;
    }
    
    // ============================================
    // TEAM MESSAGES (Team Chat)
    // ============================================
    match /teams/{teamId}/messages/{messageId} {
      // Only team members can read messages
      allow read: if request.auth != null && 
                    request.auth.uid in get(/databases/$(database)/documents/teams/$(teamId)).data.members;
      
      // Only team members can create messages
      allow create: if request.auth != null && 
                      request.auth.uid in get(/databases/$(database)/documents/teams/$(teamId)).data.members &&
                      request.resource.data.senderId == request.auth.uid;
      
      // No one can update or delete messages
      allow update, delete: if false;
    }
    
    // ============================================
    // FCM TOKENS (Push Notifications)
    // ============================================
    match /users/{userId} {
      // Users can update their own fcmToken
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.diff(resource.data).affectedKeys().hasOnly(['fcmToken', 'fcmTokenUpdatedAt']);
    }
    
  }
}
```

## 2. Firestore Indexes

Create the following **composite indexes** in Firebase Console → Firestore → Indexes:

### Activities Collection
| Collection | Fields | Query Scope |
|------------|--------|-------------|
| `activities` | `createdAt` (Descending) | Collection |

### Team Messages
| Collection | Fields | Query Scope |
|------------|--------|-------------|
| `teams/{teamId}/messages` | `createdAt` (Ascending) | Collection |

## 3. Firebase Cloud Messaging (FCM) Setup

### Step 1: Enable FCM in Firebase Console
1. Go to **Firebase Console** → Your Project
2. Click **Project Settings** (gear icon)
3. Go to **Cloud Messaging** tab
4. Copy your **Server Key** (needed for sending notifications)

### Step 2: Generate VAPID Key
1. In the **Cloud Messaging** tab
2. Under **Web Push certificates**, click "Generate key pair"
3. Copy the **Key pair** (this is your VAPID public key)

### Step 3: Add to Environment Variables
Add these to your `.env.local`:

```env
# Firebase Cloud Messaging
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_public_key_here
FIREBASE_SERVER_KEY=your_server_key_here
```

## 4. TTL Policy for Activities (Optional)

To automatically clean up old activities, set up a TTL policy:

1. Go to **Firebase Console** → **Firestore**
2. Click on **TTL Policies** (under Settings or Data)
3. Add a new policy:
   - **Collection group**: `activities`
   - **Timestamp field**: `expiresAt`

This will automatically delete activities 24 hours after creation.

## 5. Summary of Required Actions

| Action | Location | Priority |
|--------|----------|----------|
| Add Firestore security rules | Firebase Console → Firestore → Rules | **Required** |
| Create composite indexes | Firebase Console → Firestore → Indexes | **Required** |
| Generate VAPID key | Firebase Console → Project Settings → Cloud Messaging | For Push Notifications |
| Set TTL policy | Firebase Console → Firestore → Settings | Optional (cleanup) |

## Verification Steps

After applying the rules:

1. **Test Activity Feed**: Create a team and verify the activity appears
2. **Test Team Chat**: Send a message and verify it shows for team members
3. **Test Permissions**: Verify non-team members cannot read messages
