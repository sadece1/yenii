// Frontend-only mode - no backend API
export interface ReferenceBrand {
  id: number;
  name: string;
  description?: string;
  logo_url: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReferenceBrandData {
  name: string;
  description?: string;
  website_url?: string;
  display_order?: number;
  is_active?: boolean;
  logo: File;
}

export interface UpdateReferenceBrandData {
  name?: string;
  description?: string;
  website_url?: string;
  display_order?: number;
  is_active?: boolean;
  logo?: File;
}

const STORAGE_KEY = 'reference_brands_storage';

// Mock initial data
const initialBrands: ReferenceBrand[] = [
  {
    id: 1,
    name: 'Coleman',
    description: 'Outdoor camping equipment',
    logo_url: 'https://via.placeholder.com/150',
    website_url: 'https://www.coleman.com',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'The North Face',
    description: 'Premium outdoor gear',
    logo_url: 'https://via.placeholder.com/150',
    website_url: 'https://www.thenorthface.com',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Osprey',
    description: 'Backpacks and gear',
    logo_url: 'https://via.placeholder.com/150',
    website_url: 'https://www.osprey.com',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

class ReferenceBrandService {
  private getBrands(): ReferenceBrand[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBrands));
      return initialBrands;
    } catch (error) {
      console.error('Failed to load brands from storage:', error);
      return initialBrands;
    }
  }

  private saveBrands(brands: ReferenceBrand[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
    } catch (error) {
      console.error('Failed to save brands to storage:', error);
    }
  }

  async getAllBrands(): Promise<ReferenceBrand[]> {
    // Frontend-only mode: return from localStorage
    return this.getBrands();
  }

  async getBrandById(id: number): Promise<ReferenceBrand> {
    const brands = this.getBrands();
    const brand = brands.find(b => b.id === id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  }

  async createBrand(data: CreateReferenceBrandData): Promise<ReferenceBrand> {
    const brands = this.getBrands();
    const newId = brands.length > 0 ? Math.max(...brands.map(b => b.id)) + 1 : 1;
    
    // Convert logo to data URL
    const logoUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(data.logo);
    });

    const newBrand: ReferenceBrand = {
      id: newId,
      name: data.name,
      description: data.description,
      logo_url: logoUrl,
      website_url: data.website_url,
      display_order: data.display_order ?? brands.length + 1,
      is_active: data.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    brands.push(newBrand);
    this.saveBrands(brands);
    return newBrand;
  }

  async updateBrand(id: number, data: UpdateReferenceBrandData): Promise<ReferenceBrand> {
    const brands = this.getBrands();
    const index = brands.findIndex(b => b.id === id);
    
    if (index === -1) {
      throw new Error('Brand not found');
    }

    let logoUrl = brands[index].logo_url;
    if (data.logo) {
      logoUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(data.logo!);
      });
    }

    brands[index] = {
      ...brands[index],
      name: data.name ?? brands[index].name,
      description: data.description !== undefined ? data.description : brands[index].description,
      website_url: data.website_url !== undefined ? data.website_url : brands[index].website_url,
      display_order: data.display_order ?? brands[index].display_order,
      is_active: data.is_active ?? brands[index].is_active,
      logo_url: logoUrl,
      updated_at: new Date().toISOString(),
    };

    this.saveBrands(brands);
    return brands[index];
  }

  async deleteBrand(id: number): Promise<void> {
    const brands = this.getBrands();
    const filtered = brands.filter(b => b.id !== id);
    this.saveBrands(filtered);
  }

  async toggleBrandStatus(id: number): Promise<ReferenceBrand> {
    const brands = this.getBrands();
    const index = brands.findIndex(b => b.id === id);
    
    if (index === -1) {
      throw new Error('Brand not found');
    }

    brands[index].is_active = !brands[index].is_active;
    brands[index].updated_at = new Date().toISOString();
    this.saveBrands(brands);
    return brands[index];
  }
}

export const referenceBrandService = new ReferenceBrandService();


