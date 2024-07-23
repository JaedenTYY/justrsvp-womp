import React from 'react';

interface CollectionProps {
  data: any[];
  emptyTitle: string;
  emptyStateSubtext: string;
  collectionType: string;
  limit: number;
  page: number;
  totalPages?: number;
  urlParamName?: string;
}

const Collection: React.FC<CollectionProps> = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  limit,
  page,
  totalPages,
  urlParamName,
}) => {
  if (data.length === 0) {
    return (
      <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-grey-50 py-28 text-center">
        <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
        <p className="p-regular-14">{emptyStateSubtext}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        {data.map((item) => (
          <li key={item.id} className="flex justify-center">
            <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
              <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
              <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
                <h3 className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">{item.title}</h3>
                <p className="p-medium-14 md:p-medium-16 text-grey-600">{item.description}</p>
                <p className="p-medium-14 md:p-medium-16 text-grey-600">{item.location}</p>
                <p className="p-medium-14 md:p-medium-16 text-grey-600">{item.startDateTime} - {item.endDateTime}</p>
                <p className="p-medium-14 md:p-medium-16 text-grey-600">{item.price ? `$${item.price}` : 'Free'}</p>
                <a href={item.url} className="p-medium-14 md:p-medium-16 text-primary-500 hover:underline">More Info</a>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Pagination controls can be added here if needed */}
    </div>
  );
};

export default Collection;