use axum::{
    body::Bytes,
    extract::State,
    http::{HeaderMap, StatusCode},
    Json,
};
use serde::{Deserialize, Serialize};

use crate::AppState;

#[derive(Debug, Serialize)]
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
    responses(
        (status = 200, description = "Webhook received successfully", body = WebhookResponse),
        (status = 400, description = "Invalid webhook signature"),
        (status = 500, description = "Internal server error")
    ),
    tag = "webhooks"
)]
pub async fn stripe_webhook(
    State(state): State<AppState>,
    headers: HeaderMap,
    body: Bytes,
) -> Result<Json<WebhookResponse>, StatusCode> {
    tracing::info!("Received Stripe webhook");

    // Get Stripe signature from headers
    let signature = headers
        .get("stripe-signature")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| {
            tracing::error!("Missing Stripe signature header");
            StatusCode::BAD_REQUEST
        })?;

    // Verify webhook signature
    let payload_str = std::str::from_utf8(&body).map_err(|e| {
        tracing::error!("Invalid UTF-8 in webhook payload: {}", e);
        StatusCode::BAD_REQUEST
    })?;

    let event = stripe_rust::Webhook::construct_event(
        payload_str,
        signature,
        &state.stripe_webhook_secret,
    )
    .map_err(|e| {
        tracing::error!("Failed to verify webhook signature: {:?}", e);
        StatusCode::BAD_REQUEST
    })?;

    tracing::info!("Verified webhook event type: {}", event.type_);

    // Handle different event types
    match event.type_.as_str() {
        "checkout.session.completed" => {
            handle_checkout_session_completed(&event).await?;
        }
        "payment_intent.succeeded" => {
            handle_payment_intent_succeeded(&event).await?;
        }
        "payment_intent.payment_failed" => {
            handle_payment_intent_failed(&event).await?;
        }
        _ => {
            tracing::info!("Unhandled event type: {}", event.type_);
        }
    }

    Ok(Json(WebhookResponse { received: true }))
}

async fn handle_checkout_session_completed(
    event: &stripe_rust::Event,
) -> Result<(), StatusCode> {
    tracing::info!("Processing checkout.session.completed event");

    // Parse the checkout session from event data
    let session: stripe_rust::CheckoutSession = serde_json::from_value(event.data.object.clone())
        .map_err(|e| {
            tracing::error!("Failed to parse checkout session: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    tracing::info!("Checkout session completed: {}", session.id);
    tracing::info!("Payment status: {:?}", session.payment_status);
    tracing::info!("Customer email: {:?}", session.customer_details.as_ref().map(|d| &d.email));

    // Extract metadata
    if let Some(metadata) = &session.metadata {
        if let Some(quote_id) = metadata.get("quote_id") {
            tracing::info!("Quote ID from metadata: {}", quote_id);

            // TODO: Update quote status in database
            // - Mark quote as paid
            // - Create order record
            // - Send confirmation email
            // - Notify production team

            tracing::info!("Order created for quote: {}", quote_id);
        }
    }

    Ok(())
}

async fn handle_payment_intent_succeeded(
    event: &stripe_rust::Event,
) -> Result<(), StatusCode> {
    tracing::info!("Processing payment_intent.succeeded event");

    let payment_intent: stripe_rust::PaymentIntent =
        serde_json::from_value(event.data.object.clone()).map_err(|e| {
            tracing::error!("Failed to parse payment intent: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    tracing::info!("Payment intent succeeded: {}", payment_intent.id);
    tracing::info!("Amount received: {} {}", payment_intent.amount, payment_intent.currency);

    // TODO: Additional payment success handling
    // - Update payment records
    // - Send receipt
    // - Update analytics

    Ok(())
}

async fn handle_payment_intent_failed(
    event: &stripe_rust::Event,
) -> Result<(), StatusCode> {
    tracing::warn!("Processing payment_intent.payment_failed event");

    let payment_intent: stripe_rust::PaymentIntent =
        serde_json::from_value(event.data.object.clone()).map_err(|e| {
            tracing::error!("Failed to parse payment intent: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    tracing::warn!("Payment intent failed: {}", payment_intent.id);
    tracing::warn!("Failure reason: {:?}", payment_intent.last_payment_error);

    // TODO: Handle payment failure
    // - Notify customer
    // - Update quote status
    // - Log for analytics

    Ok(())
}
