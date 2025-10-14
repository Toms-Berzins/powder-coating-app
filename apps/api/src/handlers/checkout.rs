use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use stripe::{
    CheckoutSession, CheckoutSessionMode, Client,
    CreateCheckoutSession, CreateCheckoutSessionLineItems,
    CreateCheckoutSessionLineItemsPriceData,
    CreateCheckoutSessionLineItemsPriceDataProductData,
    Currency,
};
use utoipa::ToSchema;

use crate::AppState;

#[derive(Debug, Deserialize, ToSchema)]
pub struct CreateCheckoutSessionRequest {
    /// Quote ID for tracking
    pub quote_id: String,
    /// Total amount in cents (e.g., 5000 = $50.00)
    pub total_amount: i64,
    /// Currency code (e.g., "usd") - TODO: Use for multi-currency support
    #[allow(dead_code)]
    pub currency: String,
    /// Customer email
    pub customer_email: Option<String>,
    /// Success URL to redirect after payment
    pub success_url: Option<String>,
    /// Cancel URL to redirect if payment cancelled
    pub cancel_url: Option<String>,
    /// Quote details for line items
    pub quote_details: QuoteDetails,
}

#[derive(Debug, Deserialize, Serialize, ToSchema)]
pub struct QuoteDetails {
    pub base_price: i64,
    pub prep_surcharge: i64,
    pub rush_surcharge: i64,
    pub material: String,
    pub prep_level: String,
    pub quantity: i32,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct CreateCheckoutSessionResponse {
    /// Stripe checkout session ID
    pub session_id: String,
    /// Checkout URL to redirect user to
    pub url: String,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct ErrorResponse {
    pub error: String,
    pub message: String,
}

/// Create Stripe Checkout Session
///
/// Creates a Stripe Checkout session for processing the powder coating quote payment.
/// Returns a session ID and checkout URL to redirect the user to complete payment.
#[utoipa::path(
    post,
    path = "/api/checkout/create-session",
    request_body = CreateCheckoutSessionRequest,
    responses(
        (status = 200, description = "Checkout session created successfully", body = CreateCheckoutSessionResponse),
        (status = 400, description = "Invalid request", body = ErrorResponse),
        (status = 500, description = "Internal server error", body = ErrorResponse)
    ),
    tag = "checkout"
)]
pub async fn create_checkout_session(
    State(state): State<AppState>,
    Json(payload): Json<CreateCheckoutSessionRequest>,
) -> Result<Json<CreateCheckoutSessionResponse>, (StatusCode, Json<ErrorResponse>)> {
    tracing::info!("Creating checkout session for quote_id: {}", payload.quote_id);

    // Validate amount
    if payload.total_amount <= 0 {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "invalid_amount".to_string(),
                message: "Total amount must be greater than zero".to_string(),
            }),
        ));
    }

    // Set default URLs if not provided
    let success_url = payload
        .success_url
        .unwrap_or_else(|| format!("{}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            std::env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:5173".to_string())));

    let cancel_url = payload
        .cancel_url
        .unwrap_or_else(|| format!("{}/checkout/cancel",
            std::env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:5173".to_string())));

    // Create Stripe checkout session
    let client = Client::new(state.stripe_secret_key);

    // Build line items
    let mut line_items = Vec::new();

    // Base price
    line_items.push(CreateCheckoutSessionLineItems {
        price_data: Some(CreateCheckoutSessionLineItemsPriceData {
            currency: Currency::USD,
            unit_amount: Some(payload.quote_details.base_price),
            product_data: Some(CreateCheckoutSessionLineItemsPriceDataProductData {
                name: format!("Powder Coating - {} ({})",
                    payload.quote_details.material,
                    payload.quote_details.prep_level),
                description: Some(format!("Quantity: {}", payload.quote_details.quantity)),
                ..Default::default()
            }),
            ..Default::default()
        }),
        quantity: Some(1),
        ..Default::default()
    });

    // Prep surcharge if applicable
    if payload.quote_details.prep_surcharge > 0 {
        line_items.push(CreateCheckoutSessionLineItems {
            price_data: Some(CreateCheckoutSessionLineItemsPriceData {
                currency: Currency::USD,
                unit_amount: Some(payload.quote_details.prep_surcharge),
                product_data: Some(CreateCheckoutSessionLineItemsPriceDataProductData {
                    name: "Surface Preparation Surcharge".to_string(),
                    ..Default::default()
                }),
                ..Default::default()
            }),
            quantity: Some(1),
            ..Default::default()
        });
    }

    // Rush surcharge if applicable
    if payload.quote_details.rush_surcharge > 0 {
        line_items.push(CreateCheckoutSessionLineItems {
            price_data: Some(CreateCheckoutSessionLineItemsPriceData {
                currency: Currency::USD,
                unit_amount: Some(payload.quote_details.rush_surcharge),
                product_data: Some(CreateCheckoutSessionLineItemsPriceDataProductData {
                    name: "Rush Order Surcharge (+50%)".to_string(),
                    ..Default::default()
                }),
                ..Default::default()
            }),
            quantity: Some(1),
            ..Default::default()
        });
    }

    // Create the session
    let mut params = CreateCheckoutSession::new();
    params.line_items = Some(line_items);
    params.mode = Some(CheckoutSessionMode::Payment);
    params.success_url = Some(&success_url);
    params.cancel_url = Some(&cancel_url);

    if let Some(email) = &payload.customer_email {
        params.customer_email = Some(email);
    }

    // Add metadata for tracking
    let mut metadata = std::collections::HashMap::new();
    metadata.insert("quote_id".to_string(), payload.quote_id.clone());
    metadata.insert("material".to_string(), payload.quote_details.material.clone());
    metadata.insert("quantity".to_string(), payload.quote_details.quantity.to_string());
    params.metadata = Some(metadata);

    // Create session via Stripe API
    match CheckoutSession::create(&client, params).await {
        Ok(session) => {
            tracing::info!("Created Stripe checkout session: {}", session.id);

            Ok(Json(CreateCheckoutSessionResponse {
                session_id: session.id.to_string(),
                url: session.url.unwrap_or_default(),
            }))
        }
        Err(e) => {
            tracing::error!("Failed to create Stripe checkout session: {:?}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    error: "stripe_error".to_string(),
                    message: format!("Failed to create checkout session: {}", e),
                }),
            ))
        }
    }
}
