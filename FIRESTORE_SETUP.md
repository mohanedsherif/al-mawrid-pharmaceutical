# Firestore Setup Guide for AL-MAWRID Pharmaceuticals

This guide will help you set up Firestore for your application.

## Prerequisites

- Firebase project: `al-mawrid-1`
- Firebase CLI installed and logged in
- Firebase Console access

## Step 1: Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `al-mawrid-1`
3. Navigate to **Firestore Database** in the left sidebar
4. Click **Create database**
5. Choose **Start in production mode** (we'll update rules after setup)
6. Select a location closest to your users (e.g., `us-central`, `europe-west`, etc.)
7. Click **Enable**

## Step 2: Deploy Firestore Security Rules

After enabling Firestore, deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

This will deploy the rules defined in `firestore.rules` file.

## Step 3: Deploy Firestore Indexes (Optional)

If you need composite indexes for complex queries:

```bash
firebase deploy --only firestore:indexes
```

This will deploy the indexes defined in `firestore.indexes.json` file.

## Step 4: Update Security Rules for Testing (Optional)

For development/testing, you can temporarily use test mode rules:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

**⚠️ Warning**: These rules allow anyone to read/write. Only use for testing!

## Step 5: Verify Firestore is Working

1. In Firebase Console, go to **Firestore Database**
2. You should see an empty database
3. Try creating a test document:
   - Click **Start collection**
   - Collection ID: `products`
   - Document ID: `test-product`
   - Add a field: `name` (string) = `Test Product`
   - Save

## Step 6: Test from Application

Your application should now be able to:
- Read/write products
- Manage user carts
- Store user preferences
- Sync backend data to Firestore

## Collections Used in This App

The following collections are used:

1. **products** - Product catalog
   - Structure: `{ id, name, description, price, categoryId, images, stockQuantity, ... }`

2. **categories** - Product categories
   - Structure: `{ id, name, description, ... }`

3. **carts** - User shopping carts (one per user)
   - Document ID: `userId` (Firebase Auth UID)
   - Structure: `{ userId, items: [...], updatedAt }`

4. **userPreferences** - User settings
   - Document ID: `userId` (Firebase Auth UID)
   - Structure: `{ userId, theme, language, notifications, ... }`

5. **orders** - Order history
   - Structure: `{ id, userId, items: [...], totalAmount, status, ... }`

6. **feedbacks** - Customer feedback
   - Structure: `{ id, userId, rating, comment, status, ... }`

7. **traffic_logs** - Analytics/logging (admin only)
   - Structure: `{ id, timestamp, event, data, ... }`

8. **users** - User profiles
   - Document ID: `userId` (Firebase Auth UID)
   - Structure: `{ userId, email, role, ... }`

## Security Rules Overview

The security rules (`firestore.rules`) provide:

- **Products**: Public read, authenticated write
- **Categories**: Public read, authenticated write
- **Carts**: Users can only access their own cart
- **User Preferences**: Users can only access their own preferences
- **Orders**: Users can read/create their own, admins can manage all
- **Feedback**: Users can create/read their own, admins can manage all
- **Traffic Logs**: Admin only
- **Users**: Users can read/update their own, admins can manage all

## Custom Claims for Admin Access

To enable admin access in security rules, you need to set custom claims. This typically requires:

1. Firebase Admin SDK (backend/Cloud Functions)
2. Set custom claim: `admin: true` for admin users

Example (using Firebase Admin SDK):
```javascript
admin.auth().setCustomUserClaims(uid, { admin: true });
```

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Check that Firestore is enabled
- Verify security rules are deployed
- Ensure user is authenticated (for write operations)
- Check that user has proper permissions in rules

### Error: "Index not found"
- Go to Firestore Console → Indexes tab
- Create the missing index (Firebase will provide a link)
- Or deploy indexes: `firebase deploy --only firestore:indexes`

### Data not syncing
- Check browser console for errors
- Verify Firebase config in `frontend/src/config/firebase.ts`
- Ensure Firebase Auth is properly initialized

## Next Steps

1. Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. Test creating/reading documents from your app
3. Set up custom claims for admin users (if needed)
4. Monitor Firestore usage in Firebase Console

## Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Pricing](https://firebase.google.com/pricing)

