import React from "react";

interface CollectionProps {
  data: any[];
  emptyTitle: string;
  emptyStateSubtext: string;
  collectionType: string;
  limit: number;
  page: number;
  totalPages?: number;
}

const Collection: React.FC<CollectionProps> = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  limit,
  page,
  totalPages,
}) => {
  if (data.length === 0) {
    return (
      <div>
        <h3>{emptyTitle}</h3>
        <p>{emptyStateSubtext}</p>
      </div>
    );
  }

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{/* Render your item here */}</div>
      ))}
      {/* Pagination controls can be added here if needed */}
    </div>
  );
};

export default Collection;
