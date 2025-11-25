use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    Json,
};
use hmac::{Hmac, Mac};
use serde::Serialize;
use sha2::Sha256;
use utoipa::ToSchema;

use crate::AppState;

type HmacSha256 = Hmac<Sha256>;

#[derive(Debug, Serialize, ToSchema)]
pub struct WebhookResponse {
    pub received: bool,
}

/// Verify Stripe webhook signature
fn verify_signature(payload: &str, signature: &str, secret: &str) -> Result<(), StatusCode> {
    // Parse signature header: "t=timestamp,v1=signature"
    let mut timestamp: Option<i64> = None;
    let mut signatures = Vec::new();

    for part in signature.split(',') {
        let parts: Vec<&str> = part.split('=').collect();
        if parts.len() == 2 {
            match parts[0] {
                "t" => {
                    timestamp = parts[1].parse::<i64>().ok();
                }
                "v1" => {
                    signatures.push(parts[1]);
                }
                _ => {}
            }
        }
    }

    let timestamp = timestamp.ok_or_else(|| {
        tracing::error!("Missing timestamp in signature");
        StatusCode::BAD_REQUEST
    })?;

    if signatures.is_empty() {
        tracing::error!("No v1 signatures found");
        return Err(StatusCode::BAD_REQUEST);
    }

    // Check timestamp is within 5 minutes
    let current_time = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    if (current_time - timestamp).abs() > 300 {
        tracing::error!(
            "Webhook timestamp too old: {} seconds",
            current_time - timestamp
        );
        return Err(StatusCode::BAD_REQUEST);
    }

    // Compute expected signature
    let signed_payload = format!("{}.{}", timestamp, payload);
    let mut mac = HmacSha256::new_from_slice(secret.as_bytes()).map_err(|e| {
        tracing::error!("Invalid HMAC key: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;
    mac.update(signed_payload.as_bytes());
    let expected_signature = hex::encode(mac.finalize().into_bytes());

    // Compare with provided signatures
    for sig in signatures {
        if sig == expected_signature {
            return Ok(());
        }
    }

    tracing::error!("Signature verification failed");
    Err(StatusCode::BAD_REQUEST)
}

/// Stripe Webhook Handler
///
/// Receives webhook events from Stripe to handle payment status updates.
/// Verifies webhook signatures to ensure authenticity.
#[utoipa::path(
    post,
    path = "/api/webhooks/stripe",
    request_body = String,
    responses(
        (status = 200, description = "Webhook received successfully", body = WebhookResponse),
        (status = 400, description = "Invalid webhook signature"),
        (status = 500, description = "Internal server error")
    ),
    tag = "webhooks"
)]
pub async fn stripe_webhook(
    State(_state): State<AppState>,
    headers: HeaderMap,
    body: String,
) -> Result<Json<WebhookResponse>, StatusCode> {
    tracing::info!("Received Stripe webhook");

    // Get webhook secret from environment
    let webhook_secret = std::env::var("STRIPE_WEBHOOK_SECRET").map_err(|_| {
        tracing::error!("STRIPE_WEBHOOK_SECRET not set in environment");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    // Get Stripe signature from headers
    let signature = headers
        .get("stripe-signature")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| {
            tracing::error!("Missing Stripe signature header");
            StatusCode::BAD_REQUEST
        })?;

    // Verify webhook signature
    verify_signature(&body, signature, &webhook_secret)?;

    // Parse event manually after verification
    let event: serde_json::Value = serde_json::from_str(&body).map_err(|e| {
        tracing::error!("Failed to parse webhook JSON: {}", e);
        StatusCode::BAD_REQUEST
    })?;

    // Extract event type and ID
    let event_type = event
        .get("type")
        .and_then(|v| v.as_str())
        .ok_or(StatusCode::BAD_REQUEST)?;

    let event_id = event
        .get("id")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown");

    tracing::info!("Verified webhook - Type: {}, ID: {}", event_type, event_id);

    // Handle specific event types
    match event_type {
        "checkout.session.completed" => {
            if let Some(session) = event.get("data").and_then(|d| d.get("object")) {
                let session_id = session
                    .get("id")
                    .and_then(|v| v.as_str())
                    .unwrap_or("unknown");
                let payment_status = session
                    .get("payment_status")
                    .and_then(|v| v.as_str())
                    .unwrap_or("unknown");
                let customer_email = session
                    .get("customer_details")
                    .and_then(|d| d.get("email"))
                    .and_then(|e| e.as_str());

                tracing::info!("Checkout session completed: {}", session_id);
                tracing::info!("Payment status: {}", payment_status);
                tracing::info!("Customer email: {:?}", customer_email);

                // TODO: Update database with order status
                // - Create order record
                // - Update payment status
                // - Send confirmation email
                tracing::warn!("TODO: Implement order creation in database");
            }
        }
        "checkout.session.expired" => {
            tracing::info!("Checkout session expired");
            // TODO: Handle expired sessions (cleanup, notify user)
        }
        "payment_intent.succeeded" => {
            tracing::info!("Payment intent succeeded");
            // TODO: Handle successful payment
        }
        "payment_intent.payment_failed" => {
            tracing::warn!("Payment intent failed");
            // TODO: Handle failed payment (notify user, log reason)
        }
        _ => {
            tracing::info!("Unhandled event type: {}", event_type);
        }
    }

    tracing::info!("Successfully processed webhook");

    Ok(Json(WebhookResponse { received: true }))
}

// TODO: Implement event-specific handlers
// async-stripe uses EventObject enum for type-safe event handling
// Example implementation:
// match event.data {
//     stripe::EventObject::CheckoutSession(session) => {
//         // Handle checkout session completed
//     }
//     stripe::EventObject::PaymentIntent(intent) => {
//         // Handle payment intent events
//     }
//     _ => {
//         // Handle other events or ignore
//     }
// }
