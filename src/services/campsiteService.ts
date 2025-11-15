// Frontend-only mode - campsites stored in localStorage
import { Campsite, CampsiteFilters, PaginatedResponse } from '@/types';
import { config } from '@/config';

const STORAGE_KEY = 'camp_campsites_storage';

// Initial mock campsite data
const initialCampsites: Campsite[] = [
  {
    id: '1',
    name: 'Göl Kenarı Kamp Alanı',
    description: 'Muhteşem göl manzaralı doğal kamp alanı',
    location: 'Bolu',
    region: 'Karadeniz',
    latitude: 40.7392,
    longitude: 31.6013,
    amenities: ['shower', 'toilet', 'parking'],
    pricePerNight: 150,
    capacity: 50,
    images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'],
    rating: 4.5,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const loadCampsites = (): Campsite[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCampsites));
      return initialCampsites;
    }
  } catch (error) {
    console.error('Failed to load campsites from storage:', error);
  }
  return initialCampsites;
};

const saveCampsites = (campsites: Campsite[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campsites));
    }
  } catch (error) {
    console.error('Failed to save campsites to storage:', error);
  }
};

export const campsiteService = {
  async getCampsites(
    filters?: CampsiteFilters,
    page: number = 1,
    limit: number = config.itemsPerPage
  ): Promise<PaginatedResponse<Campsite>> {
    // Frontend-only mode: return from localStorage
    let campsites = loadCampsites();

    // Apply filters
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        campsites = campsites.filter(
          c => c.name.toLowerCase().includes(search) || 
               c.description?.toLowerCase().includes(search)
        );
      }
      if (filters.region) {
        campsites = campsites.filter(c => c.region === filters.region);
      }
      if (filters.amenities?.length) {
        campsites = campsites.filter(c =>
          filters.amenities!.every(a => c.amenities.includes(a))
        );
      }
      if (filters.minPrice !== undefined) {
        campsites = campsites.filter(c => c.pricePerNight >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        campsites = campsites.filter(c => c.pricePerNight <= filters.maxPrice!);
      }
    }

    // Pagination
    const total = campsites.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedCampsites = campsites.slice(start, end);

    return {
      data: paginatedCampsites,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getCampsiteById(id: string): Promise<Campsite> {
    const campsites = loadCampsites();
    const campsite = campsites.find(c => c.id === id);
    if (!campsite) {
      throw new Error('Kamp alanı bulunamadı');
    }
    return campsite;
  },

  async createCampsite(data: FormData): Promise<Campsite> {
    const campsites = loadCampsites();
    
    // Extract form data
    const name = data.get('name') as string;
    const description = data.get('description') as string;
    const location = data.get('location') as string;
    const region = data.get('region') as string;
    const latitude = parseFloat(data.get('latitude') as string);
    const longitude = parseFloat(data.get('longitude') as string);
    const pricePerNight = parseFloat(data.get('pricePerNight') as string);
    const capacity = parseInt(data.get('capacity') as string);
    const available = data.get('available') === 'true';
    
    // Handle amenities (could be array or string)
    const amenitiesRaw = data.getAll('amenities');
    const amenities = amenitiesRaw.map(a => a.toString());

    const newCampsite: Campsite = {
      id: `campsite-${Date.now()}`,
      name,
      description,
      location,
      region,
      latitude,
      longitude,
      amenities,
      pricePerNight,
      capacity,
      images: [],
      rating: 0,
      available,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    campsites.push(newCampsite);
    saveCampsites(campsites);
    return newCampsite;
  },

  async updateCampsite(id: string, data: FormData | Partial<Campsite>): Promise<Campsite> {
    const campsites = loadCampsites();
    const index = campsites.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Kamp alanı bulunamadı');
    }

    let updateData: Partial<Campsite>;
    
    if (data instanceof FormData) {
      // Extract from FormData
      updateData = {
        name: data.get('name') as string,
        description: data.get('description') as string,
        location: data.get('location') as string,
        region: data.get('region') as string,
        latitude: parseFloat(data.get('latitude') as string),
        longitude: parseFloat(data.get('longitude') as string),
        pricePerNight: parseFloat(data.get('pricePerNight') as string),
        capacity: parseInt(data.get('capacity') as string),
        available: data.get('available') === 'true',
        amenities: data.getAll('amenities').map(a => a.toString()),
      };
    } else {
      updateData = data;
    }

    campsites[index] = {
      ...campsites[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    saveCampsites(campsites);
    return campsites[index];
  },

  async deleteCampsite(id: string): Promise<void> {
    const campsites = loadCampsites();
    const filtered = campsites.filter(c => c.id !== id);
    saveCampsites(filtered);
  },
};

