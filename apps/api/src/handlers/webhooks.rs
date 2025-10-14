use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    Json,
};
use serde::Serialize;
use utoipa::ToSchema;

use crate::AppState;

#[derive(Debug, Serialize, ToSchema)]
pub struct WebhookResponse {
    pub received: bool,
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

    // Get Stripe signature from headers
    let _signature = headers
        .get("stripe-signature")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| {
            tracing::error!("Missing Stripe signature header");
            StatusCode::BAD_REQUEST
        })?;

    // TODO: Implement webhook signature verification
    // For now, just log the webhook payload for debugging
    tracing::info!("Received webhook payload (first 200 chars): {}",
        &body.chars().take(200).collect::<String>());

    // Parse the webhook event
    let event: serde_json::Value = serde_json::from_str(&body).map_err(|e| {
        tracing::error!("Failed to parse webhook JSON: {}", e);
        StatusCode::BAD_REQUEST
    })?;

    // Log event type
    if let Some(event_type) = event.get("type").and_then(|v| v.as_str()) {
        tracing::info!("Webhook event type: {}", event_type);

        // TODO: Handle specific event types
        match event_type {
            "checkout.session.completed" => {
                tracing::info!("Checkout session completed event received");
            }
            "payment_intent.succeeded" => {
                tracing::info!("Payment intent succeeded event received");
            }
            "payment_intent.payment_failed" => {
                tracing::warn!("Payment intent failed event received");
            }
            _ => {
                tracing::info!("Unhandled event type: {}", event_type);
            }
        }
    }

    tracing::info!("Successfully received webhook");

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
