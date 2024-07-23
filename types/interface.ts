// ====== USER PARAMS
export interface CreateUserParams {
  clerkId: string;
  firstName?: string; // changed from string to string | undefined
  lastName?: string;  // changed from string to string | undefined
  username: string;
  email: string;
  photo?: string;     // changed from string to string | undefined
}

  
  export interface UpdateUserParams {
    firstName?: string;
    lastName?: string;
    username: string;
    photo?: string;
  }
  
  // ====== EVENT PARAMS
  export interface CreateEventParams {
    userId: string;
    event: {
      title: string;
      description: string;
      location: string;
      imageUrl: string;
      startDateTime: Date;
      endDateTime: Date;
      categoryId: string;
      price: string;
      isFree: boolean;
      url: string;
    };
    path: string;
  }
  
  export interface UpdateEventParams {
    userId: string;
    event: {
      id: string;
      title: string;
      imageUrl: string;
      description: string;
      location: string;
      startDateTime: Date;
      endDateTime: Date;
      categoryId: string;
      price: string;
      isFree: boolean;
      url: string;
    };
    path: string;
  }
  
  export interface DeleteEventParams {
    eventId: number;
    path: string;
  }
  
  export interface GetAllEventsParams {
    query: string;
    category: string;
    limit: number;
    page: number;
  }
  
  export interface GetEventsByUserParams {
    userId: string;
    limit?: number;
    page: number;
  }
  
  export interface GetRelatedEventsByCategoryParams {
    categoryId: string;
    eventId: string;
    limit?: number;
    page: number | string;
  }
  
  export interface IEvent {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    imageUrl: string | null;
    startDateTime: string;
    endDateTime: string;
    price: number;
    isFree: boolean;
    url: string | null;
    category: {
      id: number;
      name: string;
    };
    organizer: {
      id: number;
      firstName: string | null;
      lastName: string | null;
    };
    organizerId: number;
  }
  
  
  // ====== CATEGORY PARAMS
  export interface CreateCategoryParams {
    categoryName: string;
  }
  
  export interface ICategory {
    id: number;
    name: string;
  }
  
  // ====== ORDER PARAMS
  // types/interface.ts
export interface CreateOrderParams {
    stripeId: string;
    eventId: number; // Adjusted to match your Prisma schema
    buyerId: string;
    totalAmount: number;
    createdAt: Date;
    eventTitle: string;
  }
  
  export interface CheckoutOrderParams {
    eventTitle: string;
    eventId: number; // Adjusted to match your Prisma schema
    price: string;
    isFree: boolean;
    buyerId: string;
  }
  
  // Other interfaces remain the same
  
  
  export interface GetOrdersByEventParams {
    eventId: string;
    searchString: string;
  }
  
  export interface GetOrdersByUserParams {
    userId: string | null;
    limit?: number;
    page: string | number | null;
  }
  
  // ====== URL QUERY PARAMS
  export interface UrlQueryParams {
    params: string;
    key: string;
    value: string | null;
  }
  
  export interface RemoveUrlQueryParams {
    params: string;
    keysToRemove: string[];
  }
  
  export interface SearchParamProps {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }

  interface IOrderItem {
    id: number; // Change this from string to number
    event: {
      id: number;
      title: string;
      description: string | null;
      location: string | null;
      imageUrl: string | null;
      startDate: Date;
      endDate: Date;
      price: string | null;
      isFree: boolean;
      url: string | null;
      categoryId: number;
      organizerId: number;
    };
    buyer: {
      firstName: string;
      lastName: string;
    };
    createdAt: string | Date;
    totalAmount: number;
  }
  
  