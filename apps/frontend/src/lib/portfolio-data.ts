export type PortfolioCategory = 'all' | 'automotive' | 'furniture' | 'industrial' | 'decorative'

export type PortfolioMaterial = 'aluminum' | 'steel' | 'stainless-steel'

export interface PortfolioProject {
  id: string
  title: string
  category: PortfolioCategory
  material: PortfolioMaterial
  ralCode: string
  colorName: string
  prepLevel: string
  beforeImage: string
  afterImage: string
  description: string
  tags: string[]
  featured: boolean
  gridSize: 'small' | 'medium' | 'large' // For bento grid layout
}

// Mock portfolio data (replace with real images in production)
export const portfolioProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'Vintage Bicycle Frame',
    category: 'automotive',
    material: 'steel',
    ralCode: 'RAL 5002',
    colorName: 'Ultramarine Blue',
    prepLevel: 'Premium',
    beforeImage: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format',
    afterImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format',
    description: 'Complete restoration with premium surface preparation and ultramarine blue finish.',
    tags: ['bicycle', 'restoration', 'blue'],
    featured: true,
    gridSize: 'large',
  },
  {
    id: '2',
    title: 'Modern Office Chair',
    category: 'furniture',
    material: 'aluminum',
    ralCode: 'RAL 9005',
    colorName: 'Jet Black',
    prepLevel: 'Standard',
    beforeImage: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&auto=format',
    afterImage: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format',
    description: 'Sleek matte black finish for modern office furniture.',
    tags: ['furniture', 'office', 'black'],
    featured: false,
    gridSize: 'medium',
  },
  {
    id: '3',
    title: 'Industrial Machinery Parts',
    category: 'industrial',
    material: 'steel',
    ralCode: 'RAL 7035',
    colorName: 'Light Grey',
    prepLevel: 'Standard',
    beforeImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format',
    afterImage: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format',
    description: 'Durable coating for high-stress industrial components.',
    tags: ['industrial', 'machinery', 'grey'],
    featured: false,
    gridSize: 'small',
  },
  {
    id: '4',
    title: 'Garden Furniture Set',
    category: 'furniture',
    material: 'aluminum',
    ralCode: 'RAL 6005',
    colorName: 'Moss Green',
    prepLevel: 'Premium',
    beforeImage: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=800&auto=format',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format',
    description: 'Weather-resistant coating for outdoor furniture.',
    tags: ['outdoor', 'furniture', 'green'],
    featured: true,
    gridSize: 'large',
  },
  {
    id: '5',
    title: 'Decorative Metal Art',
    category: 'decorative',
    material: 'steel',
    ralCode: 'RAL 3020',
    colorName: 'Traffic Red',
    prepLevel: 'Premium',
    beforeImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format',
    afterImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format',
    description: 'Vibrant red finish for custom metal artwork.',
    tags: ['art', 'decorative', 'red'],
    featured: false,
    gridSize: 'medium',
  },
  {
    id: '6',
    title: 'Car Wheel Rims',
    category: 'automotive',
    material: 'aluminum',
    ralCode: 'RAL 9006',
    colorName: 'White Aluminium',
    prepLevel: 'Premium',
    beforeImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format',
    afterImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format',
    description: 'High-quality metallic finish for automotive rims.',
    tags: ['automotive', 'wheels', 'silver'],
    featured: true,
    gridSize: 'medium',
  },
  {
    id: '7',
    title: 'Metal Shelving Unit',
    category: 'industrial',
    material: 'steel',
    ralCode: 'RAL 9016',
    colorName: 'Traffic White',
    prepLevel: 'Standard',
    beforeImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format',
    afterImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format',
    description: 'Clean white finish for industrial storage solutions.',
    tags: ['industrial', 'storage', 'white'],
    featured: false,
    gridSize: 'small',
  },
  {
    id: '8',
    title: 'Custom Railings',
    category: 'decorative',
    material: 'stainless-steel',
    ralCode: 'RAL 9005',
    colorName: 'Jet Black',
    prepLevel: 'Premium',
    beforeImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format',
    afterImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format',
    description: 'Elegant matte black finish for architectural elements.',
    tags: ['architecture', 'decorative', 'black'],
    featured: false,
    gridSize: 'large',
  },
]

// Helper function to filter projects
export function filterProjects(
  projects: PortfolioProject[],
  category: PortfolioCategory
): PortfolioProject[] {
  if (category === 'all') {
    return projects
  }
  return projects.filter((project) => project.category === category)
}

// Get featured projects
export function getFeaturedProjects(projects: PortfolioProject[]): PortfolioProject[] {
  return projects.filter((project) => project.featured)
}
