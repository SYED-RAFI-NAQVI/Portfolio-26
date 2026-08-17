export interface JourneyEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export const journeyData: JourneyEvent[] = [
  {
    id: '1',
    year: '2015',
    title: 'Began the Journey',
    description: 'Started exploring the world of software development and design. Built first simple websites.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    year: '2017',
    title: 'First Major Project',
    description: 'Built and launched a comprehensive web application for a local business, learning full-stack skills.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    year: '2019',
    title: 'Joined Tech Innovators Inc.',
    description: 'Transitioned into a senior developer role, focusing on scalable architectures and performance optimization.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '4',
    year: '2021',
    title: 'Leading the Charge',
    description: 'Started managing a team of talented developers and leading major product initiatives from conception to launch.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '5',
    year: '2024',
    title: 'Exploring New Horizons',
    description: 'Diving deep into modern web frameworks, AI integrations, and shaping the next generation of digital experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
  }
];
