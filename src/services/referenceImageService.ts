// Frontend-only mode - no backend API
export interface ReferenceImage {
  id: number;
  title: string;
  location?: string;
  year?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReferenceImageData {
  title: string;
  location?: string;
  year?: string;
  display_order?: number;
  is_active?: boolean;
  image: File;
}

export interface UpdateReferenceImageData {
  title?: string;
  location?: string;
  year?: string;
  display_order?: number;
  is_active?: boolean;
  image?: File;
}

const STORAGE_KEY = 'reference_images_storage';

// Mock initial data
const initialImages: ReferenceImage[] = [
  {
    id: 1,
    title: '1999 İstanbul',
    location: 'İstanbul, Türkiye',
    year: '1999',
    image_url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=600&fit=crop',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: '2005 Antalya',
    location: 'Antalya, Türkiye',
    year: '2005',
    image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: '2010 Kapadokya',
    location: 'Kapadokya, Türkiye',
    year: '2010',
    image_url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: '2015 Bolu',
    location: 'Bolu, Türkiye',
    year: '2015',
    image_url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    title: '2018 Muğla',
    location: 'Muğla, Türkiye',
    year: '2018',
    image_url: 'https://images.unsplash.com/photo-1464822759844-d150ad9bf229?w=800&h=600&fit=crop',
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: '2020 Çanakkale',
    location: 'Çanakkale, Türkiye',
    year: '2020',
    image_url: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop',
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

class ReferenceImageService {
  private getImages(): ReferenceImage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialImages));
      return initialImages;
    } catch (error) {
      console.error('Failed to load images from storage:', error);
      return initialImages;
    }
  }

  private saveImages(images: ReferenceImage[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error('Failed to save images to storage:', error);
    }
  }

  async getAllImages(): Promise<ReferenceImage[]> {
    // Frontend-only mode: return from localStorage
    return this.getImages().filter(img => img.is_active).sort((a, b) => a.display_order - b.display_order);
  }

  async getAllImagesAdmin(): Promise<ReferenceImage[]> {
    // For admin: return all images including inactive ones
    return this.getImages().sort((a, b) => a.display_order - b.display_order);
  }

  async getImageById(id: number): Promise<ReferenceImage> {
    const images = this.getImages();
    const image = images.find(img => img.id === id);
    if (!image) {
      throw new Error('Image not found');
    }
    return image;
  }

  async createImage(data: CreateReferenceImageData): Promise<ReferenceImage> {
    const images = this.getImages();
    const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
    
    // Convert image to data URL
    const imageUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(data.image);
    });

    const newImage: ReferenceImage = {
      id: newId,
      title: data.title,
      location: data.location,
      year: data.year,
      image_url: imageUrl,
      display_order: data.display_order ?? images.length + 1,
      is_active: data.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    images.push(newImage);
    this.saveImages(images);
    return newImage;
  }

  async updateImage(id: number, data: UpdateReferenceImageData): Promise<ReferenceImage> {
    const images = this.getImages();
    const index = images.findIndex(img => img.id === id);
    
    if (index === -1) {
      throw new Error('Image not found');
    }

    let imageUrl = images[index].image_url;
    if (data.image) {
      imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(data.image!);
      });
    }

    images[index] = {
      ...images[index],
      title: data.title ?? images[index].title,
      location: data.location !== undefined ? data.location : images[index].location,
      year: data.year !== undefined ? data.year : images[index].year,
      display_order: data.display_order ?? images[index].display_order,
      is_active: data.is_active ?? images[index].is_active,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    this.saveImages(images);
    return images[index];
  }

  async deleteImage(id: number): Promise<void> {
    const images = this.getImages();
    const filtered = images.filter(img => img.id !== id);
    this.saveImages(filtered);
  }

  async toggleImageStatus(id: number): Promise<ReferenceImage> {
    const images = this.getImages();
    const index = images.findIndex(img => img.id === id);
    
    if (index === -1) {
      throw new Error('Image not found');
    }

    images[index].is_active = !images[index].is_active;
    images[index].updated_at = new Date().toISOString();
    this.saveImages(images);
    return images[index];
  }
}

export const referenceImageService = new ReferenceImageService();



