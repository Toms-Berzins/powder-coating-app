# Stripe Setup Guide - Powder Coating App

## 🔑 How to Get Your Stripe API Keys

### Step 1: Create a Stripe Account (If You Don't Have One)
1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Fill in your email, name, and password
4. Verify your email address

### Step 2: Access the Stripe Dashboard
1. Go to https://dashboard.stripe.com
2. Log in with your Stripe credentials

### Step 3: Enable Test Mode
**IMPORTANT**: Start with test mode for development!

1. Look at the **top-right corner** of the dashboard
2. Find the toggle switch that says **"Test mode"**
3. Make sure it's **ON** (usually shows as a toggle or says "Viewing test data")
4. When test mode is active, you'll see a banner at the top saying "Test mode"

### Step 4: Navigate to API Keys
1. On the left sidebar, click **"Developers"**
2. Click **"API keys"**
3. You'll see two types of keys:

#### **Publishable Key** (Frontend)
- Starts with: `pk_test_...`
- **Safe to expose** in your frontend code
- Used for: Client-side payment tokenization
- **Visible by default** - just copy it

#### **Secret Key** (Backend)
- Starts with: `sk_test_...`
- **MUST BE KEPT SECRET** - never expose in frontend!
- Used for: Server-side API calls, creating checkout sessions
- Click **"Reveal test key"** to see it
- **Copy and save it immediately** (you can reveal it multiple times in test mode)

### Step 5: Copy Your Keys

**Test Publishable Key:**
```
pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Test Secret Key:**
```
sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 📝 Where to Add Your Keys

### Frontend Configuration

**File**: `apps/frontend/.env`

```bash
# Stripe Frontend (Publishable Key - Safe to expose)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# API URL
VITE_API_URL=http://localhost:8000
```

### Backend Configuration

**File**: `apps/api/.env` or root `.env`

```bash
# Stripe Backend (Secret Key - KEEP SECRET!)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Stripe Webhook Secret (we'll get this later)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Database
DATABASE_URL=postgresql://berzinstoms:Parole91Mia@localhost:5432/powdercoater

# Redis
REDIS_URL=redis://localhost:6379

# API Configuration
API_PORT=8000
API_HOST=0.0.0.0

# Environment
NODE_ENV=development
RUST_LOG=info
```

---

## 🔄 Test Mode vs Live Mode

### Test Mode (Development)
- **Keys start with**: `pk_test_...` and `sk_test_...`
- **Use for**: Development and testing
- **Test card number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)
- **No real charges** are made

### Live Mode (Production)
- **Keys start with**: `pk_live_...` and `sk_live_...`
- **Use for**: Production only
- **Real charges** are made
- **Requires**: Business verification and bank account setup

**⚠️ IMPORTANT**: Never use live keys during development!

---

## 🧪 Test Cards for Development

Stripe provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Successful payment |
| `4000 0000 0000 9995` | ❌ Card declined (insufficient funds) |
| `4000 0025 0000 3155` | ❌ Requires authentication (3D Secure) |
| `4000 0000 0000 0002` | ❌ Card declined (generic) |

**For all test cards**:
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

---

## 🪝 Setting Up Webhooks (Later Step)

Webhooks allow Stripe to notify your server about payment events.

### 1. Create a Webhook Endpoint
1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your endpoint URL: `http://localhost:8000/api/webhooks/stripe`
   - For production: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **"Add endpoint"**

### 2. Get Webhook Secret
1. Click on your newly created webhook endpoint
2. Click **"Reveal"** under **Signing secret**
3. Copy the secret (starts with `whsec_...`)
4. Add to your backend `.env` file:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

### 3. Test Webhooks Locally
Use Stripe CLI to forward webhooks to localhost:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:8000/api/webhooks/stripe

# This will give you a webhook secret like: whsec_...
# Add this to your .env file
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep your **secret key** in environment variables
- Use **test mode** during development
- Verify webhook signatures
- Use HTTPS in production
- Rotate keys if they're exposed

### ❌ DON'T:
- Commit API keys to Git
- Share secret keys publicly
- Use live keys in development
- Store keys in frontend code (publishable key is OK)
- Skip webhook signature verification

---

## 📚 Next Steps

1. ✅ Get your test API keys from Stripe Dashboard
2. ✅ Add keys to `.env` files (frontend and backend)
3. ⏭️ Implement backend endpoints (next section)
4. ⏭️ Set up webhooks
5. ⏭️ Test the complete flow
6. ⏭️ Switch to live mode when ready for production

---

## 🆘 Troubleshooting

### "Invalid API Key"
- Make sure you're using the correct key (test vs live)
- Check for extra spaces when copying
- Verify the key starts with `pk_test_` or `sk_test_`

### "Webhook signature verification failed"
- Make sure you're using the correct webhook secret
- Check that the secret matches the endpoint in Stripe Dashboard
- For local testing, use Stripe CLI secret

### "No such customer/charge/session"
- You might be mixing test and live mode
- Make sure all keys are for the same mode

---

## 📖 Useful Links

- **Stripe Dashboard**: https://dashboard.stripe.com
- **API Documentation**: https://docs.stripe.com/api
- **Testing Guide**: https://docs.stripe.com/testing
- **Webhook Guide**: https://docs.stripe.com/webhooks
- **Stripe CLI**: https://stripe.com/docs/stripe-cli

---

## ✅ Quick Checklist

Before proceeding with backend implementation:

- [ ] Created Stripe account
- [ ] Enabled test mode
- [ ] Copied publishable key (pk_test_...)
- [ ] Copied secret key (sk_test_...)
- [ ] Added keys to frontend `.env`
- [ ] Added keys to backend `.env`
- [ ] Tested with test card: 4242 4242 4242 4242

Once these are done, you're ready to implement the backend endpoints! 🚀
