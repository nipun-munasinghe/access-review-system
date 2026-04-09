export type SpaceCategory = 'Mall' | 'Park' | 'Hospital' | 'Station' | 'Other';

export interface SpaceCoordinates {
    lat: number;
    lng: number;
}

export interface LocationDetails {
    address: string;
    coordinates: SpaceCoordinates;
}

export interface PublicSpace {
    _id: string;
    id?: string;
    name: string;
    category: SpaceCategory;
    locationDetails: LocationDetails;
    imageUrl?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePublicSpaceDTO {
    name: string;
    category: SpaceCategory;
    locationDetails: LocationDetails;
    imageUrl?: string;
    description?: string;
}

export type UpdatePublicSpaceDTO = Partial<CreatePublicSpaceDTO>;
