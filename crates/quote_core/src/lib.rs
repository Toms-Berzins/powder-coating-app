use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuoteInput {
    /// Dimensions in millimeters: length x width x height
    pub length_mm: f64,
    pub width_mm: f64,
    pub height_mm: f64,

    /// Material type
    pub material: Material,

    /// Surface preparation level
    pub prep_level: PrepLevel,

    /// RAL color code (e.g., "9005", "9016")
    pub color: String,

    /// Turnaround time in days
    pub turnaround_days: u32,

    /// Quantity of parts
    pub quantity: u32,

    /// Rush order flag
    pub is_rush: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Material {
    Aluminium,
    Steel,
    Stainless,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PrepLevel {
    Clean,      // Basic cleaning
    BlastClean, // Blast + clean
    BlastPrime, // Blast + prime + clean
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuoteOutput {
    pub base_price: f64,
    pub prep_surcharge: f64,
    pub rush_surcharge: f64,
    pub total_price: f64,
    pub currency: String,
}

/// Calculate quote price (native Rust function)
pub fn calculate_quote(input: &QuoteInput) -> QuoteOutput {
    // Calculate surface area (simplified - treating as a box)
    let surface_area = 2.0
        * (input.length_mm * input.width_mm
            + input.length_mm * input.height_mm
            + input.width_mm * input.height_mm)
        / 1_000_000.0; // Convert mm² to m²

    // Base price per m² (EUR)
    let base_rate = 25.0;
    let mut base_price = surface_area * base_rate * input.quantity as f64;

    // Material multiplier
    let material_multiplier = match input.material {
        Material::Aluminium => 1.0,
        Material::Steel => 0.9,
        Material::Stainless => 1.2,
    };
    base_price *= material_multiplier;

    // Prep surcharge
    let prep_surcharge = match input.prep_level {
        PrepLevel::Clean => 0.0,
        PrepLevel::BlastClean => surface_area * 15.0 * input.quantity as f64,
        PrepLevel::BlastPrime => surface_area * 25.0 * input.quantity as f64,
    };

    // Rush surcharge (50% if rush and < 5 days)
    let rush_surcharge = if input.is_rush && input.turnaround_days < 5 {
        base_price * 0.5
    } else {
        0.0
    };

    let total_price = base_price + prep_surcharge + rush_surcharge;

    QuoteOutput {
        base_price,
        prep_surcharge,
        rush_surcharge,
        total_price,
        currency: "EUR".to_string(),
    }
}

/// WASM-exposed function for frontend use
#[wasm_bindgen]
pub fn calculate_quote_wasm(input_json: &str) -> String {
    let input: QuoteInput = serde_json::from_str(input_json).unwrap();
    let output = calculate_quote(&input);
    serde_json::to_string(&output).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_quote() {
        let input = QuoteInput {
            length_mm: 1000.0,
            width_mm: 500.0,
            height_mm: 300.0,
            material: Material::Steel,
            prep_level: PrepLevel::Clean,
            color: "9005".to_string(),
            turnaround_days: 7,
            quantity: 1,
            is_rush: false,
        };

        let output = calculate_quote(&input);
        assert!(output.total_price > 0.0);
        assert_eq!(output.prep_surcharge, 0.0);
        assert_eq!(output.rush_surcharge, 0.0);
    }

    #[test]
    fn test_rush_surcharge() {
        let input = QuoteInput {
            length_mm: 1000.0,
            width_mm: 500.0,
            height_mm: 300.0,
            material: Material::Steel,
            prep_level: PrepLevel::Clean,
            color: "9005".to_string(),
            turnaround_days: 3,
            quantity: 1,
            is_rush: true,
        };

        let output = calculate_quote(&input);
        assert!(output.rush_surcharge > 0.0);
    }
}
