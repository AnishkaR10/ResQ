export class CreateReportDto {
    title: string;
    description?: string;
    category: string;
    latitude: number;
    longitude: number;
    address?: string;
    contactInfo?: string;
  }