use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

mod routes;
mod handlers;
mod models;
mod db;

#[derive(Clone)]
pub struct AppState {
    pub stripe_secret_key: String,
    pub stripe_webhook_secret: String,
}

#[derive(OpenApi)]
#[openapi(
    paths(
        handlers::health::health_check,
        handlers::checkout::create_checkout_session,
        handlers::webhooks::stripe_webhook,
    ),
    components(
        schemas(
            handlers::checkout::CreateCheckoutSessionRequest,
            handlers::checkout::CreateCheckoutSessionResponse,
            handlers::checkout::QuoteDetails,
            handlers::checkout::ErrorResponse,
            handlers::webhooks::WebhookResponse,
        )
    ),
    tags(
        (name = "health", description = "Health check endpoints"),
        (name = "checkout", description = "Checkout and payment endpoints"),
        (name = "webhooks", description = "Webhook handlers for external services")
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables
    dotenvy::dotenv().ok();

    // Initialize app state
    let state = AppState {
        stripe_secret_key: std::env::var("STRIPE_SECRET_KEY")
            .expect("STRIPE_SECRET_KEY must be set"),
        stripe_webhook_secret: std::env::var("STRIPE_WEBHOOK_SECRET")
            .unwrap_or_else(|_| {
                tracing::warn!("STRIPE_WEBHOOK_SECRET not set, webhooks will fail");
                String::new()
            }),
    };

    // Build our application with routes
    let app = Router::new()
        .route("/health", get(handlers::health::health_check))
        .route("/api/checkout/create-session", post(handlers::checkout::create_checkout_session))
        .route("/api/webhooks/stripe", post(handlers::webhooks::stripe_webhook))
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .with_state(state)
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    // Run it
    let addr = SocketAddr::from(([0, 0, 0, 0], 8000));
    tracing::info!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
